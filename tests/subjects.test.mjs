import test from 'node:test';
import assert from 'node:assert/strict';
import {SUBJECTS,DEFAULT_SUBJECTS,workspaceSubjects,COMPONENTS,ROUTES,identifyFilename,validateAttempt,weightedTotal} from '../domain.mjs';
import {TOPICS,topicsFor,syllabusSource} from '../syllabus.mjs';
import {validateBackup} from '../backup.mjs';

test('Existing workspaces retain three defaults and add saved STEM subjects without duplicates',()=>{
 assert.deepEqual(workspaceSubjects(),DEFAULT_SUBJECTS);
 const settings={kind:'settings',subjects:['9231','9231','invalid'],routes:{'9709':'AS: P1 + P2'},year:2026};
 assert.deepEqual(workspaceSubjects([settings,{kind:'attempt',subject:'9701'}]),['9231']);
 assert.deepEqual(workspaceSubjects([{kind:'attempt',subject:'9701'}]),[...DEFAULT_SUBJECTS,'9701']);
 assert.equal(settings.year,2026);
 assert.equal(settings.routes['9709'],'AS: P1 + P2');
});
test('Removing subjects, including every default, preserves saved work for later re-adding',()=>{
 const paper={kind:'attempt',subject:'9709',marks:60,max:75};
 const topic={kind:'topic',subject:'9709',topicId:'9709:1.1',confidence:4};
 const records=[{kind:'settings',subjects:['9702']},paper,topic];
 assert.deepEqual(workspaceSubjects(records),['9702']);
 records[0].subjects=[];
 assert.deepEqual(workspaceSubjects(records),[]);
 records[0].subjects=['9709'];
 assert.deepEqual(workspaceSubjects(records),['9709']);
 assert.equal(records[1],paper);
 assert.equal(records[2].confidence,4);
});
test('Further Mathematics covers every numbered heading and permitted AS/A Level route',()=>{
 assert.equal(topicsFor('9231').length,24);
 assert.equal(TOPICS.find(t=>t.id==='9231:4.5').title,'Probability generating functions');
 assert.equal(topicsFor('9231','AS',ROUTES['9231']['AS: P1 + P3']).length,13);
 assert.equal(topicsFor('9231','AS',ROUTES['9231']['AS: P1 + P4']).length,12);
 assert.ok(topicsFor('9231','AS').every(t=>t.component!==2));
 assert.ok(topicsFor('9231','A2').some(t=>t.component===3));
 assert.equal(weightedTotal('9231',[1,2,3,4].map(component=>({component,marks:COMPONENTS['9231'][component][1]}))),250);
});
test('Chemistry and Biology include their numbered topics and practical skills at the correct stages',()=>{
 for(const [subject,count,lastAS,firstA2] of [['9701',90,'22.2','23.1'],['9700',44,'11.2','12.1']]){
  assert.equal(topicsFor(subject).filter(t=>!String(t.group).startsWith('P')).length,count);
  assert.equal(TOPICS.find(t=>t.id===`${subject}:${lastAS}`).level,'AS');
  assert.equal(TOPICS.find(t=>t.id===`${subject}:${firstA2}`).level,'A2');
  assert.ok(topicsFor(subject,'AS',[3]).some(t=>t.id===`${subject}:P3.3.3`));
  assert.ok(topicsFor(subject,'A2',[5]).some(t=>t.id===`${subject}:P5.2.3`));
  assert.equal(weightedTotal(subject,[1,2,3].map(component=>({component,marks:COMPONENTS[subject][component][1]}))),130);
  assert.equal(weightedTotal(subject,[1,2,3,4,5].map(component=>({component,marks:COMPONENTS[subject][component][1]}))),260);
 }
});
test('Added subjects support paper recognition, validation and backup restoration',()=>{
 const record={id:'f180ec1f-658c-4d37-9779-41db8f8ac21a',kind:'attempt',paper:'12',year:2026,series:'s',level:'AS',date:'2026-11-05',scope:'full',marks:35,max:40,minutes:70,difficulty:5};
 for(const subject of ['9231','9701','9700']){
  assert.equal(identifyFilename(`${subject}_s26_qp_12.pdf`).subject,subject);
  assert.deepEqual(validateAttempt({...record,subject}),[]);
  assert.equal(validateBackup({app:'cambridge-revision',version:1,records:[{...record,subject}],files:[]}).records[0].subject,subject);
  assert.ok(syllabusSource(subject,2026).startsWith('https://www.cambridgeinternational.org/Images/'));
 }
 const settings={id:record.id,kind:'settings',subjects:['9231','9701'],routes:{'9231':'AS: P1 + P4'},year:2027};
 const manifest={app:'cambridge-revision',version:1,records:[settings],files:[]};
 assert.equal(validateBackup(manifest).records[0].subjects.length,2);
 assert.throws(()=>validateBackup({...manifest,records:[{...settings,subjects:['invalid']}]}),/subject selection/);
 for(const subject of Object.keys(SUBJECTS))for(const route of Object.values(ROUTES[subject]))assert.ok(route.every(c=>COMPONENTS[subject][c]));
});
