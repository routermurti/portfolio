(() => {
  'use strict';
  const content = window.RmContent;
  if (!content) return;
  const supported = ['tr', 'en', 'de', 'es'];
  const getSaved = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const locale = (navigator.languages?.[0] || navigator.language || 'tr').slice(0, 2).toLowerCase();
  let language = getSaved('rm-lang');
  if (!supported.includes(language)) language = supported.includes(locale) ? locale : 'en';
  const selector = document.getElementById('lang');
  const themeButton = document.getElementById('theme');
  const savedTheme = getSaved('rm-theme');
  if (['light', 'dark'].includes(savedTheme)) document.documentElement.dataset.theme = savedTheme;

  function t(key, values = {}) {
    let value = content[language]?.[key] || content.tr[key] || key;
    for (const [name, replacement] of Object.entries(values)) value = value.replaceAll('{' + name + '}', String(replacement));
    return value;
  }
  window.RmUi = Object.freeze({ t, language: () => language });
  function applyLanguage() {
    document.documentElement.lang = language;
    if (selector) selector.value = language;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-placeholder]').forEach(el => { el.placeholder = t(el.dataset.placeholder); });
    document.querySelectorAll('[data-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.aria)); });
    const titles = { 'index.html': 'engineEyebrow', 'services.html': 'servicesTitle', 'portfolio.html': 'v3.pr', 'process.html': 'processTitle', 'contact.html': 'İletişim', 'code-center.html': 'Kod Merkezi' };
    document.title = 'Router Murti | ' + t(titles[document.body.dataset.page] || 'Ana Sayfa');
    document.dispatchEvent(new Event('rm:language'));
  }
  selector?.addEventListener('change', () => { language = supported.includes(selector.value) ? selector.value : 'tr'; save('rm-lang', language); applyLanguage(); });
  themeButton?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#F1F5E9' : '#19231D');
    save('rm-theme', next);
  });
  if (savedTheme === 'light') document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F1F5E9');
  applyLanguage();

  const foundersCopy = {
    tr: { title: 'İlk 50 İş Ortağımız', note: 'İlk 50 iş ortağı için ayrılan alanı görüntüle', empty: 'Henüz yayımlanan isim yok', message: 'Bu alan, birlikte ürettiğimiz işlerin ve kurduğumuz güvenin küçük bir hatırası olacak. Router Murti’ye ilk güvenen 50 iş ortağımız burada kendi hikâyesiyle yer alacak. Henüz isim eklenmedi; bu alanın ilk hikâyesini birlikte yazacağız.', cta: 'İlk 50 arasında yer almak için Telegram’dan yaz ↗' },
    en: { title: 'My first 50 partners', note: 'A reserved space for my first 50 partners', empty: 'No names published yet', message: 'The partner seat is still empty. I set up the button; now it is your turn 🙂', cta: 'Looking for a partner 🙂 Be first — write ↗' },
    de: { title: 'Meine ersten 50 Partner', note: 'Ein reservierter Bereich für meine ersten 50 Partner', empty: 'Noch keine Namen veröffentlicht', message: 'Der Partnerplatz ist noch frei. Den Knopf habe ich schon aufgestellt; jetzt bist du dran 🙂', cta: 'Partner gesucht 🙂 Sei der Erste — schreib mir ↗' },
    es: { title: 'Mis primeros 50 socios', note: 'Un espacio reservado para mis primeros 50 socios', empty: 'Todavía no hay nombres publicados', message: 'El puesto de socio sigue libre. Yo puse el botón; ahora te toca a ti 🙂', cta: 'Busco socio 🙂 Sé el primero — escribe ↗' }
  };
  function updateFoundersDock() {
    const dock = document.querySelector('.founders-dock');
    if (!dock) return;
    const copy = foundersCopy[language] || foundersCopy.tr;
    dock.querySelectorAll('[data-i18n="x.foundDock"]').forEach(el => { el.textContent = copy.title; });
    const note = dock.querySelector('[data-i18n="x.foundDockNote"]'); if (note) note.textContent = copy.note;
    const empty = dock.querySelector('.founders-dock-kicker'); if (empty) empty.textContent = copy.empty;
    const message = dock.querySelector('.founders-dock-message'); if (message) message.textContent = copy.message;
    const cta = dock.querySelector('[data-i18n="x.openFounders"]');
    if (cta) { cta.textContent = copy.cta; cta.href = 'https://t.me/routermurti'; cta.target = '_blank'; cta.rel = 'noopener noreferrer'; }
  }
  updateFoundersDock();
  document.addEventListener('rm:language', updateFoundersDock);

  const menu = document.querySelector('[data-menu]');
  const nav = document.getElementById('main-nav');
  function closeMenu() { nav?.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); }
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });

  document.querySelectorAll('[data-accordion]').forEach(group => {
    group.querySelectorAll(':scope > details').forEach(detail => detail.addEventListener('toggle', () => {
      if (detail.open) group.querySelectorAll(':scope > details').forEach(other => { if (other !== detail) other.open = false; });
    }));
  });

  document.querySelectorAll('[data-process]').forEach(group => {
    const steps = group.querySelectorAll('[data-step]');
    const panels = group.querySelectorAll('.process-panel');
    const play = group.querySelector('[data-play]');
    const progress = group.querySelector('progress');
    let current = 0, timer = null;
    function stop() { clearInterval(timer); timer = null; play.textContent = t('play'); }
    function show(index) {
      current = index;
      steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
      panels.forEach((panel, i) => { panel.hidden = i !== current; });
      progress.value = current + 1;
    }
    steps.forEach(button => button.addEventListener('click', () => { stop(); show(Number(button.dataset.step)); }));
    play.addEventListener('click', () => {
      if (timer !== null) { stop(); return; }
      if (current === panels.length - 1) show(0);
      play.textContent = t('pause');
      timer = setInterval(() => { show(current + 1); if (current === panels.length - 1) stop(); }, 6000);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    document.addEventListener('rm:language', stop);
    window.addEventListener('pagehide', stop);
  });

  const help = document.querySelector('[data-help]');
  const info = document.getElementById('contact-info');
  help?.addEventListener('click', () => { info.hidden = !info.hidden; help.setAttribute('aria-expanded', String(!info.hidden)); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && info && !info.hidden) { info.hidden = true; help.setAttribute('aria-expanded', 'false'); help.focus(); } });

  // A native dialog provides focus containment, Escape, and a visible close button.
  const dialog = document.createElement('dialog');
  dialog.className = 'command-dialog';
  dialog.setAttribute('aria-label', t('commandLabel'));
  const head = document.createElement('div'); head.className = 'command-head';
  const input = document.createElement('input'); input.type = 'search'; input.autocomplete = 'off'; input.setAttribute('aria-label', t('commandLabel'));
  const close = document.createElement('button'); close.type = 'button'; close.className = 'command-close'; close.textContent = 'Esc';
  const list = document.createElement('div'); list.className = 'command-items'; list.setAttribute('role', 'listbox');
  const note = document.createElement('p'); note.className = 'command-note';
  head.append(input, close); dialog.append(head, list, note); document.body.append(dialog);
  const pageItems = [['Ana Sayfa', 'index.html'], ['Hizmetler', 'services.html'], ['Portföy', 'portfolio.html'], ['Süreç', 'process.html'], ['Kod Merkezi', 'code-center.html'], ['İletişim', 'contact.html']];
  let active = 0, filtered = [], trigger = null;
  function closeCommands() { dialog.close(); trigger?.focus(); }
  function renderCommands() {
    const query = input.value.trim().toLocaleLowerCase(language);
    const items = pageItems.map(([key, href]) => ({ label: t(key), run: () => { location.href = href; } }));
    items.push({ label: t('themeLabel'), run: () => themeButton.click() });
    const names = ['Türkçe', 'English', 'Deutsch', 'Español'];
    supported.forEach((code, i) => items.push({ label: names[i], run: () => { selector.value = code; selector.dispatchEvent(new Event('change')); } }));
    filtered = items.filter(item => item.label.toLocaleLowerCase(language).includes(query));
    if (active >= filtered.length) active = 0;
    list.replaceChildren();
    if (!filtered.length) { const empty = document.createElement('p'); empty.textContent = t('emptyCommands'); list.append(empty); return; }
    filtered.forEach((item, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = item.label;
      button.setAttribute('role', 'option'); button.setAttribute('aria-selected', String(i === active));
      button.addEventListener('click', () => { closeCommands(); item.run(); }); list.append(button);
    });
  }
  function openCommands() {
    trigger = document.activeElement;
    input.value = ''; active = 0; input.placeholder = t('commandSearch'); note.textContent = t('commandNote');
    dialog.setAttribute('aria-label', t('commandLabel')); input.setAttribute('aria-label', t('commandLabel'));
    renderCommands(); dialog.showModal(); input.focus();
  }
  document.querySelectorAll('[data-command-open]').forEach(button => button.addEventListener('click', openCommands));
  close.addEventListener('click', closeCommands);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeCommands(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeCommands(); } });
  input.addEventListener('input', () => { active = 0; renderCommands(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); closeCommands();
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && filtered.length) {
      event.preventDefault(); active = (active + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length; renderCommands();
    } else if (event.key === 'Enter' && filtered[active]) { event.preventDefault(); const item = filtered[active]; closeCommands(); item.run(); }
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.open ? closeCommands() : openCommands(); }
  });
})();
