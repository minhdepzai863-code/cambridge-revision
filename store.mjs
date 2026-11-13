import {RECORD_KINDS,isRecordId,validateBackup} from './backup.mjs';
import {config} from './config.mjs';
const DB_NAME='cambridge-revision-v1';
const KINDS=RECORD_KINDS;
export const uid=()=>crypto.randomUUID();
let dbPromise,recoveryPromise;
function openDatabase(name,initialize){
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(name,1);
  request.onupgradeneeded=()=>initialize(request.result);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
}
function database(table){
 if(table==='recovery')return recoveryPromise||=openDatabase(DB_NAME+'-recovery',d=>d.createObjectStore('recovery',{keyPath:'id'}));
 return dbPromise||=openDatabase(DB_NAME,d=>{
  d.createObjectStore('records',{keyPath:'id'});
  d.createObjectStore('files',{keyPath:'id'});
 });
}
async function localRead(table,key){const d=await database(table);return new Promise((resolve,reject)=>{const tx=d.transaction(table,'readonly'),r=key?tx.objectStore(table).get(key):tx.objectStore(table).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function localWrite(table,items,remove=false){const d=await database(table);return new Promise((resolve,reject)=>{const tx=d.transaction(table,'readwrite'),s=tx.objectStore(table);items.forEach(i=>remove?s.delete(i):s.put(i));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Storage transaction aborted'));});}
function storedSession(){try{return JSON.parse(localStorage.getItem('ct-session')||'null');}catch{return null;}}
export const store={mode:localStorage.getItem('ct-mode')||'local',session:storedSession(),records:[],ready:false};
function saveSession(s){store.session=s;if(s)localStorage.setItem('ct-session',JSON.stringify(s));else localStorage.removeItem('ct-session');}
async function authRequest(path,body) {
 const response=await fetch(`${config.supabaseUrl}/auth/v1/${path}`,{
  method:'POST',headers:{apikey:config.supabaseKey,'Content-Type':'application/json'},body:JSON.stringify(body)
 });
 const data=await response.json().catch(()=>({}));
 if(!response.ok){
  const error=new Error(data.msg||data.error_description||data.message||'The account request failed. Try again.');
  error.status=response.status;
  throw error;
 }
 return data;
}
let refreshInFlight;
async function token(){
 let s=store.session,latest=storedSession();
 if(!s||!latest)throw new Error('Sign in to your cloud workspace first.');
 if(s.user?.id!==latest.user?.id)throw new Error('Your cloud account changed in another tab. Reload before continuing.');
 if(latest.access_token!==s.access_token&&latest.expires_at>=s.expires_at){s=latest;store.session=latest;}
 if((s.expires_at||0)*1000<Date.now()+60000){
  if(!refreshInFlight)refreshInFlight=(async()=>{const next=await authRequest('token?grant_type=refresh_token',{refresh_token:s.refresh_token});next.expires_at=Math.floor(Date.now()/1000)+next.expires_in;saveSession(next);return next;})().finally(()=>{refreshInFlight=null;});
  s=await refreshInFlight;
 }
 return s.access_token;
}
async function cloud(path,options={}){const t=await token();const r=await fetch(config.supabaseUrl+path,{...options,headers:{apikey:config.supabaseKey,Authorization:`Bearer ${t}`,...options.headers}});if(!r.ok){let message=await r.text(),code;try{const j=JSON.parse(message);code=j.code||j.error;message=j.message||j.error_description||j.error||message;}catch{}const error=new Error(message||`Cloud request failed (${r.status}).`);error.status=r.status;error.code=code;throw error;}return r;}
async function openCloudSession(session) {
 const previous=store.session;
 saveSession(session);
 try { await switchMode('cloud'); }
 catch(error) { saveSession(previous); throw error; }
}
function withExpiry(session) {
 return {...session,expires_at:Math.floor(Date.now()/1000)+Number(session.expires_in||3600)};
}
export async function signIn(email,password) {
 const session=await authRequest('token?grant_type=password',{email,password});
 await openCloudSession(withExpiry(session));
}
export async function signUp(email,password) {
 const session=await authRequest('signup?redirect_to='+encodeURIComponent(location.origin+'/'),{email,password,data:{revision_onboarding:true}});
 if(!session.access_token)return false;
 await openCloudSession(withExpiry(session));
 return true;
}
export function requestPasswordReset(email) {
 return authRequest('recover?redirect_to='+encodeURIComponent(location.origin+'/'),{email});
}
let recoverySession;
export function hasRecoverySession() {
 return Boolean(recoverySession&&recoverySession.expires_at>Date.now()/1000);
}
export async function resetPassword(password) {
 if(!hasRecoverySession())throw new Error('Request a fresh password recovery link.');
 const headers={apikey:config.supabaseKey,Authorization:`Bearer ${recoverySession.access_token}`,'Content-Type':'application/json'};
 const result=await fetch(config.supabaseUrl+'/auth/v1/user',{method:'PUT',headers,body:JSON.stringify({password})});
 if(!result.ok){
  const error=await result.json().catch(()=>({}));
  throw new Error(error.msg||error.message||'Unable to update the password. Try again or request a fresh link.');
 }
 const accountId=recoverySession.user.id;
 recoverySession=null;
 if(store.session?.user?.id===accountId){
  saveSession(null);
  store.mode='local';
  store.records=[];
  localStorage.setItem('ct-mode','local');
 }
}
export async function consumeAuthCallback() {
 const hash=new URLSearchParams(location.hash.slice(1));
 if(!hash.has('access_token')&&!hash.has('error'))return null;
 history.replaceState(null,'',location.pathname+location.search);
 if(hash.has('error'))return 'invalid';
 const access_token=hash.get('access_token'),refresh_token=hash.get('refresh_token');
 if(!access_token||!refresh_token)return 'invalid';
 const result=await fetch(config.supabaseUrl+'/auth/v1/user',{headers:{apikey:config.supabaseKey,Authorization:`Bearer ${access_token}`}});
 if(!result.ok)return 'invalid';
 const session=withExpiry({access_token,refresh_token,expires_in:hash.get('expires_in'),user:await result.json()});
 if(hash.get('type')==='recovery'){
  recoverySession=session;
  return 'recovery';
 }
 await openCloudSession(session);
 return 'signed-in';
}
export async function signOut(){try{if(store.session)await cloud('/auth/v1/logout',{method:'POST'});}finally{saveSession(null);await switchMode('local');}}
export async function switchMode(mode){if(mode==='cloud'&&!store.session)throw new Error('Sign in before opening your cloud workspace.');const previous=store.mode;store.mode=mode;try{await loadRecords();localStorage.setItem('ct-mode',mode);}catch(e){store.mode=previous;throw e;}}
export async function initialize(){const callback=await consumeAuthCallback();if(store.mode==='cloud'&&!store.session)store.mode='local';if(callback!=='signed-in'&&callback!=='recovery')await loadRecords();store.ready=true;}
export async function loadRecords(){let next;if(store.mode==='local')next=await localRead('records');else{next=[];for(let start=0;;start+=1000){let r;try{r=await cloud(`/rest/v1/revision_records?select=id,kind,payload,updated_at,version&order=id.asc&offset=${start}&limit=1000`);}catch(error){if(error.code!=='42703')throw error;r=await cloud(`/rest/v1/revision_records?select=id,kind,payload,updated_at&order=id.asc&offset=${start}&limit=1000`);}const page=await r.json();next.push(...page.map(cloudRecord));if(page.length<1000)break;}}store.records=next;return next;}
export const all=kind=>store.records.filter(r=>r.kind===kind);
export const get=id=>store.records.find(r=>r.id===id);
function cloudRecord(row){
 return {...row.payload,id:row.id,kind:row.kind,_cloudVersion:row.version};
}
const portableRecord=({_cloudVersion,...record})=>record;
function sameContent(left,right){
 const normalize=(key,value)=>key==='updatedAt'||key==='_cloudVersion'||key==='path'||(key==='files'&&Array.isArray(value)&&!value.length)?undefined:
  value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b))):value;
 return JSON.stringify(left,normalize)===JSON.stringify(right,normalize);
}
async function commit(changes){
 try{
  const response=await cloud('/rest/v1/rpc/commit_revision_records',{
   method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes})
  });
  return (await response.json()).map(cloudRecord);
 }catch(error){
  if(error.code==='PGRST202'||error.code==='42703')throw new Error('Cloud saving requires the version protection update. Your edits are still on this device.');
  throw error;
 }
}
function adopt(records){
 for(const record of records){
  const index=store.records.findIndex(item=>item.id===record.id);
  if(index<0)store.records.push(record);
  else store.records[index]=record;
 }
}
async function keepConflict(records,ids=[],reason='save'){
 const entry={id:uid(),owner:store.session.user.id,at:new Date().toISOString(),reason,
  records:records.map(portableRecord),ids};
 await localWrite('recovery',[entry]);
 return entry;
}
export async function cloudConflicts(){
 if(store.mode!=='cloud')return [];
 return (await localRead('recovery')).filter(entry=>entry.owner===store.session.user.id&&entry.reason!=='transfer-receipt').sort((a,b)=>b.at.localeCompare(a.at));
}
export async function dismissConflict(id){
 if(!(await cloudConflicts()).some(entry=>entry.id===id))return;
 await localWrite('recovery',[id],true);
}
export async function exportConflict(id){
 const entry=(await cloudConflicts()).find(item=>item.id===id);
 if(!entry)throw new Error('This conflict is no longer available.');
 return buildBackup(entry.records);
}
export async function applyRecoveredConflict(id,versions){
 const entry=(await cloudConflicts()).find(item=>item.id===id);
 if(!entry?.records.length)throw new Error('This recovered edit is no longer available.');
 const changes=entry.records.map(record=>({...record,_cloudVersion:versions.get(record.id)||null}));
 const displaced=entry.records.map(record=>get(record.id)).filter(Boolean);
 if(displaced.length)await keepConflict(displaced,[],'previous-cloud-version');
 await saveMany(changes);
 await dismissConflict(id);
}
export async function saveMany(records){
 const next=records.map(record=>({...record,id:record.id||uid(),updatedAt:new Date().toISOString()}));
 for(const record of next)if(!KINDS.has(record.kind)||!isRecordId(record.id))throw new Error('Unknown record type.');
 if(store.mode==='local'){
  const local=next.map(portableRecord);
  await localWrite('records',local);
  adopt(local);
  return local;
 }
 let saved;
 try{
  saved=await commit(next.map(record=>({id:record.id,expected_version:record._cloudVersion||null,kind:record.kind,payload:portableRecord(record)})));
 }catch(error){
  if(error.code!=='PT409')throw error;
  await keepConflict(next,[],'save');
  error.message='Cloud work changed. Your edit is available in Settings & backup under Cloud conflicts.';
  throw error;
 }
 adopt(saved);
 return saved;
}
export async function save(record){return (await saveMany([record]))[0];}
export async function removeMany(ids){
 if(store.mode==='local')await localWrite('records',ids,true);
 else{
  const changes=ids.map(id=>({id,expected_version:get(id)?._cloudVersion||null,remove:true}));
  try{await commit(changes);}catch(error){
   if(error.code!=='PT409')throw error;
   await keepConflict([],ids,'delete');
   error.message='Cloud work changed. Reload the cloud records and review the delete again.';
   throw error;
  }
 }
 store.records=store.records.filter(record=>!ids.includes(record.id));
}
export async function upload(file,role='Attachment',existingId){if(!['application/pdf','image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Choose a PDF, PNG, JPEG or WebP file.');if(file.size>20*1024*1024)throw new Error('Each attachment must be 20 MB or smaller.');const id=existingId||uid(),name=file.name||'attachment',meta={id,name,type:file.type,size:file.size,role};if(store.mode==='local'){await localWrite('files',[{...meta,blob:file}]);meta.path=id;}else{meta.path=`${store.session.user.id}/${id}/${name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;try{await cloud(`/storage/v1/object/${config.bucket}/${meta.path}`,{method:'POST',headers:{'Content-Type':file.type,'x-upsert':'false'},body:file});}catch(error){if(!existingId||!(error.status===409||['Duplicate','ResourceAlreadyExists'].includes(error.code)))throw error;const previous=new Uint8Array(await (await cloud(`/storage/v1/object/authenticated/${config.bucket}/${meta.path}`)).arrayBuffer()),next=new Uint8Array(await file.arrayBuffer());if(previous.length!==next.length||previous.some((v,i)=>v!==next[i]))throw new Error('An attachment with this ID has different contents. Export both workspaces before merging.');}}return meta;}
export async function fileBlob(meta){if(store.mode==='local'){const f=await localRead('files',meta.id);if(!f?.blob)throw new Error('This attachment is missing. Restore a complete backup.');return f.blob;}return (await cloud(`/storage/v1/object/authenticated/${config.bucket}/${meta.path}`)).blob();}
export async function openFile(meta){const b=await fileBlob(meta),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
export function download(name,body,type='application/json'){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
async function base64(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});}
async function buildBackup(records){const unique=new Map();for(const r of records)for(const f of r.files||[])unique.set(f.id,f);const files=[];for(const f of unique.values())files.push({...f,data:await base64(await fileBlob(f))});return {app:'cambridge-revision',version:1,exportedAt:new Date().toISOString(),records:records.map(portableRecord),files};}
export async function exportBackup(){return buildBackup(store.records);}
export async function importBackup(data){
 validateBackup(data);
 const known=new Map(store.records.flatMap(r=>(r.files||[]).map(f=>[f.id,f]))),plan=[];
 for(const f of data.files){
  const bytes=Uint8Array.from(atob(f.data),c=>c.charCodeAt(0));
  if(bytes.byteLength>20*1024*1024)throw new Error('Each attachment must be 20 MB or smaller.');
  const existing=known.get(f.id)||(store.mode==='local'?await localRead('files',f.id):null);
  if(existing){const old=new Uint8Array(await (existing.blob||await fileBlob(existing)).arrayBuffer());if(existing.type!==f.type||old.length!==bytes.length||old.some((v,i)=>v!==bytes[i]))throw new Error('An attachment ID in this backup already has different contents. Restore into a separate workspace.');}
  plan.push({source:f,existing,bytes});
 }
 const mapping=new Map();
 for(const {source:f,existing,bytes} of plan)mapping.set(f.id,existing?{id:existing.id,name:existing.name,type:existing.type,size:existing.size,role:f.role||existing.role,path:existing.path||existing.id}:await upload(new File([bytes],f.name,{type:f.type}),f.role,f.id));
 const records=data.records.map(r=>({...r,files:r.files?.map(f=>({...mapping.get(f.id),role:f.role||mapping.get(f.id).role}))}));
 if(store.mode==='local'){await saveMany(records);return {saved:records.length,unchanged:0,conflicts:0};}
  await loadRecords();
  return transferRecords(records,'restore');
}
export function exportCSV(attempts,gradeFor,thresholds,paperCode,percent){const fields=['Date','Subject','Level','Paper','Marks','Available','Percentage','Scope','Grade','Active minutes','Elapsed minutes','Timed','Difficulty','Notes'];const rows=attempts.map(a=>[a.date,a.subject,a.level,paperCode(a),a.marks,a.max,percent(a),a.scope,gradeFor(a,thresholds).label,a.minutes,a.elapsedMinutes,a.timed,a.difficulty,a.notes]);return [fields,...rows].map(row=>row.map(v=>{let s=String(v??'');if(/^[=+@\-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}

async function transferRecords(records,reason,receipts=null){
 const counts={saved:0,unchanged:0,conflicts:0};
 const conflicts=[];
 for(const source of records){
  const settings=source.kind==='settings'?all('settings')[0]:null;
  const record=settings&&settings.id!==source.id?{...source,id:settings.id}:source;
  const current=get(record.id);
  if(current&&sameContent(current,record)){
   counts.unchanged++;
  }else if(current||receipts?.has(record.id)){
   conflicts.push(record);
   continue;
  }else{
   try{
    adopt(await commit([{id:record.id,expected_version:null,kind:record.kind,payload:portableRecord(record)}]));
    counts.saved++;
   }catch(error){
    if(error.code!=='PT409')throw error;
    await loadRecords();
    if(sameContent(get(record.id),record))counts.unchanged++;
    else{conflicts.push(record);continue;}
   }
  }
  if(receipts&&!receipts.has(record.id)){
   const owner=store.session.user.id;
   await localWrite('recovery',[{id:owner+':'+record.id,owner,recordId:record.id,reason:'transfer-receipt'}]);
   receipts.add(record.id);
  }
 }
 if(conflicts.length){
  const existing=await cloudConflicts();
  if(!existing.some(entry=>entry.reason===reason&&sameContent(entry.records,conflicts))){
   await keepConflict(conflicts,[],reason);
  }
  counts.conflicts=conflicts.length;
 }
 return counts;
}

export async function copyLocalToCloud(){
 if(store.mode!=='cloud')throw new Error('Open your cloud workspace first.');
 await loadRecords();
 const records=await localRead('records');
 const owner=store.session.user.id;
 const receipts=new Set((await localRead('recovery')).filter(entry=>entry.owner===owner&&entry.reason==='transfer-receipt').map(entry=>entry.recordId));
 const knownFiles=new Map(store.records.flatMap(record=>(record.files||[]).map(file=>[file.id,file])));
 const uploaded=new Map();
 for(const record of records){
  for(const file of record.files||[]){
   if(uploaded.has(file.id))continue;
   const source=await localRead('files',file.id);
   if(!source?.blob)throw new Error('Missing local file: '+file.name);
   let meta=knownFiles.get(file.id);
   if(meta){
    const remote=new Uint8Array(await (await fileBlob(meta)).arrayBuffer());
    const local=new Uint8Array(await source.blob.arrayBuffer());
    if(meta.type!==file.type||remote.length!==local.length||remote.some((byte,index)=>byte!==local[index]))throw new Error('A cloud attachment with this ID has different contents: '+file.name);
   }else meta=await upload(new File([source.blob],file.name,{type:file.type}),file.role,file.id);
   uploaded.set(file.id,meta);
  }
 }
 const prepared=records.map(record=>({...record,files:record.files?.map(file=>({...uploaded.get(file.id),role:file.role}))}));
 return transferRecords(prepared,'copy',receipts);
}
