import {SUBJECTS,COMPONENTS,SERIES} from './domain.mjs';
import {TOPICS} from './syllabus.mjs';
import {resourceLinks} from './revision-tools.mjs';
import previews from './question-previews.mjs';
import csPreviews from './cs-question-previews.mjs';

const physics=['Physical quantities and units','Kinematics','Dynamics','Forces, density and pressure','Work, energy and power','Deformation of solids','Waves','Superposition','Electricity','D.C. circuits','Particle physics'];
const physicsA2=['Motion in a circle','Gravitational fields','Temperature','Ideal gases','Thermodynamics','Oscillations','Electric fields','Capacitance','Magnetic fields','Alternating currents','Quantum physics','Nuclear physics','Medical physics','Astronomy and cosmology'];
const computing=['Information representation','Communication','Hardware','Processor fundamentals','System software','Security, privacy and data integrity','Ethics and ownership','Databases','Algorithm design','Data types and structures','Programming','Software development','Data representation','Communication and internet technologies','Hardware and virtual machines','System software','Security','Artificial intelligence','Computational thinking and problem-solving','Further programming'];
function details(q){
 const match=q.reference?.match(/^(\d+)\/(\d{2})\/(F\/M|M\/J|O\/N)\/(\d{2})\b/);
 return match?{paper:match[2][0],variant:match[2][1],series:match[3],year:'20'+match[4]}:{};
}
export function sourcePreview(q,answer,esc){
 const pages=previews[q.id],cs=csPreviews[q.id];
 const selected=cs?(answer?cs.scheme:cs.question):pages?(answer?pages.slice(1):pages.slice(0,1)):[];
 return selected.map((src,index)=>'<img class="source-question" src="'+src+'" alt="'+esc((answer?'Mark scheme':'Original question')+' for '+(q.reference||q.title)+(selected.length>1?' · page '+(index+1):''))+'">').join('');
}
export function topicalView(c,questions,bookmarks,sessions,files){
 const {state,heading,button,input,select,esc,topicName}=c;
 const f=state.topical||{},subject=f.subject||'9702',done=new Set(sessions.map(s=>s.questionId)),saved=new Set(bookmarks.map(b=>b.recordId));
 const topics=TOPICS.filter(t=>t.subject===subject&&(!f.stage||t.level===f.stage||t.level==='AS/A2')&&
  (!f.paper||t.components.includes(Number(f.paper))||(subject==='9702'&&f.paper==='1'&&t.components.includes(2))));
 const chapter=t=>String(t.group).split('.')[0];
 const chapters=[...new Set(topics.map(chapter))];
 const subjectPool=questions.filter(q=>q.subject===subject);
 const available=subjectPool.filter(q=>{
  const d=details(q), t=topics.find(item=>item.id===q.topic);
  return (!f.stage||q.level===f.stage)&&(!f.paper||d.paper===f.paper)&&(!f.year||d.year===f.year)&&(!f.series||d.series===f.series)&&
   (!f.paperCode||q.reference?.startsWith(f.paperCode+' Q'))&&(!f.variant||d.variant===f.variant)&&(!f.min||Number(q.max)>=Number(f.min))&&(!f.max||Number(q.max)<=Number(f.max))&&
   (!f.chapter||(t&&chapter(t)===f.chapter))&&(!f.topic||q.topic===f.topic)&&(!f.difficulty||String(q.difficulty)===f.difficulty)&&
   (f.status==='saved'?saved.has(q.id):f.status==='done'?done.has(q.id):f.status==='todo'?!done.has(q.id):true)&&
   (!f.search||[q.title,q.reference,q.prompt,topicName(q.topic)].join(' ').toLowerCase().includes(f.search.trim().toLowerCase()));
 });
 if(f.sort==='newest'||f.sort==='oldest')available.sort((a,b)=>{
  const first=details(a),second=details(b),seasons=['F/M','M/J','O/N'];
  return (f.sort==='oldest'?1:-1)*(Number(first.year||0)-Number(second.year||0)||seasons.indexOf(first.series)-seasons.indexOf(second.series));
 });
 const active=available.find(q=>q.id===state.topicalId)||available[0];
 const index=available.indexOf(active);
 const any=(label,items)=>[['',label],...items];
 const filters='<form id="topical-filters" class="resource-filters">'+
  select('Exam board','board',[['cambridge','Cambridge International']],'cambridge')+
  select('Qualification','qualification',[['alevel','AS & A Level']],'alevel')+
  select('Subject','subject',Object.keys(SUBJECTS).map(id=>[id,SUBJECTS[id].name+' ('+id+')']),subject)+
  select('Stage','stage',any('AS + A2',['AS','A2']),f.stage)+
  select('Paper','paper',any('All papers',Object.keys(COMPONENTS[subject]).map(p=>[p,'P'+p+' · '+COMPONENTS[subject][p][0]])),f.paper)+
  select('Chapter','chapter',any('All chapters',chapters.map(id=>[id,id+' · '+(subject==='9702'&&[...physics,...physicsA2][Number(id)-1]||subject==='9618'&&computing[Number(id)-1]||COMPONENTS[subject][id]?.[0]||topics.find(t=>chapter(t)===id)?.title||'Syllabus chapter')])),f.chapter)+
  select('Topic / subtopic','topic',any('All topics',topics.filter(t=>!f.chapter||chapter(t)===f.chapter).map(t=>[t.id,t.code+' '+t.title])),f.topic)+
  select('Year','year',any('All years',[...new Set(subjectPool.map(q=>details(q).year).filter(Boolean))].sort().reverse()),f.year)+
  select('Season','series',any('All seasons',Object.values(SERIES).map((label,i)=>[['F/M','M/J','O/N'][i],label])),f.series)+
  select('Variant','variant',any('All variants',[...new Set(subjectPool.map(q=>details(q).variant).filter(Boolean))].sort()),f.variant)+
  select('Sort questions','sort',[['default','Paper order'],['newest','Newest first'],['oldest','Oldest first']],f.sort)+
  input('Minimum marks','min',f.min,'number','min="1"')+input('Maximum marks','max',f.max,'number','min="1"')+
  select('Difficulty','difficulty',any('Any difficulty',[...new Set(subjectPool.map(q=>q.difficulty).filter(Number.isFinite))].sort().map(n=>[n,n+'/5'])),f.difficulty)+
  select('Progress','status',any('All questions',[['saved','Bookmarked'],['done','Completed'],['todo','Not completed']]),f.status)+
  input('Search questions','search',f.search,'search','placeholder="Topic, keyword or paper reference"')+
  '<button class="btn primary">Apply filters</button>'+button('Reset filters','topical-reset','quiet')+'</form>'+
  (f.paperCode?'<p class="small">Paper '+esc(f.paperCode)+' '+button('Clear paper selection','topical-clear-paper','quiet')+'</p>':'');
 const list=available.map(q=>'<li><button type="button" data-action="topical-open" data-id="'+esc(q.id)+'" '+(q===active?'aria-current="true"':'')+'><strong>'+esc(q.title)+'</strong><small>'+esc(q.reference||topicName(q.topic))+' · '+esc(q.max)+' marks</small><small>'+[saved.has(q.id)?'Bookmarked':'',done.has(q.id)?'Completed':''].filter(Boolean).join(' · ')+'</small></button></li>').join('');
 const answer=state.topicalAnswer&&state.topicalId===active?.id;
 const preview=active?'<section class="panel resource-panel topical-preview"><div class="button-row">'+
  button('Previous','topical-open','quiet',index>0?'data-id="'+esc(available[index-1].id)+'"':'disabled')+
  button('Shuffle','topical-shuffle','quiet',available.length>1?'data-ids="'+available.filter(q=>q!==active).map(q=>esc(q.id)).join(',')+'"':'disabled')+
  button('Next','topical-open','quiet',index+1<available.length?'data-id="'+esc(available[index+1].id)+'"':'disabled')+
  button(answer?'Show question':'Show mark scheme','topical-answer','quiet','data-id="'+esc(active.id)+'" aria-pressed="'+Boolean(answer)+'"')+
  '</div><h2 tabindex="-1">'+esc(active.title)+'</h2><p>'+esc(active.reference||'Saved question')+' · '+esc(active.max)+' marks · '+esc(topicName(active.topic))+'</p>'+
  (sourcePreview(active,answer,esc)||'<p class="preserve">'+esc(answer?(active.answer||active.correctOption||'See the linked mark scheme.'):active.prompt)+'</p>')+
  (!answer?files(active.files):'')+
  '<div class="button-row">'+resourceLinks(active).filter(([name])=>answer||name==='Question paper').map(([name,href])=>'<a href="'+esc(href)+'" class="btn quiet" target="_blank" rel="noopener">'+name+'</a>').join('')+
  button('Practise question','open-question','primary','data-id="'+esc(active.id)+'"')+
  button(saved.has(active.id)?'Edit bookmark':'Bookmark','bookmark','quiet','data-id="'+esc(active.id)+'"')+
  button('Add to exam','topical-add','quiet','data-id="'+esc(active.id)+'"')+'</div></section>':'<section class="panel resource-panel"><h2>No matching questions</h2><p>Change the filters or add a question for this topic. The paper catalogue lists full papers beyond the indexed question bank.</p></section>';
 return heading('Topical questions','Browse the syllabus and practise from the original papers.',button('Add question','new-question','quiet'))+
  '<div class="topical-layout"><section class="panel resource-panel"><h2>Find questions</h2>'+filters+
  '<p role="status">'+available.length+' of '+subjectPool.length+' available questions</p><ul class="topical-list">'+list+'</ul></section>'+preview+'</div>';
}

