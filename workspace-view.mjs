import {SUBJECTS,COMPONENTS,component,paperCode,full,percent,average,stats,gradeFor,SERIES} from './domain.mjs';
import {TOPICS} from './syllabus.mjs';
import {lineChart} from './charts.mjs';
import {activityCalendar} from './study-view.mjs';

const overviewShortcuts = [
 ['Practice',[['Past papers','papers','folder'],['Focused study','practice','play'],['Syllabus','syllabus','book']]],
 ['Review',[['Review queue','review','repeat'],['Mistakes','mistakes','edit'],['Bookmarks','bookmarks','flag']]],
 ['Progress',[['Analytics','analytics','chart'],['Study plan','plan','calendar'],['History','history','clock']]]
];

function overviewShortcutView({link,icon,state}) {
 const active=state.overviewShortcut??0;
 return `<div class="overview-shortcuts" data-overview-shortcuts>
  <div role="tablist" aria-label="Dashboard shortcuts">${overviewShortcuts.map(([name],i)=>`<button type="button" role="tab" id="shortcut-tab-${i}" aria-controls="shortcut-panel-${i}" aria-selected="${i===active}" tabindex="${i===active?0:-1}">${name}</button>`).join('')}</div>
  <div class="overview-shortcut-panels">${overviewShortcuts.map(([,items],i)=>`<div role="tabpanel" id="shortcut-panel-${i}" aria-labelledby="shortcut-tab-${i}"${i!==active?' hidden':''}>${items.map(([name,route,glyph])=>link(icon(glyph)+name,route,'overview-shortcut')).join('')}</div>`).join('')}</div>
 </div>`;
}

