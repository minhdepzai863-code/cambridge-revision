export const SUBJECTS = {'9709':{name:'Mathematics',short:'Maths',color:'#9c83c8',tint:'#efebf8',icon:'math'},'9702':{name:'Physics',short:'Physics',color:'#b67b3e',tint:'#fbefdf',icon:'atom'},'9618':{name:'Computer Science',short:'CS',color:'#718b65',tint:'#e9f0e3',icon:'chip'}};
export const SERIES = {'m':'February/March','s':'May/June','w':'October/November'};
export const CATEGORIES = ['Conceptual misunderstanding','Calculation error','Algebra/sign error','Incorrect formula','Misreading the question','Missing Cambridge mark-scheme keywords','Incomplete working or explanation','Time-management problem','Weak problem-solving/application skills'];
export const COMPONENTS = {
 '9709':{1:['Pure Mathematics 1',75,110,'AS'],2:['Pure Mathematics 2',50,75,'AS'],3:['Pure Mathematics 3',75,110,'A2'],4:['Mechanics',50,75,'AS/A2'],5:['Probability & Statistics 1',50,75,'AS/A2'],6:['Probability & Statistics 2',50,75,'A2']},
 '9702':{1:['Multiple Choice',40,75,'AS'],2:['AS Structured Questions',60,75,'AS'],3:['Advanced Practical Skills',40,120,'AS'],4:['A Level Structured Questions',100,120,'A2'],5:['Planning, Analysis and Evaluation',30,75,'A2']},
 '9618':{1:['Theory Fundamentals',75,90,'AS'],2:['Fundamental Problem-solving and Programming Skills',75,120,'AS'],3:['Advanced Theory',75,90,'A2'],4:['Practical',75,150,'A2']}
};
export const ROUTES = {
 '9709': {'AS: P1 + P2':[1,2],'AS: P1 + P4':[1,4],'AS: P1 + P5':[1,5],'A Level: P1 + P3 + P4 + P5':[1,3,4,5],'A Level: P1 + P3 + P5 + P6':[1,3,5,6]},
 '9702': {'AS: P1 + P2 + P3':[1,2,3],'A Level: P1–P5':[1,2,3,4,5]},
 '9618': {'AS: P1 + P2':[1,2],'A Level: P1–P4':[1,2,3,4]}
};
export const SOURCE_LINKS = {'9709':'https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf','9702':'https://www.cambridgeinternational.org/Images/664565-2025-2027-syllabus.pdf','9618-2026':'https://www.cambridgeinternational.org/Images/697372-2026-syllabus.pdf','9618-2027':'https://www.cambridgeinternational.org/Images/721397-2027-2029-syllabus.pdf'};
export function identifyFilename(name) {
 const m = name.match(/(9709|9702|9618)[_ -]([msw])(\d{2})[_ -](qp|ms|er|gt)[_ -]?(\d{2})?/i);
 if(!m) return null;
 return {subject:m[1],series:m[2].toLowerCase(),year:2000+Number(m[3]),paper:m[5]||'',role:{qp:'Question paper',ms:'Mark scheme',er:'Examiner report',gt:'Grade thresholds'}[m[4].toLowerCase()]};
}
export const component = a => COMPONENTS[a.subject]?.[String(a.paper||'')[0]];
export const paperCode = a => `${a.subject}/${a.paper}/${({m:'F/M',s:'M/J',w:'O/N'})[a.series]||a.series}/${String(a.year).slice(-2)}`;
export const percent = a => a.max>0 && Number.isFinite(+a.marks) ? +((a.marks/a.max)*100).toFixed(2) : null;
export const full = a => a.scope !== 'partial';
export const sum = xs => xs.reduce((s,v)=>s+(+v||0),0);
export const average = xs => xs.length ? sum(xs)/xs.length : null;
export function thresholdFor(a,ts) {
 return ts.filter(t=>t.scope==='component'&&t.subject===a.subject&&String(t.paper)===String(a.paper)&&+t.year===+a.year&&t.series===a.series&&+t.max===+a.max).sort((x,y)=>String(y.updatedAt).localeCompare(String(x.updatedAt)))[0];
}
export function gradeFor(a,ts) {
 if(!full(a)) return {grade:null,label:'Partial attempt · no paper grade'};
 const t=thresholdFor(a,ts);
 if(!t) return {grade:null,label:'Grade boundary unavailable'};
 const grade=['a','b','c','d','e'].find(g=>t.values[g]!==undefined && a.marks>=t.values[g])||'u';
 return {grade,label:`${t.official?'Official component threshold':'Manual component estimate'}: ${grade}`,threshold:t};
}
export function validateAttempt(a) {
 const errors=[];
 if(!SUBJECTS[a.subject]||!COMPONENTS[a.subject]?.[String(a.paper)[0]]||!/^\d{2}$/.test(a.paper)) errors.push('Choose a valid subject, component and two-digit paper code.');
 if(!['m','s','w'].includes(a.series)||!Number.isInteger(+a.year)||a.year<2000||a.year>2100) errors.push('Enter the examination series and year.');
 if(!['AS','A2'].includes(a.level)) errors.push('Select AS or A2.');
 const level=component(a)?.[3]; if(level!=='AS/A2'&&level!==a.level) errors.push('This component does not belong to the selected AS/A2 stage.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||Number.isNaN(Date.parse(a.date))) errors.push('Enter the attempt date.');
 if(!Number.isFinite(+a.marks)||!Number.isFinite(+a.max)||a.max<=0||a.marks<0||a.marks>a.max) errors.push('Marks must be between zero and the available marks.');
 if(a.scope==='partial' && (!(a.paperMax>0)||a.paperMax<a.max)) errors.push('Enter full-paper marks, at least the marks covered by this partial attempt.');
 if(!Number.isFinite(+a.minutes)||a.minutes<0) errors.push('Working time must be zero or more minutes.');
 if(a.elapsedMinutes!=null&&a.elapsedMinutes!==''&&(!Number.isFinite(+a.elapsedMinutes)||a.elapsedMinutes<a.minutes)) errors.push('Elapsed time cannot be shorter than working time.');
 if(a.difficulty<1||a.difficulty>10) errors.push('Difficulty must be from 1 to 10.');
 if((+a.correct)+(+a.partialCorrect)>(+a.questionsAttempted)) errors.push('Correct and partially correct questions cannot exceed questions attempted.');
 for(const q of a.questions||[]) if(!q.number||q.max<=0||q.marks<0||q.marks>q.max) errors.push('Check the question numbers and individual marks.');
 if(new Set((a.questions||[]).map(q=>q.number.trim().toLowerCase())).size!==(a.questions||[]).length) errors.push('Question numbers/subparts must be unique.');
 return [...new Set(errors)];
}
export function questionTotals(a) {return {marks:sum((a.questions||[]).map(q=>q.marks)),max:sum((a.questions||[]).map(q=>q.max))};}
export function stats(attempts,mistakes=[],sessions=[]) {
 const papers=attempts.filter(full), ps=papers.map(percent).filter(x=>x!==null), chron=[...papers].sort((a,b)=>a.date.localeCompare(b.date)||String(a.createdAt).localeCompare(String(b.createdAt)));
 const recent=chron.slice(-3).map(percent), previous=chron.slice(-6,-3).map(percent);
 return {count:papers.length,partial:attempts.length-papers.length,earned:sum(papers.map(a=>a.marks)),available:sum(papers.map(a=>a.max)),avg:average(ps),latest:chron.length?percent(chron.at(-1)):null,best:ps.length?Math.max(...ps):null,avgTime:average(attempts.filter(a=>a.minutes>0).map(a=>a.minutes)),totalTime:sum(attempts.map(a=>a.minutes))+sum(sessions.map(a=>a.minutes)),mistakes:mistakes.length,corrected:mistakes.filter(m=>m.corrected).length,trend:recent.length&&previous.length?average(recent)-average(previous):null};
}
export function topicStats(id,attempts,mistakes,sessions) {
 const qs=attempts.flatMap(a=>(a.questions||[]).filter(q=>q.topic===id).map(q=>({...q,date:a.date}))), practice=sessions.filter(s=>s.topic===id), ms=mistakes.filter(m=>m.topic===id), max=sum(qs.map(q=>q.max))+sum(practice.map(s=>s.max));
 return {attempted:qs.length+practice.length,accuracy:max?100*(sum(qs.map(q=>q.marks))+sum(practice.map(s=>s.marks)))/max:null,lost:sum(qs.map(q=>q.max-q.marks)),repeated:ms.length,last:[...qs.map(q=>q.date),...practice.map(s=>s.date)].sort().at(-1),next:ms.filter(m=>!m.corrected).map(m=>m.retryDate).sort()[0]};
}
export function timerValues(t,now=Date.now()) {return {activeMs:(t.activeMs||0)+(t.running?Math.max(0,now-t.resumedAt):0),elapsedMs:Math.max(0,(t.finishedAt||now)-t.startedAt)};}
export function nextReview(m,rating,today=new Date()) {const step=rating==='again'?0:Math.min((m.reviewStep??-1)+1,3),days=rating==='again'?1:[1,3,7,14][step],d=new Date(today);d.setDate(d.getDate()+days);return {...m,reviewStep:step,retryDate:localDate(d),corrected:rating==='easy',reviewHistory:[...(m.reviewHistory||[]),{date:today.toISOString(),rating}]};}
export function localDate(d=new Date()) {return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function countdown(date,now=Date.now()) {const diff=new Date(date).getTime()-now;return {past:diff<0,days:Math.max(0,Math.floor(diff/86400000)),hours:Math.max(0,Math.floor(diff/3600000)%24),minutes:Math.max(0,Math.floor(diff/60000)%60)};}
export function weightedTotal(subject,parts) {return sum(parts.map(p=>(+p.marks||0)*(subject==='9702'&&+p.component===3?0.75:1)));}
export function validateThreshold(t) {
 if(!SUBJECTS[t.subject]||!t.year||!SERIES[t.series]||t.max<=0) return 'Check subject, year, series and maximum marks.';
 if(t.scope==='component'&&(!/^\d{2}$/.test(t.paper)||!COMPONENTS[t.subject]?.[t.paper[0]]))return 'Enter the exact component and variant, e.g. 12.';
 const order=t.scope==='qualification'&&t.level==='A Level'?['A*','A','B','C','D','E']:['a','b','c','d','e'];let last=Infinity;
 for(const g of order) {const v=t.values[g];if(v===undefined||!Number.isFinite(v)||v<0||v>t.max||v>last)return 'Enter all boundaries in descending order, within the maximum.';last=v;}
 if(t.official&&!(t.sourceUrl?.startsWith('https://www.cambridgeinternational.org/')||t.files?.length))return 'An official threshold needs a Cambridge source URL or attached threshold PDF.';
 return null;
}
