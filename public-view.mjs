const book = '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 6c-3-3-7-3-10-2v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2zm0 0v15"/></svg>';
const appearance = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16Z" fill="currentColor" stroke="none"/></svg>';
const brand = `<a class="folio-brand" href="/"><span class="folio-mark">${book}</span><span>Cambridge Revision<small>Independent study workspace</small></span></a>`;

const appearanceButton=()=>`<button type="button" class="btn quiet folio-theme" data-action="public-theme" aria-label="Switch light or dark appearance">${appearance}</button>`;
export function publicShell(content, signedIn = false, landing = false, accountPath = '') {
  return `<div class="public-folio${landing?' revision-landing':accountPath?' account-entry':''}"><header class="folio-top"><div class="folio-width">
    ${brand}<nav aria-label="Public navigation">
    ${landing ? '<a class="folio-nav-detail" href="#method">How it works</a><a class="folio-nav-detail" href="#preview">Features</a><a class="folio-nav-detail" href="#cambridge">For Cambridge</a>' : ''}
    ${landing?`<details class="folio-appearance"><summary class="folio-theme" aria-label="Landing page options">${appearance}</summary><div class="folio-appearance-options"><a class="folio-compact-link" href="#method">How it works</a><a class="folio-compact-link" href="#preview">Features</a><a class="folio-compact-link" href="#cambridge">For Cambridge</a>${appearanceButton()}<label><input type="checkbox" data-film-control> Animate walkthrough</label></div></details>`:appearanceButton()}
    ${signedIn ? '<a class="btn primary" href="/dashboard">Open dashboard</a>' : `<a class="btn quiet" href="/login"${accountPath==="/login"?' aria-current="page"':''}>Log in</a><a class="btn primary" href="/signup" data-entry-cta${accountPath==="/signup"?' aria-current="page"':''}>Start revising</a>`}
    </nav></div></header>
    <main id="main" tabindex="-1">${content}</main>
    <footer id="cambridge" class="folio-width folio-footer"><span>Cambridge Revision</span><span>Independent tool for Cambridge International AS &amp; A Level. No institutional affiliation.</span><a href="/workspace">Local workspace</a></footer>
  </div>`;
}

// Source: Cambridge International 9709/11, May/June 2024, Q1 and its published mark scheme.
export const demoQuestions = [
  {number:'1(a)',marks:2,max:2,topic:'Quadratics'},
  {number:'1(b)',marks:2,max:3,topic:'Quadratics'}
];
const demoSteps = ['Upload', 'Mark', 'Correct', 'Review'];

