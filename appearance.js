(function (root) {
  'use strict';
  const KEY = 'max-note-appearance-v1';
  const THEMES = Object.freeze({
    moc: {label: 'Mộc xanh', color: '#142b28'},
    bien: {label: 'Biển xanh', color: '#162f51'},
    nang: {label: 'Nắng ấm', color: '#4c3028'},
    tim: {label: 'Tím nhẹ', color: '#33264b'},
    dem: {label: 'Đêm sâu', color: '#0a131c'},
  });
  const DENSITIES = Object.freeze(['relaxed', 'compact']);
  const DEFAULT = Object.freeze({theme: 'moc', density: 'relaxed'});

  function normalizeAppearance(input) {
    const o = input && typeof input === 'object' ? input : {};
    return {
      theme: Object.prototype.hasOwnProperty.call(THEMES, o.theme) ? o.theme : DEFAULT.theme,
      density: DENSITIES.includes(o.density) ? o.density : DEFAULT.density,
    };
  }

  function readStored(storage) {
    try { return normalizeAppearance(JSON.parse(storage.getItem(KEY) || 'null')); }
    catch { return {...DEFAULT}; }
  }

  function applyAppearance(settings, doc) {
    const next = normalizeAppearance(settings);
    doc.documentElement.dataset.theme = next.theme;
    doc.documentElement.dataset.density = next.density;
    const label = doc.getElementById('active-theme-label');
    if (label) label.textContent = THEMES[next.theme].label;
    const select = doc.getElementById('appearance-density');
    if (select) select.value = next.density;
    doc.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === next.theme));
    });
    const meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEMES[next.theme].color);
    return next;
  }

  function init() {
    if (!root.document || !root.location) return;
    let storage;
    try { storage = root.localStorage; }
    catch { applyAppearance(DEFAULT, root.document); return; }
    if (!storage) { applyAppearance(DEFAULT, root.document); return; }
    let state = readStored(storage);
    const params = new URLSearchParams(root.location.search);
    // Only known static theme names can be applied from shareable links.
    const linkedTheme = params.get('theme');
    const linkedDensity = params.get('density');
    if (linkedTheme && Object.prototype.hasOwnProperty.call(THEMES, linkedTheme)) state.theme = linkedTheme;
    if (linkedDensity && DENSITIES.includes(linkedDensity)) state.density = linkedDensity;
    function saveAndApply(patch) {
      state = applyAppearance({...state, ...patch}, root.document);
      try { storage.setItem(KEY, JSON.stringify(state)); }
      catch {
        const status = root.document.getElementById('notice');
        if (status) status.textContent = 'Đã đổi giao diện nhưng trình duyệt không cho lưu lựa chọn này.';
      }
    }
    saveAndApply({});
    root.document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.addEventListener('click', () => saveAndApply({theme: button.dataset.themeChoice}));
    });
    const density = root.document.getElementById('appearance-density');
    if (density) density.addEventListener('change', () => saveAndApply({density: density.value}));
    // Prevent a bookmarked query string from overriding later manual selections on reload.
    if (params.has('theme') || params.has('density')) {
      try {
        const url = new URL(root.location.href);
        url.searchParams.delete('theme'); url.searchParams.delete('density');
        root.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch { /* Cosmetic only. */ }
    }
  }

  root.MaxNoteAppearance = {THEMES, normalizeAppearance, readStored, applyAppearance, init};
  if (root.document) init();
})(typeof window !== 'undefined' ? window : globalThis);