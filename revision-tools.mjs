import {SUBJECTS,SERIES,COMPONENTS,paperCode,localDate,weightedTotal} from './domain.mjs';
import {TOPICS,topicsFor} from './syllabus.mjs';

const archive='https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/';
const official='https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-';
const slugs={'9709':'mathematics','9702':'physics','9618':'computer-science','9231':'mathematics-further','9701':'chemistry','9700':'biology'};
export const officialPapers=subject=>official+slugs[subject]+'-'+subject+'/past-papers/';
export const paperCatalogue=[
 ['9709','11'],['9709','12'],['9702','12'],['9702','22'],['9618','12'],['9618','22']
].map(([subject,paper])=>{
 const id=subject+'_s24_', info=COMPONENTS[subject][paper[0]];
 return {subject,paper,series:'s',year:2024,level:'AS',label:info[0],max:info[1],
  questionUrl:archive+id+'qp_'+paper+'.pdf',schemeUrl:archive+id+'ms_'+paper+'.pdf'};
});
const physicsPaper=paperCatalogue.find(paper=>paper.subject==='9702'&&paper.paper==='12');
// May/June 2024 9702/12. Each entry points to the original question and the published key.
const physicsTopics=[
 '1.4','1.3','2.1','2.1','2.1','2.1','3.3','3.3','3.3','3.3',
 '4.2','4.1','4.3','5.3','5.1','5.2','5.2','6.2','6.1','6.2',
 '7.3','8.2','8.1','7.5','8.1','8.4','8.1','8.3','9.2','10.1',
 '9.3','9.1','9.1','10.2','10.1','10.1','11.1','11.2','11.1','11.1'
];
const physicsPages=[3,3,3,3,4,4,5,5,5,6,6,7,7,7,8,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,14,14,14,14,15,15,15,16,16,16];
const physicsKey=['CDADBB','CACABC','DCDABC','CDCDBB','CADDAC','DCBADA','BDCC'].join('');
export const catalogQuestions=physicsTopics.map((topic,index)=>({
 id:'9702-s24-12-q'+(index+1),kind:'question',subject:'9702',level:'AS',source:'cambridge',
 reference:paperCode(physicsPaper)+' Q'+(index+1),title:'Question '+(index+1),topic:'9702:'+topic,max:1,
 prompt:'Open the question paper at page '+physicsPages[index]+' and work through question '+(index+1)+'.',
 questionUrl:physicsPaper.questionUrl+'#page='+physicsPages[index],
 schemeUrl:physicsPaper.schemeUrl+'#page='+(index<28?2:3),correctOption:physicsKey[index],paper:paperCode(physicsPaper)
}));

export function topicQuestionIds(questions,mistakes,topic,today=localDate()){
 const due=new Set(mistakes.filter(m=>!m.corrected&&(!m.retryDate||m.retryDate<=today)).map(m=>m.questionId));
 return questions.filter(q=>q.topic===topic).sort((a,b)=>Number(due.has(b.id))-Number(due.has(a.id))).slice(0,5).map(q=>q.id);
}

export function gradeTarget(subject,parts,boundary){
 const maximum=weightedTotal(subject,parts.map(p=>({component:p.component,marks:p.max})));
 const secured=weightedTotal(subject,parts.filter(p=>p.type==='actual'));
 const remaining=weightedTotal(subject,parts.filter(p=>p.type!=='actual').map(p=>({component:p.component,marks:p.max})));
 const required=Math.max(0,boundary-secured);
 return {maximum,secured,remaining,required,reachable:required<=remaining,percentage:remaining?100*required/remaining:null};
}