function paperWalkthrough({attachments, marks}) {
  const questionMark = '<span class="demo-question-mark"><strong>Q1(b)</strong><span>1 mark lost</span></span>';
  const markedPaper = `<div class="demo-script">
    <div class="demo-script-question">
      <div class="demo-script-meta"><span>Pure Mathematics 1</span><span>Question 1(b)</span></div>
      <p>Find the real roots of</p>
      <div class="demo-script-equation">3<var>x</var>⁴ − 12<var>x</var>² − 15 = 0</div>
    </div>
    <div class="demo-script-margin">
      <span>Sample mark</span><strong>2<small> / 3</small></strong>
      <button type="button" class="text-link" data-demo-mark>See the missed mark <span aria-hidden="true">↗</span></button>
    </div>
  </div>`;
  const scenes = [
    ['Attach the source files', 'Keep the paper, mark scheme and your working together.', `${markedPaper}${attachments}`],
    ['See where the mark went', 'This sample covers two questions from the paper.', `<div class="demo-score"><strong>4 / 5</strong><span>Marks on attempted questions</span></div>${marks}`],
    ['Write the correction', 'Give the lost mark a topic and a reason you can revisit.', `
      ${questionMark}<dl class="demo-record"><div><dt>Topic</dt><dd>Quadratics</dd></div><div><dt>Missed step</dt><dd>I wrote only the positive root.</dd></div><div><dt>Correction</dt><dd>If <var>x</var>² = 5, take both roots: −√5 and √5.</dd></div></dl>`],
    ['Retry from memory', 'Open the correction when you are ready to check your working.', `
      ${questionMark}<div class="demo-retry"><p>Find both real roots of <span>3<var>x</var>⁴ − 12<var>x</var>² − 15 = 0.</span></p><details><summary>Reveal correction</summary><p><var>x</var> = −√5 or √5</p></details></div>`]
  ];
  return `<section class="landing-walkthrough paper-walkthrough" id="features" aria-label="Past-paper walkthrough">
    <header class="demo-mast" id="method">
      <div><span class="paper-reference">9709/11/M/J/24</span><p>Mathematics, May/June 2024</p></div>
      <button type="button" class="btn quiet demo-play" data-demo-play>Play walkthrough</button>
    </header>
    <div class="demo-rail" role="tablist" aria-label="Paper walkthrough steps">${demoSteps.map((label,i)=>`<button type="button" role="tab" id="demo-step-${i}" aria-controls="demo-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><span aria-hidden="true">0${i+1}</span>${label}</button>`).join('')}</div>
    <div class="demo-scenes">
      ${scenes.map(([title, description, scene], index)=>`<section class="demo-scene" role="tabpanel" id="demo-panel-${index}" aria-labelledby="demo-step-${index}" tabindex="0"${index?' hidden':''}>
        <h2>${title}</h2><p>${description}</p><div class="demo-evidence">${scene}</div>
      </section>`).join('')}
    </div>
    <footer class="demo-colophon">Example attempt, Cambridge International 9709/11</footer>
  </section>`;
}

export function bindPreviewTabs(group, onChange = () => {}, allowMotion = () => true) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab=>group.querySelector('#'+tab.getAttribute('aria-controls')));
  let active = tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');
  let animation;
  function select(index,{focus=false,motion=false}={}) {
    if (index!==active) {
      animation?.cancel();
      const direction = index>active?1:-1;
      active = index;
      tabs.forEach((tab,i)=>{
        tab.setAttribute('aria-selected', String(i===index));
        tab.tabIndex = i===index?0:-1;
        panels[i].hidden = i!==index;
      });
      const incoming = panels[index];
      if (motion && allowMotion() && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = incoming?.animate?.([
          {opacity:.8,transform:`translateX(${direction*6}px)`},
          {opacity:1,transform:'translateX(0)'}
        ], {duration:180,easing:'cubic-bezier(.2,.7,.3,1)'});
      }
      onChange(index);
    }
    if (focus) tabs[index].focus({preventScroll:true});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',event=>select(index,{motion:event.detail>0}));
    tab.addEventListener('keydown',event=>{
      const shortcuts={ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1};
      if (!Object.hasOwn(shortcuts,event.key)) return;
      event.preventDefault();
      select(shortcuts[event.key],{focus:true});
    });
  });
  return select;
}

export function initPaperWalkthrough(root) {
  const landing = root.querySelector('.revision-landing');
  if (!landing) return;
  const lifetime = new AbortController();
  const {signal} = lifetime;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tour = landing.querySelector('.paper-walkthrough');
  const control = landing.querySelector('[data-film-control]');
  const play = tour.querySelector('[data-demo-play]');
  const dashboard = landing.querySelector('.landing-progress-detail');
  dashboard?.querySelector('summary').addEventListener('click',event=>{
    if(!event.detail||dashboard.open)return;
    requestAnimationFrame(()=>{
      if(!dashboard.open||dashboard.getBoundingClientRect().bottom<=innerHeight)return;
      dashboard.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
    });
  },{signal});
  const progressHeading = landing.querySelector('#progress-story');
  const reveal = progressHeading && !reduced.matches && typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(entries => {
        if (!entries.some(entry=>entry.isIntersecting)) return;
        progressHeading.classList.add('progress-reveal');
        reveal.disconnect();
      }, {threshold:.6}) : null;
  if (reveal) reveal.observe(progressHeading);
  let active = 0;
  let timer;
  let playing = false;
  let motion = !reduced.matches;
  let fromPlayback = false;

  const select = bindPreviewTabs(tour, index => {
    active = index;
    if (!fromPlayback) stop();
  }, () => motion);
  tour.querySelector('[data-demo-mark]')?.addEventListener('click',event=>{
    select(2,{focus:true,motion:event.detail>0});
  },{signal});

  function stop() {
    clearTimeout(timer);
    playing = false;
    play.textContent = 'Play walkthrough';
  }

  function advance() {
    if (active === demoSteps.length - 1) {
      stop();
      return;
    }
    timer = setTimeout(() => {
      fromPlayback = true;
      select(active + 1, {motion:true});
      fromPlayback = false;
      advance();
    }, active === 0 ? 3000 : 3800);
  }

  play.addEventListener('click', () => {
    if (playing) {
      stop();
      return;
    }
    if (active === demoSteps.length - 1) select(0, {motion:true});
    playing = true;
    play.textContent = 'Pause walkthrough';
    advance();
  }, {signal});

  control.checked = motion;
  control.addEventListener('change', () => { motion = control.checked; }, {signal});
  reduced.addEventListener('change', () => { motion = control.checked = !reduced.matches; stop(); }, {signal});
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); }, {signal});
  tour.addEventListener('focusin', event => {
    if (event.target !== play && playing) stop();
  }, {signal});
  landing.querySelectorAll('.folio-compact-link').forEach(link=>link.addEventListener('click',()=>{
    link.closest('details').open = false;
  },{signal}));
  return () => {
    reveal?.disconnect();
    stop();
    lifetime.abort();
  };
}

export function landingView(signedIn, dashboard, evidence) {
  const start = signedIn ? '/dashboard' : '/signup';
  const action = signedIn ? 'Open dashboard' : 'Start revising';
  return publicShell(`<section class="landing-stage" aria-labelledby="landing-headline">
    <div class="folio-width landing-desk">
      <div class="desk-intro">
        <h1 id="landing-headline">Make lost marks useful.</h1>
        <p>Track Cambridge AS &amp; A Level papers, scores and corrections.</p>
        <div class="folio-actions"><a class="btn primary" href="${start}" data-entry-cta>${action}</a><a class="btn hero-tour-link" href="#features">See how it works</a></div>
      </div>
      ${paperWalkthrough(evidence)}
    </div>
  </section>
  <div class="folio-width landing-content">
    <section class="landing-dashboard-section" id="preview" aria-labelledby="progress-story">
      <header><h2 id="progress-story"><span>Find</span> <span>the</span> <span>lost</span> <span>mark.</span><br><span>Fix</span> <span>it</span> <span>on</span> <span>the</span> <span>retake.</span></h2><p>In Q1(b), missing the negative root cost one mark. Keep that correction alongside your retake of the same paper.</p></header>
      <div class="landing-trail">
        ${evidence.trail}
        <details class="landing-progress-detail">
          <summary>See the dashboard preview</summary>
          <figure class="folio-preview landing-dashboard" aria-label="Example marks, score trend and study activity"><figcaption>Example results</figcaption><div class="landing-dashboard-body" inert>${dashboard}</div></figure>
        </details>
      </div>
    </section>
    <section class="folio-end"><h2>Start with your next paper.</h2><a class="btn primary" href="${start}" data-entry-cta>${action}</a></section>
  </div>`, signedIn, true);
}

const accounts = {
  '/login': ['Log in', 'Open your account to continue your revision.'],
  '/signup': ['Create your account', 'Save papers, study sessions and corrections across devices.'],
  '/forgot-password': ['Reset your password', 'Enter your account email to request a recovery link.'],
  '/reset-password': ['Choose a new password', 'Use at least eight characters.']
};

export function accountView(path, esc, message = '', recovery = false) {
  const [title, intro] = accounts[path];
  const signup = path === '/signup', forgot = path === '/forgot-password', reset = path === '/reset-password';
  const label = forgot ? 'Send recovery link' : reset ? 'Save new password' : title;
  return publicShell(`<div class="folio-width account-layout"><aside class="account-aside">
    <div class="folio-mark">${book}</div><h2>Keep your place.</h2>
    <p>Your papers, marks and revision plans are ready when you return.</p>
    <ul><li>Paper library</li><li>Study plan</li><li>Review queue</li></ul>
  </aside><section class="account-form"><h1 tabindex="-1">${title}</h1><p>${intro}</p>
    ${message ? `<div class="notice" role="status">${esc(message)}</div>` : ''}
    ${reset && !recovery ? '<p>This recovery link is unavailable. Request a new one to continue.</p><a class="btn primary" href="/forgot-password">Request a new link</a>' :
    `<form id="account-form" data-screen="${path}">${reset ? '' : '<label class="field"><span>Email address</span><input type="email" name="email" autocomplete="email" required maxlength="254"></label>'}
    ${forgot ? '' : `<label class="field"><span>${reset ? 'New password' : 'Password'}</span><input type="password" name="password" autocomplete="${signup || reset ? 'new-password' : 'current-password'}" ${signup || reset ? 'minlength="8"' : ''} required></label>`}
    ${reset ? '<label class="field"><span>Confirm password</span><input type="password" name="confirmation" autocomplete="new-password" required minlength="8"></label>' : ''}
    <p class="account-error" role="alert" hidden></p><button class="btn primary" type="submit">${label}</button></form>`}
    <div class="account-links">${path === '/login' ? '<a href="/forgot-password">Forgot password?</a><a href="/signup">Create an account</a>' : '<a href="/login">Back to log in</a>'}</div>
  </section></div>`, false, false, path);
}
