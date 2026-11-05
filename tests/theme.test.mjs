import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../theme.js',import.meta.url),'utf8');
function setup(saved={},dark=false,blocked=false){
  const values=new Map(Object.entries(saved));let listener;
  const media={matches:dark,addEventListener(_event,fn){listener=fn;}};
  const context={window:{},document:{documentElement:{dataset:{}},querySelector:()=>({setAttribute(){}})},localStorage:{getItem(k){if(blocked)throw Error('blocked');return values.get(k);},setItem(k,v){if(blocked)throw Error('blocked');values.set(k,v);}},matchMedia:()=>media};
  runInNewContext(source,context);return {context,values,media,change:()=>listener()};
}
test('Saved black mode and disabled grid apply before the app starts',()=>{
  const {context}=setup({'ct-theme':'black','ct-grid':'off'});
  assert.equal(context.document.documentElement.dataset.theme,'black');assert.equal(context.document.documentElement.dataset.grid,'off');
});
test('Appearance choices persist, while invalid theme names are ignored',()=>{
  const {context,values}=setup();context.window.revisionAppearance.set('white',false);
  assert.equal(values.get('ct-theme'),'white');assert.equal(values.get('ct-grid'),'off');
  context.window.revisionAppearance.set('invalid');assert.equal(context.window.revisionAppearance.theme,'white');
});
test('Device theme follows preference changes without replacing an explicit choice',()=>{
  const {context,media,change}=setup({'ct-theme':'system'},true);
  assert.equal(context.document.documentElement.dataset.theme,'black');
  media.matches=false;change();assert.equal(context.document.documentElement.dataset.theme,'white');
  context.window.revisionAppearance.set('current');media.matches=true;change();assert.equal(context.document.documentElement.dataset.theme,'current');
});
test('Unavailable browser storage does not prevent appearance controls working',()=>{
  const {context}=setup({},false,true);context.window.revisionAppearance.set('black');
  assert.equal(context.document.documentElement.dataset.theme,'black');
});
test('New workspaces start with the readable blue palette',()=>{
  assert.equal(setup().context.document.documentElement.dataset.theme,'blue');
});
test('Blue and Paper choices persist across page loads',()=>{
  for(const theme of ['blue','paper'])assert.equal(setup({'ct-theme':theme}).context.document.documentElement.dataset.theme,theme);
});
