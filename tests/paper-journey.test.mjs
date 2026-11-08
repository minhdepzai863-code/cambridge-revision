import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paperJourney} from '../paper-journey.mjs';

const attempt=(id,date,marks,extra={})=>({id,date,marks,max:75,subject:'9709',paper:'11',series:'s',year:2024,scope:'full',...extra});

test('Correction trail compares only chronological full retakes of the exact paper and maximum',()=>{
 const baseline=attempt('baseline','2026-11-01',52);
 const retake=attempt('retake','2026-11-07',68);
 const invalid=[
  attempt('different-session','2026-11-05',73,{series:'w'}),
  attempt('different-variant','2026-11-05',73,{paper:'12'}),
  attempt('different-year','2026-11-05',73,{year:2025}),
  attempt('partial','2026-11-05',73,{scope:'partial'}),
  attempt('different-max','2026-11-05',73,{max:80})
 ];
 const result=paperJourney([baseline,retake,...invalid],[]);
 assert.equal(result.baseline.id,'baseline');
 assert.equal(result.retake.id,'retake');
 assert.equal(result.change,16);
 assert.equal(paperJourney([baseline,{...retake,scope:'partial'}],[]).retake,null);
 assert.equal(paperJourney([baseline,{...retake,date:baseline.date}],[]).retake,null);
});

test('Question marks and linked correction notes do not count the same lost marks twice',()=>{
 const a=attempt('a','2026-11-01',52,{questions:[
  {number:'1(a)',max:8,marks:2,topic:'trig'},{number:'2(b)',max:4,marks:2}
 ]});
 const make=(id,question,lost,extra={})=>({id,question,lost,topic:'algebra',attemptId:'a',...extra});
 const j=paperJourney([a],[
  make('same','Q 1(a)',6,{corrected:true}),make('linked','2(b)',3),
  make('duplicate','Q2(b)',2),make('other','3',4,{attemptId:'elsewhere'})
 ]);
 assert.deepEqual(j.topics,[{topic:'trig',loss:6},{topic:'algebra',loss:2}]);
 assert.equal(j.completed,1);
 assert.equal(j.corrections,3);
});
