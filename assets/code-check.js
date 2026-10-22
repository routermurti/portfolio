(() => {
  'use strict';
  const form = document.getElementById('rmAnalysisForm');
  if (!form || !window.RmSecurityScan || !window.RmSyntaxCheck || !window.RmUi) return;
  const t = window.RmUi.t, $ = id => document.getElementById(id);
  const result = $('rmAnalysisResult'), button = $('rmAnalyzeBtn');
  let revision = 0, busy = false;
  const mode = () => form.querySelector('input[name="sourceType"]:checked')?.value || 'code';
  function updateButton() {
    const selected = mode();
    const source = selected === 'code' ? $('rmCode').value.trim() : selected === 'file' ? $('rmFile').files?.length : $('rmUrl').value.trim();
    button.disabled = busy || !($('rmSafeConsent').checked && source);
  }
  function refresh() {
    revision++;
    ['code', 'file', 'url'].forEach(name => { $({ code: 'rmCodePane', file: 'rmFilePane', url: 'rmUrlPane' }[name]).hidden = name !== mode(); });
    result.hidden = true; result.replaceChildren(); updateButton();
  }
  form.addEventListener('input', refresh); form.addEventListener('change', refresh);
  document.addEventListener('rm:language', refresh);
  form.querySelector('[data-sample]')?.addEventListener('click', () => {
    form.querySelector('input[value="code"]').checked = true;
    $('rmCodeType').value = 'css'; $('rmCode').value = '.baslik {\n  color: #C4EB72;\n  font-size: 24px;\n';
    refresh(); $('rmCode').focus();
  });
  function message(title, body, categories = []) {
    result.replaceChildren(); result.hidden = false;
    const heading = document.createElement('h2'); heading.textContent = title; result.append(heading);
    const paragraph = document.createElement('p'); paragraph.textContent = body; result.append(paragraph);
    if (categories.length) {
      const names = { 'API anahtarı': ['API key', 'API-Schlüssel', 'Clave API'], 'Erişim belirteci': ['Access token', 'Zugriffstoken', 'Token de acceso'], 'Özel anahtar': ['Private key', 'Privater Schlüssel', 'Clave privada'], 'Webhook adresi': ['Webhook URL', 'Webhook-Adresse', 'URL de webhook'], 'Parola/kimlik bilgisi': ['Password or credentials', 'Passwort oder Zugangsdaten', 'Contraseña o credenciales'], 'Kişisel veri': ['Personal data', 'Personenbezogene Daten', 'Datos personales'], 'Bağlantı kimlik bilgisi': ['Connection credentials', 'Verbindungszugangsdaten', 'Credenciales de conexión'], 'Ödeme verisi': ['Payment data', 'Zahlungsdaten', 'Datos de pago'] };
      const lang = window.RmUi.language(); const index = ['en', 'de', 'es'].indexOf(lang);
      const kinds = categories.map(category => index < 0 ? category : names[category]?.[index] || category);
      const p = document.createElement('p'); p.textContent = t('categories', { types: kinds.join(', ') }); result.append(p);
    }
  }
  function report(data) {
    const metricKey = data.count === 1 ? 'metricOne' : 'metric';
    message(t(data.unsupported ? 'reviewNeeded' : 'done'), data.unsupported ? t('urlInfo') : data.count ? t(data.count === 1 ? 'foundOne' : 'found', { count: data.count }) : t('none'));
    if (!data.unsupported) { const metric = document.createElement('div'); metric.className = 'rm-report-metric'; metric.textContent = t(metricKey, { count: data.count }); result.append(metric); }
    const privacy = document.createElement('p'); privacy.textContent = t('summaryPrivacy'); result.append(privacy);
    const label = document.createElement('label'), consent = document.createElement('input'); consent.type = 'checkbox';
    label.append(consent, document.createTextNode(t('summaryConsent'))); result.append(label);
    const actions = document.createElement('div'); actions.className = 'rm-report-actions';
    const link = document.createElement('a'); link.textContent = t('openSummary'); link.href = '#'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.className = 'is-disabled'; link.tabIndex = -1; link.setAttribute('aria-disabled', 'true');
    const summary = ['Smart Code Check v0.2.0', t('requestReview'), data.unsupported ? t('urlInfo') : t(metricKey, { count: data.count })].join('\n\n');
    consent.addEventListener('change', () => {
      link.href = consent.checked ? 'https://wa.me/905520661318?text=' + encodeURIComponent(summary) : '#';
      link.className = consent.checked ? '' : 'is-disabled'; link.tabIndex = consent.checked ? 0 : -1;
      link.setAttribute('aria-disabled', String(!consent.checked));
    });
    link.addEventListener('click', event => { if (!consent.checked) event.preventDefault(); });
    actions.append(link); result.append(actions);
  }
  async function readSource(selected) {
    if (selected === 'code') {
      const text = $('rmCode').value;
      return text.length > 100000 ? { error: t('tooLong') } : { text, kind: $('rmCodeType').value };
    }
    if (selected === 'file') {
      const file = $('rmFile').files?.[0];
      if (!file) return { error: t('chooseFile') };
      if (file.size > 102400 || !/\.(html?|css)$/i.test(file.name)) return { error: t('invalidFile') };
      try {
        const text = await file.text();
        return text.includes('\0') ? { error: t('unreadable') } : { text, kind: /\.css$/i.test(file.name) ? 'css' : 'html', fileName: file.name };
      } catch { return { error: t('unreadable') }; }
    }
    const rawUrl = $('rmUrl').value.trim();
    try { const url = new URL(rawUrl); return ['http:', 'https:'].includes(url.protocol) ? { unsupported: true, rawUrl } : { error: t('invalidUrl') }; }
    catch { return { error: t('invalidUrl') }; }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (button.disabled) return;
    const version = revision, selected = mode(), problem = $('rmProblem').value;
    busy = true; updateButton();
    try {
      const source = await readSource(selected);
      if (version !== revision) return;
      if (source.error) { message(t('inputError'), source.error); return; }
      const sensitive = window.RmSecurityScan.scan([problem, source.text, source.fileName, source.rawUrl].filter(Boolean).join('\n'));
      if (sensitive.length) { message(t('sensitiveTitle'), t('sensitiveBody'), sensitive); return; }
      if (source.unsupported) { report({ unsupported: true }); return; }
      report(window.RmSyntaxCheck.check(source.text, source.kind));
    } catch { if (version === revision) message(t('scanFailed'), t('scanFailedBody')); }
    finally { busy = false; updateButton(); }
  });
  refresh();
})();