// Presentation only. Records, navigation, grading and persistence stay in the app.
export function overviewView(c){
 const {state,esc,icon,subjectIcon,button,link,heading,filters,pct,mins,date,scoped,all,activeSubjects,countdownText}=c;
 const attempts=scoped('attempt'),mistakes=scoped('mistake'),sessions=scoped('session'),subjects=activeSubjects();
 const summary=stats(attempts,mistakes,sessions);
 const recent=[...attempts].sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,4);
 const exams=scoped('exam').filter(e=>new Date(e.datetime)>Date.now()).sort((a,b)=>a.datetime.localeCompare(b.datetime)),next=exams[0];
 const due=mistakes.filter(m=>!m.corrected&&(!m.retryDate||m.retryDate<=c.localDate()));
 const trendAttempts=attempts.filter(a=>!state.dashboardComponent||a.paper[0]===state.dashboardComponent);
 const hasPapers=trendAttempts.some(full);
 const performanceChart=lineChart(trendAttempts,true,{width:900,height:340,left:96,right:44,top:28,bottom:56,axisLabelX:76,adaptiveTicks:true});
 return (c.preview?'':heading(c.welcome,new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date()))+filters()+overviewShortcutView(c)+
 `<section class="next-task" aria-label="Your next study task"><div class="next-task-main"><h2>${esc(c.next.title)}</h2><p>${esc(c.next.copy)}</p>${button(c.next.label,c.next.action,'primary')}</div><div class="next-task-exam"><h3>Next examination</h3>${next?`<strong data-countdown="${esc(next.datetime)}">${countdownText(next.datetime)}</strong><p>${esc(SUBJECTS[next.subject].name)} · Paper ${esc(next.paper)} · ${esc(new Date(next.datetime).toLocaleString('en-GB'))}</p>`:'<p>Add a date confirmed by your centre.</p>'}${link(next?'View examination plan':'Set an examination date','exams')}</div></section>`)+`
 <section class="preparation-summary dashboard-summary" aria-label="Study summary"><div class="primary-measure"><span>Average paper score</span><strong>${pct(summary.avg)}</strong><small>Completed papers only</small></div><div><span>Papers completed</span><strong>${summary.count}</strong><small>${summary.partial?`${summary.partial} partial ${summary.partial===1?'attempt':'attempts'}`:'Full-paper attempts'}</small></div><div><span>Focused study time</span><strong>${mins(summary.totalTime)}</strong><small>Papers and practice</small></div><div><span>Study streak</span><strong>${c.streak} ${c.streak===1?'day':'days'}</strong><small>Consecutive active days</small></div><div><span>Review due</span><strong>${due.length+c.dueBookmarks}</strong><small>Corrections and bookmarks</small></div></section>
 <div class="overview-composition"><section class="performance-module"><div class="section-heading"><div><h2>Performance over time</h2><p>Your completed papers, by component</p></div>${link('Open analytics','analytics')}</div><label class="field trend-component"><span>Component</span><select id="dashboard-component"><option value="">All components</option>${[...new Set(attempts.map(a=>a.paper[0]))].sort().map(p=>`<option value="${esc(p)}" ${state.dashboardComponent===p?'selected':''}>Paper ${esc(p)}</option>`).join('')}</select></label>${hasPapers?`<div class="performance-plot" tabindex="0" role="region" aria-label="Scrollable paper performance chart">${performanceChart}</div><p class="chart-caption">${trendAttempts.filter(full).length} completed ${trendAttempts.filter(full).length===1?'paper':'papers'}${c.preview?'':' · focus a point for its marks and date'}<span class="chart-scroll-hint">Scroll horizontally for the full chart</span></p>`:`<div class="performance-empty"><span>${icon('chart')}</span><div><h3>Your first score starts the story.</h3><p>Record a completed paper to see your performance here.</p></div>${button('Log a paper','log','primary')}</div>`}</section>
 <div class="activity-module">${activityCalendar(c.activity,c,28,{planner:!c.preview})}</div>
 ${c.preview?'':`<section class="recent-module"><div class="section-heading"><h2>Recent papers</h2>${link('View history','history')}</div>${recent.length?`<div class="activity-list">${recent.map(a=>`<div class="activity-row"><span class="document-mark">${icon('file')}</span><div><button class="record-link" data-action="detail" data-id="${a.id}">${paperCode(a)}</button><p>${SUBJECTS[a.subject].name} <span>${date(a.date)}</span></p></div><div class="activity-score"><strong>${pct(percent(a))}</strong><small>${a.scope==='partial'?'Partial attempt':`${a.marks}/${a.max} marks`}</small></div>${button(icon('arrow'),'detail','icon-button',`data-id="${a.id}" aria-label="View ${paperCode(a)}"`)}</div>`).join('')}</div>`:`<div class="recent-empty"><p>No saved attempts yet. Upload a paper and keep your first set of marks.</p>${link('Log a paper','log')}</div>`}</section>
 <section class="review-module"><div class="section-heading"><h2>Ready for review</h2>${icon('repeat')}</div><div class="review-count"><strong>${due.length+c.dueBookmarks}</strong><span>${due.length+c.dueBookmarks===1?'item due':'items due'}</span></div><p>${due.length+c.dueBookmarks?'Open the queue to revisit a correction or a saved question.':mistakes.length?'Your corrections are scheduled. Return when your next review is due.':'Your saved mistakes will become focused review sessions.'}</p>${link('Open review','review')}</section>
 <section class="subject-management"><div class="section-heading"><div><h2>Your subjects</h2><p>${subjects.length} ${subjects.length===1?'subject':'subjects'} in your workspace</p></div>${button(icon('plus')+' Add subject','new-subject','quiet')}</div><div class="subject-register">${subjects.map(code=>{
 const sub=SUBJECTS[code],papers=all('attempt').filter(a=>a.subject===code&&full(a)),topics=TOPICS.filter(t=>t.subject===code),confident=all('topic').filter(t=>t.subject===code&&t.confidence>=4).length;
 return `<article class="subject-entry"><span class="register-icon">${subjectIcon(code)}</span><div class="subject-entry-name"><h3>${sub.name}</h3><p>Cambridge ${code}</p></div><div class="subject-entry-score"><strong>${papers.length?pct(average(papers.map(percent))):'—'}</strong><small>${papers.length} completed ${papers.length===1?'paper':'papers'}</small></div><div class="subject-entry-confidence"><strong>${confident}/${topics.length}</strong><small>topics confident</small></div><button class="text-link" data-subject-go="${code}">Syllabus ${icon('arrow')}</button></article>`;
 }).join('')||'<p class="library-note">Add a subject to bring its syllabus into your workspace.</p>'}</div></section>`}</div>`;
}

