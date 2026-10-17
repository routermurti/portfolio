// Project request is composed locally and sent only after the visitor confirms in WhatsApp.
const projectForm = document.getElementById('project-request');
if (projectForm) projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!projectForm.reportValidity()) return;
  const details = document.getElementById('request-detail').value.trim();
  if (details.length < 10) return;
  const flagged = window.RmSecurityScan ? window.RmSecurityScan.scan(details) : ['Tarama kullanılamıyor'];
  if (flagged.length) {
    document.getElementById('request-error').textContent = 'Hassas bilgi ihtimali tespit edildi veya tarama çalışmıyor. Mesajı kontrol edip özel bilgileri kaldırın.';
    return;
  }
  document.getElementById('request-error').textContent = '';
  const category = document.getElementById('request-category');
  const scope = document.getElementById('request-scope');
  const message = [
    'Merhaba Router Murti,',
    'Hizmet / Service: ' + category.options[category.selectedIndex].text,
    'Kapsam / Scope: ' + scope.options[scope.selectedIndex].text,
    'Talep / Request:', details
  ].join('\n');
  const target = 'https://wa.me/905520661318?text=' + encodeURIComponent(message);
  const opened = window.open(target, '_blank', 'noopener,noreferrer');
  if (!opened) document.getElementById('request-error').textContent = 'Tarayıcı yeni pencereyi engelledi. WhatsApp bağlantısını açmak için açılır pencere iznini kontrol edin. Mesajınız gönderilmedi.';
});
