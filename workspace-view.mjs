import {SUBJECTS,COMPONENTS,component,paperCode,full,percent,average,stats,gradeFor,SERIES,topicStats} from './domain.mjs';
import {TOPICS} from './syllabus.mjs';
import {lineChart} from './charts.mjs';
import {activityCalendar} from './study-view.mjs';
import {paperJourneyView} from './paper-journey.mjs';

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

const longDate = new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const examDate = new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'});
const chartDate = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'});
const shortPaperDate = date => chartDate.format(new Date(date+'T12:00'));
const completedOrder = (a,b) => b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt));
const amount = (count,label) => `${count} ${label}${count===1?'':'s'}`;
const paperSeries = paper => `${paper.subject}/${String(paper.paper)[0]}`;

function overviewPreview(c, attempts, mistakes, sessions) {
 const {pct,mins}=c;
 const summary=stats(attempts,mistakes,sessions);
 const chart=lineChart(attempts,true,{width:900,height:340,left:96,right:44,top:28,bottom:56,axisLabelX:76,adaptiveTicks:true});
 return `<section class="preparation-summary dashboard-summary" aria-label="Study summary">
  <div class="primary-measure"><span>Average paper score</span><strong>${pct(summary.avg)}</strong><small>Completed papers only</small></div>
  <div><span>Papers completed</span><strong>${summary.count}</strong><small>Full-paper attempts</small></div>
  <div><span>Focused study time</span><strong>${mins(summary.totalTime)}</strong><small>Papers and practice</small></div>
 </section><div class="overview-composition"><section class="performance-module">
  <div class="section-heading"><h2>Performance over time</h2></div>
  <div class="performance-plot">${chart}</div><p class="chart-caption">${amount(summary.count,'completed paper')}</p>
 </section><div class="activity-module">${activityCalendar(c.activity,c,28)}</div></div>`;
}

function recentPapers(c, recent, thresholds) {
 const {esc,icon,link,date,pct}=c;
 return `<section class="desk-recent" aria-labelledby="desk-recent-title">
  <div class="desk-heading"><h2 id="desk-recent-title">Recent papers</h2>${link('View history','history')}</div>
  ${recent.length?`<ul class="desk-paper-list">${recent.map(paper=>{
   const grade=gradeFor(paper,thresholds);
   return `<li>
    <button type="button" class="desk-paper" data-action="detail" data-id="${esc(paper.id)}">
     <span class="desk-paper-identity"><span class="desk-paper-code">${esc(paperCode(paper))}</span><span>${esc(SUBJECTS[paper.subject]?.name||paper.subject)}</span></span>
     <time datetime="${esc(paper.date)}">${esc(date(paper.date))}</time>
     <span class="desk-paper-result"><strong>${pct(percent(paper))}</strong><span>${esc(paper.marks)}/${esc(paper.max)} marks${full(paper)?'':', partial'}</span></span>
     ${grade.grade?`<abbr class="desk-grade" title="${esc(grade.label)}">${esc(grade.grade.toUpperCase())}</abbr>`:`<span class="desk-paper-arrow">${icon('arrow')}</span>`}
    </button>
   </li>`;
  }).join('')}</ul>`:`<div class="desk-empty"><p>No papers logged for this selection.</p>${link('Open past papers','papers')}</div>`}
 </section>`;
}

function examDocket(c, exam, examCount) {
 const {esc,icon,link,countdownText}=c;
 return `<section class="desk-exam" aria-labelledby="desk-exam-title">
  <h2 id="desk-exam-title">${icon('calendar')} Next examination</h2>
  ${exam?`<strong class="desk-exam-count" data-countdown="${esc(exam.datetime)}">${countdownText(exam.datetime)}</strong>
  <p class="desk-exam-paper">${esc(SUBJECTS[exam.subject]?.name||exam.subject)}, Paper ${esc(exam.paper)}</p>
  <p><time datetime="${esc(exam.datetime)}">${esc(examDate.format(new Date(exam.datetime)))}</time>${examCount>1?` <span class="desk-exam-more">+ ${amount(examCount-1,'more examination')}</span>`:''}</p>`:'<p>Add the date confirmed by your centre.</p>'}
  ${link(exam?'Examination plan':'Set an examination date','exams')}
 </section>`;
}

