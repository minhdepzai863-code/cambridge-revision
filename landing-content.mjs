import {landingView,demoQuestions} from './public-view.mjs';
import {overviewView,questionBreakdownView} from './workspace-view.mjs';
import {localDate} from './domain.mjs';
import {studyEvents} from './study-view.mjs';
import {paperJourneyView} from './paper-journey.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const number = new Intl.NumberFormat('en-GB',{maximumFractionDigits:1});
const date = new Intl.DateTimeFormat('en-GB',{dateStyle:'medium'});
const fileIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h5"/></svg>';

export function renderLanding(signedIn=false) {
  const attempts=[54,57,60,63].map((marks,index)=>{
    const day=new Date();
    day.setDate(day.getDate()-[12,7,3,0][index]);
    return {id:'demo-'+index,subject:'9709',paper:'12',series:'s',year:2024,date:localDate(day),scope:'full',marks,max:75,minutes:45+index*5};
  });
  const scoped=kind=>kind==='attempt'?attempts:[];
  const preview=overviewView({
    preview:true,state:{},scoped,activity:studyEvents(attempts,[],[]),esc,link:()=> '',
    pct:value=>number.format(value)+'%',
    mins:value=>Math.floor(value/60)+'h '+Math.round(value%60)+'m',
    date:value=>date.format(new Date(value+'T12:00'))
  });
  const files=[['9709_s24_qp_11.pdf','Question paper'],['9709_s24_ms_11.pdf','Mark scheme'],['worked-answers.pdf','Completed answers']];
  const attachments='<ul class="file-list demo-attachments">'+files.map(([name,role])=>
    `<li class="file-row">${fileIcon}<strong>${name}</strong><span class="pill">${role}</span></li>`
  ).join('')+'</ul>';
  const trail=paperJourneyView({esc,icon:()=>''},[],[],{example:true});
  return landingView(signedIn,preview,{attachments,trail,marks:questionBreakdownView(demoQuestions,esc,topic=>topic)});
}