export function monthDays(month){
 const [year,number]=month.split('-').map(Number);
 const first=new Date(year,number-1,1,12);
 first.setDate(first.getDate()-(first.getDay()+6)%7);
 return Array.from({length:42},(_,index)=>{
  const day=new Date(first);
  day.setDate(first.getDate()+index);
  return {date:localDate(day),number:day.getDate(),current:day.getMonth()===number-1};
 });
}
export function shiftMonth(month,amount){
 const [year,number]=month.split('-').map(Number);
 return localDate(new Date(year,number-1+amount,1,12)).slice(0,7);
}
export function syllabusSchedule(subject,level,start,finish,progress,components=[]){
 const topics=topicsFor(subject,level).filter(topic=>!topic.supplementary&&(!components.length||topic.components.some(p=>components.includes(p))));
 return distributeTopics(topics,start,finish,progress);
}
export function distributeTopics(topics,start,finish,progress){
 const cursor=new Date(start+'T12:00:00');
 const last=new Date(finish+'T12:00:00');
 const days=[];
 while(cursor<=last){
  days.push(localDate(cursor));
  cursor.setDate(cursor.getDate()+1);
 }
 const completed=new Set(progress.filter(p=>p.status==='Complete').map(p=>p.topicId));
 const pending=topics.filter(t=>!completed.has(t.id));
 const milestones=pending.map((topic,index)=>({topic,date:days[Math.floor(index*days.length/pending.length)]}));
 return {total:topics.length,complete:topics.length-pending.length,milestones,days:days.length};
}

export function resourceLinks(q){
 const url=value=>{try{const parsed=new URL(value);return parsed.protocol==='https:'?parsed.href:null;}catch{return null;}};
 return [['Question paper',url(q.questionUrl)],['Mark scheme',url(q.schemeUrl)]].filter(([,href])=>href);
}

export function catalogueView(c){
 const {state,esc,input,select,button,heading,link,activeSubjects}=c;
 const filters=state.catalogue||{},subjects=activeSubjects();
 const papers=paperCatalogue.filter(p=>subjects.includes(p.subject)&&(!filters.subject||p.subject===filters.subject)&&
  (!filters.search||[paperCode(p),p.label,SUBJECTS[p.subject].name,SERIES[p.series],p.year].join(' ').toLowerCase().includes(filters.search.toLowerCase())));
 const links=p=>resourceLinks(p).map(([label,href])=>'<a class="btn quiet" href="'+esc(href)+'" target="_blank" rel="noopener">'+label+'</a>').join('');
 return heading('Find a past paper','Open the question paper and mark scheme for the same component.',link('Saved attempts','papers'))+
  '<section class="panel resource-panel"><form id="catalogue-filters" class="resource-filters">'+
  input('Search papers','search',filters.search,'search','placeholder="9702 or 9709/11"')+
  select('Subject','subject',[['','All subjects'],...subjects.map(code=>[code,SUBJECTS[code].name+' ('+code+')'])],filters.subject)+
  '<button class="btn">Filter papers</button></form>'+
  '<div class="table-wrap"><table><thead><tr><th>Paper</th><th>Series</th><th>Marks</th><th>Files</th></tr></thead><tbody>'+
  papers.map(p=>'<tr><td><strong>'+esc(paperCode(p))+'</strong><small>'+esc(SUBJECTS[p.subject].name+' · '+p.label)+'</small></td><td>'+SERIES[p.series]+' '+p.year+'</td><td>'+p.max+'</td><td>'+links(p)+'</td></tr>').join('')+
  '</tbody></table></div>'+(papers.length?'':'<p>No papers match these filters.</p>')+'</section>'+
  '<section class="panel resource-panel"><h2>Official Cambridge paper collections</h2><div class="button-row">'+subjects.map(code=>'<a class="btn quiet" href="'+officialPapers(code)+'" target="_blank" rel="noopener">'+esc(SUBJECTS[code].name)+'</a>').join('')+'</div></section>';
}

