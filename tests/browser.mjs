import assert from 'node:assert/strict';
import test, {after,before} from 'node:test';
import {createRequire} from 'node:module';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,extname} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='http://127.0.0.1:4182';
let browser,server,downloads;
before(async()=>{
 downloads=await mkdtemp(join(tmpdir(),'cambridge-browser-'));
 if(!process.env.CAMBRIDGE_BROWSER_ROUTE){
 server=spawn(process.execPath,['server.mjs','dist'],{env:{...process.env,PORT:'4182'},stdio:['ignore','pipe','inherit']});
 await once(server.stdout,'data');
 }
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||undefined});
});
after(async()=>{
 await browser?.close();
 server?.kill();
 if(downloads)await rm(downloads,{recursive:true,force:true});
});

function pdf(text){
 const objects=[
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
  null,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
 ];
 const content='BT /F1 14 Tf 60 700 Td ('+text+') Tj ET';
 objects[3]='<< /Length '+content.length+' >>\nstream\n'+content+'\nendstream';
 let body='%PDF-1.4\n';
 const offsets=objects.map((object,i)=>{
  const start=body.length;
  body+=(i+1)+' 0 obj\n'+object+'\nendobj\n';
  return start;
 });
 return Buffer.from(body+'xref\n0 6\n0000000000 65535 f \n'+offsets.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+
  'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+body.length+'\n%%EOF\n');
}
async function localPage(t,options){
 const context=await browser.newContext(options);
 context.setDefaultTimeout(7000);
 t.after(()=>context.close());
 if(process.env.CAMBRIDGE_BROWSER_ROUTE){
  const types={'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
  await context.route(origin+'/**',async route=>{
   const pathname=new URL(route.request().url()).pathname;
   const path=pathname==='/'?'index.html':pathname.slice(1)+(extname(pathname)?'':'.html');
   await route.fulfill({path:join('dist',path),contentType:types[extname(path)]});
  });
 }
 return context.newPage();
}
const action=(page,name)=>page.locator('[data-action="'+name+'"]').first();

test('PDFs, marking, refresh, export and restore in a fresh workspace',async t=>{
 const page=await localPage(t);
 // Keep the CI exercise deterministic and cover the filename-recognition fallback.
 await page.route('https://cdn.jsdelivr.net/**',route=>route.abort());
 await page.goto(origin+'/workspace#log');
 const qp=pdf('9709/11 May/June 2024 Question paper');
 const ms=pdf('Mark scheme');
 await page.locator('#paper-files').setInputFiles([
  {name:'9709_s24_qp_11.pdf',mimeType:'application/pdf',buffer:qp},
  {name:'9709_s24_ms_11.pdf',mimeType:'application/pdf',buffer:ms}
 ]);
 await page.getByText(/2 attachments stored/).waitFor();
 await page.locator('#wizard-form button[type=submit]').click();
 await page.locator('#wizard-form button[type=submit]').click();
 await page.locator('[name=marks]').fill('67');
 await page.locator('[name=max]').fill('75');
 await page.locator('[name=minutes]').fill('94');
 await page.locator('#wizard-form button[type=submit]').click();
 await action(page,'add-row').click();
 await page.getByLabel('Question 1 available marks').fill('2');
 await page.getByLabel('Question 1 obtained marks').fill('1');
 await page.getByLabel('Question 1 topic').selectOption('9709:1.1');
 await page.locator('#wizard-form button[type=submit]').click();
 await page.getByRole('button',{name:/save attempt/i}).click();
 await page.waitForURL('**/workspace#detail:*');
 await page.reload();
 await page.getByRole('heading',{name:'9709/11/M/J/24'}).waitFor();
 await page.goto(origin+'/workspace#settings');
 const pendingDownload=page.waitForEvent('download');
 await action(page,'backup').click();
 const download=await pendingDownload;
 const target=join(downloads,'backup.json');
 await download.saveAs(target);
 const data=JSON.parse(await readFile(target,'utf8'));
 const attempt=data.records.find(record=>record.kind==='attempt');
 assert.equal(attempt.marks,67);
 assert.equal(attempt.questions[0].marks,1);
 assert.deepEqual(Buffer.from(data.files.find(file=>file.name.includes('_qp_')).data,'base64'),qp);
 assert.deepEqual(Buffer.from(data.files.find(file=>file.name.includes('_ms_')).data,'base64'),ms);
 const fresh=await localPage(t);
 await fresh.goto(origin+'/workspace#settings');
 await fresh.locator('#import-backup').setInputFiles(target);
 await fresh.getByRole('button',{name:'Restore backup',exact:true}).click();
 await fresh.getByText(/1 restored/).waitFor();
 await fresh.goto(origin+'/workspace#detail:'+data.records.find(record=>record.kind==='attempt').id);
 await fresh.getByRole('heading',{name:'9709/11/M/J/24'}).waitFor();
 await action(fresh,'preview-paper').click();
 await fresh.locator('iframe[src^="blob:"]').waitFor();
});

test('password recovery verifies the callback, updates the password and returns to login',async t=>{
 const page=await localPage(t);
 const calls=[];
 await page.route('**/auth/v1/**',async route=>{
  const request=route.request(),url=new URL(request.url());
  calls.push([request.method(),url.pathname,request.headers().authorization]);
  const body=url.pathname.endsWith('/user')?{id:'00000000-0000-4000-8000-000000000001'}:{};
  if(request.method()==='PUT')assert.deepEqual(request.postDataJSON(),{password:'test-password-123'});
  await route.fulfill({json:body,headers:{'access-control-allow-origin':'*'}});
 });
 await page.goto(origin+'/forgot-password');
 await page.getByLabel('Email address').fill('student@example.com');
 await page.getByRole('button',{name:'Send recovery link'}).click();
 await page.getByText(/check your email|recovery link has|if an account/i).last().waitFor();
 await page.goto(origin+'/#type=recovery&access_token=recovery-test-token&refresh_token=recovery-test-refresh');
 await page.waitForURL('**/reset-password');
 await page.getByLabel('New password',{exact:true}).fill('test-password-123');
 await page.getByLabel('Confirm password').fill('test-password-123');
 await page.getByRole('button',{name:'Save new password'}).click();
 await page.waitForURL('**/login');
 assert.deepEqual(calls.map(call=>call.slice(0,2)),[['POST','/auth/v1/recover'],['GET','/auth/v1/user'],['PUT','/auth/v1/user']]);
 assert.equal(calls.at(-1)[2],'Bearer recovery-test-token');
});

test('mobile menu closes with Escape, returns focus and navigates without page overflow',async t=>{
 const page=await localPage(t,{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.goto(origin+'/workspace');
 const toggle=page.getByRole('button',{name:'Open navigation'});
 await toggle.click();
 const menu=page.getByRole('dialog',{name:'Workspace navigation'});
 await menu.getByRole('button',{name:'Close navigation'}).waitFor();
 await page.keyboard.press('Escape');
 assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
 await toggle.click();
 await menu.getByText('Practice',{exact:true}).click();
 await menu.getByRole('button',{name:'Past papers'}).click();
 await page.waitForURL('**/workspace#papers');
 assert.equal(await menu.count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
});


test('a custom paper survives refresh and MCQ feedback flows into the review queue',async t=>{
 const page=await localPage(t,{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.goto(origin+'/workspace#builder');
 await page.getByRole('heading',{name:'Exam builder'}).waitFor();
 await page.getByRole('button',{name:'Add question',exact:true}).first().click();
 await page.getByRole('button',{name:'Add question',exact:true}).first().click();
 await page.getByLabel('Paper title').fill('My Physics mock');
 await page.getByRole('button',{name:'Save paper',exact:true}).click();
 await page.getByText('Custom paper saved.').waitFor();
 await page.reload();
 assert.equal(await page.getByLabel('Paper title').inputValue(),'My Physics mock');
 await page.getByRole('button',{name:'Sit this paper'}).click();
 await page.getByRole('radio',{name:'A',exact:true}).check();
 await page.getByRole('button',{name:'Check answer'}).click();
 await page.getByText('You chose A. Correct answer C.').waitFor();
 await page.reload();
 await page.getByText('You chose A. Correct answer C.').waitFor();
 await page.getByRole('navigation',{name:'Open workspace tabs'}).getByRole('button',{name:'Exam builder',exact:true}).click();
 await page.getByRole('heading',{name:'Exam builder'}).waitFor();
 await page.getByRole('navigation',{name:'Open workspace tabs'}).getByRole('button',{name:'Close Exam builder tab'}).click();
 await page.getByText('You chose A. Correct answer C.').waitFor();
 await page.goto(origin+'/workspace#review');
 await page.getByRole('heading',{name:'Scheduled corrections'}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
});

test('calendar, syllabus milestones, and weighted grade targets work from the workspace',async t=>{
 const page=await localPage(t);
 await page.goto(origin+'/workspace#calendar');
 await page.getByRole('heading',{name:'Study calendar'}).waitFor();
 const day=page.locator('.student-calendar button[aria-pressed=true]');
 const selectedDate=await day.getAttribute('data-date');
 await page.getByRole('button',{name:'Plan a session',exact:true}).click();
 await page.getByLabel('Session title').fill('Quadratics timed practice');
 assert.equal(await page.getByLabel('Date',{exact:true}).inputValue(),selectedDate);
 await page.getByRole('button',{name:'Add to study plan'}).click();
 await page.getByText('Quadratics timed practice',{exact:true}).waitFor();
 await page.goto(origin+'/workspace#syllabus-plan');
 await page.getByRole('button',{name:'Add syllabus plan'}).click();
 const finish=new Date();
 finish.setDate(finish.getDate()+10);
 const end=finish.getFullYear()+'-'+String(finish.getMonth()+1).padStart(2,'0')+'-'+String(finish.getDate()).padStart(2,'0');
 await page.getByLabel('Finish date').fill(end);
 await page.getByRole('button',{name:'Save syllabus plan'}).click();
 await page.getByRole('heading',{name:'Mathematics · AS'}).waitFor();
 await page.goto(origin+'/workspace#calculator');
 const route=page.getByLabel('Examination route');
 await route.selectOption('AS: P1 + P5');
 await page.getByLabel('Paper 1 raw marks').fill('60');
 await page.getByLabel('Paper 5 mark source').selectOption('future');
 await page.getByLabel('Manual target boundary (weighted marks, optional)').fill('90');
 await page.getByRole('button',{name:'Calculate target'}).click();
 await page.getByText('You need 30 of the 50 remaining weighted marks (60%).').waitFor();
});


test('a stale cloud edit is recovered, and a second change blocks applying it',async t=>{
 const page=await localPage(t);
 const second=await localPage(t);
 const owner='00000000-0000-4000-8000-000000000001';
 const record={id:owner,kind:'settings',payload:{id:owner,kind:'settings',displayName:'Original',subjects:['9709','9702','9618']},version:'version-one'};
 const conflicts=[];
 for(const browserPage of [page,second]){
  await browserPage.addInitScript(id=>{
   localStorage.setItem('ct-session',JSON.stringify({user:{id,email:'student@example.com'},
    access_token:'cloud-test-token',refresh_token:'cloud-test-refresh',expires_at:Math.floor(Date.now()/1000)+3600}));
  },owner);
  await browserPage.route('**/rest/v1/**',async route=>{
   const request=route.request();
   if(request.method()==='GET')return route.fulfill({json:[record]});
   const [change]=request.postDataJSON().changes;
   if(change.expected_version!==record.version){
    conflicts.push(change);
    return route.fulfill({status:409,json:{code:'PT409',message:'A cloud record changed before this save.'}});
   }
   record.payload=change.payload;
   record.version='version-'+Date.now();
   return route.fulfill({json:[record]});
  });
  await browserPage.goto(origin+'/dashboard#profile');
  await browserPage.getByLabel('Display name').waitFor();
 }
 await page.getByLabel('Display name').fill('Pending edit');
 await second.getByLabel('Display name').fill('Device two');
 await second.getByRole('button',{name:'Save profile'}).click();
 await second.getByText('Study preferences saved.').waitFor();
 await page.getByRole('button',{name:'Save profile'}).click();
 await page.getByText(/Cloud work changed/).waitFor();
 assert.equal(record.payload.displayName,'Device two');
 assert.equal(conflicts[0].expected_version,'version-one');
 await page.goto(origin+'/dashboard#settings');
 await page.getByRole('button',{name:'Cloud conflicts'}).click();
 const dialog=page.getByRole('dialog',{name:'Cloud conflicts'});
 await dialog.getByRole('button',{name:'Use recovered edit'}).waitFor();
 await dialog.locator('summary').first().click();
 await dialog.getByText(/Pending edit/).waitFor();
 await dialog.getByText(/Device two/).waitFor();
 await second.getByLabel('Display name').fill('Another edit');
 await second.getByRole('button',{name:'Save profile'}).click();
 await second.getByText('Study preferences saved.').waitFor();
 await dialog.getByRole('button',{name:'Use recovered edit'}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Use recovered edit'}).click();
 await page.getByText(/Cloud work changed/).waitFor();
 assert.equal(record.payload.displayName,'Another edit');
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Cloud conflicts'}).click();
 await dialog.getByRole('button',{name:'Use recovered edit'}).first().click();
 await page.getByRole('dialog').getByRole('button',{name:'Use recovered edit'}).click();
 await page.getByText('Recovered work saved to the cloud.').waitFor();
 assert.equal(record.payload.displayName,'Pending edit');
 await dialog.locator('summary').first().click();
 await dialog.locator('summary').filter({hasText:'settings'}).first().evaluate(summary=>summary.parentElement.open=true);
 await dialog.getByText(/Another edit/).first().waitFor();
});


test('copy resumes after an interruption and keeps a subsequently edited cloud record',async t=>{
 const page=await localPage(t);
 const owner='00000000-0000-4000-8000-000000000099';
 const ids=['00000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000020'];
 const remote=new Map();
 let interrupt=true;
 await page.route('**/rest/v1/**',async route=>{
  const request=route.request();
  if(request.method()==='GET')return route.fulfill({json:[...remote.values()]});
  const [change]=request.postDataJSON().changes;
  if(change.id===ids[1]&&interrupt)return route.fulfill({status:503,json:{message:'Connection interrupted'}});
  if(remote.has(change.id))return route.fulfill({status:409,json:{code:'PT409'}});
  const row={id:change.id,kind:change.kind,payload:change.payload,version:'cloud-version'};
  remote.set(row.id,row);
  return route.fulfill({json:[row]});
 });
 await page.goto(origin+'/workspace#settings');
 await page.getByRole('heading',{name:'Storage & account'}).waitFor();
 const backup={app:'cambridge-revision',version:1,files:[],records:ids.map((id,i)=>({
  id,kind:'exam',subject:'9709',level:'AS',paper:'12',duration:110,datetime:'2027-05-0'+(i+1)+'T09:00:00Z'
 }))};
 await page.locator('#import-backup').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.getByRole('button',{name:'Restore backup',exact:true}).click();
 await page.getByText(/2 restored/).waitFor();
 await page.evaluate(id=>localStorage.setItem('ct-session',JSON.stringify({user:{id,email:'student@example.com'},
  access_token:'cloud-test-token',refresh_token:'cloud-test-refresh',expires_at:Math.floor(Date.now()/1000)+3600})),owner);
 await page.goto(origin+'/dashboard#settings');
 async function copy(){
  await page.getByRole('button',{name:'Copy local data to cloud'}).click();
  await page.getByRole('button',{name:'Copy to cloud',exact:true}).click();
 }
 await copy();
 await page.getByText('Connection interrupted',{exact:true}).waitFor();
 assert.equal(remote.size,1);
 await page.getByRole('button',{name:'Close dialog'}).click();
 interrupt=false;
 remote.get(ids[0]).payload={...remote.get(ids[0]).payload,duration:120};
 await copy();
 await page.getByText('1 copied, 0 already present. 1 in Cloud conflicts.').waitFor();
 assert.equal(remote.size,2);
 assert.equal(remote.get(ids[0]).payload.duration,120);
 await copy();
 await page.getByText('0 copied, 1 already present. 1 in Cloud conflicts.').waitFor();
});