function folderMark(){return '<svg class="folder-mark" width="44" height="35" viewBox="0 0 56 44" fill="none" aria-hidden="true"><path d="M3 10V7a3 3 0 0 1 3-3h14l6 6h24a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V10z" fill="var(--folder-back)" stroke="var(--folder-edge)"/><path d="M9 14h38v12H9z" fill="var(--folder-page)"/><path d="M3 18h50l-2 20a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3L3 18z" fill="var(--folder-front)" stroke="var(--folder-edge)"/></svg>';}

const mathSubjects = new Set(['9709','9231']);
const mathTracks = ['Pure','Mechanics','Statistics'];
function mathTrack(attempt) {
 if(!mathSubjects.has(attempt.subject))return '';
 return mathTracks.find(track=>component(attempt)?.[0].includes(track))||'';
}

export function libraryView(c){
 const {esc,icon,button,heading,filters,pct,date,scoped,all,state,input,select}=c;
 const f=state.library||{}, search=(f.search||'').trim().toLowerCase();
 const allAttempts=scoped('attempt');
 const componentNames=mathSubjects.has(state.subject)?COMPONENTS[state.subject]:null;
 const componentOptions=[1,2,3,4,5,6].map(n=>[n,`Paper ${n}${componentNames?.[n]?' · '+componentNames[n][0]:''}`]);
 const matching=new Set(allAttempts.filter(a=>{
  const searchable=[paperCode(a),a.subject,a.year,SERIES[a.series],SUBJECTS[a.subject].name,component(a)?.[0],...(a.files||[]).map(file=>file.name)].join(' ').toLowerCase();
  return (!search||searchable.includes(search))&&(!f.year||a.year==f.year)&&(!f.series||a.series===f.series)&&
    (!f.component||a.paper[0]===f.component)&&(!f.track||mathTrack(a)===f.track)&&(!f.scope||a.scope===f.scope)&&(!f.grade||gradeFor(a,all('threshold')).grade===f.grade)&&
    (!f.min||percent(a)>=+f.min);
 }).map(paperCode));
 const attempts=allAttempts.filter(a=>matching.has(paperCode(a))),groups=new Map(),collections=new Map();
 const filtering=Object.values(f).some(Boolean);
 const advanced=Object.entries(f).some(([key,value])=>key!=='search'&&value);
 const searchForm=`<form id="paper-filters" class="paper-search"><div class="paper-search-row">
 ${input('Search papers and files','search',f.search||'','search','placeholder="Paper code, syllabus or attachment"')}<button class="btn primary">Apply filters</button>${filtering?button('Clear','reset-library','quiet','aria-label="Clear paper filters"'):''}</div>
 <details class="paper-search-advanced" ${advanced?'open':''}><summary>More filters</summary><div class="filter-grid">
 ${input('Examination year','year',f.year||'','number','placeholder="Any year" min="2000" max="2100"')}
 ${select('Series','series',[['','All series'],...Object.entries(SERIES)],f.series||'')}
 ${select('Component','component',[['','All components'],...componentOptions],f.component||'')}
 ${(f.track||state.subject==='all'||mathSubjects.has(state.subject))?select('Mathematics strand','track',[['','All strands'],...mathTracks.map(track=>[track,track])],f.track||''):''}
 ${select('Completion','scope',[['','Full and partial'],['full','Full paper'],['partial','Partial attempt']],f.scope||'')}
 ${select('Component grade','grade',[['','All grades'],...['a','b','c','d','e','u'].map(g=>[g,g.toUpperCase()])],f.grade||'')}
 ${input('Minimum score (%)','min',f.min||'','number','placeholder="Any score" min="0" max="100"')}
 </div><button class="btn primary">Apply advanced filters</button></details></form>`;
 for(const a of [...attempts].sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt)))){
  const key=paperCode(a);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(a);
 }
 for(const [code,records] of groups){const subject=records[0].subject;if(!collections.has(subject))collections.set(subject,[]);collections.get(subject).push([code,records]);}
 const fileIds=new Set(attempts.flatMap(a=>(a.files||[]).map(f=>f.id)));
 const summary=`<div class="library-summary"><span><strong>${groups.size}</strong> ${groups.size===1?'paper':'papers'}</span><span><strong>${attempts.length}</strong> ${attempts.length===1?'attempt':'attempts'}</span><span><strong>${fileIds.size}</strong> ${fileIds.size===1?'attachment':'attachments'}</span></div>`;
 const columns='<div class="library-columns" aria-hidden="true"><span>Paper & documents</span><span>Latest attempt</span><span>Best full paper</span><span>Actions</span></div>';
 const recordView=([code,records])=>{
  const latest=records[0],papers=records.filter(full),best=papers.length?Math.max(...papers.map(percent)):null;
  const files=[...new Map(records.flatMap(a=>a.files||[]).map(f=>[f.id,f])).values()];
  return `<article class="library-record"><div class="library-identity"><span class="document-mark">${icon('file')}</span><div><h3><button class="record-link" data-action="detail" data-id="${latest.id}">${code}</button></h3><p>${esc(component(latest)?.[0]||'')} · ${latest.level}</p><div class="document-chips">${files.map(f=>button(icon('file')+' '+esc(f.role||'Document'),'file','document-chip',`data-file="${esc(f.id)}" title="Open ${esc(f.name)}" aria-label="Open ${esc(f.role||'document')}: ${esc(f.name)}"`)).join('')}${files.length?'':'<span class="small muted">No attachments</span>'}</div></div></div><div class="library-latest"><span class="mobile-label">Latest attempt</span><strong>${pct(percent(latest))}</strong><small>${latest.scope==='partial'?'Partial attempt':`${latest.marks}/${latest.max} marks`}</small><small>${date(latest.date)}</small></div><div class="library-best"><span class="mobile-label">Best full paper</span><strong>${pct(best)}</strong><small>${records.length} ${records.length===1?'attempt':'attempts'}</small></div><div class="library-actions">${button('View details','detail','quiet',`data-id="${latest.id}"`)}${button(icon('plus')+' New attempt','repeat-paper','',`data-id="${latest.id}"`)}</div></article>`;
 };
 const library=collections.size?c.activeSubjects().filter(subject=>collections.has(subject)).map(subject=>[subject,collections.get(subject)]).map(([subject,records])=>{
  const count=records.reduce((n,[,attempts])=>n+attempts.length,0);
  return `<section class="library-collection" aria-labelledby="collection-${subject}"><div class="collection-heading"><div class="collection-title"><h2 id="collection-${subject}">${folderMark()} ${SUBJECTS[subject].name}</h2><p>Cambridge ${subject}</p></div><span class="collection-count">${records.length} ${records.length===1?'paper':'papers'} <span aria-hidden="true">/</span> ${count} ${count===1?'attempt':'attempts'}</span></div><div class="document-library">${columns}${records.map(recordView).join('')}</div></section>`;
 }).join('')+`<p class="library-footnote">Each paper keeps its own documents and attempt history. Partial attempts are excluded from the best full-paper score.</p>`:
 `<section class="library-collection"><div class="collection-heading"><div class="collection-title"><h2>${folderMark()} Paper library</h2></div></div><div class="library-onboarding"><div><h3>${filtering?'No papers match these filters':'Your first paper belongs here'}</h3><p>${filtering?'Clear filters or choose another subject to widen the search.':'Upload a question paper and mark scheme, then record your attempt. Every retry stays separate.'}</p>${filtering?button('Clear filters','reset-library'):button(icon('upload')+' Upload your first paper','log','primary')}<div class="supported-files"><span>Question paper</span><span>Mark scheme</span><span>Your working</span></div></div></div></section>`;
 return heading('Past papers.','Your documents, attempts and working, in one library.',`<div class="button-row">${button('Paper history','history','quiet')}${button(icon('upload')+' Upload & log paper','log','primary')}</div>`)+filters()+searchForm+summary+`<div class="academic-library">${library}</div>`;
}

