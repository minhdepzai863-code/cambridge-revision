// Apply before the stylesheet paints, so a saved dark workspace never flashes white.
(() => {
  let theme = 'blue', grid = true;
  try {
    const saved = localStorage.getItem('ct-theme');
    if (['blue', 'paper', 'current', 'white', 'black', 'system'].includes(saved)) theme = saved;
    grid = localStorage.getItem('ct-grid') !== 'off';
  } catch { /* Browser storage may be unavailable; the workspace still renders. */ }
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    document.documentElement.dataset.theme = theme === 'system' ? (dark.matches ? 'black' : 'white') : theme;
    document.documentElement.dataset.grid = grid ? 'on' : 'off';
    document.documentElement.dataset.appearance = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', document.documentElement.dataset.theme === 'black' ? '#202923' : theme === 'current' ? '#f6f7f1' : theme === 'paper' ? '#faf5e9' : '#f7faff');
  };
  window.revisionAppearance = {
    get theme() { return theme; },
    get grid() { return grid; },
    set(nextTheme, nextGrid = grid) {
      if (!['blue', 'paper', 'current', 'white', 'black', 'system'].includes(nextTheme)) return;
      theme = nextTheme;
      grid = Boolean(nextGrid);
      try {
        localStorage.setItem('ct-theme', theme);
        localStorage.setItem('ct-grid', grid ? 'on' : 'off');
      } catch { /* Keep the choice for this page when storage is blocked. */ }
      apply();
    }
  };
  dark.addEventListener('change', () => { if (theme === 'system') apply(); });
  apply();
})();