export function builderView(c,questions,draft){
 const {state,esc,input,select,button,heading,topicName}=c, filter=state.builder||{};
 const selected=draft.ids.map(id=>questions.find(q=>q.id===id)).filter(Boolean);
 const search=(filter.search||'').trim().toLowerCase();
 const matches=questions.filter(q=>(!filter.topic||q.topic===filter.topic)&&(!filter.subject||q.subject===filter.subject)&&
  (!search||[q.title,q.prompt,q.reference,topicName(q.topic)].join(' ').toLowerCase().includes(search)));
 const rows=matches.map(q=>{
  const included=draft.ids.includes(q.id);
  return '<li><div><strong>'+esc(q.title)+'</strong><small>'+esc(q.reference||SUBJECTS[q.subject].name)+' · '+esc(topicName(q.topic))+' · '+q.max+' marks</small></div>'+
   button(included?'Added':'Add question','builder-add','quiet','data-id="'+q.id+'" '+(included?'disabled':''))+'</li>';
 }).join('');
 return heading('Exam builder','Build and sit a paper using questions from your bank and the linked Cambridge catalogue.')+
  '<div class="resource-split"><section class="panel resource-panel"><h2>Choose questions</h2><form class="resource-filters" id="builder-filters">'+
  input('Search questions','search',filter.search,'search')+
  select('Subject','subject',[['','All subjects'],...c.activeSubjects().map(code=>[code,SUBJECTS[code].name])],filter.subject)+
  select('Topic','topic',[['','All topics'],...TOPICS.filter(t=>questions.some(q=>q.topic===t.id)&&(!filter.subject||t.subject===filter.subject)).map(t=>[t.id,SUBJECTS[t.subject].name+' · '+t.title])],filter.topic)+
  '<button class="btn">Filter questions</button></form><ul class="resource-list">'+rows+'</ul>'+(rows?'':'<p>No matching questions. Add questions to your bank or change the filters.</p>')+
  '</section><section class="panel resource-panel"><h2>Your paper</h2><p>'+selected.length+' questions · '+selected.reduce((n,q)=>n+Number(q.max),0)+' marks</p>'+
  '<form id="builder-save" class="resource-filters">'+input('Paper title','title',draft.title,'text','required maxlength="120"')+
  '<button class="btn" '+(selected.length?'':'disabled')+'>Save paper</button></form><ol class="resource-list">'+selected.map((q,index)=>
   '<li><div><strong>'+esc(q.title)+'</strong><small>'+esc(q.reference||topicName(q.topic))+'</small></div><div class="button-row">'+
   button('↑','builder-move','quiet','data-id="'+q.id+'" data-step="-1" aria-label="Move question '+(index+1)+' up" '+(index?'':'disabled'))+
   button('↓','builder-move','quiet','data-id="'+q.id+'" data-step="1" aria-label="Move question '+(index+1)+' down" '+(index===selected.length-1?'disabled':''))+
   button('Remove','builder-remove','quiet','data-id="'+q.id+'" aria-label="Remove question '+(index+1)+'"')+'</div></li>').join('')+
  '</ol><div class="button-row">'+button('Sit this paper','builder-sit','primary',selected.length?'':'disabled')+
  button('Print paper','builder-print','quiet',selected.length?'':'disabled')+button('Print mark scheme','builder-print-scheme','quiet',selected.length?'':'disabled')+button('New paper','builder-new','quiet')+
  '</div><h3>Saved papers</h3><ul class="resource-list">'+(c.customPapers||[]).map(p=>
  '<li><div><strong>'+esc(p.title)+'</strong><small>'+p.ids.length+' questions</small></div>'+button('Open','builder-open','quiet','data-id="'+p.id+'"')+'</li>').join('')+'</ul></section></div>';
}