export function paperAttachmentsView(attempt,c){
 const {icon,button,esc,state,fileList}=c,files=attempt.files||[];
 return `<section class="paper-attachments" aria-labelledby="paper-materials-heading"><div class="collection-heading"><div class="collection-title"><h2 id="paper-materials-heading">${folderMark()} Paper & attachments</h2></div><span class="collection-count">${files.length} ${files.length===1?'file':'files'}</span></div><div class="collection-body">${files.length?fileList(files):'<p class="collection-empty-note">No attachments saved with this attempt. Use Edit record to add your paper or working.</p>'}${files.find(f=>f.role==='Question paper')?`<div class="collection-actions">${button(icon('eye')+' Preview question paper','preview-paper','',`data-id="${attempt.id}"`)}</div>`:''}${state.preview?`<iframe class="pdf-preview" title="Uploaded question paper" src="${esc(state.preview)}"></iframe>`:''}</div></section>`;
}

export function attemptHistoryView(attempt,c){
 const records=c.all('attempt').filter(a=>paperCode(a)===paperCode(attempt)).sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt)));
 const fullPapers=records.filter(full),latest=fullPapers[0],first=fullPapers.at(-1);
 const best=fullPapers.length?Math.max(...fullPapers.map(percent)):null;
 const change=fullPapers.length>1?percent(latest)-percent(first):null;
 return `<section class="panel attempt-history"><div class="section-heading"><h2>Attempt history</h2><span class="pill">${records.length} ${records.length===1?'attempt':'attempts'}</span></div><div class="library-summary"><span>Latest full paper <strong>${c.pct(latest?percent(latest):null)}</strong></span><span>Best full paper <strong>${c.pct(best)}</strong></span><span>First to latest <strong>${change==null?'—':`${change>0?'+':''}${new Intl.NumberFormat('en-GB',{maximumFractionDigits:2}).format(change)} pp`}</strong></span></div><div class="activity-list">${records.map(a=>`<div class="activity-row"><div><strong>${c.date(a.date)}</strong><p>${a.scope==='partial'?'Partial attempt':'Full paper'}${a.id===attempt.id?' · Viewing now':''}</p></div><div class="activity-score"><strong>${c.pct(percent(a))}</strong><small>${a.marks}/${a.max} marks</small></div>${c.button('View','detail','quiet',`data-id="${a.id}"`)}</div>`).join('')}</div></section>`;
}

export function questionBreakdownView(questions,esc,topicName) {
 if(!questions?.length)return '<p>No question marks recorded yet. You can add them at any time.</p>';
 const rows=questions.map(q=>`<tr><td>Q${esc(q.number)}</td><td>${q.max}</td><td>${q.marks}</td><td>${q.max-q.marks}</td><td>${esc(topicName(q.topic))}</td></tr>`).join('');
 return `<div class="table-wrap"><table><thead><tr><th scope="col">Question</th><th scope="col">Available</th><th scope="col">Obtained</th><th scope="col">Lost</th><th scope="col">Topic</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
