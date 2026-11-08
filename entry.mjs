import {accountView,initPaperWalkthrough} from './public-view.mjs';
import {submitAccount} from './account-actions.mjs';

const root=document.getElementById('app');
const accountPaths=new Set(['/login','/signup','/forgot-password','/reset-password']);
const publicHashes=new Set(['','#main','#features','#method','#preview','#cambridge']);
const path=()=>location.pathname.replace(/\/$/,'')||'/';
const needsWorkspace=()=>{
  const hash=new URLSearchParams(location.hash.slice(1));
  return hash.has('access_token')||hash.has('error')||
    (!accountPaths.has(path())&&(path()!=='/'||!publicHashes.has(location.hash)));
};
const escape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

// Browsers can skip a cross-document transition during fast or interrupted navigation.
for(const event of ['pageswap','pagereveal']){
  window.addEventListener(event,({viewTransition})=>viewTransition?.ready.catch(()=>{}));
}

if(needsWorkspace()){
  await import('./app.mjs');
}else{
  const events=new AbortController();
  const options={signal:events.signal};
  let dispose;
  function showAccount(message){
    root.innerHTML=accountView(path(),escape,message);
    if(message)root.querySelector('h1')?.focus();
  }
  if(accountPaths.has(path())){
    if(!root.querySelector('.account-entry'))showAccount('');
  }else{
    let session;
    try{session=JSON.parse(localStorage.getItem('ct-session')||'null');}catch{}
    if(!root.querySelector('.revision-landing')){
      const {renderLanding}=await import('./landing-content.mjs');
      root.innerHTML=renderLanding(Boolean(session));
    }
    if(session){
      root.querySelector('.folio-top a[href="/login"]')?.remove();
      for(const link of root.querySelectorAll('a[data-entry-cta]')){
        link.href='/dashboard';
        link.textContent='Open dashboard';
      }
    }
    dispose=initPaperWalkthrough(root);
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-action="public-theme"]')){
      window.revisionAppearance.set(document.documentElement.dataset.theme==='black'?'blue':'black');
    }
    const menu=event.target.closest('.folio-appearance');
    if(menu&&event.target.closest('a'))menu.open=false;
  },options);
  document.addEventListener('submit',event=>{
    const form=event.target;
    if(form.id!=='account-form')return;
    event.preventDefault();
    void submitAccount(form,showAccount);
  },options);
  window.addEventListener('hashchange',()=>{
    if(!needsWorkspace())return;
    dispose?.();
    events.abort();
    void import('./app.mjs');
  },options);
}
