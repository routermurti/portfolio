(() => {
  'use strict';
  const form = document.getElementById('project-request');
  if (!form || !window.RmUi) return;
  const t = window.RmUi.t;
  const error = document.getElementById('request-error');
  document.addEventListener('rm:language', () => { error.replaceChildren(); });
  form.addEventListener('input', () => { error.replaceChildren(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const detail = document.getElementById('request-detail').value.trim();
    if (detail.length < 10) return;
    const flagged = window.RmSecurityScan?.scan(detail);
    if (!flagged || flagged.length) { error.textContent = t('contactBlocked'); return; }
    const category = document.getElementById('request-category'), scope = document.getElementById('request-scope');
    const message = [t('greeting'), t('serviceMessage') + category.options[category.selectedIndex].text, t('scopeMessage') + scope.options[scope.selectedIndex].text, t('detailMessage'), detail].join('\n');
    const target = 'https://t.me/routermurti?text=' + encodeURIComponent(message);
    window.open(target, '_blank', 'noopener,noreferrer');
    error.textContent = t('contactFallback') + ' ';
    const fallback = document.createElement('a'); fallback.href = target; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = t('contactOpen'); error.append(fallback);
  });
})();
