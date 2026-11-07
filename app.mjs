import {overviewView,libraryView,attemptHistoryView,paperAttachmentsView,questionBreakdownView} from './workspace-view.mjs';
import {SUBJECTS,workspaceSubjects,SERIES,CATEGORIES,COMPONENTS,ROUTES,identifyFilename,component,paperCode,percent,full,sum,average,gradeFor,thresholdFor,validateAttempt,validateThreshold,questionTotals,stats,topicStats,timerValues,nextReview,localDate,countdown,weightedTotal} from './domain.mjs';
import {TOPICS,topicsFor,syllabusSource} from './syllabus.mjs';
import {store,uid,loadRecords,all,get,save,saveMany,removeMany,upload,openFile,fileBlob,download,exportBackup,importBackup,exportCSV,signIn,signUp,signOut,switchMode,copyLocalToCloud,consumeAuthCallback,requestPasswordReset,hasRecoverySession,resetPassword} from './store.mjs';
import {lineChart,bars,scatter,gradeBars,boundaryChart} from './charts.mjs';
import {landingView,initPaperWalkthrough,bindPreviewTabs,demoQuestions,accountView,publicShell} from './public-view.mjs';
import {activityCalendar,eventRows,nextStudyTask,studyEvents,studyStreak} from './study-view.mjs';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={'subject-9618':'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M7 9l3 3-3 3 M13 15h4','subject-9709':'M4 3v17h17 M6 6q6 22 13 0','subject-9231':'M19 4H6l7 8-7 8h13 M19 4v3 M19 17v3','subject-9702':'M4 3h16 M12 3l5 13 M20 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M5 10a15 15 0 0 0 4 8','subject-9701':'M9 3h6 M10 3v6L4 19a1.4 1.4 0 0 0 1.2 2h13.6a1.4 1.4 0 0 0 1.2-2L14 9V3 M7 15h10 M10 18h1','subject-9700':'M20 3C10 2 4 6 4 12c0 5 4 8 8 7 7-1 8-9 8-16z M3 22 16 9 M9 15v-5 M9 15h5',folder:'M3 7V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z M3 8h18',moon:'M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z',book:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h3z',home:'m3 10 9-7 9 7 M5 9v12h14V9 M9 21v-8h6v8',file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h5',chart:'M3 3v18h18 M7 15l4-5 4 3 5-7',check:'m5 12 4 4L19 6',clock:'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',repeat:'m20 7-4-4 M20 7h-6 M4 17l4 4 M4 17h6 M20 7a9 9 0 0 0-16 3 M4 17a9 9 0 0 0 16-3',plus:'M12 5v14 M5 12h14',arrow:'M5 12h14 m-5-5 5 5-5 5',upload:'M12 16V3 m-5 5 5-5 5 5 M4 16v5h16v-5',download:'M12 3v13 m-5-5 5 5 5-5 M4 17v4h16v-4',settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6',calendar:'M4 5h16v16H4z M8 2v6 M16 2v6 M4 10h16',search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',close:'m6 6 12 12 M6 18 18 6',menu:'M4 6h16 M4 12h16 M4 18h16',chip:'M7 7h10v10H7z M10 10h4v4h-4z M9 3v4 M15 3v4 M9 17v4 M15 17v4 M3 9h4 M3 15h4 M17 9h4 M17 15h4',math:'M3 16c4 0 4-12 7-12s2 16 5 16 4-12 6-12 M3 12h18',atom:'M12 2v20 M3.3 7l17.4 10 M3.3 17 20.7 7 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',flag:'M5 21V3 M5 3c5-3 9 3 15 0v10c-6 3-10-3-15 0',pause:'M8 5v14 M16 5v14',play:'m8 4 12 8-12 8z',trash:'M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',edit:'m15 4 5 5 M4 20l5-1L21 7l-5-5L4 14z',cloud:'M7 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5 5 0 0 1 0 11z',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'};
const icon=(name,cls='')=>`<svg class="icon ${cls}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]||icons.book}"/></svg>`;
const subjectIcon=code=>icon('subject-'+code);
const nav=[['home','Overview','home'],['papers','Past Paper Tracker','folder'],['history','Paper History','clock'],['mistakes','Mistake Journal','edit'],['review','Spaced Review','repeat'],['analytics','Progress','chart'],['syllabus','Syllabus Checklist','check'],['boundaries','Grade Boundaries','flag'],['exams','Examination Plan','calendar'],['bank','Question Bank','book'],['practice','Practice Studio','play']];
let state={route:'home',subject:'all',level:'all',year:2027,menu:false,detail:null,range:'all',from:'',to:'',component:'all',history:{},bank:{search:'',source:'all',difficulty:'all'},selected:[],retry:null,revealed:false,practice:null,preview:null};
const workspaceKey=()=>`ct-draft-${store.mode}-${store.session?.user?.id||'local'}`;
let W=null,activeTimer=null,busy=false;
const groups = [
  ['Workspace',[['home','Dashboard','home'],['plan','Study plan','calendar'],['analytics','Analytics','chart']]],
  ['Practice',[['papers','Past papers','folder'],['practice','Focused study','play'],['syllabus','Subjects & syllabus','check'],['bank','Question bank','book']]],
  ['Review',[['history','History','clock'],['mistakes','Mistakes','edit'],['bookmarks','Bookmarks','flag'],['review','Review queue','repeat']]],
  ['Resources',[['exams','Examination planner','calendar'],['boundaries','Grade thresholds','flag'],['calculator','Grade calculator','chart']]]
];
const accountPaths = new Set(['/login','/signup','/forgot-password','/reset-password']);
const routeNames = new Set([...groups.flatMap(([,items])=>items.map(([route])=>route)),'log','detail','settings','profile','onboarding']);
const collapsedGroups = new Set(['Practice','Resources']);
let compact=false,accountMessage='';
const profile=()=>all('settings')[0]||{};
const planned=()=>Array.isArray(profile().studyPlan)?profile().studyPlan:[];
const bookmarks=()=>Array.isArray(profile().bookmarks)?profile().bookmarks:[];
const events=()=>studyEvents(scoped('attempt'),scoped('session'),scoped('mistake'));
const workspacePath=()=>store.mode==='cloud'?'/dashboard':'/workspace';
const practiceKey=()=>workspaceKey()+'-practice';
function readPracticeDraft(){
 try{
  const draft=JSON.parse(localStorage.getItem(practiceKey())||'null');
  return draft?.ids?.length&&get(draft.ids[draft.index])?.kind==='question'?draft:null;
 }catch{return null;}
}
function practiceMinutes(p){
 const active=Number(p.activeMs)||0;
 return (active+(p.startedAt?Math.max(0,Date.now()-p.startedAt):0))/60000;
}
function pausePractice(){
 const p=state.practice;
 if(p?.startedAt&&p.timed!==false){
  p.activeMs=practiceMinutes(p)*60000;
  p.startedAt=null;
  savePracticeDraft();
 }
}
function savePracticeDraft(){
 try{
  if(state.practice)localStorage.setItem(practiceKey(),JSON.stringify(state.practice));
  else localStorage.removeItem(practiceKey());
 }catch{/* Continue this session in memory. */}
}
function namedAccount(){
 const name=profile().displayName||store.session?.user?.user_metadata?.full_name||'';
 return typeof name==='string'?name.trim().split(/\s+/)[0].slice(0,50):'';
}
const button=(label,action,cls='',extra='')=>`<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;
const link=(label,route,cls='')=>`<button class="text-link ${cls}" data-route="${route}">${label}</button>`;
const badge=s=>`<span class="subject-badge subject-${s}"><i></i>${SUBJECTS[s]?.name||esc(s)}</span>`;
const fmt=n=>n==null?'—':new Intl.NumberFormat('en-GB',{maximumFractionDigits:2}).format(n);
const pct=n=>n==null?'—':`${fmt(n)}%`;
const mins=m=>m==null?'—':m>=60?`${Math.floor(m/60)}h ${Math.round(m%60)}m`:`${fmt(m)} min`;
const date=d=>d?new Date(d+'T12:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—';
function input(label,name,value='',type='text',attrs=''){return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;}
function select(label,name,options,value='',attrs=''){return `<label class="field"><span>${label}</span><select name="${name}" ${attrs}>${options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(l)}</option>`;}).join('')}</select></label>`;}
const textarea=(label,name,value='',attrs='')=>`<label class="field wide"><span>${label}</span><textarea name="${name}" rows="3" ${attrs}>${esc(value)}</textarea></label>`;
const check=(label,name,value)=>`<label class="checkbox"><input type="checkbox" name="${name}" ${value?'checked':''}>${label}</label>`;
const activeSubjects=()=>workspaceSubjects(store.records);
const defaultSubject=()=>activeSubjects().includes('9709')?'9709':activeSubjects()[0]||'9709';
const subjectOptions=()=>[...new Set([...activeSubjects(),...(W?.subject&&SUBJECTS[W.subject]?[W.subject]:[])])].map(s=>[s,`${SUBJECTS[s].name} ${s}`]);
const mathsComponent=t=>['9709','9231'].includes(t.subject)?COMPONENTS[t.subject][t.component][0]:'';
const topicOptions=(subject,empty=true,level='all')=>[...(empty?[['','Select a syllabus topic']]:[]),...topicsFor(subject,level).map(t=>[t.id,`${mathsComponent(t)?mathsComponent(t)+' · ':''}${t.code} ${t.title}`])];
const topicName=id=>{const t=TOPICS.find(t=>t.id===id);return t?`${t.code} ${t.title}`:'Topic not assigned';};
const inScope=a=>activeSubjects().includes(a.subject)&&(state.subject==='all'||a.subject===state.subject)&&(state.level==='all'||a.level===state.level);
const scoped=kind=>all(kind).filter(inScope);
const dueMistakes=()=>scoped('mistake').filter(m=>!m.corrected&&(!m.retryDate||m.retryDate<=localDate()));
function empty(title,body,cta='',action='',symbol='book'){return `<div class="empty">${icon(symbol)}<h3>${title}</h3><p>${body}</p>${cta?button(cta,action,'primary'):''}</div>`;}
function heading(title,desc,action=''){return `<div class="page-heading"><div><h1${state.route==='detail'?' class="paper-code-title"':''}>${title}</h1><p>${desc}</p></div>${action}</div>`;}
function filters(){return `<div class="subject-tabs" role="group" aria-label="Subject filter">${button(esc(state.subject==='all'?'All subjects':SUBJECTS[state.subject].name)+icon('arrow'),'choose-subject','subject-tab active','aria-haspopup="dialog" aria-label="Choose subject: '+esc(state.subject==='all'?'All subjects':SUBJECTS[state.subject].name)+'"')}<div class="level-tabs" role="group" aria-label="Level filter">${['all','AS','A2'].map(l=>`<button data-level="${l}" aria-pressed="${state.level===l}" class="${state.level===l?'active':''}">${l==='all'?'AS + A2':l}</button>`).join('')}</div></div>`;}
function subjectPicker(){modal('Your subjects',`<p>Choose a subject to focus your workspace.</p><div class="subject-options">${[['all','All subjects'],...activeSubjects().map(s=>[s,SUBJECTS[s].name])].map(([s,n])=>`<div class="subject-option"><button type="button" data-subject="${s}" class="btn ${state.subject===s?'primary':''}" aria-pressed="${state.subject===s}">${s==='all'?icon('book'):subjectIcon(s)}<span>${esc(n)}${s==='all'?'':`<small>Cambridge ${s}</small>`}</span>${state.subject===s?icon('check'):''}</button>${s==='all'?'':button(icon('trash'),'remove-subject','icon-button',`data-code="${s}" aria-label="Remove ${esc(n)}" title="Remove subject"`)}</div>`).join('')}</div>${activeSubjects().length?'':'<p>No subjects yet. Add a STEM subject to get started.</p>'}<div class="dialog-actions">${button(icon('plus')+' Add subject','new-subject')}</div>`);$('#dialog').classList.add('subject-drawer');}
function removeSubject(code){if(!activeSubjects().includes(code))return;confirmAction(`Remove ${SUBJECTS[code].name}?`,'Remove this subject from your workspace. Saved papers, files and progress are kept and will be available if you add it again.',async()=>{const settings=all('settings')[0]||{id:uid(),kind:'settings'};await save({...settings,subjects:activeSubjects().filter(s=>s!==code)});if(state.subject===code)state.subject='all';closeModal();render();notify(`${SUBJECTS[code].name} removed. Saved work retained.`);},'Remove subject');}

function addSubjectModal(){const available=Object.keys(SUBJECTS).filter(s=>!activeSubjects().includes(s));if(!available.length){modal('All STEM subjects added.','<p>Every subject in the current STEM catalogue is already in your workspace.</p>');return;}modal('Add a STEM subject',`<p>Add a subject with its official syllabus checklist and paper components.</p>${select('Subject','subject',available.map(s=>[s,`${SUBJECTS[s].name} · ${s}`]),available[0],'required')}`,'add-subject','Add subject');}

