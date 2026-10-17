// Project request is composed locally and sent only after the visitor confirms in WhatsApp.
const projectForm = document.getElementById('project-request');
if (projectForm) projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!projectForm.reportValidity()) return;
  const details = document.getElementById('request-detail').value.trim();
  if (details.length < 10) return;
  const flagged = window.RmSecurityScan ? window.RmSecurityScan.scan(details) : ["Hassas bilgi taraması kullanılamıyor"];
  if (flagged.length) {
    document.getElementById('request-error').textContent = "Açıklamada hassas bilgi bulunabileceği saptandı veya hassas bilgi taraması kullanılamıyor. Özel bilgileri kaldırıp yeniden deneyin. WhatsApp mesaj taslağı açılmadı.";
    return;
  }
  document.getElementById('request-error').textContent = '';
  const category = document.getElementById('request-category');
  const scope = document.getElementById('request-scope');
  const turkish = document.documentElement.lang === 'tr';
  const message = [
    'Merhaba Router Murti,',
    (turkish ? "Hizmet: " : 'Hizmet / Service: ') + category.options[category.selectedIndex].text,
    (turkish ? "Proje kapsamı: " : 'Kapsam / Scope: ') + scope.options[scope.selectedIndex].text,
    (turkish ? "Proje açıklaması:" : 'Talep / Request:'), details
  ].join('\n');
  const target = 'https://wa.me/905520661318?text=' + encodeURIComponent(message);
  const opened = window.open(target, '_blank', 'noopener,noreferrer');
  if (!opened) document.getElementById('request-error').textContent = "WhatsApp penceresi açılmamış olabilir. Açılmadıysa tarayıcınızın açılır pencere izinlerini kontrol edin. Bu form, mesajı kendiliğinden göndermez.";
});

