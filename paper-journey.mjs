import {full,paperCode} from './domain.mjs';

const questionKey=value=>String(value??'').toLowerCase().replace(/\s+/g,'').replace(/^q(?=\d)/,'');
const positive=value=>Number.isFinite(Number(value))?Math.max(0,Number(value)):0;
export const newestFirst=(a,b)=>String(b.date||'').localeCompare(String(a.date||''))||
 String(b.createdAt||'').localeCompare(String(a.createdAt||''));

export function paperJourney(attempts,mistakes) {
 const [latest,...older]=[...attempts].sort(newestFirst);
 if(!latest)return null;
 const previous=full(latest)&&positive(latest.max)>0&&older.find(attempt=>
  full(attempt)&&attempt.subject===latest.subject&&attempt.paper===latest.paper&&
  attempt.series===latest.series&&Number(attempt.year)===Number(latest.year)&&
  Number(attempt.max)===Number(latest.max)&&newestFirst(attempt,latest)>0);
 const baseline=previous||latest;
 const linked=mistakes.filter(m=>m.attemptId===baseline.id);
 const represented=new Set(), losses=new Map(), remaining=new Map();
 const record=(topic,loss)=>{if(topic&&loss>0)losses.set(topic,(losses.get(topic)||0)+loss);};
 for(const q of baseline.questions||[]){
  const key=questionKey(q.number);
  const loss=Math.max(0,positive(q.max)-positive(q.marks));
  if(key)remaining.set(key,loss);
  if(q.topic){if(key)represented.add(key);record(q.topic,loss);}
 }
 const missed=new Map();
 for(const m of linked){
  const key=questionKey(m.question);
  if(!m.topic||m.questionId||represented.has(key))continue;
  const group=key||m.id;
  const loss=Math.min(positive(m.lost),remaining.get(key)??Infinity);
  if(loss>(missed.get(group)?.loss||0))missed.set(group,{topic:m.topic,loss});
 }
 for(const {topic,loss} of missed.values())record(topic,loss);
 return {
  baseline,retake:previous?latest:null,
  topics:[...losses].map(([topic,loss])=>({topic,loss})).sort((a,b)=>b.loss-a.loss),
  corrections:linked.length,completed:linked.filter(m=>m.corrected).length,
  change:previous?Number(latest.marks)-Number(previous.marks):null
 };
}

const sample={
 baseline:{subject:'9709',paper:'11',series:'s',year:2024,marks:52,max:75},
 retake:{marks:68,max:75},change:16,topics:[{topic:'Quadratics · Q1(b)',loss:1}],corrections:1,completed:1
};
const marks=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
const difference=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2,signDisplay:'exceptZero'});

function markScale(baseline,retake){
 const max=positive(baseline.max);
 if(!retake||!max)return '';
 const first=Math.min(100,100*positive(baseline.marks)/max);
 const second=Math.min(100,100*positive(retake.marks)/max);
 return `<div class="journey-scale" aria-hidden="true" style="--first:${first}%;--second:${second}%;--low:${Math.min(first,second)}%;--delta:${Math.abs(second-first)}%">
  <span>0</span><div><i></i><b></b><b></b></div><span>${marks.format(max)}</span>
 </div>`;
}

function scoreStation(paper,esc,example,label){
 const score=`<strong>${marks.format(paper.marks)}<small> / ${marks.format(paper.max)}</small></strong>`;
 if(example)return score;
 return `<button type="button" class="journey-paper-link" data-action="detail" data-id="${esc(paper.id)}"
  aria-label="${label}: ${marks.format(paper.marks)} / ${marks.format(paper.max)}. Open paper attempt.">
  ${score}<span aria-hidden="true">↗</span>
 </button>`;
}

export function paperJourneyView(c,attempts,mistakes,{example=false}={}){
 const j=example?sample:paperJourney(attempts,mistakes);
 if(!j)return '';
 const {esc,icon,link}=c;
 const {baseline,retake,topics,completed,corrections,change}=j;
 const status=corrections
  ? corrections===1&&completed?'1 correction completed':`${completed} of ${corrections} ${corrections===1?'correction':'corrections'} complete`
  : 'No corrections recorded';
 const showLoss=topics.slice(0,2);
 const scale=Math.max(1,...showLoss.map(t=>t.loss));
 const topicTitle=topic=>example?topic:c.topicName(topic);
 return `<section class="paper-journey" aria-labelledby="paper-journey-title">
  <div class="desk-heading"><div><h2 id="paper-journey-title">The correction trail</h2>
  <p>${example?'Example · Mathematics':esc(paperCode(baseline))+(retake?' · Same paper, two attempts':' · Latest attempt')}</p></div>
  ${!example&&corrections?link('Open corrections','mistakes'):''}</div>
  <ol class="paper-journey-stations">
   <li><span class="journey-stage">${icon('file')} Attempt</span>
    ${scoreStation(baseline,esc,example,'Attempt')}
    <p>${example?'9709/11/M/J/24':esc(c.date(baseline.date))+(full(baseline)?'':' · Partial attempt')}</p></li>
   <li><span class="journey-stage">${icon('edit')} Correct</span>
    <p class="journey-status">${status}</p>
    ${showLoss.length?`<ul class="journey-losses" aria-label="Marks lost by topic">${showLoss.map(t=>`<li><span>${esc(topicTitle(t.topic))}</span><strong>−${marks.format(t.loss)}</strong><span class="journey-bar" aria-hidden="true"><i style="--loss:${100*t.loss/scale}%"></i></span></li>`).join('')}</ul>`:'<p>Tag a question with its syllabus topic to see marks lost here.</p>'}</li>
   <li><span class="journey-stage">${icon('repeat')} Retake</span>
    ${retake?`${scoreStation(retake,esc,example,'Retake')}<p class="journey-delta" data-direction="${Math.sign(change)}">${difference.format(change)} marks ${example?'on the retake':'· '+esc(c.date(retake.date))}</p>`:'<p class="journey-status">No comparable retake yet</p><p>Log the same full paper again to compare marks.</p>'}</li>
  </ol>
  ${markScale(baseline,retake)}
 </section>`;
}