function metric(label,value,detail=''){return `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`;}
function titleFor() {
 return groups.flatMap(([,items])=>items).find(([route])=>route===state.route)?.[1]||
  ({log:'Log a paper',detail:'Paper details',settings:'Settings & backup',profile:'Student profile'})[state.route]||'Dashboard';
}
function navigation() {
 return groups.map(([label,items])=>{
  const active=items.some(([route])=>route===state.route);
  return `<details class="nav-group" data-group="${label}" ${compact||active||!collapsedGroups.has(label)?'open':''}><summary>${label}${icon('arrow')}</summary><div>${items.map(([route,title,symbol])=>{
   const current=route===state.route||(route==='papers'&&['log','detail'].includes(state.route));
   const due=route==='review'?dueMistakes().length+filteredBookmarks().filter(b=>b.reviewOn&&b.reviewOn<=localDate()).length:0;
   return `<button data-route="${route}" class="nav-item ${current?'active':''}" ${current?'aria-current="page"':''} aria-label="${title}" title="${title}">${icon(symbol)}<span>${title}</span>${due?`<b>${due}</b>`:''}</button>`;
  }).join('')}</div></details>`;
 }).join('');
}
function shell(content) {
 const collapsed=compact?' sidebar-compact':'';
 const account=store.mode==='cloud'?namedAccount()||store.session?.user?.email||'Cloud workspace':'On this device';
 return `<div class="app-frame${collapsed}"><aside id="workspace-navigation" class="sidebar ${state.menu?'open':''}" ${state.menu?'role="dialog" aria-modal="true" aria-label="Workspace navigation"':''}>
 <a class="brand" href="${workspacePath()}#home" aria-label="Cambridge Revision dashboard">${icon('book')}<span>Cambridge Revision<small>Study workspace</small></span></a>
 ${state.menu?button('Close navigation','menu','quiet mobile-only','id="close-navigation"'):''}
 <nav aria-label="Main navigation">${navigation()}</nav>
 <div class="sidebar-bottom">
 <button class="nav-item ${state.route==='profile'?'active':''}" data-route="profile" title="Student profile" aria-label="Student profile">${icon('book')}<span>Profile</span></button>
 <button class="nav-item ${state.route==='settings'?'active':''}" data-route="settings" title="Settings and backup" aria-label="Settings and backup">${icon('settings')}<span>Settings &amp; backup</span></button>
 <button class="nav-item" data-action="toggle-theme" title="Switch appearance" aria-label="Switch appearance">${icon('moon')}<span>Appearance</span></button>
 ${store.mode==='cloud'?'<button class="nav-item" data-action="signout" title="Sign out" aria-label="Sign out">'+icon('arrow')+'<span>Sign out</span></button>':''}
 <div class="sidebar-account">${esc(account)}</div>
 </div></aside>
 ${state.menu?'<button class="menu-scrim" data-action="menu" aria-label="Close navigation" tabindex="-1"></button>':''}
 <div class="workspace" ${state.menu?'inert':''}><header class="topbar">
 ${button(icon('menu'),'menu','icon-button mobile-only','aria-label="Open navigation" aria-controls="workspace-navigation" aria-expanded="'+state.menu+'"')}
 ${button(icon('menu'),'compact-menu','icon-button desktop-collapse','aria-label="'+(compact?'Expand':'Collapse')+' sidebar" aria-controls="workspace-navigation" aria-expanded="'+!compact+'"')}
 <div class="breadcrumbs"><span>Workspace</span><span>/</span><strong>${titleFor()}</strong></div>
 <div class="top-actions"><button class="storage-status" data-action="auth" aria-label="Storage and account">${icon(store.mode==='cloud'?'cloud':'check')}<span>${store.mode==='cloud'?'Cloud':'Local'}</span></button>${button(icon('plus')+' Log paper','log','primary')}</div></header>
 <main id="main" tabindex="-1">${content}<footer><span>Cambridge Revision</span><span>Independent AS &amp; A Level study workspace</span></footer></main></div></div>`;
}
let disposeLanding;
function render() {
 disposeLanding?.();
 disposeLanding=null;
 const path=location.pathname.replace(/\/$/,'')||'/';
 if(accountPaths.has(path)){
  $('#app').innerHTML=accountView(path,esc,accountMessage,hasRecoverySession());
  document.title='Account · Cambridge Revision';
  return;
 }
 if(path==='/'&&!routeNames.has(location.hash.slice(1).split(':')[0])){
  $('#app').innerHTML=landingView(Boolean(store.session), landingDashboard(), questionBreakdownView(demoQuestions,esc,topic=>topic));
  disposeLanding=initPaperWalkthrough($('#app'));
  document.title='Cambridge Revision';
  return;
 }
 if(state.subject!=='all'&&!activeSubjects().includes(state.subject))state.subject='all';
 if(state.route==='practice'&&state.practice?.timed!==false&&state.practice&&!state.practice.startedAt)state.practice.startedAt=Date.now();
 const pages={home,papers,history:historyPage,log:wizard,detail:detailPage,mistakes:mistakesPage,review:reviewPage,analytics:analyticsPage,syllabus:syllabusPage,boundaries:boundariesPage,calculator:calculatorPage,exams:examsPage,bank:bankPage,practice:practicePage,settings:settingsPage,profile:profilePage,onboarding:onboardingPage,plan:planPage,bookmarks:bookmarksPage};
 $('#app').innerHTML=shell((pages[state.route]||home)());
 const shortcuts=$('[data-overview-shortcuts]');
 if(shortcuts)bindPreviewTabs(shortcuts,index=>{state.overviewShortcut=index;});
 document.title=`${titleFor()} · Cambridge Revision`;
 updateTimerDisplay();
}
function go(route,id) {
 const changingView=state.route!==route;
 if(state.route==='log'){
  captureWizard();
  if(route!=='log')pauseForVisibility();
 }
 if(state.route==='practice'&&route!=='practice')pausePractice();
 if(state.preview)URL.revokeObjectURL(state.preview);
 state.route=route;
 state.detail=id||null;
 state.menu=false;
 state.preview=null;
 const next=workspacePath()+'#'+route+(id?':'+id:'');
 if(location.pathname+location.hash!==next)history.pushState(null,'',next);
 render();
 if(changingView)$('#main')?.classList.add('workspace-view-enter');
 $('#main')?.focus({preventScroll:true});
 window.scrollTo({top:0,behavior:'instant'});
}
function viewContext(){
 return {state,esc,icon,subjectIcon,button,link,heading,filters,badge,pct,mins,date,scoped,all,activeSubjects,countdownText,localDate,input,select};
}
function landingDashboard(){
 const attempts=[54,57,60,63].map((marks,index)=>{
  const day=new Date();
  day.setDate(day.getDate()-[12,7,3,0][index]);
  return {id:'demo-'+index,subject:'9709',paper:'12',series:'s',year:2024,date:localDate(day),scope:'full',marks,max:75,minutes:45+index*5};
 });
 const records=kind=>kind==='attempt'?attempts:[];
 const view={...viewContext(),preview:true,state:{},scoped:records,all:records,activeSubjects:()=>[],
  activity:studyEvents(attempts,[],[]),dueBookmarks:0,streak:0};
 return overviewView(view);
}
function home(){
 const c=viewContext();
 const attempts=scoped('attempt'),due=dueMistakes(),activity=events();
 const dueBookmarks=filteredBookmarks().filter(b=>b.reviewOn&&b.reviewOn<=localDate()).length;
 const next=nextStudyTask({draft:Boolean(W||localStorage.getItem(workspaceKey())),due,
  planned:planned().filter(p=>!p.done).sort((a,b)=>a.date.localeCompare(b.date)),attempts,questions:scoped('question'),dueBookmarks});
 const hour=new Date().getHours();
 const greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
 const name=namedAccount();
 return overviewView({...c,welcome:greeting+(name?', '+esc(name):'')+'.',next,activity,dueBookmarks,streak:studyStreak(activity)});
}
function papers(){return libraryView(viewContext());}
function historyPage(){
 const h=state.history,type=h.type||'all';
 const papers=filteredHistory();
 let activity=studyEvents(type==='Practice'||type==='Review'?[]:papers,type==='Paper'||type==='Review'?[]:scoped('session'),type==='Paper'||type==='Practice'?[]:scoped('mistake'));
 activity=activity.filter(e=>(!h.from||e.date>=h.from)&&(!h.to||e.date<=h.to));
 const score=e=>e.type==='Review'||e.record.max<=0?null:percent(e.record);
 if(h.sort==='oldest')activity.reverse();
 if(h.sort==='duration')activity.sort((a,b)=>(b.type==='Review'?0:b.record.minutes||0)-(a.type==='Review'?0:a.record.minutes||0));
 if(h.sort==='best'||h.sort==='worst')activity.sort((a,b)=>score(a)===null?(score(b)===null?0:1):score(b)===null?-1:(h.sort==='best'?-1:1)*(score(a)-score(b)));
 if(h.sort==='marks')activity.sort((a,b)=>(b.record.marks||0)-(a.record.marks||0));
 const draft=Boolean(W||localStorage.getItem(workspaceKey()));
 return heading('Study history','Find saved attempts, focused study and corrections in date order.',button(icon('download')+' Export paper CSV','csv'))+filters()+
  `<section class="next-task"><div><span class="task-kicker">Pick up where you left off</span><h2>Unfinished work</h2><p>${draft||state.practice?'Resume a draft saved on this device.':'Start a paper or a focused study set.'}</p><div class="button-row">${button(draft?'Resume paper draft':'Log a paper','log','primary')}${button(state.practice?'Resume practice set':'Focused study','practice')}</div></div></section>`+
  historyFilters()+
  (type==='Paper'?historyTable(papers):activity.length?eventRows(activity,viewContext()):empty('No activity matches','Log a paper, complete a practice question or adjust the filters.','Log a paper','log'));
}
function historyFilters(){const h=state.history;return `<form id="history-filters" class="filter-panel"><div class="filter-grid">${select('Activity','type',[['all','All activity'],['Paper','Paper attempts'],['Practice','Focused study'],['Review','Corrections']],h.type||'all')}${select('Component','component',[['all','All components'],...[1,2,3,4,5,6].map(x=>[x,'Paper '+x])],h.component||'all')}${input('Examination year','year',h.year||'','number','placeholder="Any year" min="2000" max="2100"')}${select('Series','series',[['all','All series'],...Object.entries(SERIES)],h.series||'all')}${select('Component grade','grade',[['all','All grades'],...['a','b','c','d','e','u'].map(g=>[g,g]),['unavailable','Unavailable']],h.grade||'all')}${select('Timing','timed',[['all','Timed + untimed'],['yes','Timed'],['no','Untimed']],h.timed||'all')}${select('Sort by','sort',[['newest','Newest first'],['oldest','Oldest first'],['marks','Highest raw marks'],['best','Best percentage'],['worst','Lowest percentage'],['duration','Longest working time']],h.sort||'newest')}${input('Minimum score %','min',h.min||'','number','min="0" max="100"')}${input('Maximum score %','max',h.max||'','number','min="0" max="100"')}${input('Attempted from','from',h.from||'','date')}${input('Attempted to','to',h.to||'','date')}</div><div class="button-row"><button class="btn primary">Apply filters</button>${button('Reset','reset-history','quiet')}</div></form>`;}
function filteredHistory(){const h=state.history;let a=scoped('attempt').filter(a=>(!h.component||h.component==='all'||a.paper[0]===h.component)&&(!h.year||a.year==h.year)&&(!h.series||h.series==='all'||a.series===h.series)&&(!h.timed||h.timed==='all'||a.timed===(h.timed==='yes'))&&(!h.from||a.date>=h.from)&&(!h.to||a.date<=h.to)&&(h.min===''||h.min==null||percent(a)>=+h.min)&&(h.max===''||h.max==null||percent(a)<=+h.max));if(h.grade&&h.grade!=='all')a=a.filter(a=>h.grade==='unavailable'?!gradeFor(a,all('threshold')).grade:gradeFor(a,all('threshold')).grade===h.grade);a.sort((a,b)=>h.sort==='oldest'?a.date.localeCompare(b.date):h.sort==='duration'?(b.minutes||0)-(a.minutes||0):h.sort==='marks'?b.marks-a.marks:h.sort==='best'?percent(b)-percent(a):h.sort==='worst'?percent(a)-percent(b):b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt)));return a;}
function attemptNumber(a){return all('attempt').filter(p=>paperCode(p)===paperCode(a)).sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))).findIndex(p=>p.id===a.id)+1;}
function historyTable(attempts){if(!attempts.length)return empty('No paper attempts here yet.','Log a paper, or adjust your filters to find an earlier attempt.','Log a paper','log');return `<div class="table-caption"><span>${attempts.length} attempts · full and partial scores are labelled separately</span></div><div class="table-wrap"><table><thead><tr>${['Date','Subject','Paper','Marks','Percentage','Grade','Time','Difficulty','Attempt',''].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${attempts.map(a=>{const g=gradeFor(a,all('threshold'));return `<tr><td>${date(a.date)}<small>${a.level} · ${a.scope==='partial'?'Partial':'Full paper'}</small></td><td>${badge(a.subject)}</td><td><strong>${paperCode(a)}</strong><small>${esc(component(a)?.[0])}</small></td><td>${a.marks}/${a.max}</td><td><strong>${pct(percent(a))}</strong>${a.scope==='partial'?'<small>Attempted marks only</small>':''}</td><td><span class="grade ${g.grade?'':'unavailable'}" title="${esc(g.label)}">${g.grade||'Unavailable'}</span>${g.grade?`<small>${g.threshold.official?'Official component':'Manual estimate'}</small>`:''}</td><td>${mins(a.minutes)}<small>${a.timed?'Timed':'Untimed'}</small></td><td>${a.difficulty}/10</td><td>#${attemptNumber(a)}</td><td>${button('View details','detail','quiet','data-id="'+a.id+'"')}</td></tr>`;}).join('')}</tbody></table></div>`;}
function newWizard(source=null,edit=false,navigate=true){const comp=source&&component(source);W=source?structuredClone(source):{id:uid(),kind:'attempt',subject:state.subject==='all'?defaultSubject():state.subject,level:state.level==='all'?'AS':state.level,paper:'12',series:'s',year:state.year,date:localDate(),marks:'',max:'',paperMax:'',minutes:'',elapsedMinutes:'',officialMinutes:'',difficulty:5,scope:'full',timed:false,examConditions:false,questionsAttempted:0,correct:0,partialCorrect:0,notes:'',struggled:'',files:[],questions:[],mistakes:[]};if(source&&!edit){W.id=uid();W.date=localDate();W.marks='';W.minutes='';W.elapsedMinutes='';W.notes='';W.questions=[];W.mistakes=[];W.timer=null;W.createdAt=null;}else if(source&&edit)W.mistakes=all('mistake').filter(m=>m.attemptId===source.id).map(m=>structuredClone(m));W.step=source?2:0;W.editing=edit;W.mistakes||=[];activeTimer=W.timer||null;persistDraft();if(navigate)go('log');}
function persistDraft(){if(W)try{localStorage.setItem(workspaceKey(),JSON.stringify(W));}catch{notify('Draft could not be cached. Save this attempt before leaving.','error');}}
function captureWizard(){if(!W)return;const f=$('#wizard-form');if(!f)return;const data=new FormData(f);for(const [k,v]of data){if(k.startsWith('q-'))continue;W[k]=v;}for(const c of f.querySelectorAll('input[type="checkbox"]'))W[c.name]=c.checked;W.questions=(W.questions||[]).map((q,i)=>({...q,number:data.get(`q-number-${i}`)??q.number,max:+(data.get(`q-max-${i}`)??q.max),marks:+(data.get(`q-marks-${i}`)??q.marks),topic:data.get(`q-topic-${i}`)??q.topic}));for(const key of ['marks','max','paperMax','minutes','elapsedMinutes','officialMinutes','difficulty','questionsAttempted','correct','partialCorrect','year'])if(W[key]!==''&&W[key]!=null)W[key]=+W[key];persistDraft();}
function wizard(){if(!activeSubjects().length)return heading('Choose your subjects first.','Add a subject before logging a paper.')+empty('Your STEM workspace starts here.','Add a subject and its syllabus.','Add subject','new-subject');if(!W){try{W=JSON.parse(localStorage.getItem(workspaceKey())||'null');activeTimer=W?.timer||null;}catch{}if(!W)newWizard(null,false,false);}const steps=['Upload','Identify','Performance','Questions & mistakes','Save & analyse'];let content='';
if(W.step===0)content=`<h2>Keep the paper with your progress.</h2><p>Add a question paper PDF, then attach the mark scheme, your answers or an examiner report.</p>${uploadZone()}<div id="upload-status" role="status"></div>${fileList(W.files,true)}<p class="small muted">PDF, PNG, JPEG or WebP · 20 MB per file · files are stored in ${store.mode==='cloud'?'your private Supabase bucket':'this browser’s database'}. Uploaded files are reusable across attempts.</p>`;
if(W.step===1)content=`<h2>Check the paper details.</h2><p>Filename recognition is a starting point. Confirm the paper’s cover before continuing.</p>${W.recognition?`<div class="notice">${esc(W.recognition)}</div>`:''}<div class="form-grid">${select('Subject','subject',subjectOptions(),W.subject,'required')}${select('Stage studied','level',['AS','A2'],W.level)}${input('Paper code (component + variant)','paper',W.paper,'text','pattern="[0-9]{2}" maxlength="2" required placeholder="12"')}${select('Examination series','series',Object.entries(SERIES),W.series)}${input('Examination year','year',W.year,'number','min="2000" max="2100" required')}${input('Official duration (minutes)','officialMinutes',W.officialMinutes,'number','min="1" placeholder="Confirm from cover"')}</div><div class="notice subtle">${COMPONENTS[W.subject]?.[W.paper?.[0]]?`Syllabus reference: ${component(W)[0]} · ${component(W)[1]} marks · ${component(W)[2]} minutes. `:''}Paper cover details take precedence. ${W.series==='m'?'Cambridge’s m filename code normally means February/March; s means May/June.':''}</div>`;
if(W.step===2)content=`<div class="section-heading"><div><h2>Record your attempt.</h2><p>${paperCode(W)} · ${esc(component(W)?.[0])}</p></div>${badge(W.subject)}</div><section class="form-section"><h3>Score and paper</h3><div class="form-grid">${input('Date attempted','date',W.date,'date','required')}${select('Attempt coverage','scope',[['full','Full paper'],['partial','Partial paper']],W.scope)}${input('Marks achieved','marks',W.marks,'number','min="0" step="0.25" required')}${input(W.scope==='partial'?'Available marks in attempted questions':'Maximum paper marks','max',W.max,'number','min="0.25" step="0.25" required')}${W.scope==='partial'?input('Full-paper maximum marks','paperMax',W.paperMax,'number','min="1" required'):''}${input('Difficulty (1–10)','difficulty',W.difficulty,'number','min="1" max="10" required')}</div></section><section class="form-section"><h3>Time and conditions</h3>${timerPanel()}<div class="form-grid">${input('Active working time (minutes)','minutes',W.minutes,'number','min="0" step="0.01" required placeholder="94"')}${input('Elapsed time, including pauses (optional)','elapsedMinutes',W.elapsedMinutes,'number','min="0" step="0.01"')}</div><div class="check-row">${check('Timed attempt','timed',W.timed)}${check('Completed under examination conditions','examConditions',W.examConditions)}</div></section><section class="form-section"><h3>Question counts</h3><div class="form-grid">${input('Questions attempted','questionsAttempted',W.questionsAttempted,'number','min="0" step="1"')}${input('Fully correct questions','correct',W.correct,'number','min="0" step="1"')}${input('Partially correct questions','partialCorrect',W.partialCorrect,'number','min="0" step="1"')}</div></section><section class="form-section"><h3>Reflections</h3>${textarea('Topics I struggled with','struggled',W.struggled)}${textarea('Notes and reflections','notes',W.notes)}</section><div class="live-score" id="live-score">${scorePreview()}</div>`;
if(W.step===3)content=`<div class="section-heading"><div><h2>Make the lost marks useful.</h2><p>Optional. Add question marks now, or come back to this attempt later.</p></div>${button(icon('plus')+' Add question','add-row')}</div>${questionEditor(W)}<div id="question-summary" class="notice ${questionDiscrepancy(W)?'warning':'subtle'}">${questionSummary(W)}</div><div class="section-heading"><h3>Mistakes to revisit</h3>${button(icon('plus')+' Log a mistake','new-mistake','','data-attempt="'+W.id+'"')}</div>${W.mistakes.length?W.mistakes.map(m=>`<div class="mistake-line"><div><strong>Q${esc(m.question)} · ${m.lost} marks lost</strong><small>${esc(topicName(m.topic))} · ${esc(m.category)}</small></div>${button('Edit','edit-draft-mistake','quiet','data-id="'+m.id+'"')}</div>`).join(''):'<p class="muted">No mistake notes yet. Your question marks and reflections are saved independently.</p>'}`;
if(W.step===4)content=`<h2>Ready to see the work adding up.</h2><p>Check this attempt before saving it to your history.</p><div class="summary-record"><h3>${paperCode(W)}</h3>${badge(W.subject)}<div class="metrics three">${metric('Marks',`${W.marks}/${W.max}`,W.scope==='partial'?'Partial attempt':'Full paper')}${metric('Percentage',pct(percent(W)),W.scope==='partial'?'Of attempted marks only':'Percentage of full paper')}${metric('Working time',mins(W.minutes),W.timed?'Timed attempt':'Untimed attempt')}</div><p>${esc(gradeFor(W,all('threshold')).label)}</p><p>${W.files.length} attachments · ${W.questions.length} question marks · ${W.mistakes.length} mistake notes</p>${questionDiscrepancy(W)?`<div class="notice warning">${questionSummary(W)} You can save this draft breakdown and correct it later.</div>`:''}</div><div class="notice subtle">${store.mode==='cloud'?'Records will be saved to Supabase under your account.':'This is a browser-local workspace. Keep JSON backups, or sign in to copy your records to Supabase.'} No successful save is shown until storage confirms it.</div>`;
return heading(W.editing?'Correct an earlier attempt.':'A paper is more than a score.','Keep the evidence, the time and the lessons together.')+`<div class="wizard-layout"><div class="wizard-steps">${steps.map((s,i)=>`<div class="wizard-step ${i===W.step?'active':''} ${i<W.step?'done':''}"><span>${i<W.step?icon('check'):i+1}</span><strong>${s}</strong></div>`).join('')}</div><form id="wizard-form" class="panel wizard-panel">${content}<div class="wizard-actions"><div>${W.step?button('Back','wizard-back'):button('Save draft & leave','leave-draft','quiet')}</div><div class="button-row">${W.step===3?button('Skip for now','wizard-next','quiet'):''}${W.step===4?'<button class="btn primary" type="submit" data-submit="save-attempt">Save attempt & analyse</button>':`<button type="submit" class="btn primary">Continue ${icon('arrow')}</button>`}</div></div><div id="wizard-error" role="alert"></div></form></div>`;}
function uploadZone(){return `<label class="dropzone" id="dropzone">${icon('upload')}<strong>Drop your papers here</strong><span>or choose files from your device</span><input type="file" id="paper-files" accept="application/pdf,image/png,image/jpeg,image/webp" multiple aria-label="Upload paper attachments"></label>`;}
function fileList(files,editable=false){return `<div class="file-list">${(files||[]).map((f,i)=>`<div class="file-row">${icon('file')}<div><strong>${esc(f.name)}</strong><small>${(f.size/1024/1024).toFixed(2)} MB · Stored</small></div>${editable?`<select aria-label="Attachment role for ${esc(f.name)}" data-file-role="${i}">${['Question paper','Mark scheme','Completed answers','Examiner report','Grade thresholds','Mistake image'].map(r=>`<option ${f.role===r?'selected':''}>${r}</option>`).join('')}</select>`:`<span class="pill">${esc(f.role)}</span>`}${button('Open','file','quiet',`data-file="${esc(f.id)}"`)}${editable?button(icon('close'),'detach','icon-button',`data-index="${i}" aria-label="Detach ${esc(f.name)}"`):''}</div>`).join('')}</div>`;}
function questionEditor(a){if(!a.questions?.length)return '<div class="empty small-empty"><p>Add the question number, its available marks, your score and a syllabus topic.</p></div>';return `<div class="table-wrap"><table class="question-table"><thead><tr><th>Question / subpart</th><th>Available</th><th>Obtained</th><th>Lost</th><th>Syllabus topic</th><th></th></tr></thead><tbody>${a.questions.map((q,i)=>`<tr><td><input name="q-number-${i}" value="${esc(q.number)}" required aria-label="Question ${i+1} number" placeholder="1(a)"></td><td><input type="number" name="q-max-${i}" value="${q.max}" min="0.25" step="0.25" required aria-label="Question ${i+1} available marks"></td><td><input type="number" name="q-marks-${i}" value="${q.marks}" min="0" step="0.25" required aria-label="Question ${i+1} obtained marks"></td><td data-question-lost="${i}">${fmt(q.max-q.marks)}</td><td><select name="q-topic-${i}" aria-label="Question ${i+1} topic">${topicOptions(a.subject,true,a.level).map(([v,l])=>`<option value="${esc(v)}" ${q.topic===v?'selected':''}>${esc(l)}</option>`).join('')}</select></td><td>${button(icon('close'),'remove-row','icon-button',`data-index="${i}" aria-label="Remove question ${i+1}"`)}</td></tr>`).join('')}</tbody></table></div>`;}
function questionDiscrepancy(a){const t=questionTotals(a);return a.questions?.length&&(Math.abs(t.marks-a.marks)>0.001||Math.abs(t.max-a.max)>0.001);}
function questionSummary(a){const t=questionTotals(a);return a.questions?.length?`Question total: ${t.marks}/${t.max}. Entered attempt: ${a.marks}/${a.max}.${questionDiscrepancy(a)?' These totals differ; the breakdown may be incomplete.':' The marks match.'}`:'No question breakdown yet.';}
function scorePreview(){return W?.max>0?`<strong>${pct(percent(W))}</strong><span>${W.scope==='partial'?'Partial attempt: percentage of attempted marks only.':'Full-paper percentage.'}</span>`:'Enter marks to calculate your percentage.';}
function timerPanel(){const t=W?.timer;return `<section class="timer-panel"><div>${icon('clock')}<div><strong data-timer-active>${t?timeText(timerValues(t).activeMs):'00:00:00'}</strong><small data-timer-elapsed>${t?'Elapsed '+timeText(timerValues(t).elapsedMs):'Start when you begin working, or enter time manually below.'}</small></div></div><div class="button-row">${!t?button(icon('play')+' Start timed paper','timer-start'):t.finishedAt?'<span class="pill">Timer finished</span>':button(icon(t.running?'pause':'play')+(t.running?' Pause':' Resume'),'timer-toggle')}${t&&!t.finishedAt?button('Finish paper','timer-finish','primary'):''}</div></section>${t?.autoPaused?'<p class="small muted">Timer paused when you left the page. Resume when you return to work.</p>':''}`;}
function timeText(ms){const sec=Math.floor(ms/1000);return [Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(n=>String(n).padStart(2,'0')).join(':');}
function countdownText(d){const t=countdown(d);return t.past?'Examination date passed':`${t.days}d ${t.hours}h ${t.minutes}m`;}
function detailPage(){const a=get(state.detail);if(!a||a.kind!=='attempt')return heading('Paper not found.','It may belong to your other workspace.')+link('Back to history','history');const g=gradeFor(a,all('threshold')),ms=all('mistake').filter(m=>m.attemptId===a.id),duration=a.officialMinutes||([2026,2027].includes(+a.year)?component(a)?.[2]:null),delta=duration-a.minutes;return heading(paperCode(a),`${SUBJECTS[a.subject].name} · ${a.level} · ${date(a.date)} · Attempt #${attemptNumber(a)}`,`<div class="button-row">${button('Bookmark','bookmark','quiet','data-id="'+a.id+'"')}${button('Log another attempt','repeat-paper','','data-id="'+a.id+'"')}${button(icon('edit')+' Edit record','edit-attempt','primary','data-id="'+a.id+'"')}</div>`)+`<div class="detail-grid"><div><section class="metrics three">${metric('Marks achieved',`${a.marks}/${a.max}`,full(a)?'Full paper':`Partial · ${a.paperMax} full-paper marks`)}${metric('Percentage',pct(percent(a)),full(a)?'Full-paper score':'Of attempted marks only')}${metric('Active working time',mins(a.minutes),a.elapsedMinutes?`${mins(a.elapsedMinutes)} elapsed`:'Manually recorded')}</section>${paperAttachmentsView(a,{...viewContext(),fileList})}${attemptHistoryView(a,viewContext())}<section class="panel"><div class="section-heading"><h2>Question breakdown</h2>${button('Edit question marks','edit-attempt','quiet','data-id="'+a.id+'"')}</div>${questionBreakdownView(a.questions,esc,topicName)}<div class="notice ${questionDiscrepancy(a)?'warning':'subtle'}">${questionSummary(a)}</div></section><section class="panel"><div class="section-heading"><h2>Mistakes & corrections</h2>${button(icon('plus')+' Add mistake','new-mistake','','data-attempt="'+a.id+'"')}</div>${ms.length?ms.map(m=>mistakeCard(m)).join(''):'<p>No mistakes logged for this attempt.</p>'}</section><section class="panel"><h2>Reflections</h2><p class="preserve">${esc(a.notes)||'No reflections recorded.'}</p><h3>Topics that felt difficult</h3><p class="preserve">${esc(a.struggled)||'None recorded.'}</p></section></div><aside><section class="panel"><h2>Component grade</h2><p class="grade-result">${g.grade||'—'}</p><p>${esc(g.label)}</p>${g.threshold?boundaryChart(a,g.threshold):link('Add matching boundaries','boundaries')}<p class="small muted">A component indication is not a final AS or A Level qualification grade.</p>${g.threshold?nextThresholdText(a,g.threshold):''}</section><section class="panel"><h2>Time & conditions</h2><dl><dt>Official duration</dt><dd>${mins(duration)}</dd><dt>Time comparison</dt><dd>${a.timed&&!duration?'Confirm duration from paper cover':a.timed?`${mins(Math.abs(delta))} ${delta>=0?'within the limit':'over the limit'}`:'Untimed practice'}</dd><dt>Difficulty</dt><dd>${a.difficulty}/10</dd><dt>Exam conditions</dt><dd>${a.examConditions?'Yes':'No'}</dd><dt>Questions attempted</dt><dd>${a.questionsAttempted}</dd><dt>Correct / partial</dt><dd>${a.correct} / ${a.partialCorrect}</dd></dl></section><section class="panel"><h2>Record history</h2><p>Saved ${new Date(a.createdAt||a.updatedAt).toLocaleString('en-GB')}</p>${(a.revisions||[]).map(r=>`<div class="revision-entry"><strong>${new Date(r.at).toLocaleString('en-GB')}</strong><small>Previous mark: ${r.marks}/${r.max} · ${mins(r.minutes)}</small></div>`).join('')}<hr>${button(icon('trash')+' Delete this attempt','delete-attempt','danger','data-id="'+a.id+'"')}</section></aside></div>`;}
function nextThresholdText(a,t){const next=Object.entries(t.values).filter(([,v])=>v>a.marks).sort((a,b)=>a[1]-b[1])[0];return `<p>${next?`${fmt(next[1]-a.marks)} more marks to reach ${esc(next[0])}.`:'You meet the highest available component threshold.'}</p>`;}
function mistakeCard(m){const a=get(m.attemptId);return `<article class="mistake-card"><div class="split"><div>${badge(m.subject)}<h3>Q${esc(m.question)} · ${m.lost} marks lost</h3><p>${esc(topicName(m.topic))}</p></div><span class="pill ${m.corrected?'success':''}">${m.corrected?'Corrected':'To revisit'}</span></div><div class="mistake-category">${esc(m.category)}</div><p class="preserve">${esc(m.explanation)}</p><div class="button-row">${button('Retry this question','retry','primary','data-id="'+m.id+'"')}${button('Edit correction','edit-mistake','','data-id="'+m.id+'"')}${a?button(paperCode(a),'detail','quiet','data-id="'+a.id+'"'):''}</div><small class="muted">Next review: ${date(m.retryDate)} · ${m.reviewHistory?.length||0} reviews</small>${m.corrections?.length?`<details class="correction-history"><summary>${m.corrections.length} earlier correction${m.corrections.length===1?'':'s'}</summary>${m.corrections.map(c=>`<p><strong>${esc(new Date(c.at).toLocaleString('en-GB'))}</strong></p><p class="preserve">${esc(c.correctAnswer||c.explanation)}</p>`).join('')}</details>`:''}</article>`;}
function mistakesPage(){
 const f=state.mistakeFilters||{},ms=scoped('mistake'),today=localDate();
 const topics=[...new Set(ms.map(m=>m.topic).filter(Boolean))];
 const list=ms.filter(m=>(!f.status||f.status==='all'||(f.status==='corrected'?m.corrected:!m.corrected&&(f.status!=='due'||!m.retryDate||m.retryDate<=today)))&&
  (!f.topic||m.topic===f.topic)&&(!f.category||m.category===f.category)&&(!f.from||m.date>=f.from)&&(!f.to||m.date<=f.to))
  .sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 const next=list.find(m=>!m.corrected);
 return heading('Mistakes','Keep the question, what went wrong and the correction together.',
  `<div class="button-row">${button('Log a mistake','new-mistake')}${next?button('Start correction','retry','primary',`data-id="${next.id}"`):''}</div>`)+filters()+
  `<form id="mistake-filters" class="filter-panel"><div class="filter-grid">
  ${select('Status','status',[['all','All mistakes'],['open','Open mistakes'],['corrected','Corrected'],['due','Due for review']],f.status||'all')}
  ${select('Topic','topic',[['','All topics'],...topics.map(t=>[t,topicName(t)])],f.topic||'')}
  ${select('Error category','category',[['','All categories'],...CATEGORIES],f.category||'')}
  ${input('From','from',f.from||'','date')}${input('To','to',f.to||'','date')}
  </div><div class="button-row"><button class="btn primary">Apply filters</button>${button('Reset','reset-mistakes','quiet')}</div></form>
  <p class="muted">${list.length} ${list.length===1?'mistake':'mistakes'} shown</p>`+
  (list.length?`<div class="review-list">${list.map(mistakeCard).join('')}</div>`:empty(ms.length?'No matching mistakes':'No mistakes recorded','Log a mistake after marking a paper, or change the current filters.','Log a mistake','new-mistake'));
}
function reviewPage(){
 const ms=scoped('mistake'),due=dueMistakes();
 const scheduled=ms.filter(m=>!m.corrected&&m.retryDate>localDate()).sort((a,b)=>a.retryDate.localeCompare(b.retryDate));
 const saved=filteredBookmarks().filter(b=>b.reviewOn&&b.reviewOn<=localDate());
 return heading('Review queue','Try the question again before checking your correction.')+filters()+
  `<section class="metrics three">${metric('Mistakes due',due.length)}${metric('Scheduled mistakes',scheduled.length)}${metric('Bookmarks due',saved.length)}</section>
  <section class="folio-section"><h2>Due corrections</h2>${due.length?`<div class="review-list">${due.map(mistakeCard).join('')}</div>`:empty('No corrections due','Log a mistake or complete a focused study question to start the queue.','Focused study','practice')}</section>
  ${scheduled.length?`<section class="folio-section"><h2>Scheduled corrections</h2><div class="review-list">${scheduled.map(mistakeCard).join('')}</div></section>`:''}
  ${saved.length?`<section class="folio-section"><h2>Saved questions and sections</h2>${bookmarkRows(saved,true)}</section>`:''}
  <details class="folio-section"><summary>Corrected mistakes (${ms.filter(m=>m.corrected).length})</summary><div class="review-list">${ms.filter(m=>m.corrected).map(mistakeCard).join('')}</div></details>`;
}
function analyticsFiltered(kind){return scoped(kind).filter(a=>{let from=state.from;if(state.range!=='all'&&state.range!=='custom'){const d=new Date();d.setDate(d.getDate()-Number(state.range));from=localDate(d);}return (!from||a.date>=from)&&(!state.to||a.date<=state.to)&&(state.component==='all'||String(a.paper||'')[0]===state.component);});}
function analyticsPage(){const a=analyticsFiltered('attempt'),ms=scoped('mistake').filter(m=>a.some(a=>a.id===m.attemptId)||!m.attemptId),ss=analyticsFiltered('session'),s=stats(a,ms,ss),topics=TOPICS.filter(t=>activeSubjects().includes(t.subject)&&(state.subject==='all'||t.subject===state.subject)).map(t=>({...t,...topicStats(t.id,a,ms,ss)})),lostTopics=topics.filter(t=>t.lost>0).sort((a,b)=>b.lost-a.lost),mistakesByCategory=CATEGORIES.map(label=>({label,value:sum(ms.filter(m=>m.category===label).map(m=>m.lost))})).filter(v=>v.value>0);return heading('Analytics','Follow completed-paper scores, working time and the syllabus topics behind them.')+filters()+`<form id="analytics-filters" class="analytics-filters">${select('Date range','range',[['7','Last 7 days'],['30','Last 30 days'],['90','Last 90 days'],['all','All time'],['custom','Custom dates']],state.range)}${select('Component','component',[['all','All components'],...[1,2,3,4,5,6].map(p=>[p,'Paper '+p])],state.component)}${state.range==='custom'?input('From','from',state.from,'date')+input('To','to',state.to,'date'):''}<button class="btn">Apply</button></form><section class="metrics analytics-metrics analytics-summary">${metric('Papers completed',s.count,`${s.partial} partial attempts excluded`)}${metric('Marks earned / available',`${fmt(s.earned)} / ${fmt(s.available)}`,'Totals, not a raw-mark average')}${metric('Average percentage',pct(s.avg),'Equal weight per completed attempt')}</section><details class="folio-section analytics-evidence"><summary>More performance measures</summary><section class="metrics analytics-metrics">${metric('Most recent score',pct(s.latest))}${metric('Best paper score',pct(s.best))}${metric('Average working time',mins(s.avgTime))}${metric('Total study time',mins(s.totalTime))}${metric('Recorded mistakes',s.mistakes)}${metric('Corrected mistakes',s.corrected)}${metric('Performance trend',s.trend==null?'—':`${s.trend>=0?'+':''}${fmt(s.trend)} pp`,'Latest 3 vs previous 3 papers')}</section></details><section class="panel"><div class="section-heading"><div><h2>Marks over time</h2><p>Solid: attempts · dashed: 3-attempt moving average within each component.</p></div><span class="pill">Full papers only</span></div><div class="performance-plot" tabindex="0" role="region" aria-label="Paper scores over time">${lineChart(a,true,{width:900,height:340,left:96,right:44,top:28,bottom:56,axisLabelX:76})}</div><p class="small muted">Each subject/component has its own line. Hover or focus a point for the date, paper and score.</p></section><div class="chart-grid"><section class="panel"><h2>Time vs performance</h2>${scatter(a)}</section><section class="panel"><h2>Component grade distribution</h2>${gradeBars(a,all('threshold'))}</section><section class="panel"><h2>Marks lost by topic</h2>${bars(lostTopics.slice(0,8).map(t=>({label:t.title,value:t.lost,color:SUBJECTS[t.subject].color})))}</section><section class="panel"><h2>Marks lost by mistake type</h2>${bars(mistakesByCategory)}</section><section class="panel"><h2>AS vs A2</h2>${bars(['AS','A2'].map(level=>({label:`${level} completed papers`,value:a.filter(p=>p.level===level&&full(p)).length})))}<div class="split"><span>AS average</span><strong>${pct(average(a.filter(p=>p.level==='AS'&&full(p)).map(percent)))}</strong></div><div class="split"><span>A2 average</span><strong>${pct(average(a.filter(p=>p.level==='A2'&&full(p)).map(percent)))}</strong></div></section></div>${activityCalendar(studyEvents(a,ss,ms),viewContext(),91)}<section class="panel"><h2>Topic mastery</h2><p>Measured accuracy and your confidence are separate signals.</p>${topics.filter(t=>t.attempted).length?`<div class="table-wrap"><table><thead><tr><th>Topic</th><th>Questions / practice attempts</th><th>Measured accuracy</th><th>Confidence</th><th>Marks lost</th></tr></thead><tbody>${topics.filter(t=>t.attempted).map(t=>`<tr><td>${esc(topicName(t.id))}</td><td>${t.attempted}</td><td>${pct(t.accuracy)}</td><td>${all('topic').find(r=>r.topicId===t.id)?.confidence||'—'}/5</td><td>${t.lost}</td></tr>`).join('')}</tbody></table></div>`:empty('Practice will reveal the pattern.','Link question marks to syllabus topics to measure accuracy.')}</section>`;}
function syllabusPage(){const subject=state.subject==='all'?defaultSubject():state.subject,settings=all('settings')[0]||{},route=settings.routes?.[subject]||Object.keys(ROUTES[subject]).at(-1),cs=ROUTES[subject][route],ts=topicsFor(state.subject,state.level,state.subject==='all'?null:cs).filter(t=>activeSubjects().includes(t.subject));return heading('Know what you know. Find what needs work.','Track the numbered topics and practical skills in your selected 2026–2027 syllabus.')+filters()+`<form id="syllabus-settings" class="analytics-filters">${select('Examination year','year',[2026,2027],settings.year||state.year)}${activeSubjects().includes('9709')?select('Mathematics examination route','mathRoute',Object.keys(ROUTES['9709']),settings.routes?.['9709']||'A Level: P1 + P3 + P4 + P5'):''}${state.subject!=='all'&&state.subject!=='9709'?select('Qualification route','route',Object.keys(ROUTES[subject]),route):''}<button class="btn">Apply</button></form><div class="notice subtle">${state.subject==='all'?'All components are visible. Select a subject to apply its examination route.':`Showing components for ${esc(route)}.`} Confidence is self-reported; accuracy comes from recorded marks. <div class="source-links">${(state.subject==='all'?activeSubjects():[state.subject]).map(s=>`<a href="${syllabusSource(s,settings.year||state.year)}" target="_blank" rel="noopener">Official ${SUBJECTS[s].name} syllabus ${icon('arrow')}</a>`).join('')}</div></div><div class="table-caption">${ts.length} syllabus subtopics · expand a row to update your progress</div><div class="syllabus-list">${ts.map((t,i)=>{const p=all('topic').find(p=>p.topicId===t.id)||{},m=topicStats(t.id,all('attempt'),all('mistake'),all('session'));return `${mathsComponent(t)&&(!i||ts[i-1].subject!==t.subject||ts[i-1].component!==t.component)?`<h2 class="syllabus-component">${esc(mathsComponent(t))} <span>Paper ${t.component}</span></h2>`:''}<button class="syllabus-row" data-action="topic" data-topic="${t.id}"><span class="topic-status ${p.status==='Complete'?'done':''}">${p.status==='Complete'?icon('check'):''}</span><div><strong>${t.code} ${esc(t.title)}</strong><small>${SUBJECTS[t.subject].name} · P${t.components.join(' / P')} · ${t.level}</small></div><div><strong>${pct(m.accuracy)}</strong><small>${m.attempted} attempts</small></div><div><strong>${p.confidence?`${p.confidence}/5`:'—'}</strong><small>Confidence</small></div><div><strong>${m.lost}</strong><small>Marks lost</small></div><div><strong>${m.repeated}</strong><small>Mistakes</small></div><div><strong>${date(m.last)}</strong><small>Last practised</small></div><div><strong>${date(m.next)}</strong><small>Next review</small></div>${icon('edit')}</button>`;}).join('')}</div>`;}
function boundariesPage(){const ts=scoped('threshold');return heading('Put your marks in context.','Exact subject, series, year and variant. A paper grade is not a qualification grade.',`<div class="button-row">${button('AS → A Level calculator','calculator')}${button(icon('plus')+' Add thresholds','new-threshold','primary')}</div>`)+filters()+`<div class="notice subtle">Official thresholds need a Cambridge source or an attached official PDF. Manual estimates are labelled separately. Component grades use a–e; A* is only available for the full A Level qualification.</div>`+(ts.length?`<div class="table-wrap"><table><thead><tr><th>Subject</th><th>Scope / paper</th><th>Series</th><th>Maximum</th><th>Thresholds</th><th>Provenance</th><th></th></tr></thead><tbody>${ts.map(t=>`<tr><td>${badge(t.subject)}</td><td>${t.scope==='component'?t.paper:`${esc(t.level)} · ${esc(t.optionCode||'')}`}<small>${t.scope==='component'?'Component indication':esc(t.route)}</small></td><td>${SERIES[t.series]} ${t.year}</td><td>${t.max}</td><td>${Object.entries(t.values).map(([g,n])=>`${esc(g)} ${n}`).join(' · ')}</td><td><span class="pill">${t.official?'Official source supplied':'Manual estimate'}</span>${/^https?:\/\//i.test(t.sourceUrl||'')?`<a target="_blank" rel="noopener" href="${esc(t.sourceUrl)}">View source</a>`:''}</td><td>${button('Edit','edit-threshold','quiet','data-id="'+t.id+'"')}</td></tr>`).join('')}</tbody></table></div>`:empty('The right boundary matters.','Upload a grade-threshold PDF and enter the matching component row. We will never guess a grade.','Add grade thresholds','new-threshold','flag'))+`<section class="panel"><h2>How grades are reported</h2><div class="explanation-grid"><div><h3>Component indication</h3><p>Your raw mark compared with the exact paper’s threshold. It is a practice indicator, never a final qualification grade.</p></div><div><h3>Overall qualification</h3><p>Requires the correct entry option, all component results, weightings, and the overall threshold table.</p></div><div><h3>Future outcome estimate</h3><p>A simulation using entered AS marks and hypothetical A2 scores. Carry-forward eligibility must be confirmed with your centre.</p></div></div></section>`;}
function calculatorPage(){if(!activeSubjects().length)return heading('Choose your subjects first.','Add a subject to use its component routes.')+empty('Your STEM workspace starts here.','Add a subject and its syllabus.','Add subject','new-subject');const subject=state.subject==='all'?defaultSubject():state.subject,route=state.calcRoute&&ROUTES[subject][state.calcRoute]?state.calcRoute:Object.keys(ROUTES[subject]).at(-1),parts=ROUTES[subject][route];return heading('What could your next results make possible?','Simulate a valid component route. Every future A2 mark is hypothetical.')+filters()+`<form id="calculator" class="panel"><div class="form-grid">${select('Examination route','route',Object.keys(ROUTES[subject]),route)}${select('Examination series','series',Object.entries(SERIES),'s')}${input('Examination year','year',state.year,'number','min="2026" max="2027"')}${input('Overall threshold entry option','optionCode','','text','required placeholder="Exact option, e.g. AY"')}</div><div class="notice subtle">${['9702','9701','9700'].includes(subject)?`${SUBJECTS[subject].name} Paper 3 raw marks are multiplied by 0.75; other components have factor 1.`:'Raw component marks use factor 1 for these routes.'} ${subject==='9709'&&parts.includes(2)?'The P1 + P2 AS route cannot be carried forward to a full A Level route.':''}</div><div class="table-wrap"><table><thead><tr><th>Component</th><th>Raw marks</th><th>Maximum</th><th>Result type</th></tr></thead><tbody>${parts.map(p=>`<tr><td>P${p} ${COMPONENTS[subject][p][0]}</td><td><input type="number" name="score-${p}" min="0" max="${COMPONENTS[subject][p][1]}" required aria-label="Paper ${p} raw marks"></td><td>${COMPONENTS[subject][p][1]}</td><td>${select('','type-'+p,[['actual','Recorded component result'],['future','Hypothetical future result']],COMPONENTS[subject][p][3]==='A2'?'future':'actual')}</td></tr>`).join('')}</tbody></table></div><div class="check-row">${check('My centre has confirmed this component combination and any carry-forward eligibility','eligible',false)}</div><button class="btn primary">Calculate estimate</button><div id="calculation-result" aria-live="polite"></div></form>`;}
function examsPage(){const exams=[...scoped('exam')].sort((a,b)=>a.datetime.localeCompare(b.datetime));return heading('Give your revision a real deadline.','Add your actual examination dates. Each paper has its own countdown.',button(icon('plus')+' Add examination','new-exam','primary'))+filters()+(exams.length?`<div class="exam-timeline">${exams.map(e=>{const days=countdown(e.datetime).days,weak=TOPICS.filter(t=>t.subject===e.subject&&t.components.some(c=>String(c)===e.paper[0])).map(t=>({...t,...topicStats(t.id,all('attempt'),all('mistake'),all('session'))})).sort((a,b)=>b.lost-a.lost)[0];return `<article class="panel exam-card"><div class="exam-date"><strong>${new Date(e.datetime).getDate()}</strong><span>${new Date(e.datetime).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span></div><div>${badge(e.subject)}<h2>${SUBJECTS[e.subject].name} · Paper ${esc(e.paper)}</h2><p>${new Date(e.datetime).toLocaleString('en-GB')} · ${e.duration} min · ${e.level} · Target ${esc(e.target)}</p><p>${weak?.lost?`Prioritise ${weak.title}: ${weak.lost} marks lost in recorded attempts.`:days<=14?'Keep sessions short, timed and focused. Review corrections before another full paper.':'Build a baseline with a paper, then practise the topics where marks are lost.'}</p></div><div><div class="countdown" data-countdown="${esc(e.datetime)}">${countdownText(e.datetime)}</div><div class="button-row">${button('Edit','edit-exam','','data-id="'+e.id+'"')}${button(icon('trash'),'delete-record','icon-button','data-id="'+e.id+'" aria-label="Delete exam"')}</div></div></article>`;}).join('')}</div>`:empty('Your dates. Your timeline.','No examination dates are assumed. Add the timetable confirmed by your centre.','Add your first examination','new-exam','calendar'));}
function bankPage(){const b=state.bank,questions=scoped('question').filter(q=>(!b.search||[q.title,q.prompt,topicName(q.topic),q.reference].join(' ').toLowerCase().includes(b.search.toLowerCase()))&&(b.source==='all'||q.source===b.source)&&(b.difficulty==='all'||q.difficulty==b.difficulty));return heading('A question bank that grows with you.','Save paper references, rate the challenge and revisit your attempts.',button(icon('plus')+' Add question','new-question','primary'))+filters()+`<form id="bank-filters" class="bank-filters">${input('Search questions','search',b.search,'search','placeholder="Search topic, paper code or question…"')}${select('Source','source',[['all','All sources'],['original','Original practice'],['cambridge','Cambridge past paper']],b.source)}${select('Difficulty','difficulty',[['all','All difficulties'],...[1,2,3,4,5].map(n=>[n,n+'/5'])],b.difficulty)}<button class="btn">Search</button></form><div class="table-caption"><span>${questions.length} questions · difficulty is your revision estimate</span>${button(`Practise selected (${state.selected.length})`,'practice-selected','',state.selected.length?'':'disabled')}</div>`+(questions.length?`<div class="table-wrap"><table><thead><tr><th>Select</th><th>Question / source</th><th>Subject & topic</th><th>Challenge</th><th>Last score</th><th></th></tr></thead><tbody>${questions.map(q=>{const latest=all('session').filter(s=>s.questionId===q.id).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))[0];return `<tr><td><input type="checkbox" data-select-question="${q.id}" ${state.selected.includes(q.id)?'checked':''} aria-label="Select ${esc(q.title)}"></td><td><strong>${esc(q.title)}</strong><small>${q.level} · ${q.max} marks${q.reference?' · '+esc(q.reference):''}</small><span class="pill">${q.source==='cambridge'?'Cambridge past paper · user supplied':'Original practice'}</span></td><td>${badge(q.subject)}<small>${esc(topicName(q.topic))}</small></td><td>${q.difficulty}/5</td><td>${latest?`${latest.marks}/${latest.max}`:'Unattempted'}</td><td>${button('Open','open-question','quiet','data-id="'+q.id+'"')}${button('Bookmark','bookmark','quiet','data-id="'+q.id+'"')}</td></tr>`;}).join('')}</tbody></table></div>`:empty('Keep good questions close.','Add your own practice questions or verified references from papers you have uploaded.','Add your first question','new-question'));}
function practicePage(){const p=state.practice;if(p){const q=get(p.ids[p.index]);if(!q)return empty('This question is no longer available.','Clear this unfinished set to choose another question.','Clear unfinished set','discard-practice');return heading('Try first. Then check your reasoning.',`Question ${p.index+1} of ${p.ids.length} · ${q.source==='original'?'Original practice':'Cambridge reference supplied by you'}`)+`<section class="panel practice-card">${badge(q.subject)}<h2>${esc(q.title)}</h2><p class="small muted">${esc(topicName(q.topic))} · ${q.max} marks · ${q.level}</p><p class="question-prompt preserve">${esc(q.prompt)}</p>${fileList(q.files)}<label class="field"><span>Your working (saved with this attempt)</span><textarea id="practice-working" rows="7">${esc(p.working||'')}</textarea></label><div class="split">${p.timed===false?'<span>Untimed practice</span>':`<span class="practice-clock" data-practice-time>${mins(practiceMinutes(p))}</span>`}${button(p.revealed?'Hide answer':'Reveal answer','reveal-answer')}</div><div class="button-row">${button('Bookmark question','bookmark','quiet',`data-id="${q.id}"`)}${button('Clear unfinished set','discard-practice','quiet')}</div>${p.revealed?`<div class="answer-block"><h3>Answer & marking notes</h3><p class="preserve">${esc(q.answer)}</p></div><form id="self-mark"><div class="form-grid">${input('Marks earned','marks','','number',`min="0" max="${q.max}" step="0.25" required`)}${input('Working time (minutes)','minutes',p.timed===false?'0':practiceMinutes(p).toFixed(2),'number','min="0" step="0.01" required')}${select('Confidence after checking','confidence',[1,2,3,4,5],3)}</div><button class="btn primary">Save practice result${p.index<p.ids.length-1?' & continue':''}</button></form>`:''}</section>`;}const sessions=scoped('session');return heading('Focused study','Practise a syllabus topic using your saved questions, then record marks and working time.')+filters()+focusedStudyForm()+`<section class="folio-section"><h2>Session history</h2>${sessions.length?`<div class="table-wrap"><table><thead><tr><th>Date</th><th>Question</th><th>Subject</th><th>Marks</th><th>Time</th></tr></thead><tbody>${[...sessions].reverse().map(s=>`<tr><td>${date(s.date)}</td><td>${esc(get(s.questionId)?.title||s.title||'Practice question')}</td><td>${badge(s.subject)}</td><td>${s.marks}/${s.max}</td><td>${mins(s.minutes)}</td></tr>`).join('')}</tbody></table></div>`:empty('Your next focused session starts here.','Add questions to the bank, select a set and begin.','Choose a set','bank')}</section>`;}
async function saveProfile(values){
 const settings=profile();
 return save({...settings,id:settings.id||uid(),kind:'settings',...values});
}
function setupRequired(){
 return store.mode==='cloud'&&store.session?.user?.user_metadata?.revision_onboarding===true&&!profile().onboarded&&!store.records.length;
}
function profileFields(onboarding=false){
 const p=profile(),level=p.qualification||'all';
 const exams=Object.entries(COMPONENTS).flatMap(([code,parts])=>Object.entries(parts).map(([part,details])=>
  [code+':'+part,SUBJECTS[code].name+' · Paper '+part+' · '+details[0]]));
 return `<form class="folio-form" id="profile-form">
 <fieldset><legend>Study preferences</legend><div class="form-grid">
 ${input('Display name','displayName',p.displayName||'','text','maxlength="60" autocomplete="given-name"')}
 ${select('Qualification stage','qualification',[['all','AS and A2'],['AS','AS'],['A2','A2']],level)}
 ${input('Optional grade target','gradeTarget',p.gradeTarget||'','text','maxlength="30" placeholder="For example, A in Mathematics"')}
 </div>${textarea('Revision goal','studyGoal',p.studyGoal||'','maxlength="600"')}</fieldset>
 <fieldset><legend>Your subjects</legend><div class="subject-checks">${Object.entries(SUBJECTS).map(([code,subject])=>
  `<label class="checkbox"><input type="checkbox" name="subjects" value="${code}" ${activeSubjects().includes(code)?'checked':''}>${esc(subject.name)} (${code})</label>`).join('')}</div></fieldset>
 ${onboarding?`<fieldset><legend>First examination (optional)</legend><div class="form-grid">
  ${select('Subject and component','examComponent',[['','Choose a component'],...exams])}
  ${input('Paper variant (1–3)','examVariant','1','number','min="1" max="3"')}
  ${input('Confirmed date and time','examDate','','datetime-local')}
 </div></fieldset>`:''}
 <div class="button-row"><button class="btn primary" type="submit">${onboarding?'Open my dashboard':'Save profile'}</button>
 ${onboarding?button('Skip for now','skip-onboarding','quiet'):link('Open examination planner','exams')}</div>
 </form>`;
}
function profilePage(){
 return heading('Student profile',store.mode==='cloud'?'Signed in as '+esc(store.session?.user?.email):'Preferences for your local workspace.')+profileFields();
}
function onboardingPage(){
 return heading('Set up your workspace','Choose the subjects you are preparing for. You can update these choices later.')+profileFields(true);
}
function setWorkspacePreferences(){
 state.year=profile().year||2027;
 state.level=profile().qualification||'all';
 state.practice=readPracticeDraft();
 if(state.practice)state.practice.startedAt=null;
}
function planPage(){
 const plans=[...planned()].sort((a,b)=>Number(a.done)-Number(b.done)||a.date.localeCompare(b.date));
 const exams=scoped('exam').filter(record=>new Date(record.datetime)>Date.now()).sort((a,b)=>a.datetime.localeCompare(b.datetime));
 const task=nextStudyTask({draft:Boolean(W||localStorage.getItem(workspaceKey())),due:dueMistakes(),planned:plans.filter(p=>!p.done),attempts:scoped('attempt'),questions:scoped('question')});
 return heading('Study plan','Prepare around your exam dates and keep your next sessions in view.',button(icon('plus')+' Plan a session','plan-session','primary'))+
 `<section class="next-task"><div><h2>${esc(task.title)}</h2><p>${esc(task.copy)}</p>${task.action==='plan'?'':button(task.label,task.action,'primary')}</div>
 <div><span class="task-kicker">Revision goal</span><p class="preserve">${esc(profile().studyGoal)||'Add a goal to guide your study plan.'}</p>${link('Edit profile','profile')}</div></section>
 <section class="folio-section"><div class="section-heading"><h2>Planned sessions</h2></div>
 ${plans.map(p=>`<article class="folio-record"><div><h3>${esc(p.title)}</h3><p>${date(p.date)} · ${esc(SUBJECTS[p.subject]?.name||'Any subject')} · ${mins(p.minutes)}${p.done?' · Completed':''}</p></div><div class="button-row">${button(p.done?'Reopen':'Mark complete','toggle-plan','quiet',`data-id="${esc(p.id)}"`)}${button('Edit','plan-session','quiet',`data-id="${esc(p.id)}"`)}</div></article>`).join('')||'<p>No sessions planned yet.</p>'}
 </section><section class="folio-section"><div class="section-heading"><h2>Upcoming examinations</h2>${link('Open planner','exams')}</div>
 ${exams.map(e=>`<div class="folio-record"><div><strong>${esc(SUBJECTS[e.subject].name)} · Paper ${esc(e.paper)}</strong><p>${esc(new Date(e.datetime).toLocaleString('en-GB'))}</p></div><span>${countdownText(e.datetime)}</span></div>`).join('')||'<p>Add an examination date confirmed by your centre.</p>'}
 </section>`;
}
function planSessionModal(id){
 const p=planned().find(plan=>plan.id===id);
 modal(p?'Edit planned session':'Plan a study session',input('Session title','title',p?.title||'','text','required maxlength="120"')+
  select('Subject','subject',[['','Any subject'],...subjectOptions()],p?.subject||'')+
  input('Date','date',p?.date||localDate(),'date','required')+input('Minutes','minutes',p?.minutes||45,'number','required min="1" max="720"'),
  'plan-session',p?'Save changes':'Add to study plan');
 dialogContext.record=p||{};
}
function bookmarkModal(id){
 const record=get(id);
 if(!['attempt','question'].includes(record?.kind))return;
 const title=record.kind==='attempt'?paperCode(record):record.title;
 const existing=bookmarks().find(b=>b.recordId===id&&b.kind==='question');
 modal('Save a bookmark',`<p>${esc(title)}</p>`+
  (record.kind==='attempt'?input('Question or section','section','','text','placeholder="For example, Question 6(b)" maxlength="100"'):'')+
  input('Optional review date','reviewOn',existing?.reviewOn||'','date'),'bookmark','Save bookmark');
 dialogContext.record={recordId:id,kind:record.kind,title,subject:record.subject,level:record.level,...existing};
}
function filteredBookmarks(){
 return bookmarks().filter(b=>inScope(b)).sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
}
function bookmarkRows(items,review=false){
 return items.map(b=>{
  const record=get(b.recordId),title=b.section?b.title+' · '+b.section:b.title;
  return `<article class="folio-record"><div><h3>${esc(title)}</h3><p>${esc(SUBJECTS[b.subject]?.name||b.subject)} · ${b.kind==='attempt'?'Paper section':'Question'}${b.reviewOn?' · Review '+date(b.reviewOn):''}${record?'':' · Source unavailable'}</p></div>
  <div class="button-row">${record?button(b.kind==='attempt'?'Open paper':'Practise question',b.kind==='attempt'?'detail':'open-question','quiet',`data-id="${esc(b.recordId)}"`):''}
  ${review?button('Mark reviewed','review-bookmark','quiet',`data-id="${esc(b.id)}"`):button('Remove','remove-bookmark','quiet',`data-id="${esc(b.id)}" aria-label="Remove bookmark: ${esc(title)}"`)}</div></article>`;
 }).join('');
}
function bookmarksPage(){
 const search=state.bookmarkSearch||'';
 const list=filteredBookmarks().filter(b=>[b.title,b.section].join(' ').toLowerCase().includes(search.toLowerCase()));
 return heading('Bookmarks','Save questions or paper sections you want to return to.')+filters()+
  `<form id="bookmark-filters" class="button-row work-filter">${input('Find a bookmark','search',search,'search','placeholder="Paper code or question"')}<button class="btn">Search</button></form>`+
  (list.length?bookmarkRows(list):empty(search?'No matching bookmarks':'Nothing bookmarked yet',search?'Try a different paper code or question.':'Open a saved paper or question and select Bookmark.','Open papers','papers'));
}
function focusedStudyForm(){
 const subject=state.subject==='all'?(activeSubjects().includes(state.focusSubject)?state.focusSubject:defaultSubject()):state.subject;
 return `<form id="focused-study" class="folio-form folio-section">
 <div class="section-heading"><div><h2>Build a practice set</h2><p>Choose from questions you have saved to your bank.</p></div>${link('Question bank','bank')}</div>
 <div class="form-grid">${select('Subject','subject',subjectOptions().filter(([code])=>state.subject==='all'||state.subject===code),subject,'required')}
 ${select('Syllabus topic','topic',[['','All topics'],...topicOptions(subject,false,state.level)],'')}
 ${select('Set size','size',[1,3,5,10],3)}
 ${select('Timing','timing',[['timed','Timed'],['untimed','Untimed']],'timed')}</div>
 <div class="button-row"><button class="btn primary">Start practice</button>${button('Add a question','new-question','quiet')}</div>
 </form>`;
}
function settingsPage(){return heading('A workspace you can keep.','Control where your data lives and keep a complete backup.')+`<div class="settings-grid"><section class="panel appearance-panel"><h2>Make yourself at home.</h2><p>Choose a readable palette for your study space. Saved on this browser.</p><div class="theme-options" role="group" aria-label="Workspace theme">${[['blue','Ivory'],['black','Dark'],['system','Device']].map(([v,l])=>`<button class="theme-option" data-action="set-theme" data-theme-value="${v}" aria-pressed="${(window.revisionAppearance.theme===v||(v==='blue'&&['paper','current','white'].includes(window.revisionAppearance.theme)))}"><span class="theme-swatch ${v}" aria-hidden="true"></span>${l}</button>`).join('')}</div></section><section class="panel"><h2>Storage & account</h2><div class="notice ${store.mode==='cloud'?'success':'subtle'}">${store.mode==='cloud'?`Signed in as ${esc(store.session?.user?.email)}. Records and files are stored in your private Supabase workspace.`:'You are using the local workspace. Records and files survive refresh and browser restarts on this browser profile. Clearing site data removes them. They do not sync to other devices.'}</div><div class="button-row">${store.mode==='cloud'?button('Sign out','signout')+button('Open local workspace','local-mode'):button('Sign in to cloud workspace','auth','primary')}${store.session&&store.mode==='local'?button('Open cloud workspace','cloud-mode'):''}</div>${store.mode==='cloud'?`<hr><h3>Bring local work to the cloud</h3><p>Copy this browser’s saved records and attachments into your account. Local originals are retained. Matching record IDs are updated.</p>${button('Copy local data to cloud','migrate-local')}`:''}</section><section class="panel"><h2>Export & restore</h2><p>A complete JSON backup contains records and the actual attachment bytes. CSV is a spreadsheet-friendly summary of paper attempts.</p><div class="button-row">${button(icon('download')+' Complete JSON backup','backup','primary')}${button('Paper history CSV','csv')}</div><hr><label class="field"><span>Restore a complete JSON backup</span><input type="file" id="import-backup" accept="application/json,.json"></label><p class="small muted">Records with matching IDs are updated; other records remain. Review the confirmation before importing. Import into the local workspace first if you want to inspect an unfamiliar backup.</p></section><section class="panel"><h2>Academic data</h2><p>Examination years: 2026 and 2027. Historical papers can be logged separately. Component durations and routes are based on official Cambridge syllabuses.</p><div class="source-links">${activeSubjects().map(s=>`<a target="_blank" rel="noopener" href="${syllabusSource(s,state.year)}">${SUBJECTS[s].name} official syllabus</a>`).join('')}</div><p>Thresholds are entered from your supplied official PDFs or explicitly labelled manual estimates. No synthetic results or dates are preloaded.</p></section><section class="panel"><h2>About this workspace</h2><p class="small muted">An independent revision tool; not affiliated with Cambridge International Education.</p></section></div>`;}

let dialogContext={},confirmCallback=null,pendingImport=null;
function modal(title,body,form='',submit='Save'){const d=$('#dialog');d.classList.remove('subject-drawer');dialogContext.form=form;d.innerHTML=`<div class="dialog-heading"><h2>${title}</h2>${button(icon('close'),'close-dialog','icon-button','aria-label="Close dialog"')}</div>${form?`<form id="modal-form" data-form="${form}">${body}<div class="dialog-actions">${button('Cancel','close-dialog')}<button class="btn primary" type="submit">${submit}</button></div><p id="modal-error" class="error" role="alert"></p></form>`:body}`;if(!d.open)d.showModal();}
function closeModal(){const d=$('#dialog');if(d.open)d.close();d.classList.remove('subject-drawer');dialogContext={};}
function confirmAction(title,body,callback,label='Confirm'){confirmCallback=callback;modal(title,`<p>${body}</p><div class="dialog-actions">${button('Cancel','close-dialog')}${button(label,'confirm','primary')}</div>`);}
function authModal(){
 if(!store.session){location.assign('/login');return;}
 const email=esc(store.session.user?.email);
 const actions=store.mode==='cloud'?button('Settings & backup','settings')+button('Sign out','signout'):button('Open cloud workspace','cloud-mode','primary');
 modal('Your account',`<p>Signed in as ${email}.</p><div class="button-row">${actions}</div>`);
}
function mistakeModal(existing=null,attemptId=null){if(state.route==='log')captureWizard();const attempts=all('attempt'),attempt=attemptId===W?.id?W:get(attemptId||existing?.attemptId),subject=existing?.subject||attempt?.subject||(state.subject==='all'?defaultSubject():state.subject),m=existing||{id:uid(),kind:'mistake',attemptId:attempt?.id||'',subject,level:attempt?.level||'AS',question:'',lost:1,topic:'',category:CATEGORIES[0],original:'',correctAnswer:'',explanation:'',remember:'',retryDate:localDate(new Date(Date.now()+86400000)),corrected:false,files:[],reviewHistory:[]};dialogContext={record:m,draft:state.route==='log',files:[...(m.files||[])]};modal(existing?'Update the correction.':'Turn a lost mark into a next step.',`<div class="form-grid">${select('Original paper attempt','attemptId',[[W&&state.route==='log'?W.id:'','Current draft / no linked paper'],...attempts.map(a=>[a.id,`${paperCode(a)} · ${date(a.date)} · #${attemptNumber(a)}`])],m.attemptId)}${select('Subject','subject',subjectOptions(),m.subject)}${select('Stage','level',['AS','A2'],m.level)}${input('Question number and subpart','question',m.question,'text','required placeholder="2(b)(ii)"')}${input('Marks lost','lost',m.lost,'number','min="0.25" step="0.25" required')}${select('Syllabus topic / subtopic','topic',topicOptions(m.subject,true,m.level),m.topic,'required')}${select('Mistake category','category',CATEGORIES,m.category)}${input('Retry date','retryDate',m.retryDate,'date','required')}</div>${textarea('Original question or task (for retry)','prompt',m.prompt||get(m.questionId)?.prompt||'')}${textarea('My original working or answer','original',m.original)}${textarea('Correct working or answer','correctAnswer',m.correctAnswer)}${textarea('What went wrong','explanation',m.explanation,'required')}${textarea('What to remember next time','remember',m.remember)}<label class="field"><span>Optional question / working images</span><input id="mistake-files" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" multiple></label><div id="modal-attachments">${(m.files||[]).map(f=>`<p>${esc(f.name)} · Stored</p>`).join('')}</div>${check('This mistake has been corrected','corrected',m.corrected)}`,'mistake','Save mistake');}
function thresholdModal(existing=null){const t=existing||{id:uid(),kind:'threshold',subject:state.subject==='all'?defaultSubject():state.subject,scope:'component',level:'AS',paper:'12',year:state.year,series:'s',max:75,values:{},official:false,sourceUrl:'',optionCode:'',route:'',files:[]};dialogContext={record:t,files:[...(t.files||[])]};modal('Use the exact threshold row.',`<p>Attach an official threshold PDF, then transcribe and verify its row. PDFs are retained as evidence; table values are never guessed.</p><div class="form-grid">${select('Subject','subject',subjectOptions(),t.subject)}${select('Threshold scope','scope',[['component','Individual component'],['qualification','Overall qualification']],t.scope)}${select('Qualification level','level',['AS','A Level'],t.level)}${input('Paper + variant (component only)','paper',t.paper,'text','placeholder="12" maxlength="2"')}${input('Examination year','year',t.year,'number','min="2000" max="2100" required')}${select('Examination series','series',Object.entries(SERIES),t.series)}${input('Maximum marks (weighted for overall)','max',t.max,'number','min="1" step="0.25" required')}${input('Entry option code (overall only)','optionCode',t.optionCode,'text','placeholder="Exact Cambridge option"')}${select('Component route (overall only)','route',[['','Choose exact route'],...Object.keys(ROUTES[t.subject])],t.route)}</div><div class="boundary-inputs">${['A*','a','b','c','d','e'].map(g=>input(`${g==='A*'?'A* (overall A Level only)':g+' / '+g.toUpperCase()} boundary`,`boundary-${g}`,t.values[g]??t.values[g.toUpperCase()]??'','number','min="0" step="0.25"')).join('')}</div>${input('Official Cambridge source URL (optional with PDF)','sourceUrl',t.sourceUrl,'url','placeholder="https://www.cambridgeinternational.org/…"')}<label class="field"><span>Official threshold PDF</span><input type="file" id="threshold-files" accept="application/pdf" multiple></label><div id="modal-attachments">${(t.files||[]).map(f=>`<p>${esc(f.name)} · Stored</p>`).join('')}</div>${check('I verified these values against the attached / linked official Cambridge threshold row','official',t.official)}<p class="small muted">Leave unchecked for a clearly labelled manual estimate. Component a is not A*. Match the year, series, exact variant and maximum.</p>`,'threshold','Save thresholds');}
function examModal(existing=null){const e=existing||{id:uid(),kind:'exam',subject:state.subject==='all'?defaultSubject():state.subject,level:'AS',paper:'12',datetime:'',duration:110,target:'a'};dialogContext={record:e};modal('Your actual examination date.',`<div class="form-grid">${select('Subject','subject',subjectOptions(),e.subject)}${select('Stage','level',['AS','A2'],e.level)}${input('Paper number and variant','paper',e.paper,'text','pattern="[0-9]{2}" required')}${input('Date and start time (your local timezone)','datetime',e.datetime?localDateTime(e.datetime):'','datetime-local','required')}${input('Duration (minutes)','duration',e.duration,'number','min="1" required')}${select('Target qualification grade','target',e.level==='AS'?['a','b','c','d','e']:['A*','A','B','C','D','E'],e.target)}</div><p class="small muted">Use your centre’s confirmed timetable. Times display in your device’s local timezone.</p>`,'exam','Save examination');}
function localDateTime(d){const x=new Date(d);return localDate(x)+`T${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`;}
function questionModal(existing=null){const q=existing||{id:uid(),kind:'question',subject:state.subject==='all'?(activeSubjects().includes('9618')?'9618':defaultSubject()):state.subject,level:'AS',title:'',source:'original',reference:'',topic:'',max:4,difficulty:3,prompt:'',answer:'',attemptId:'',files:[]};dialogContext={record:q,files:[...(q.files||[])]};modal(existing?'Edit this practice question.':'Keep a useful question.',`<div class="form-grid">${input('Question title','title',q.title,'text','required')}${select('Subject','subject',subjectOptions(),q.subject)}${select('Stage','level',['AS','A2'],q.level)}${select('Source','source',[['original','Original practice'],['cambridge','Authentic Cambridge past paper']],q.source)}${input('Verified Cambridge paper / question reference','reference',q.reference,'text','placeholder="9709/12/M/J/25 Q2"')}${select('Link to a recorded attempt (optional)','attemptId',[['','No linked attempt'],...all('attempt').map(a=>[a.id,paperCode(a)])],q.attemptId)}${select('Syllabus topic','topic',topicOptions(q.subject,true,q.level),q.topic,'required')}${input('Maximum marks','max',q.max,'number','min="0.25" step="0.25" required')}${select('Difficulty estimate','difficulty',[1,2,3,4,5],q.difficulty)}</div>${textarea('Question / task','prompt',q.prompt,'required')}${textarea('Answer and self-marking guidance','answer',q.answer,'required')}<label class="field"><span>Optional question image / PDF</span><input type="file" id="question-files" accept="application/pdf,image/png,image/jpeg,image/webp" multiple></label><div id="modal-attachments"></div>`,'question','Save question');}
function topicModal(id){const t=TOPICS.find(t=>t.id===id),p=all('topic').find(p=>p.topicId===id)||{id:uid(),kind:'topic',topicId:id,subject:t.subject,level:t.level,status:'Not started',confidence:0};dialogContext={record:p};const s=topicStats(id,all('attempt'),all('mistake'),all('session'));modal(esc(topicName(id)),`<p>${SUBJECTS[t.subject].name}${mathsComponent(t)?' · '+esc(mathsComponent(t)):''} · Paper ${t.components.join(' / ')} · ${t.level}</p><div class="form-grid">${select('Completion status','status',['Not started','Learning','Practising','Complete'],p.status)}${select('Self-reported confidence','confidence',[[0,'Not rated'],[1,'1 · Uncertain'],[2,'2 · Developing'],[3,'3 · Getting there'],[4,'4 · Confident'],[5,'5 · Very confident']],p.confidence)}</div><div class="notice subtle">Measured accuracy: ${pct(s.accuracy)} · ${s.attempted} attempts · ${s.lost} marks lost. Changing confidence does not change these results.</div>`,'topic','Save topic progress');}
function retryModal(id){const m=get(id);if(!m)return;state.retry=id;state.revealed=false;modal(`Retry Q${esc(m.question)}`,`<p>${esc(topicName(m.topic))}</p><p>Try this question again before revealing the correction.</p><p class="preserve">${esc(m.prompt||get(m.questionId)?.prompt)||'Open the original paper and attempt the question shown below. Your previous working is hidden until you reveal the correction.'}</p>${get(m.attemptId)?button('Open original paper','retry-paper','','data-id="'+m.attemptId+'"'):''}${fileList(m.files)}<label class="field"><span>Your retry working</span><textarea id="retry-working" rows="6"></textarea></label><div id="retry-answer"></div>${button('Reveal correction','reveal-correction','primary')}`);}
function showRetryAnswer(){const m=get(state.retry);if(!m)return;state.revealed=true;$('#retry-answer').innerHTML=`<div class="answer-block"><h3>Previous working</h3><p class="preserve">${esc(m.original)||'No previous working recorded.'}</p><h3>Correct working</h3><p class="preserve">${esc(m.correctAnswer)||'No correct working recorded yet.'}</p><h3>Remember next time</h3><p class="preserve">${esc(m.remember)}</p></div><p>How well did you recall it?</p><div class="button-row">${button('Again · 1 day','review-rating','','data-rating="again"')}${button('Good · next interval','review-rating','primary','data-rating="good"')}${button('Corrected','review-rating','','data-rating="easy"')}</div>`;}
function updateTimerDisplay(){if(W?.timer){const v=timerValues(W.timer);if($('[data-timer-active]'))$('[data-timer-active]').textContent=timeText(v.activeMs);if($('[data-timer-elapsed]'))$('[data-timer-elapsed]').textContent='Elapsed '+timeText(v.elapsedMs);}for(const e of document.querySelectorAll('[data-countdown]'))e.textContent=countdownText(e.dataset.countdown);if(state.practice&&$('[data-practice-time]'))$('[data-practice-time]').textContent=mins(practiceMinutes(state.practice));}
function notify(message,type='success'){const t=$('#toast');t.textContent=message;t.className='show '+type;clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>t.className='',6500);}
async function run(action){if(busy)return;busy=true;document.body.classList.add('busy');try{await action();}catch(e){console.error(e);notify(e.message||'Something went wrong. Your form has been kept.','error');const err=$('#modal-error')||$('#wizard-error');if(err)err.textContent=e.message;}finally{busy=false;document.body.classList.remove('busy');}}
async function extractPDF(file){const guessed=identifyFilename(file.name);if(guessed?.role==='Question paper'){Object.assign(W,{subject:guessed.subject,paper:guessed.paper||W.paper,series:guessed.series,year:guessed.year});const c=component(W);if(c)W.level=c[3]==='AS/A2'?W.level:c[3];W.recognition=`Recognised filename: ${paperCode(W)}. Confirm the series and cover details.`;}if(file.type!=='application/pdf'||guessed?.role&&guessed.role!=='Question paper')return;try{const pdfjs=await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.min.mjs');pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs';const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false}).promise;const page=await pdf.getPage(1),text=(await page.getTextContent()).items.map(i=>i.str).join(' '),code=text.match(/\b(9709|9702|9618|9231|9701|9700)\s*\/\s*(\d{2})\b/);if(code){W.subject=code[1];W.paper=code[2];}const series=text.match(/(February\s*\/\s*March|May\s*\/\s*June|October\s*\/\s*November)\s+(20\d{2})/i);if(series){W.series=/February/i.test(series[1])?'m':/May/i.test(series[1])?'s':'w';W.year=+series[2];}const marks=text.match(/total\s+mark(?:s)?\s+(?:for\s+this\s+paper\s+)?(?:is|are|:)\s*(\d+)/i);if(marks){W.max=+marks[1];W.paperMax=+marks[1];W.verifiedMax=true;}const duration=text.match(/(?:(\d+)\s*hours?\s*)?(\d+)?\s*minutes?/i);if(duration&&(duration[1]||duration[2]))W.officialMinutes=(+duration[1]||0)*60+(+duration[2]||0);const c=component(W);if(c)W.level=c[3]==='AS/A2'?W.level:c[3];W.recognition=`Read PDF cover${marks?' and read the maximum marks':''}. Confirm all details before saving.`;await pdf.destroy();}catch{W.recognition=(W.recognition||'')+' PDF text extraction was unavailable or the PDF is scanned. Please confirm the paper identity and maximum marks manually.';}}
async function handlePaperFiles(files){if(!W)newWizard();captureWizard();const status=$('#upload-status');if(status)status.textContent='Storing attachments…';for(const f of files){const guess=identifyFilename(f.name),role=guess?.role||((f.type.startsWith('image/'))?'Completed answers':W.files.some(x=>x.role==='Question paper')?'Completed answers':'Question paper');const meta=await upload(f,role);W.files.push(meta);await extractPDF(f);persistDraft();}render();notify(`${files.length} attachment${files.length===1?'':'s'} stored. Confirm the paper details next.`);}
async function saveAttempt(){captureWizard();if(W.timer?.running)throw new Error('Finish or pause the timer before saving.');const a={...W,kind:'attempt',marks:+W.marks,max:+W.max,minutes:+W.minutes,elapsedMinutes:W.elapsedMinutes===''?undefined:+W.elapsedMinutes,year:+W.year,difficulty:+W.difficulty,questionsAttempted:+W.questionsAttempted,correct:+W.correct,partialCorrect:+W.partialCorrect,createdAt:W.createdAt||new Date().toISOString()};const errors=validateAttempt(a);if(errors.length)throw new Error(errors.join(' '));if(!a.files.some(f=>f.role==='Question paper'&&f.type==='application/pdf'))throw new Error('Attach the question paper PDF before saving.');const old=get(a.id);if(old)a.revisions=[...(old.revisions||[]),{at:new Date().toISOString(),marks:old.marks,max:old.max,minutes:old.minutes,questions:old.questions,notes:old.notes}];const mistakes=W.mistakes.map(m=>({...m,kind:'mistake',attemptId:a.id,subject:a.subject,level:a.level,date:a.date}));delete a.mistakes;delete a.step;delete a.editing;await saveMany([a,...mistakes]);localStorage.removeItem(workspaceKey());W=null;activeTimer=null;go('detail',a.id);notify(`Attempt saved · ${a.marks}/${a.max} · ${pct(percent(a))}${a.scope==='partial'?' of attempted marks':''}.`);}
async function wizardNext(){captureWizard();const form=$('#wizard-form');if(form&&!form.reportValidity())return;if(W.step===0&&!W.files.some(f=>f.role==='Question paper'&&f.type==='application/pdf'))throw new Error('Upload and label a question paper before continuing.');if(W.step===1){if(!COMPONENTS[W.subject]?.[W.paper[0]]||!/^\d{2}$/.test(W.paper))throw new Error('Choose a valid component and variant.');const c=component(W);if(c[3]!=='AS/A2'&&c[3]!==W.level)throw new Error('This component does not match the selected AS/A2 stage.');if(!W.officialMinutes&&[2026,2027].includes(+W.year))W.officialMinutes=c[2];}if(W.step===2){const e=validateAttempt(W);if(e.length)throw new Error(e.join(' '));}W.step=Math.min(4,W.step+1);persistDraft();render();window.scrollTo({top:0});}
async function modalSubmit(form){const d=Object.fromEntries(new FormData(form)),type=form.dataset.form;const record=dialogContext.record||{};
if(type==='add-subject'){if(!SUBJECTS[d.subject])throw Error('Choose a subject from the STEM catalogue.');const settings=all('settings')[0]||{id:uid(),kind:'settings'};await save({...settings,subjects:[...new Set([...activeSubjects(),d.subject])]});closeModal();render();notify(`${SUBJECTS[d.subject].name} added with its syllabus.`);return;}
if(type==='mistake'){const m={...record,...d,lost:+d.lost,corrected:!!form.corrected.checked,files:dialogContext.files,kind:'mistake'};const a=m.attemptId===W?.id?W:get(m.attemptId);if(a&&(a.subject!==m.subject||a.level!==m.level))throw new Error('The mistake subject and stage must match its original attempt.');const t=TOPICS.find(t=>t.id===m.topic);if(!t||t.subject!==m.subject||(t.level!=='AS/A2'&&t.level!==m.level))throw new Error('Choose a topic from the mistake’s subject.');const q=a?.questions?.find(q=>q.number.trim().toLowerCase()===m.question.trim().toLowerCase());if(q&&m.lost>q.max-q.marks)throw new Error('Marks lost exceed the loss recorded for this question.');m.date=a?.date||localDate();if(record.updatedAt)m.corrections=[...(record.corrections||[]),{at:new Date().toISOString(),prompt:record.prompt,original:record.original,correctAnswer:record.correctAnswer,explanation:record.explanation,remember:record.remember,lost:record.lost,corrected:record.corrected}];if(dialogContext.draft&&m.attemptId===W.id){const i=W.mistakes.findIndex(v=>v.id===m.id);if(i<0)W.mistakes.push(m);else W.mistakes[i]=m;persistDraft();}else await save(m);closeModal();render();notify('Mistake saved and scheduled for review.');return;}
if(type==='threshold'){const t={...record,...d,max:+d.max,year:+d.year,official:!!form.official.checked,files:dialogContext.files,values:{}};const grades=t.scope==='qualification'&&t.level==='A Level'?['A*','A','B','C','D','E']:['a','b','c','d','e'];for(const g of grades){const key=g==='A*'?'A*':g.toLowerCase();if(d['boundary-'+key]==='')throw new Error('Enter all grade boundaries for this threshold row.');t.values[g]=+d['boundary-'+key];}if(t.scope==='qualification'&&(!t.route||!t.optionCode))throw new Error('Overall thresholds require the exact component route and entry option.');const err=validateThreshold(t);if(err)throw new Error(err);await save(t);closeModal();render();notify('Thresholds saved. Matching paper grades updated.');return;}
if(type==='exam'){const e={...record,...d,datetime:new Date(d.datetime).toISOString(),duration:+d.duration};if(!/^\d{2}$/.test(e.paper)||!COMPONENTS[e.subject]?.[e.paper[0]])throw new Error('Choose a valid examination component.');const c=component(e);if(c[3]!=='AS/A2'&&c[3]!==e.level)throw new Error('The component does not match the AS/A2 stage.');await save(e);closeModal();render();notify('Examination date saved.');return;}
if(type==='question'){const q={...record,...d,max:+d.max,difficulty:+d.difficulty,files:dialogContext.files};if(q.source==='cambridge'&&!q.reference.trim())throw new Error('Authentic Cambridge questions need a verified paper and question reference.');const topic=TOPICS.find(t=>t.id===q.topic);if(!topic||topic.subject!==q.subject||(topic.level!=='AS/A2'&&topic.level!==q.level))throw new Error('Choose a syllabus topic that matches the question subject and stage.');if(q.attemptId&&(get(q.attemptId)?.subject!==q.subject||get(q.attemptId)?.level!==q.level))throw new Error('The linked paper belongs to another subject.');await save(q);closeModal();render();notify('Question saved.');return;}
if(type==='plan-session'){
 const title=d.title.trim(),minutes=+d.minutes;
 if(!title||!Number.isFinite(minutes)||minutes<1||minutes>720||!d.date||(d.subject&&!activeSubjects().includes(d.subject)))throw new Error('Check the session title, subject, date and duration.');
 const next={...record,id:record.id||uid(),title,minutes,date:d.date,subject:d.subject,done:Boolean(record.done)};
 await saveProfile({studyPlan:[...planned().filter(p=>p.id!==next.id),next]});closeModal();render();notify('Study plan updated.');return;
}
if(type==='bookmark'){
 const section=(d.section||'').trim(),current=bookmarks().find(b=>b.recordId===record.recordId&&(b.section||'')===section);
 const next={...record,id:current?.id||record.id||uid(),section,reviewOn:d.reviewOn,savedAt:new Date().toISOString()};
 await saveProfile({bookmarks:[...bookmarks().filter(b=>b.id!==next.id),next]});closeModal();render();notify('Bookmark saved.');return;
}
if(type==='topic'){await save({...record,status:d.status,confidence:+d.confidence});closeModal();render();notify('Topic progress saved. Measured accuracy is unchanged.');}}

document.addEventListener('click',e=>{if(e.target.closest('.skip')){e.preventDefault();$('#main')?.focus();return;}const route=e.target.closest('[data-route]'),subject=e.target.closest('[data-subject]'),level=e.target.closest('[data-level]'),sg=e.target.closest('[data-subject-go]');if(route){closeModal();go(route.dataset.route);return;}if(subject){closeModal();state.subject=subject.dataset.subject;state.component='all';state.dashboardComponent='';state.selected=[];render();return;}if(level){state.level=level.dataset.level;state.dashboardComponent='';render();return;}if(sg){state.subject=sg.dataset.subjectGo;go('syllabus');return;}const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action,id=el.dataset.id;if(a==='close-dialog'){closeModal();return;}run(async()=>{
if(!activeSubjects().length&&['log','new-mistake','new-exam','new-question','new-threshold','practice-selected'].includes(a)){addSubjectModal();return;}
if(a==='reload'){location.reload();return;}
if(a==='public-theme'){window.revisionAppearance.set(document.documentElement.dataset.theme==='black'?'blue':'black');return;}
if(a==='compact-menu'){compact=!compact;render();document.querySelector('[data-action="compact-menu"]')?.focus();return;}
if(a==='activity-day'){state.activityDate=el.dataset.date;const y=scrollY;render();document.querySelector('[data-date="'+state.activityDate+'"]')?.focus({preventScroll:true});window.scrollTo({top:y,behavior:'instant'});return;}
if(a==='skip-onboarding'){await saveProfile({onboarded:true});go('home');return;}
if(a==='plan-session'){planSessionModal(id);return;}
if(a==='toggle-plan'){await saveProfile({studyPlan:planned().map(p=>p.id===id?{...p,done:!p.done}:p)});render();return;}
if(a==='bookmark'){bookmarkModal(id);return;}
if(a==='remove-bookmark'){await saveProfile({bookmarks:bookmarks().filter(b=>b.id!==id)});render();notify('Bookmark removed.');return;}
if(a==='review-bookmark'){await saveProfile({bookmarks:bookmarks().map(b=>b.id===id?{...b,reviewOn:''}:b)});render();notify('Bookmark review cleared.');return;}
if(a==='discard-practice'){confirmAction('Clear this unfinished practice set?','Saved practice results remain in History.',async()=>{state.practice=null;savePracticeDraft();closeModal();render();},'Clear draft');return;}
if(a==='session-details'){const s=get(id);if(s?.kind==='session')modal(esc(s.title||'Practice result'),`<p>${date(s.date)} · ${s.marks}/${s.max} marks · ${mins(s.minutes)}</p><h3>Your working</h3><p class="preserve">${esc(s.working)||'No working recorded.'}</p>`);return;}
if(a==='set-theme'){window.revisionAppearance.set(el.dataset.themeValue);const choice=el.dataset.themeValue;render();document.querySelector('[data-theme-value="'+choice+'"]')?.focus();}
else if(a==='toggle-theme'){window.revisionAppearance.set(document.documentElement.dataset.theme==='black'?'blue':'black');render();}
else if(a==='menu'){state.menu=!state.menu;render();(state.menu?$('#close-navigation'):$('.topbar [data-action="menu"]'))?.focus();}
else if(a==='log'){if(W||localStorage.getItem(workspaceKey()))go('log');else newWizard();}
else if(routeNames.has(a)&&a!=='detail'){closeModal();go(a);}
else if(a==='detail')go('detail',id);
else if(a==='auth')authModal();
else if(a==='signout'){try{await signOut();}finally{location.replace('/');}}
else if(a==='local-mode'){await switchMode('local');location.assign('/workspace');}
else if(a==='cloud-mode'){location.assign('/dashboard');}
else if(a==='migrate-local')confirmAction('Copy local data to your account?','Local records and attachments will be copied. Matching IDs in your cloud workspace will be updated. Local originals remain.',async()=>{const n=await copyLocalToCloud();closeModal();render();notify(`${n} local records copied to Supabase.`);},'Copy to cloud');
else if(a==='backup'){notify('Preparing a complete backup, including attachments…');const data=await exportBackup();download(`cambridge-revision-${localDate()}.json`,JSON.stringify(data));notify('Complete backup prepared.');}
else if(a==='csv'){download(`paper-history-${localDate()}.csv`,exportCSV(scoped('attempt'),gradeFor,all('threshold'),paperCode,percent),'text/csv;charset=utf-8');notify('CSV prepared.');}
else if(a==='wizard-next')await wizardNext();
else if(a==='wizard-back'){captureWizard();W.step=Math.max(0,W.step-1);render();}
else if(a==='leave-draft'){captureWizard();go('papers');notify('Draft kept on this browser. Use Log Paper to resume.');}
else if(a==='detach'){captureWizard();W.files.splice(+el.dataset.index,1);persistDraft();render();}
else if(a==='file'){const files=[...(W?.files||[]),...(dialogContext.files||[]),...store.records.flatMap(r=>r.files||[])];const f=files.find(f=>f.id===el.dataset.file);if(f)await openFile(f);}
else if(a==='add-row'){captureWizard();W.questions.push({number:String(W.questions.length+1),max:1,marks:0,topic:''});render();}
else if(a==='remove-row'){captureWizard();W.questions.splice(+el.dataset.index,1);render();}
else if(a==='timer-start'){captureWizard();W.timed=true;W.timer={startedAt:Date.now(),resumedAt:Date.now(),activeMs:0,running:true};persistDraft();render();}
else if(a==='timer-toggle'){captureWizard();const t=W.timer;if(t.running){t.activeMs=timerValues(t).activeMs;t.running=false;}else{t.resumedAt=Date.now();t.running=true;t.autoPaused=false;}persistDraft();render();}
else if(a==='timer-finish'){captureWizard();const t=W.timer;const v=timerValues(t);t.activeMs=v.activeMs;t.running=false;t.finishedAt=Date.now();W.minutes=+(v.activeMs/60000).toFixed(2);W.elapsedMinutes=+(v.elapsedMs/60000).toFixed(2);persistDraft();render();}
else if(a==='repeat-paper')newWizard(get(id));
else if(a==='edit-attempt')newWizard(get(id),true);
else if(a==='preview-paper'){const f=get(id)?.files.find(f=>f.role==='Question paper');if(f){const url=URL.createObjectURL(await fileBlob(f));if(state.preview)URL.revokeObjectURL(state.preview);state.preview=url;render();}}
else if(a==='delete-attempt')confirmAction('Delete this attempt?','This removes this attempt and its linked mistake notes. Other attempts of the same paper remain. Export a backup first if you want to keep a copy.',async()=>{await removeMany([id,...all('mistake').filter(m=>m.attemptId===id).map(m=>m.id)]);closeModal();go('history');notify('Attempt deleted. Other attempts are retained.');},'Delete attempt');
else if(a==='delete-record')confirmAction('Delete this record?','This action removes the selected record from your active workspace.',async()=>{await removeMany([id]);closeModal();render();notify('Record deleted.');},'Delete record');
else if(a==='confirm'){const fn=confirmCallback;confirmCallback=null;if(fn)await fn();}
else if(a==='reset-library'){state.library={};render();}
else if(a==='reset-mistakes'){state.mistakeFilters={};render();}
else if(a==='reset-history'){state.history={};render();}
else if(a==='new-mistake')mistakeModal(null,el.dataset.attempt);
else if(a==='edit-mistake')mistakeModal(get(id));
else if(a==='edit-draft-mistake')mistakeModal(W.mistakes.find(m=>m.id===id),W.id);
else if(a==='retry')retryModal(id);
else if(a==='retry-paper'){const m=get(state.retry),f=get(id)?.files.find(f=>f.role==='Question paper');if(f)await openFile(f);else notify('The original question paper is not attached.','error');}
else if(a==='reveal-correction')showRetryAnswer();
else if(a==='review-rating'){const m=get(state.retry);const next=nextReview(m,el.dataset.rating);next.reviewHistory.at(-1).working=$('#retry-working')?.value||'';await save(next);closeModal();render();notify('Review saved. The next interval has been scheduled.');}
else if(a==='match-threshold'){const p=get(id);thresholdModal({id:uid(),kind:'threshold',subject:p.subject,scope:'component',level:p.level==='A2'?'A Level':'AS',paper:p.paper,year:p.year,series:p.series,max:p.max,values:{},official:false,sourceUrl:'',optionCode:'',route:'',files:[]});}
else if(a==='new-threshold')thresholdModal();
else if(a==='edit-threshold')thresholdModal(get(id));
else if(a==='choose-subject')subjectPicker();
else if(a==='new-subject')addSubjectModal();
else if(a==='remove-subject')removeSubject(el.dataset.code);
else if(a==='new-exam')examModal();
else if(a==='edit-exam')examModal(get(id));
else if(a==='topic')topicModal(el.dataset.topic);
else if(a==='new-question')questionModal();
else if(a==='open-question'){state.selected=[id];startPractice([id]);}
else if(a==='practice-selected')startPractice(state.selected);
else if(a==='reveal-answer'){state.practice.working=$('#practice-working')?.value||'';state.practice.revealed=!state.practice.revealed;savePracticeDraft();render();}
});});
function startPractice(ids,timed=true){
 if(!ids.length)return;
 if(state.practice){go('practice');notify('Finish or clear the current practice set before starting another.');return;}
 state.practice={ids:[...ids],index:0,startedAt:timed?Date.now():null,activeMs:0,timed,revealed:false,working:''};
 savePracticeDraft();
 go('practice');
}
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target;if(f.id==='account-form'){submitAccount(f);return;}run(async()=>{
if(f.id==='wizard-form'){if(W.step===4)await saveAttempt();else await wizardNext();}
else if(f.id==='modal-form')await modalSubmit(f);
else if(f.id==='history-filters'){state.history=Object.fromEntries(new FormData(f));render();}
else if(f.id==='analytics-filters'){const d=Object.fromEntries(new FormData(f));Object.assign(state,d);if(d.range!=='custom'){state.from='';state.to='';}render();}
else if(f.id==='syllabus-settings'){const d=Object.fromEntries(new FormData(f)),old=all('settings')[0]||{id:uid(),kind:'settings',routes:{}};old.year=+d.year;state.year=+d.year;old.routes={...old.routes,...(d.mathRoute?{'9709':d.mathRoute}:{})};if(state.subject!=='all'&&d.route)old.routes[state.subject]=d.route;await save(old);render();notify('Syllabus year and routes saved.');}
else if(f.id==='bank-filters'){state.bank=Object.fromEntries(new FormData(f));render();}
else if(f.id==='calculator'){calculate(f);}
else if(f.id==='profile-form'){await submitProfile(f);}
else if(f.id==='paper-filters'){state.library=Object.fromEntries(new FormData(f));render();}
else if(f.id==='bookmark-filters'){state.bookmarkSearch=new FormData(f).get('search').trim();render();}
else if(f.id==='mistake-filters'){state.mistakeFilters=Object.fromEntries(new FormData(f));render();}
else if(f.id==='focused-study'){const d=Object.fromEntries(new FormData(f));const ids=all('question').filter(q=>q.subject===d.subject&&inScope(q)&&(!d.topic||q.topic===d.topic)).slice(0,+d.size).map(q=>q.id);if(!ids.length)throw new Error('No saved questions match this subject and topic. Add a question in the bank or choose a different topic.');startPractice(ids,d.timing==='timed');}
else if(f.id==='self-mark'){const p=state.practice,q=get(p.ids[p.index]),d=Object.fromEntries(new FormData(f)),r={id:uid(),kind:'session',questionId:q.id,attemptId:q.attemptId||'',subject:q.subject,level:q.level,topic:q.topic,marks:+d.marks,max:q.max,minutes:+d.minutes,confidence:+d.confidence,date:localDate(),createdAt:new Date().toISOString(),working:$('#practice-working')?.value||p.working||'',title:q.title};if(r.marks<0||r.marks>r.max||r.minutes<0)throw new Error('Check the practice marks and working time.');const records=[r];if(r.marks<r.max)records.push({id:uid(),kind:'mistake',questionId:q.id,attemptId:q.attemptId||'',subject:q.subject,level:q.level,question:q.title,lost:r.max-r.marks,topic:q.topic,category:'Conceptual misunderstanding',prompt:q.prompt,original:r.working,correctAnswer:q.answer,explanation:'Review this self-marked practice question. Update the mistake category after checking.',remember:'',retryDate:localDate(new Date(Date.now()+86400000)),corrected:false,files:q.files||[],date:r.date,reviewHistory:[]});await saveMany(records);if(p.index<p.ids.length-1){p.index++;p.startedAt=p.timed===false?null:Date.now();p.activeMs=0;p.revealed=false;p.working='';}else state.practice=null;savePracticeDraft();render();notify('Practice result saved. Topic accuracy and review queue updated.');}
});});
function calculate(form){const d=Object.fromEntries(new FormData(form)),subject=state.subject==='all'?defaultSubject():state.subject,route=d.route,components=ROUTES[subject][route],parts=components.map(c=>({component:c,marks:+d['score-'+c]}));const total=weightedTotal(subject,parts),maximum=weightedTotal(subject,components.map(c=>({component:c,marks:COMPONENTS[subject][c][1]}))),hypothetical=components.some(c=>d['type-'+c]==='future'),level=route.startsWith('AS:')?'AS':'A Level',t=all('threshold').find(t=>t.scope==='qualification'&&t.subject===subject&&t.level===level&&t.route===route&&t.optionCode?.toLowerCase()===d.optionCode.toLowerCase()&&t.series===d.series&&+t.year===+d.year&&Math.abs(t.max-maximum)<.001);if(parts.some(p=>p.marks<0||p.marks>COMPONENTS[subject][p.component][1]))throw new Error('A component mark exceeds its valid range.');const grades=level==='AS'?['a','b','c','d','e']:['A*','A','B','C','D','E'];const g=t?grades.find(g=>total>=t.values[g])||'U':null;$('#calculation-result').innerHTML=`<div class="notice"><h3>${hypothetical?'Hypothetical overall estimate':t?.official&&form.eligible.checked?'Calculated against official overall thresholds':'Overall estimate'}</h3><p>Weighted total: <strong>${fmt(total)} / ${fmt(maximum)}</strong></p><p>${g?`Threshold indication: <strong>${g}</strong> (${t.official?'official threshold table':'manual threshold estimate'}).`:'Grade boundary unavailable for this exact route, entry option, year and series.'}</p><p class="small">${!form.eligible.checked?'Carry-forward / entry eligibility has not been confirmed. ':''}${hypothetical?'Future marks are hypothetical. ':''}This calculator does not issue an official Cambridge result.</p></div>`;}
document.addEventListener('change',e=>{const el=e.target;run(async()=>{
if(el.id==='notebook-grid'){window.revisionAppearance.set(window.revisionAppearance.theme,el.checked);}
else if(el.closest('#focused-study')&&el.name==='subject'){state.focusSubject=el.value;const topic=el.form.elements.topic;topic.innerHTML=[['','All topics'],...topicOptions(el.value,false,state.level)].map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');}
else if(el.id==='dashboard-component'){state.dashboardComponent=el.value;const y=scrollY;render();$('#dashboard-component')?.focus({preventScroll:true});window.scrollTo({top:y,behavior:'instant'});}
else if(el.id==='paper-files')await handlePaperFiles([...el.files]);
else if(el.dataset.fileRole!==undefined){captureWizard();W.files[+el.dataset.fileRole].role=el.value;persistDraft();}
else if(el.dataset.selectQuestion){if(el.checked)state.selected.push(el.dataset.selectQuestion);else state.selected=state.selected.filter(id=>id!==el.dataset.selectQuestion);render();}
else if(['mistake-files','threshold-files','question-files'].includes(el.id)){const role=el.id==='threshold-files'?'Grade thresholds':el.id==='mistake-files'?'Mistake image':'Question image';for(const f of el.files)dialogContext.files.push(await upload(f,role));$('#modal-attachments').innerHTML=dialogContext.files.map(f=>`<p>${esc(f.name)} · Stored</p>`).join('');}
else if(el.id==='import-backup'&&el.files[0]){const file=el.files[0];if(file.size>150*1024*1024)throw new Error('This backup is too large for browser import. Split it before importing.');pendingImport=JSON.parse(await file.text());el.value='';confirmAction('Restore this backup?',`${pendingImport.records?.length||0} records and ${pendingImport.files?.length||0} files will be imported into your ${store.mode} workspace. Matching record IDs are updated.`,async()=>{const n=await importBackup(pendingImport);pendingImport=null;closeModal();render();notify(`${n} records restored with their attachments.`);},'Restore backup');}
else if(el.closest('#wizard-form')){captureWizard();if(['scope','subject'].includes(el.name))render();}
else if(el.closest('#modal-form')&&['subject','level'].includes(el.name)){const topic=el.form.querySelector('[name="topic"]'),route=el.form.querySelector('[name="route"]');if(topic)topic.innerHTML=topicOptions(el.form.subject.value,true,el.form.level?.value||'all').map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');const target=el.form.querySelector('[name="target"]');if(target&&el.name==='level')target.innerHTML=(el.value==='AS'?['a','b','c','d','e']:['A*','A','B','C','D','E']).map(g=>`<option>${g}</option>`).join('');if(route&&el.name==='subject')route.innerHTML='<option value="">Choose exact route</option>'+Object.keys(ROUTES[el.value]).map(r=>`<option>${esc(r)}</option>`).join('');}
else if(el.closest('#calculator')&&el.name==='route'){state.calcRoute=el.value;render();}
else if(el.closest('#analytics-filters')&&el.name==='range'){state.range=el.value;render();}
});});
document.addEventListener('input',e=>{if(e.target.closest('#wizard-form')){captureWizard();if($('#live-score'))$('#live-score').innerHTML=scorePreview();if($('#question-summary')){$('#question-summary').textContent=questionSummary(W);$('#question-summary').className='notice '+(questionDiscrepancy(W)?'warning':'subtle');}for(const cell of document.querySelectorAll('[data-question-lost]')){const q=W.questions[+cell.dataset.questionLost];if(q)cell.textContent=fmt(q.max-q.marks);}}if(e.target.id==='practice-working'&&state.practice){state.practice.working=e.target.value;savePracticeDraft();}});
document.addEventListener('dragover',e=>{if(e.target.closest('#dropzone')){e.preventDefault();$('#dropzone').classList.add('dragging');}});
document.addEventListener('dragleave',e=>{if(e.target.closest('#dropzone'))$('#dropzone')?.classList.remove('dragging');});
document.addEventListener('drop',e=>{if(e.target.closest('#dropzone')){e.preventDefault();run(()=>handlePaperFiles([...e.dataTransfer.files]));}});
function pauseForVisibility(){if(W?.timer?.running){const t=W.timer;t.activeMs=timerValues(t).activeMs;t.running=false;t.autoPaused=true;persistDraft();if(state.route==='log')render();}}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){pauseForVisibility();pausePractice();}
 else if(state.route==='practice'&&state.practice?.timed!==false&&state.practice&&!state.practice.startedAt)state.practice.startedAt=Date.now();
});
window.addEventListener('pagehide',()=>{pauseForVisibility();pausePractice();});
async function submitProfile(form){
 const d=new FormData(form),subjects=d.getAll('subjects').filter(code=>Object.hasOwn(SUBJECTS,code));
 const qualification=d.get('qualification');
 if(!['all','AS','A2'].includes(qualification))throw new Error('Choose a qualification stage.');
 const previous=profile();
 const records=[{...previous,id:previous.id||uid(),kind:'settings',onboarded:true,subjects,qualification,
  displayName:d.get('displayName').trim(),studyGoal:d.get('studyGoal').trim(),gradeTarget:d.get('gradeTarget').trim()}];
 const when=d.get('examDate'),selection=d.get('examComponent');
 if(when||selection){
  const [subject,part]=(selection||'').split(':'),info=COMPONENTS[subject]?.[part],variant=d.get('examVariant');
  if(!info||!subjects.includes(subject)||!when||!Number.isFinite(Date.parse(when))||!/^[1-3]$/.test(variant))throw new Error('Choose a component for one of your subjects, its variant and a confirmed exam date.');
  const level=info[3]==='AS/A2'?(qualification==='A2'?'A2':'AS'):info[3];
  records.push({id:uid(),kind:'exam',subject,paper:part+variant,level,datetime:new Date(when).toISOString(),duration:info[2]});
 }
 await saveMany(records);
 state.level=qualification;
 if(state.route==='onboarding')go('home');else render();
 notify('Study preferences saved.');
}
async function submitAccount(form){
 const submit=form.querySelector('button[type="submit"]'),error=form.querySelector('.account-error');
 if(submit.disabled)return;
 submit.disabled=true;
 error.hidden=true;
 const data=new FormData(form),email=String(data.get('email')||'').trim(),password=data.get('password');
 try{
  switch(form.dataset.screen){
   case '/login':
    await signIn(email,password);
    location.replace('/dashboard');
    break;
   case '/signup':
    if(await signUp(email,password))location.replace('/dashboard');
    else {
     accountMessage='Check your email for an account confirmation link. After confirming, return to your workspace.';
     form.reset();
     render();
    }
    break;
   case '/forgot-password':
    await requestPasswordReset(email);
    accountMessage='If an account matches that address, a password recovery link will arrive shortly.';
    form.reset();
    render();
    break;
   case '/reset-password':
    if(password!==data.get('confirmation'))throw new Error('The passwords do not match.');
    await resetPassword(password);
    history.replaceState(null,'','/login');
    accountMessage='Password updated. Log in with your new password.';
    render();
    break;
  }
 }catch(e){
  error.textContent=e.message||'The account request failed. Please try again.';
  error.hidden=false;
 }finally{submit.disabled=false;}
}
function readRoute(){
 const [route,id]=location.hash.slice(1).split(':');
 return {route:routeNames.has(route)?route:'home',id};
}
async function boot(){
 const path=location.pathname.replace(/\/$/,'')||'/';
 const callback=await consumeAuthCallback();
 if(callback==='recovery'||callback==='invalid'){
  history.replaceState(null,'',callback==='recovery'?'/reset-password':'/forgot-password');
  if(callback==='invalid')accountMessage='The email link has expired or could not be verified. Request a new link if needed.';
  render();
  return;
 }
 if(callback==='signed-in')history.replaceState(null,'','/dashboard');
 else if(accountPaths.has(path)||(path==='/'&&!routeNames.has(location.hash.slice(1).split(':')[0]))){
  render();
  return;
 }else if(path==='/dashboard'){
  if(!store.session){location.replace('/login');return;}
  await switchMode('cloud');
 }else if(path==='/workspace'||!store.session){
  await switchMode('local');
 }else{
  await loadRecords();
 }
 setWorkspacePreferences();
 const {route,id}=readRoute();
 state.route=route;
 state.detail=id;
 if(setupRequired()&&route==='home'){
  state.route='onboarding';
  history.replaceState(null,'','/dashboard#onboarding');
 }
 if(path==='/'&&callback!=='signed-in')history.replaceState(null,'',workspacePath()+location.hash);
 store.ready=true;
 render();
}
function syncRoute(){
 if(accountPaths.has(location.pathname)||(location.pathname==='/'&&!routeNames.has(location.hash.slice(1).split(':')[0])))return;
 const {route,id}=readRoute();
 if(route===state.route&&id===state.detail)return;
 if(state.route==='log'){captureWizard();pauseForVisibility();}
 if(state.route==='practice'&&route!=='practice')pausePractice();
 if(state.preview)URL.revokeObjectURL(state.preview);
 state.route=route;
 state.detail=id;
 state.menu=false;
 state.preview=null;
 render();
}
document.addEventListener('click',event=>{
 const group=event.target.closest('.nav-group > summary')?.parentElement;
 if(!group||compact)return;
 if(group.open)collapsedGroups.add(group.dataset.group);
 else collapsedGroups.delete(group.dataset.group);
});
document.addEventListener('keydown',event=>{
 if(!state.menu)return;
 if(event.key==='Escape'){
  state.menu=false;
  render();
  $('.topbar [data-action="menu"]')?.focus();
 }else if(event.key==='Tab'){
  const items=[...document.querySelectorAll('#workspace-navigation a, #workspace-navigation button, #workspace-navigation summary')].filter(el=>el.getClientRects().length);
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
});
window.addEventListener('storage',event=>{
 if(event.key!=='ct-session'||store.mode!=='cloud')return;
 let id;
 try{id=JSON.parse(event.newValue)?.user?.id;}catch{}
 if(id!==store.session?.user?.id)location.reload();
});
window.addEventListener('popstate',syncRoute);
window.addEventListener('hashchange',syncRoute);
setInterval(updateTimerDisplay,1000);
try{
 await boot();
}catch(e){
 if(location.pathname.startsWith('/dashboard')&&[400,401,403].includes(e.status)){
  location.replace('/login');
 }else{
  $('#app').innerHTML=publicShell(`<div class="folio-width account-layout"><section><h1>Your workspace could not be opened</h1><p>${esc(e.message)}</p><div class="button-row">${button('Try again','reload','primary')}<a class="btn" href="/login">Log in</a><a class="btn" href="/workspace">Open local workspace</a></div></section></div>`);
 }
}