function revisionFocus(c, mistakes, due, weak) {
 const {esc,link,pct,dueBookmarks,button}=c;
 const dueCount=due.length+dueBookmarks;
 const dueParts=[due.length?amount(due.length,'correction'):'',dueBookmarks?amount(dueBookmarks,'saved question'):''].filter(Boolean);
 return `<aside class="desk-focus" aria-labelledby="desk-focus-title">
  <div class="desk-heading"><h2 id="desk-focus-title">What to revisit</h2></div>
  <div class="desk-review">
   <p><strong>${dueCount?`${dueParts.join(' and ')} due`:mistakes.length?'You’re up to date':'Corrections queue'}</strong></p>
   ${dueCount?'':`<p>${mistakes.length?'Saved corrections return when they’re due.':'Log a mistake to schedule a retry.'}</p>`}
   ${link('Open review queue','review')}
  </div>
  <div class="desk-weak">
   <h3>Topics costing marks</h3>
   ${weak.length?`<ol class="desk-topic-list">${weak.map(t=>`<li><div><strong>${esc(t.title)}</strong><small>${esc(SUBJECTS[t.subject].name)} <span>§ ${esc(t.code)}</span></small></div><div><strong>${t.lost} lost</strong><small>${pct(t.accuracy)} accuracy</small></div>${button('Practise this topic','practise-topic','quiet','data-topic="'+t.id+'"')}</li>`).join('')}</ol>`:'<p>Tag question marks with syllabus topics to see where you’re losing marks.</p>'}
   ${weak.length?link('Topic analysis','analytics'):link('Browse syllabus','syllabus')}
  </div>
 </aside>`;
}

function performanceView(c, completed, components) {
 const {state,esc,link,button,pct,date}=c;
 const latest=completed[0];
 const previous=latest&&completed.find((paper,i)=>i>0&&paperSeries(paper)===paperSeries(latest));
 const delta=previous?percent(latest)-percent(previous):null;
 const change=delta==null?'':`${new Intl.NumberFormat('en-GB',{maximumFractionDigits:1,signDisplay:'exceptZero'}).format(delta)} pp vs previous ${latest.subject} Paper ${String(latest.paper)[0]}`;
 const plot=completed.length>1?lineChart(completed,true,{width:680,height:230,left:92,right:52,top:22,bottom:37,axisLabelX:77,adaptiveTicks:true,formatDate:shortPaperDate}):'';
 return `<section class="desk-performance" aria-labelledby="desk-performance-title">
  <div class="desk-heading"><h2 id="desk-performance-title">Paper performance</h2>${link('Open analytics','analytics')}</div>
  <label class="field desk-component"${components.length?'':' hidden'}><span>Component</span><select id="dashboard-component"${components.length?'':' disabled'}><option value="">All components</option>${components.map(p=>`<option value="${esc(p)}"${state.dashboardComponent===p?' selected':''}>Paper ${esc(p)}</option>`).join('')}</select></label>
  ${latest?`<div class="desk-performance-result">
   <span class="desk-performance-score">${pct(percent(latest))}</span>
   <div><strong>${esc(paperCode(latest))}</strong><p>${esc(latest.marks)}/${esc(latest.max)} marks on ${esc(date(latest.date))}</p></div>
   ${change?`<span class="desk-performance-change">${esc(change)}</span>`:''}
  </div>
  ${plot?`<div class="desk-plot performance-plot">${plot}</div><p class="desk-chart-note">${amount(completed.length,'completed paper')}. Lines connect attempts within the same syllabus and component.</p>`:'<p class="desk-chart-note">Baseline score. Complete another paper in this component to see a change.</p>'}`:
  `<div class="desk-empty"><p>${components.length?'No completed papers in this selection. Partial attempts are listed under Recent papers.':'Log a complete paper to establish a baseline score.'}</p>${button('Log a paper','log','quiet')}</div>`}
 </section>`;
}

