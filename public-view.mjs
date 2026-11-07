const book = '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 6c-3-3-7-3-10-2v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2zm0 0v15"/></svg>';
const appearance = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16Z" fill="currentColor" stroke="none"/></svg>';
const brand = `<a class="folio-brand" href="/"><span class="folio-mark">${book}</span><span>Cambridge Revision<small>Independent study workspace</small></span></a>`;

const appearanceButton=()=>`<button type="button" class="btn quiet folio-theme" data-action="public-theme" aria-label="Switch light or dark appearance">${appearance}</button>`;
export function publicShell(content, signedIn = false, landing = false) {
  return `<div class="public-folio${landing?' revision-landing':''}"><header class="folio-top"><div class="folio-width">
    ${brand}<nav aria-label="Public navigation">
    ${landing ? '<a class="folio-nav-detail" href="#method">How it works</a><a class="folio-nav-detail" href="#preview">Features</a><a class="folio-nav-detail" href="#cambridge">For Cambridge</a>' : ''}
    ${landing?`<details class="folio-appearance"><summary class="folio-theme" aria-label="Landing page options">${appearance}</summary><div class="folio-appearance-options"><a class="folio-compact-link" href="#method">How it works</a><a class="folio-compact-link" href="#preview">Features</a><a class="folio-compact-link" href="#cambridge">For Cambridge</a>${appearanceButton()}<label><input type="checkbox" data-film-control> Background motion</label></div></details>`:appearanceButton()}
    ${signedIn ? '<a class="btn primary" href="/dashboard">Open dashboard</a>' : `<a class="btn quiet" href="/login">Log in</a><a class="btn primary" href="/signup">${landing?'Start revising':'Get started'}</a>`}
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

function paperScene(stylus = false) {
  return `<div class="demo-sheet-pair">
        <section class="demo-sheet"><h3>Question paper</h3><span class="demo-label">9709/11/M/J/24 · Q1(b)</span>
          <p>Find the real roots:</p>
          <p><span data-demo-ink>3<var>x</var>⁴ − 12<var>x</var>² − 15 = 0<i aria-hidden="true"></i></span></p>
        </section>
        <section class="demo-sheet demo-scheme"><h3>Mark scheme</h3><span class="demo-label">Q1(b) · 3 marks</span>
          <p><var>x</var>² = 5 or −1</p>
          <p class="demo-answer" data-demo-target><var>x</var> = ±√5<i aria-hidden="true"></i></p>
        </section>
        ${stylus?`<svg class="demo-pen" data-demo-pen viewBox="0 0 20 124" aria-hidden="true">
          <path d="M4 8a6 6 0 0 1 12 0v94l-6 21-6-21Z" fill="#e0d9cc" stroke="#fff4e5"/>
          <path d="M5 17h10M5 98h10" fill="none" stroke="#8c8479" stroke-width="2"/>
          <path d="m4 102 6 21 6-21Z" fill="#bcb2a3"/><path d="m8.6 118 1.4 5 1.4-5Z" fill="#202622"/>
        </svg>`:''}
      </div>`;
}

function studyPath() {
  const route = 'M100 85 C185 85 217 39 300 39 S420 78 500 78 S620 26 700 26';
  return `<div class="journey-map">
      <svg viewBox="0 0 800 110" preserveAspectRatio="none" aria-hidden="true">
        <path class="journey-track" d="${route}" />
        <path class="journey-trace" d="${route}" pathLength="1" data-journey-route />
        <circle class="journey-cursor" r="4" transform="translate(700 26)" data-journey-cursor />
      </svg>
      <ol role="tablist" aria-label="Paper walkthrough steps">${demoSteps.map((label,i)=>`<li role="presentation" style="--node-height:${[77,35,71,24][i]}%"><button type="button" role="tab" id="demo-step-${i}" aria-controls="demo-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><span aria-hidden="true">0${i+1}</span>${label}</button></li>`).join('')}</ol>
    </div>`;
}

function tabletPreview() {
  return `<figure class="hero-tablet" aria-label="Sample past paper beside its mark scheme">
    ${paperScene(true)}
  </figure>`;
}

function paperWalkthrough(marksPreview) {
  const scenes = [
    ['Keep your files together.', 'Paper, mark scheme and working.', tabletPreview()],
    ['Record your marks.', 'See marks by question.',
      `<div class="demo-score"><strong>4 / 5</strong><span>80% · Sample partial attempt</span></div>${marksPreview}`],
    ['Find the lost mark.', 'Save a correction by topic.',
      `<dl class="demo-record"><div><dt>Question</dt><dd>Q1(b) · 1 mark lost</dd></div><div><dt>Syllabus topic</dt><dd>Quadratics · Pure Mathematics</dd></div><div><dt>Mistake</dt><dd>I only wrote the positive root.</dd></div><div><dt>Correction</dt><dd>From x² = 5, take both square roots: −√5 and √5.</dd></div></dl>`],
    ['Try it again.', 'Revisit the question when it’s due.',
      `<dl class="demo-record"><div><dt>Review queue</dt><dd>Q1(b) · Quadratics</dd></div><div><dt>Retry prompt</dt><dd>Find both real roots before opening the correction.</dd></div><div><dt>Sample retry result</dt><dd>Correct · −√5 and √5</dd></div></dl>`]
  ];
  return `<section class="landing-walkthrough" id="features">
    <div class="paper-walkthrough" id="method">
      <header><h2>From paper to revision.</h2></header>
      ${studyPath()}
      <div class="walkthrough-frame">
        ${scenes.map(([title,description,scene],index)=>`<section class="walkthrough-panel" role="tabpanel" id="demo-panel-${index}" aria-labelledby="demo-step-${index}" tabindex="0"${index?' hidden':''}>
          <div class="walkthrough-notes"><h3>${title}</h3><p>${description}</p>
          </div><div class="walkthrough-evidence">${scene}</div>
        </section>`).join('')}
      </div>
      <p class="walkthrough-caption">Example: Cambridge International 9709/11, May/June 2024.</p>
    </div>
  </section>`;
}

export function bindPreviewTabs(group, onChange = () => {}) {
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
      if (motion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = incoming?.animate?.([
          {opacity:.45,transform:`translateX(${direction*8}px)`},
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
  const stage = landing.querySelector('.landing-stage');
  const video = stage.querySelector('video');
  const videoControl = landing.querySelector('[data-film-control]');
  const constrainedData = navigator.connection?.saveData === true;
  let filmVisible = stage.getBoundingClientRect().bottom > 0;
  let filmChoice = null;

  function updateFilm() {
    const enabled = filmChoice??(!reduced.matches && !constrainedData);
    videoControl.checked = enabled;
    if (!filmVisible || document.hidden || !enabled) {
      video.pause();
      return;
    }
    if (!video.hasAttribute('src')) video.src = matchMedia('(max-width: 640px)').matches ? video.dataset.mobileSrc : video.dataset.src;
    video.play().catch(()=>{ if (filmVisible && !document.hidden && enabled && filmChoice!==false) videoControl.checked = false; });
  }

  videoControl.addEventListener('change',()=>{
    filmChoice = videoControl.checked;
    updateFilm();
  });
  landing.querySelectorAll('.folio-compact-link').forEach(link=>link.addEventListener('click',()=>{
    link.closest('details').open = false;
  },{signal}));
  reduced.addEventListener('change',()=>{filmChoice=null;updateFilm();scheduleJourney();},{signal});
  document.addEventListener('visibilitychange',updateFilm,{signal});
  const filmObserver = 'IntersectionObserver' in window?new IntersectionObserver(([entry])=>{
    filmVisible=entry.intersectionRatio>=.12;
    updateFilm();
  },{threshold:.12}):null;
  filmObserver?.observe(stage);
  updateFilm();

  const tour = landing.querySelector('.paper-walkthrough');
  bindPreviewTabs(tour,index=>{
    if(index===0)startPenWhenVisible();
    else { penObserver?.disconnect(); stopPen(); }
  });

  const scene = landing.querySelector('.hero-tablet .demo-sheet-pair');
  const pen = scene.querySelector('[data-demo-pen]');
  const underline = scene.querySelector('[data-demo-ink] i');
  const answer = scene.querySelector('[data-demo-target]');
  const highlight = answer.querySelector('i');
  let animations = [];

  function stopPen() {
    animations.forEach(animation=>animation.cancel());
    animations = [];
  }

  function playPen() {
    stopPen();
    if (reduced.matches || !pen.animate) return;
    // Measure inside the tablet so its slight rotation doesn't skew the pen tip.
    const positionInScene = element => {
      let x=0,y=0;
      for(let node=element;node && node!==scene;node=node.offsetParent) {
        x+=node.offsetLeft;
        y+=node.offsetTop;
      }
      return {x,y};
    };
    const width = scene.clientWidth;
    const line = positionInScene(underline);
    const target = positionInScene(answer);
    const x = line.x;
    const y = line.y + 1;
    const lineWidth = underline.offsetWidth;
    const endX = Math.min(width - 12, target.x + answer.offsetWidth + 12);
    const endY = target.y + answer.offsetHeight + 7;
    const pose = (offset, px, py, tilt, opacity, easing='linear') =>
      ({offset,transform:`translate(${px}px,${py}px) rotate(${tilt}deg)`,opacity,easing});
    const arrive = 'cubic-bezier(.2,.75,.25,1)';
    const glide = 'cubic-bezier(.4,0,.2,1)';
    const duration = 3300;
    animations = [
      pen.animate([
        pose(0,width+10,100,-6,1,arrive),
        pose(.22,(width+x)/2,y-22,-24,1,arrive),
        pose(.28,x,y,-21,1),
        pose(.36,x,y,-21,1),
        pose(.53,x+lineWidth,y,-21,1,glide),
        pose(.67,(x+lineWidth+endX)/2,(y+endY)/2-22,-11,1,arrive),
        pose(.79,endX,endY,-15,1),
        pose(.85,endX,endY,-15,1,glide),
        pose(1,width+10,100,-6,1,glide)
      ], {duration,fill:'forwards'}),
      underline.animate([
        {transform:'scaleX(0)',offset:0},{transform:'scaleX(0)',offset:.36},
        {transform:'scaleX(1)',offset:.53},{transform:'scaleX(1)',offset:1}
      ], {duration}),
      highlight.animate([
        {opacity:0,offset:0},{opacity:0,offset:.77,easing:arrive},
        {opacity:1,offset:.87},{opacity:1,offset:1}
      ], {duration})
    ];
  }

  let penObserver;
  function startPenWhenVisible() {
    penObserver?.disconnect();
    if (pen.animate && !reduced.matches && 'IntersectionObserver' in window) {
      penObserver = new IntersectionObserver(([entry])=>{
        if (!scene.isConnected || (entry.isIntersecting && getComputedStyle(scene).visibility==='visible')) {
          penObserver.disconnect();
          if (scene.isConnected) playPen();
        }
      }, {threshold:.55});
      penObserver.observe(scene);
    }
  }
  startPenWhenVisible();

  const map = landing.querySelector('.journey-map');
  const trace = map.querySelector('[data-journey-route]');
  const cursor = map.querySelector('[data-journey-cursor]');
  const length = trace.getTotalLength();
  let frameId = 0;
  let previous = -1;
  function drawJourney() {
    frameId = 0;
    const top = map.getBoundingClientRect().top;
    const height = window.innerHeight;
    const progress = reduced.matches?1:Math.max(0,Math.min(1,(height*.90-top)/(height*.48)));
    if (progress===previous) return;
    previous = progress;
    const point = trace.getPointAtLength(length*progress);
    trace.style.strokeDashoffset = String(1-progress);
    cursor.setAttribute('transform',`translate(${point.x} ${point.y})`);
  }
  function scheduleJourney() {
    if (!frameId) frameId = requestAnimationFrame(drawJourney);
  }
  drawJourney();
  window.addEventListener('scroll',scheduleJourney,{passive:true,signal});
  window.addEventListener('resize',scheduleJourney,{signal});
  return ()=>{
    lifetime.abort();
    filmObserver?.disconnect();
    penObserver?.disconnect();
    cancelAnimationFrame(frameId);
    video.pause();
    stopPen();
  };
}

export function landingView(signedIn, dashboard, marksPreview) {
  const start = signedIn ? '/dashboard' : '/signup';
  return publicShell(`<section class="landing-stage" aria-labelledby="landing-headline">
    <video class="landing-film" aria-hidden="true" autoplay muted loop playsinline preload="none" poster="/assets/alevel-study.jpg" data-src="/assets/alevel-study.mp4" data-mobile-src="/assets/alevel-study-mobile.mp4"></video>
    <div class="folio-width film-content">
      <h1 id="landing-headline">Every paper.<br>Every <em class="hero-ink">improvement<span class="hero-period">.</span><svg viewBox="0 0 360 80" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M327 11 C233 -1 23 1 12 34 C-8 67 166 80 280 65 C350 56 370 30 336 16" /></svg></em></h1>
      <p>Track past papers, marks and corrections for Cambridge AS &amp; A Level.</p>
      <div class="folio-actions"><a class="btn primary" href="${start}">${signedIn?'Open dashboard':'Start revising'}</a><a class="btn hero-tour-link" href="#features">See how it works</a></div>
    </div>
  </section>
    <div class="folio-width landing-content">
      ${paperWalkthrough(marksPreview)}
      <section class="landing-dashboard-section" id="preview">
        <header><h2>See your progress.</h2><p>Example results</p></header>
        <figure class="folio-preview landing-dashboard" aria-label="Example marks, score trend and study activity"><div class="landing-dashboard-body" inert>${dashboard}</div></figure>
      </section>
      <section class="folio-end"><svg class="folio-end-line" viewBox="0 0 450 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90C112 93 187 3 335 0"/></svg><h2>Start with your next paper.</h2><a class="btn primary" href="${start}">${signedIn?'Open dashboard':'Start revising'}</a></section>
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
  </aside><section class="account-form"><h1>${title}</h1><p>${intro}</p>
    ${message ? `<div class="notice" role="status">${esc(message)}</div>` : ''}
    ${reset && !recovery ? '<p>This recovery link is unavailable. Request a new one to continue.</p><a class="btn primary" href="/forgot-password">Request a new link</a>' :
    `<form id="account-form" data-screen="${path}">${reset ? '' : '<label class="field"><span>Email address</span><input type="email" name="email" autocomplete="email" required maxlength="254"></label>'}
    ${forgot ? '' : `<label class="field"><span>${reset ? 'New password' : 'Password'}</span><input type="password" name="password" autocomplete="${signup || reset ? 'new-password' : 'current-password'}" ${signup || reset ? 'minlength="8"' : ''} required></label>`}
    ${reset ? '<label class="field"><span>Confirm password</span><input type="password" name="confirmation" autocomplete="new-password" required minlength="8"></label>' : ''}
    <p class="account-error" role="alert" hidden></p><button class="btn primary" type="submit">${label}</button></form>`}
    <div class="account-links">${path === '/login' ? '<a href="/forgot-password">Forgot password?</a><a href="/signup">Create an account</a>' : '<a href="/login">Back to log in</a>'}</div>
  </section></div>`);
}
