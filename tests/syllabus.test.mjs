import test from 'node:test';
import assert from 'node:assert/strict';
import {TOPICS,topicsFor,syllabusSource} from '../syllabus.mjs';
import {ROUTES,COMPONENTS,weightedTotal} from '../domain.mjs';
test('Mathematics covers the 38 numbered syllabus headings and all permitted routes',()=>{
  assert.equal(TOPICS.filter(t=>t.subject==='9709').length,38);
  assert.equal(Object.keys(ROUTES['9709']).length,5);
  for(const route of Object.values(ROUTES['9709']))assert.ok(route.every(c=>COMPONENTS['9709'][c]));
  assert.equal(weightedTotal('9709',ROUTES['9709']['A Level: P1 + P3 + P4 + P5'].map(component=>({component,marks:COMPONENTS['9709'][component][1]}))),250);
});
test('Physics includes fundamental particles and detailed practical skills',()=>{
  assert.equal(TOPICS.find(t=>t.id==='9702:11.2').title,'Fundamental particles');
  assert.ok(TOPICS.find(t=>t.id==='9702:P3.3.3').title.includes('uncertainties'));
  assert.ok(TOPICS.find(t=>t.id==='9702:P5.1.4').title.includes('safety'));
  assert.equal(TOPICS.find(t=>t.id==='9702:5.3').supplementary,true);
});
test('Computer Science advanced algorithms are assessed in both Papers 3 and 4',()=>{
  for(const component of [3,4])assert.ok(topicsFor('9618','A2',[component]).some(t=>t.id==='9618:19.2'));
  assert.notEqual(syllabusSource('9618',2026),syllabusSource('9618',2027));
  assert.equal(TOPICS.filter(t=>t.subject==='9618').length,44);
});
test('Topic IDs stay unique and AS filters exclude A2-only topics',()=>{
  assert.equal(new Set(TOPICS.map(t=>t.id)).size,TOPICS.length);
  assert.ok(topicsFor('9709','AS').every(t=>t.level!=='A2'));
});
