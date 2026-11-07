import {SUBJECTS,localDate,paperCode,percent} from './domain.mjs';

export function studyEvents(attempts, sessions, mistakes) {
  const papers = attempts.map(record => ({type:'Paper', date:record.date, time:record.createdAt||record.date, record}));
  const practice = sessions.map(record => ({type:'Practice', date:record.date, time:record.createdAt||record.date, record}));
  const reviews = mistakes.flatMap(record => (record.reviewHistory||[]).filter(item => Number.isFinite(Date.parse(item.date))).map(item => ({
    type:'Review', date:localDate(new Date(item.date)), time:item.date, record
  })));
  return [...papers,...practice,...reviews].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
}

export function studyStreak(events, today = new Date()) {
  const days = new Set(events.map(event => event.date));
  const current = new Date(today);
  if(!days.has(localDate(current)))current.setDate(current.getDate()-1);
  let streak = 0;
  while(days.has(localDate(current))){
    streak++;
    current.setDate(current.getDate()-1);
  }
  return streak;
}

export function eventTitle({type,record}) {
  if(type==='Paper')return paperCode(record);
  if(type==='Practice')return record.title||'Focused study';
  return 'Reviewed Q'+record.question;
}

export function eventRows(events,c) {
  const {esc,date,mins,pct,button}=c;
  return events.map(event=>{
    const {record,type}=event;
    const score=type==='Paper'||(type==='Practice'&&record.max>0)?pct(percent(record)):'';
    const detail=type==='Paper'?button('Open attempt','detail','quiet',`data-id="${esc(record.id)}"`):
      type==='Review'?button('Open correction','edit-mistake','quiet',`data-id="${esc(record.id)}"`):
      button('Session details','session-details','quiet',`data-id="${esc(record.id)}"`);
    return `<article class="folio-record"><div><h3>${esc(eventTitle(event))}</h3><p>${type} · ${esc(SUBJECTS[record.subject]?.name||record.subject)} · ${date(event.date)}${score?' · '+score:''}${record.minutes!=null?' · '+mins(record.minutes):''}</p></div>${detail}</article>`;
  }).join('');
}

export function activityCalendar(events,c,days=28,{planner=false}={}) {
  const {state,esc,date,mins,link}=c;
  const today=new Date();
  const selected=state.activityDate;
  const counts=new Map();
  for(const event of events)counts.set(event.date,(counts.get(event.date)||0)+1);
  const cells=Array.from({length:days},(_,index)=>{
    const day=new Date(today);
    day.setDate(day.getDate()+index-days+1);
    const key=localDate(day), count=counts.get(key)||0;
    return `<button type="button" class="heat-cell intensity-${Math.min(count,3)}" data-action="activity-day" data-date="${key}" aria-pressed="${selected===key}" aria-label="${date(key)}, ${count} ${count===1?'activity':'activities'}" title="${date(key)}: ${count}">${day.getDate()}</button>`;
  }).join('');
  const since=new Date(today);
  since.setDate(since.getDate()-6);
  const week=events.filter(event=>event.date>=localDate(since)&&event.date<=localDate(today));
  const active=events.filter(event=>event.date===selected);
  const minutes=week.reduce((total,event)=>total+(event.type==='Review'?0:Number(event.record.minutes)||0),0);
  return `<section class="dashboard-activity"><div class="section-heading"><div><h2>Study activity</h2><p>Last 7 days: ${mins(minutes)} studied · ${week.filter(e=>e.type==='Paper').length} paper attempts · ${week.filter(e=>e.type==='Review').length} reviews</p></div><div class="activity-links">${link('Open history','history')}${planner?link('Exam planner','exams'):''}</div></div>
    <div class="activity-calendar" aria-label="Study calendar">${cells}</div><div class="activity-calendar-legend"><span>Last ${days} days</span><span>Today</span></div>
    ${selected?`<div class="activity-day"><h3>${date(selected)}</h3>${active.length?`<ul>${active.map(event=>`<li>${esc(event.type)} · ${esc(eventTitle(event))}</li>`).join('')}</ul>`:'<p>No recorded activity for this date.</p>'}</div>`:''}
  </section>`;
}

export function nextStudyTask({draft,due,planned,attempts,questions,dueBookmarks=0}) {
  if(draft)return {title:'Continue your paper',copy:'A paper draft is saved on this browser.',action:'log',label:'Resume draft'};
  if(due.length)return {title:'Return to a correction',copy:`${due.length} ${due.length===1?'mistake is':'mistakes are'} due for another attempt.`,action:'review',label:'Open review queue'};
  if(dueBookmarks)return {title:'Revisit a saved question',copy:'A bookmark is ready for review.',action:'review',label:'Open review queue'};
  if(planned.length)return {title:planned[0].title,copy:'Your next planned session.',action:'plan',label:'Open study plan'};
  if(attempts.length&&questions.length)return {title:'Practise a syllabus topic',copy:'Choose from the questions already saved in your workspace.',action:'practice',label:'Open focused study'};
  if(!attempts.length)return {title:'Log your first paper',copy:'Add the paper and mark scheme, then record your marks and working time.',action:'log',label:'Log a paper'};
  return {title:'Log your next paper',copy:'Add the paper and mark scheme, then record your marks and working time.',action:'log',label:'Log a paper'};
}