export function calendarView(c){
 const {state,heading,button,filters,scoped,all,events,planned,plans,esc,mins,date}=c;
 const today=localDate(),month=state.calendarMonth||today.slice(0,7),selected=state.calendarDate||today;
 const byDate=new Map();
 function add(day,label,record,minutes=0){
  const entries=byDate.get(day)||[];
  entries.push({label,record,minutes});byDate.set(day,entries);
 }
 for(const item of events)add(item.date,item.type,item.record,item.type==='Review'?0:Number(item.record.minutes)||0);
 for(const plan of planned){
  if(!plan.subject||state.subject==='all'||plan.subject===state.subject)add(plan.date,plan.done?'Completed plan':'Planned',plan);
 }
 for(const exam of scoped('exam'))add(localDate(new Date(exam.datetime)),'Exam',exam);
 for(const plan of plans){
  if(plan.finish<today)continue;
  for(const item of syllabusSchedule(plan.subject,plan.level,today,plan.finish,all('topic')).milestones)add(item.date,'Syllabus',item.topic);
 }
 const selectedEntries=byDate.get(selected)||[];
 const monthTotal=[...byDate].filter(([day])=>day.startsWith(month)).flatMap(([,entries])=>entries).reduce((sum,item)=>sum+item.minutes,0);
 const monthName=new Date(month+'-01T12:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'});
 return heading('Study calendar','See paper attempts, practice, reviews and upcoming plans in one place.',button('Today','calendar-today','quiet'))+filters()+
 '<div class="resource-split calendar-layout"><section class="panel resource-panel"><div class="section-heading"><div><h2>'+esc(monthName)+'</h2><p>'+mins(monthTotal)+' of recorded study</p></div>'+
 '<div class="button-row">'+button('‹','calendar-month','quiet','data-step="-1" aria-label="Previous month"')+
 button('›','calendar-month','quiet','data-step="1" aria-label="Next month"')+'</div></div>'+
 '<div class="student-calendar">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day=>'<span class="weekday">'+day+'</span>').join('')+
 monthDays(month).map(day=>{
  const entries=byDate.get(day.date)||[];
  return '<button type="button" data-action="calendar-day" data-date="'+day.date+'" aria-pressed="'+(day.date===selected)+'" aria-label="'+date(day.date)+
   ', '+entries.length+' entries" class="'+(day.current?'':'outside')+'"><span>'+day.number+'</span>'+(entries.length?'<small>'+entries.length+'</small>':'')+'</button>';
 }).join('')+'</div></section><section class="panel resource-panel"><h2>'+date(selected)+'</h2>'+
 (selectedEntries.length?'<ul class="resource-list">'+selectedEntries.map(({label,record,minutes})=>{
  const title=label==='Paper'?paperCode(record):label==='Exam'?SUBJECTS[record.subject].name+' · Paper '+record.paper:record.title||(label==='Review'?'Q'+record.question:'Focused study');
  const actions=label==='Paper'?button('Open','detail','quiet','data-id="'+record.id+'"'):label==='Exam'?button('Open','edit-exam','quiet','data-id="'+record.id+'"'):
   label==='Syllabus'?button('Practise','practise-topic','quiet','data-topic="'+record.id+'"'):'';
  return '<li><div><strong>'+esc(title)+'</strong><small>'+label+(minutes?' · '+mins(minutes):'')+'</small></div>'+actions+'</li>';
 }).join('')+'</ul>':'<p>Nothing planned or recorded for this day.</p>')+
 button('Plan a session','plan-session','primary')+'</section></div>';
}
export function syllabusPlansView(c,plans){
 const {heading,button,filters,all,esc,date,topicName}=c;
 const today=localDate();
 return heading('Syllabus plans','Spread unfinished syllabus topics up to your finish date.',button('Add syllabus plan','syllabus-plan','primary'))+filters()+
 (plans.length?plans.map(plan=>{
  const schedule=syllabusSchedule(plan.subject,plan.level,today,plan.finish,all('topic'));
  return '<section class="panel resource-panel"><div class="section-heading"><div><h2>'+esc(SUBJECTS[plan.subject].name)+' · '+plan.level+'</h2>'+
  '<p>'+schedule.complete+' of '+schedule.total+' topics complete · finish '+date(plan.finish)+'</p></div><div class="button-row">'+
  button('Edit','syllabus-plan','quiet','data-id="'+plan.id+'"')+button('Remove','remove-syllabus-plan','quiet','data-id="'+plan.id+'"')+'</div></div>'+
  '<progress value="'+schedule.complete+'" max="'+Math.max(schedule.total,1)+'" aria-label="Syllabus completion"></progress>'+
  '<ul class="resource-list">'+schedule.milestones.map(({topic,date:day})=>'<li><div><strong>'+esc(topicName(topic.id))+'</strong><small>'+
  (day?date(day):'Finish date passed')+'</small></div><div class="button-row">'+button('Update progress','topic','quiet','data-topic="'+topic.id+'"')+
  button('Practise','practise-topic','quiet','data-topic="'+topic.id+'"')+'</div></li>').join('')+'</ul></section>';
 }).join(''):'<section class="panel resource-panel"><h2>Plan your syllabus finish date</h2><p>Choose a subject and stage to schedule its remaining topics.</p></section>');
}
