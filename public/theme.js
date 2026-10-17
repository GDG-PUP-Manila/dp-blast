(() => {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('dpblast-theme'); } catch {}
  const apply = theme => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      button.innerHTML = theme === 'dark'
        ? '<span aria-hidden="true">☀</span><span class="max-sm:sr-only"> Light</span>'
        : '<span aria-hidden="true">☾</span><span class="max-sm:sr-only"> Dark</span>';
    });
  };
  apply(preference === 'dark' || preference === 'light' ? preference : system.matches ? 'dark' : 'light');
  system.addEventListener('change', () => {
    if (preference !== 'dark' && preference !== 'light') apply(system.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('dpblast-theme', preference); } catch {}
        apply(preference);
      });
    });
  });
  // Shared focus lifecycle for the two dialogs.
  window.dpblastDialogFocus = (dialog, returnFocus = document.activeElement) => {
    const previous = returnFocus;
    const siblings = [...document.body.children].filter(el => el !== dialog && !el.contains(dialog));
    const inertStates = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    const focusable = () => [...dialog.querySelectorAll('button, input, textarea, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const onKey = event => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', onKey);
    focusable()[0]?.focus();
    return () => {
      dialog.removeEventListener('keydown', onKey);
      siblings.forEach((el, i) => { el.inert = inertStates[i]; });
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  };
})();
