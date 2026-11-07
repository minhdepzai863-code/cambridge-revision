const book = '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 6c-3-3-7-3-10-2v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2zm0 0v15"/></svg>';
const appearance = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16Z" fill="currentColor" stroke="none"/></svg>';
const brand = `<a class="folio-brand" href="/"><span class="folio-mark">${book}</span><span>Cambridge Revision<small>Independent study workspace</small></span></a>`;

export function publicShell(content, signedIn = false, landing = false) {
  return `<div class="public-folio"><header class="folio-top"><div class="folio-width">
    ${brand}<nav aria-label="Public navigation">
    ${landing ? '<a class="folio-nav-detail" href="#features">Features</a><a class="folio-nav-detail" href="#method">How it works</a>' : ''}
    <button type="button" class="btn quiet folio-theme" data-action="public-theme" aria-label="Switch light or dark appearance">${appearance}</button>
    ${signedIn ? '<a class="btn primary" href="/dashboard">Open dashboard</a>' : '<a class="btn quiet" href="/login">Log in</a><a class="btn primary" href="/signup">Get started</a>'}
    </nav></div></header>
    <main id="main" tabindex="-1">${content}</main>
    <footer class="folio-width folio-footer"><span>Cambridge Revision</span><span>Independent tool for Cambridge International AS &amp; A Level. No institutional affiliation.</span><a href="/workspace">Local workspace</a></footer>
  </div>`;
}

export function landingView(signedIn) {
  const start = signedIn ? '/dashboard' : '/signup';
  return publicShell(`<div class="folio-width">
    <section class="folio-hero">
      <div class="folio-intro">
        <h1>Every paper.<br>Every improvement.</h1>
        <p class="folio-edition">Cambridge International AS &amp; A Level revision</p>
        <p>Bring your past papers, marks and corrections together. See where you stand and decide what to study next.</p>
        <div class="folio-actions"><a class="btn primary" href="${start}">Start revising</a><a class="btn" href="#features">Explore features</a></div>
        <a class="folio-local" href="/workspace">Use on this device without an account</a>
      </div>
      <figure class="folio-archive">
        <img src="/assets/pepys-library.jpg" alt="Historic photograph of the Pepys Library bookcases and reading desks" width="1280" height="898" fetchpriority="high">
        <figcaption><span>The Pepys Library, Cambridge</span><a href="https://commons.wikimedia.org/wiki/File:Pepys_Library_Cambridge_interior.jpg">1899 archive photograph</a></figcaption>
      </figure>
    </section>
    <section class="folio-method" id="method" aria-label="How it works">
      <article><span>01</span><div><h2>Log the paper</h2><p>Keep the question paper, mark scheme and your working together.</p></div></article>
      <article><span>02</span><div><h2>Find the lost marks</h2><p>Record scores by component and link errors to syllabus topics.</p></div></article>
      <article><span>03</span><div><h2>Return to the question</h2><p>Use corrections, bookmarks and spaced review to plan the next session.</p></div></article>
    </section>
    <section class="folio-tour" id="features">
      <div class="folio-tour-intro"><h2>One paper. A record of what changed.</h2><p>Compare attempts in the same place you keep the paper, mark scheme and your working. When you’re ready to revisit a question, the correction is there too.</p></div>
      <figure class="folio-preview" aria-labelledby="sample-caption">
        <figcaption id="sample-caption"><span>${book} Revision workspace</span><span>Example data</span></figcaption>
        <div class="folio-preview-body">
          <div class="folio-preview-heading"><div><p>Mathematics / 9709</p><h2>Paper record</h2></div><span class="folio-preview-tag">Paper 12</span></div>
          <div class="folio-preview-score"><div><strong>84%</strong><span>Latest attempt</span></div><div><strong>+12</strong><span>Percentage points</span></div></div>
          <svg viewBox="0 0 420 95" class="folio-preview-chart" role="img" aria-label="Example scores of 72, 77 and 84 percent"><path d="M10 23H410M10 52H410M10 81H410" stroke="var(--line)"/><path d="M22 70L210 51 398 25" stroke="var(--chart-high)" stroke-width="2.5" fill="none"/><g fill="var(--chart-high)"><circle cx="22" cy="70" r="4"/><circle cx="210" cy="51" r="4"/><circle cx="398" cy="25" r="4"/></g></svg>
          <div class="folio-preview-row"><span>9709/12/M/J/24</span><strong>63 / 75</strong><span>Latest</span></div>
          <div class="folio-preview-row"><span>9709/12/M/J/24</span><strong>54 / 75</strong><span>First attempt</span></div>
          <div class="folio-preview-note"><span>Next review</span><strong>Q6 · Differentiation</strong></div>
        </div>
      </figure>
    </section>
    <section class="folio-features">
      <header><h2>Follow the evidence.</h2><p>Build a record you can use when deciding what to revise next.</p></header>
      <dl><div><dt>Past papers and attachments</dt><dd>Group files by paper and compare repeat attempts without losing earlier scores.</dd></div>
      <div><dt>Marks and progress</dt><dd>Read score trends by subject and component, alongside time spent and topics that cost marks.</dd></div>
      <div><dt>Mistakes and bookmarks</dt><dd>Keep corrections and deliberately saved questions in separate lists.</dd></div>
      <div><dt>Study plan and exams</dt><dd>Plan sessions around dates confirmed by your centre, with due reviews and recent activity in view.</dd></div></dl>
      <figure class="folio-print"><img src="/assets/cambridge-library-etching.jpg" width="1280" height="944" loading="lazy" alt="Thomas Rowlandson’s 1809 print showing readers among the Cambridge library shelves"><figcaption><a href="https://www.metmuseum.org/art/collection/search/786809">Thomas Rowlandson, Cambridge public library, 1809. The Metropolitan Museum of Art.</a></figcaption></figure>
    </section>
    <section class="folio-end"><div><h2>Start with your next paper.</h2><p>Choose your subjects and set up a workspace for the exams you’re preparing for.</p></div><a class="btn primary" href="${start}">Start revising</a></section>
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
