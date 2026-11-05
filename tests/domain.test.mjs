import test from 'node:test';
import assert from 'node:assert/strict';
import {identifyFilename,gradeFor,validateAttempt,validateThreshold,stats,timerValues,nextReview,weightedTotal} from '../domain.mjs';

const attempt={subject:'9709',paper:'12',year:2026,series:'s',level:'AS',date:'2026-11-05',scope:'full',marks:60,max:75,minutes:90,elapsedMinutes:100,difficulty:5,correct:3,partialCorrect:1,questionsAttempted:4,questions:[]};
const threshold={scope:'component',subject:'9709',paper:'12',year:2026,series:'s',max:75,official:false,values:{a:60,b:50,c:40,d:30,e:20}};
test('Recognizes Cambridge file metadata without inventing provenance',()=>{
  assert.deepEqual(identifyFilename('9709_s26_qp_12.pdf'),{subject:'9709',series:'s',year:2026,paper:'12',role:'Question paper'});
  assert.equal(identifyFilename('my-notes.pdf'),null);
});
test('Grades only complete attempts against matching component thresholds',()=>{
  assert.equal(gradeFor(attempt,[threshold]).grade,'a');
  assert.equal(gradeFor({...attempt,scope:'partial'},[threshold]).grade,null);
  assert.equal(gradeFor({...attempt,paper:'13'},[threshold]).grade,null);
  assert.equal(gradeFor({...attempt,year:2027},[threshold]).grade,null);
});
test('Rejects impossible marks and duplicate question parts',()=>{
  assert.deepEqual(validateAttempt(attempt),[]);
  assert.ok(validateAttempt({...attempt,marks:76}).length);
  assert.ok(validateAttempt({...attempt,questions:[{number:'1a',marks:2,max:3},{number:'1A',marks:1,max:3}]}).some(e=>e.includes('unique')));
  assert.ok(validateAttempt({...attempt,elapsedMinutes:80}).some(e=>e.includes('Elapsed')));
});
test('Threshold validation requires descending marks and official evidence',()=>{
  assert.equal(validateThreshold(threshold),null);
  assert.ok(validateThreshold({...threshold,values:{...threshold.values,b:65}}));
  assert.ok(validateThreshold({...threshold,official:true}));
});
test('Full paper statistics exclude partial scores while counting all focus time',()=>{
  const result=stats([attempt,{...attempt,scope:'partial',marks:1,max:5,minutes:10}],[],[{minutes:15}]);
  assert.equal(result.count,1);assert.equal(result.partial,1);assert.equal(result.avg,80);assert.equal(result.totalTime,115);
  assert.equal(stats([]).avg,null);
});
test('Paused timer preserves active time while elapsed time continues',()=>{
  assert.deepEqual(timerValues({activeMs:2000,running:false,startedAt:1000},6000),{activeMs:2000,elapsedMs:5000});
  assert.deepEqual(timerValues({activeMs:2000,running:true,resumedAt:5000,startedAt:1000},6000),{activeMs:3000,elapsedMs:5000});
});
test('Spaced review schedules another attempt and retains history',()=>{
  const today=new Date(2026,10,5,12);
  const reviewed=nextReview({reviewStep:1,reviewHistory:[]},'again',today);
  assert.equal(reviewed.retryDate,'2026-11-06');assert.equal(reviewed.corrected,false);assert.equal(reviewed.reviewHistory.length,1);
  assert.equal(nextReview({},'easy',today).corrected,true);
});
test('Physics practical component receives its syllabus weight',()=>{
  assert.equal(weightedTotal('9702',[{component:1,marks:40},{component:3,marks:40}]),70);
  assert.equal(weightedTotal('9709',[{component:1,marks:75},{component:4,marks:50}]),125);
});

test('Form values accept optional elapsed time and add question counts numerically',()=>{
 assert.deepEqual(validateAttempt({...attempt,elapsedMinutes:'',correct:'3',partialCorrect:'1',questionsAttempted:'4'}),[]);
 assert.ok(validateAttempt({...attempt,correct:'3',partialCorrect:'2',questionsAttempted:'4'}).some(e=>e.includes('questions attempted')));
});