function subjectRegister(c, subjects) {
 const {all,subjectIcon,button,esc,pct}=c;
 const attempts=all('attempt').filter(full);
 const confidences=all('topic').filter(record=>record.confidence>=4);
 return `<section class="subject-management desk-subjects" aria-labelledby="desk-subjects-title">
  <div class="desk-heading"><h2 id="desk-subjects-title">Subject register</h2>${button('Add subject','new-subject','quiet')}</div>
  <div class="subject-register">${subjects.map(code=>{
   const papers=attempts.filter(a=>a.subject===code);
   const topicCount=TOPICS.filter(t=>t.subject===code).length;
   const confident=confidences.filter(t=>t.subject===code).length;
   return `<article class="subject-entry"><span class="register-icon">${subjectIcon(code)}</span>
    <div class="subject-entry-name"><h3>${esc(SUBJECTS[code].name)}</h3><p>Cambridge ${esc(code)}</p></div>
    <div class="subject-entry-score">${papers.length?`<strong>${pct(average(papers.map(percent)))}</strong><small>${amount(papers.length,'completed paper')}</small>`:'<small>No completed papers</small>'}</div>
    <div class="subject-entry-confidence">${confident?`<strong>${confident}/${topicCount}</strong><small>topics confident</small>`:`<small>${amount(topicCount,'syllabus topic')}</small>`}</div>
    <button type="button" class="text-link" data-subject-go="${esc(code)}" aria-label="Syllabus for ${esc(SUBJECTS[code].name)}">Syllabus</button>
   </article>`;
  }).join('')||'<p class="library-note">Add a subject to keep its syllabus and papers together.</p>'}</div>
 </section>`;
}

// Dashboard reads the existing scoped records. Actions stay with the app's handlers.
export function overviewView(c) {
 const {state,esc,button,heading,filters,scoped,all,activeSubjects,localDate}=c;
 const attempts=scoped('attempt'),mistakes=scoped('mistake'),sessions=scoped('session');
 if(c.preview)return overviewPreview(c,attempts,mistakes,sessions);
 const ordered=[...attempts].sort(completedOrder);
 const firstPaper=!all('attempt').length&&!all('mistake').length&&!all('session').length;
 const components=[...new Set(attempts.map(paper=>String(paper.paper)[0]))].filter(Boolean).sort();
 const completed=ordered.filter(paper=>full(paper)&&(!state.dashboardComponent||String(paper.paper)[0]===state.dashboardComponent));
 const exams=scoped('exam').filter(exam=>new Date(exam.datetime)>Date.now()).sort((a,b)=>a.datetime.localeCompare(b.datetime));
 const due=mistakes.filter(m=>!m.corrected&&(!m.retryDate||m.retryDate<=localDate()));
 const activeTopicIds=new Set([...attempts.flatMap(a=>(a.questions||[]).map(q=>q.topic)),...sessions.map(s=>s.topic),...mistakes.map(m=>m.topic)]);
 const weak=TOPICS.filter(t=>activeTopicIds.has(t.id)).map(t=>({...t,...topicStats(t.id,attempts,mistakes,sessions)}))
  .filter(t=>t.lost>0).sort((a,b)=>b.lost-a.lost||a.accuracy-b.accuracy).slice(0,3);
 return `<div class="study-desk">
  <div class="desk-masthead">${heading('Revision desk',longDate.format(new Date()))}${!firstPaper||all('exam').length?filters():''}</div>
  <div class="desk-next">
   <section class="desk-next-task" aria-labelledby="desk-task-title"><div><h2 id="desk-task-title">${firstPaper&&c.next.action==="log"&&!/resume/i.test(c.next.label)?'Start with one paper':esc(c.next.title)}</h2><p>${firstPaper&&c.next.action==="log"&&!/resume/i.test(c.next.label)?'Add a question paper and record your marks. You can tag any lost marks for your next review.':esc(c.next.copy)}</p></div>${button(esc(c.next.label),c.next.action,'primary')}</section>
   ${examDocket(c,exams[0],exams.length)}
  </div>
  ${paperJourneyView(c,ordered,mistakes,{example:firstPaper})}
  ${firstPaper?'':`<div class="desk-records">${recentPapers(c,ordered.slice(0,4),all('threshold'))}${revisionFocus(c,mistakes,due,weak)}</div>
  <div class="desk-evidence">
   ${performanceView(c,completed,components)}
   <details class="desk-activity"${c.activity.length||state.activityDate?' open':''}>
    <summary>Study activity${c.streak?` <span>${amount(c.streak,'day')} in a row</span>`:''}</summary>
    ${activityCalendar(c.activity,c,28,{planner:true})}
   </details>
  </div>`}
  ${subjectRegister(c,activeSubjects())}
  <section class="desk-shortcuts" aria-labelledby="desk-shortcuts-title"><h2 id="desk-shortcuts-title">Study tools</h2>${overviewShortcutView(c)}</section>
 </div>`;
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
