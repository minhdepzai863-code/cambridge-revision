import test from 'node:test';
import assert from 'node:assert/strict';

const owner='a54180be-48bc-456b-99ba-5c0cd5e4557b';
let values=new Map();
globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
const {store,loadRecords}=await import('../store.mjs');
function session(access='expired-test-token',expires=0){return {access_token:access,refresh_token:'test-refresh-token',expires_at:expires,user:{id:owner}};}
function setup(s=session()){values=new Map([['ct-mode','cloud'],['ct-session',JSON.stringify(s)]]);store.mode='cloud';store.session=structuredClone(s);store.records=[];}

test('Concurrent cloud reads refresh an expired session once',async()=>{
  setup();let refreshes=0,reads=0;
  globalThis.fetch=async(url,options)=>{
    if(url.includes('/auth/v1/token')){refreshes++;return new Response(JSON.stringify({...session('refreshed-test-token'),expires_in:3600}));}
    reads++;assert.equal(options.headers.Authorization,'Bearer refreshed-test-token');return new Response('[]');
  };
  await Promise.all([loadRecords(),loadRecords()]);
  assert.equal(refreshes,1);assert.equal(reads,2);
  assert.ok(JSON.parse(values.get('ct-session')).expires_at>Date.now()/1000);
});
test('A tab adopts a newer session refreshed by a sibling tab',async()=>{
  setup();values.set('ct-session',JSON.stringify(session('sibling-test-token',Math.floor(Date.now()/1000)+3600)));
  globalThis.fetch=async(url,options)=>{assert.ok(!url.includes('/auth/'));assert.equal(options.headers.Authorization,'Bearer sibling-test-token');return new Response('[]');};
  await loadRecords();assert.equal(store.session.access_token,'sibling-test-token');
});
test('Account changes in another tab stop stale authenticated requests',async()=>{
  setup();values.set('ct-session',JSON.stringify({...session(),user:{id:'c5e9a393-a4d8-4b65-bd7d-1a53ee0fce44'}}));
  globalThis.fetch=async()=>{assert.fail('No request should use the previous account.');};
  await assert.rejects(loadRecords(),/account changed/);
});
test('Signing out in another tab prevents reuse of an in-memory token',async()=>{
  setup(session('still-unexpired-test-token',Math.floor(Date.now()/1000)+3600));values.delete('ct-session');
  globalThis.fetch=async()=>{assert.fail('No request should be sent after sign-out.');};
  await assert.rejects(loadRecords(),/Sign in/);
});
