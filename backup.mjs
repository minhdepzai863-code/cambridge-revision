import {SUBJECTS,COMPONENTS,ROUTES,validateAttempt,validateThreshold} from './domain.mjs';
export const RECORD_KINDS=new Set(['attempt','mistake','threshold','exam','topic','question','session','settings','timer']);
export const isRecordId=id=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const types=new Set(['application/pdf','image/png','image/jpeg','image/webp']);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const numeric=(v,min=0)=>v!==''&&v!=null&&Number.isFinite(+v)&&+v>=min;
function validateRecord(r){
  if(['attempt','session','mistake','question','exam','topic','threshold'].includes(r.kind)&&!SUBJECTS[r.subject])throw Error('The backup contains an invalid subject.');
  if(r.kind==='attempt'){
    if(!['full','partial'].includes(r.scope)||(r.questions!==undefined&&!Array.isArray(r.questions))||!numeric(r.difficulty,1)||r.difficulty>10)throw Error('The backup contains an invalid paper attempt.');
    if(validateAttempt(r).length)throw Error('The backup contains invalid paper details or marks.');
    for(const q of r.questions||[])if(!object(q)||typeof q.number!=='string'||!numeric(q.max,.25)||!numeric(q.marks)||+q.marks>+q.max)throw Error('The backup contains invalid question marks.');
    if(r.revisions!==undefined&&!Array.isArray(r.revisions))throw Error('The backup contains invalid revision history.');
    for(const old of r.revisions||[])if(!object(old)||!numeric(old.marks)||!numeric(old.max,.25)||!numeric(old.minutes)||+old.marks>+old.max)throw Error('The backup contains invalid revision history.');
  }
  if(['session','question','threshold'].includes(r.kind)&&!numeric(r.max,.25))throw Error('The backup contains invalid maximum marks.');
  if(r.kind==='session'&&(!numeric(r.minutes)||!numeric(r.marks)||+r.marks>+r.max))throw Error('The backup contains invalid practice marks or time.');
  if(r.kind==='mistake'&&!numeric(r.lost))throw Error('The backup contains invalid lost marks.');
  if(r.kind==='question'&&(!numeric(r.difficulty,1)||r.difficulty>5||!['original','cambridge'].includes(r.source)))throw Error('The backup contains an invalid practice question.');
  if(r.kind==='topic'&&(!numeric(r.confidence)||r.confidence>5))throw Error('The backup contains invalid topic confidence.');
  if(r.kind==='threshold'&&(!['component','qualification'].includes(r.scope)||!object(r.values)||validateThreshold(r)))throw Error('The backup contains invalid thresholds or source links.');
  if(r.kind==='exam'&&(!/^\d{2}$/.test(r.paper)||!COMPONENTS[r.subject]?.[r.paper[0]]||!numeric(r.duration,1)||!Number.isFinite(Date.parse(r.datetime))))throw Error('The backup contains an invalid examination date or component.');
  if(r.kind==='settings'){
    if(r.subjects!==undefined&&(!Array.isArray(r.subjects)||r.subjects.some(s=>!Object.hasOwn(SUBJECTS,s))))throw Error('The backup contains an invalid subject selection.');
    if(r.year!==undefined&&![2026,2027].includes(+r.year))throw Error('The backup contains an unsupported syllabus year.');
    if(r.routes!==undefined&&(!object(r.routes)||Object.entries(r.routes).some(([s,route])=>!SUBJECTS[s]||!Object.hasOwn(ROUTES[s],route))))throw Error('The backup contains an invalid examination route.');
  }
}
// Validate the entire manifest before any file or record is written.
export function validateBackup(data){
  if(!object(data)||data.app!=='cambridge-revision'||data.version!==1||!Array.isArray(data.records)||!Array.isArray(data.files))throw Error('Choose a Cambridge Revision JSON backup.');
  const ids=new Set(),fileIds=new Set();
  for(const f of data.files){
    if(!object(f)||!isRecordId(f.id)||fileIds.has(f.id)||!types.has(f.type)||typeof f.name!=='string'||!f.name||typeof f.data!=='string'||!f.data.length||f.data.length%4!==0||f.data.length>Math.ceil(20*1024*1024/3)*4||/[^A-Za-z0-9+/=]/.test(f.data)||!/^[^=]*={0,2}$/.test(f.data))throw Error('The backup contains an invalid, duplicate, or oversized attachment.');
    fileIds.add(f.id);
  }
  for(const r of data.records){
    if(!object(r)||!RECORD_KINDS.has(r.kind)||!isRecordId(r.id)||ids.has(r.id))throw Error('The backup contains an invalid or duplicate record.');
    ids.add(r.id);
    validateRecord(r);
    if(r.files!==undefined&&!Array.isArray(r.files))throw Error('The backup contains an invalid attachment list.');
    for(const f of r.files||[])if(!object(f)||!fileIds.has(f.id))throw Error('The backup is missing a referenced attachment.');
    if(['attempt','session'].includes(r.kind)&&(!Object.hasOwn(SUBJECTS,r.subject)||!Number.isFinite(+r.max)||!Number.isFinite(+r.marks)||r.max<=0||r.marks<0||+r.marks>+r.max))throw Error('The backup contains invalid marks.');
  }
  return data;
}
