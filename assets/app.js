const translations = {
  tr: {
    'Ana Sayfa': 'Ana Sayfa',
    Hizmetler: 'Hizmetler',
    Portföy: 'Portföy',
    Süreç: 'Süreç',
    'Kod Merkezi': 'Kod Merkezi',
    İletişim: 'İletişim',
    'Küçük web sorunlarına net çözümler': 'Küçük web sorunlarına net çözümler',
    'HTML/CSS düzenlemeleri, mobil görünüm ve küçük arayüz düzeltmeleri.': 'HTML/CSS düzenlemeleri, mobil görünüm ve küçük arayüz düzeltmeleri.',
    'Kod ön inceleme merkezine geç': 'Kod ön inceleme merkezine geç'
  },
  en: {
    'Ana Sayfa': 'Home',
    Hizmetler: 'Services',
    Portföy: 'Portfolio',
    Süreç: 'Process',
    'Kod Merkezi': 'Code Center',
    İletişim: 'Contact',
    'Küçük web sorunlarına net çözümler': 'Clear solutions for small website issues',
    'HTML/CSS düzenlemeleri, mobil görünüm ve küçük arayüz düzeltmeleri.': 'HTML/CSS edits, mobile layout improvements and small interface fixes.',
    'Kod ön inceleme merkezine geç': 'Open Code Center'
  },
  de: {
    'Ana Sayfa': 'Startseite',
    Hizmetler: 'Leistungen',
    Portföy: 'Portfolio',
    Süreç: 'Ablauf',
    'Kod Merkezi': 'Code-Center',
    İletişim: 'Kontakt',
    'Küçük web sorunlarına net çözümler': 'Klare Lösungen für kleine Website-Probleme',
    'HTML/CSS düzenlemeleri, mobil görünüm ve küçük arayüz düzeltmeleri.': 'HTML/CSS-Anpassungen, mobile Layouts und kleine Oberflächenkorrekturen.',
    'Kod ön inceleme merkezine geç': 'Code-Center öffnen'
  },
  es: {
    'Ana Sayfa': 'Inicio',
    Hizmetler: 'Servicios',
    Portföy: 'Portafolio',
    Süreç: 'Proceso',
    'Kod Merkezi': 'Centro de código',
    İletişim: 'Contacto',
    'Küçük web sorunlarına net çözümler': 'Soluciones claras para pequeños problemas web',
    'HTML/CSS düzenlemeleri, mobil görünüm ve küçük arayüz düzeltmeleri.': 'Ediciones HTML/CSS, mejoras móviles y pequeños ajustes de interfaz.',
    'Kod ön inceleme merkezine geç': 'Abrir centro de código'
  }
};

const founderTranslations = {
  en: {
    foundersTag: 'ROUTER MURTI · EARLY SUPPORTERS',
    foundersTitle: 'The First 50 Who Believe in Us',
    foundersIntro: 'Our freelance journey is just beginning. We have no client names to display yet. We hope to thank the first 50 clients with completed projects here, with their permission.',
    foundersWaiting: 'Waiting for our first supporters',
    foundersThanks: 'Thank you for believing in us',
    foundersPrivacy: 'Names appear only for genuine completed projects with explicit permission. A nickname can be used, or the name removed on request.'
  },
  de: {
    foundersTag: 'ROUTER MURTI · ERSTE UNTERSTÜTZER',
    foundersTitle: 'Die ersten 50, die an uns glauben',
    foundersIntro: 'Unsere Freelance-Reise beginnt gerade erst. Noch gibt es keine Kundennamen. Den ersten 50 Kunden mit abgeschlossenen Aufträgen möchten wir hier mit ihrer Erlaubnis danken.',
    foundersWaiting: 'Wir warten auf unsere ersten Unterstützer',
    foundersThanks: 'Danke für Ihr Vertrauen',
    foundersPrivacy: 'Namen erscheinen nur nach echten, abgeschlossenen Aufträgen und ausdrücklicher Einwilligung. Ein Pseudonym ist möglich; Namen können entfernt werden.'
  },
  es: {
    foundersTag: 'ROUTER MURTI · PRIMEROS COLABORADORES',
    foundersTitle: 'Las primeras 50 personas que confían en nosotros',
    foundersIntro: 'Nuestro camino como freelancers acaba de comenzar. Aún no tenemos nombres de clientes para mostrar. Queremos agradecer aquí a los primeros 50 clientes con trabajos completados, con su permiso.',
    foundersWaiting: 'Esperando a nuestros primeros colaboradores',
    foundersThanks: 'Gracias por confiar en nosotros',
    foundersPrivacy: 'Solo se muestran nombres de trabajos reales completados y con permiso explícito. Se puede usar un alias o solicitar su eliminación.'
  },
  tr: {
    foundersTag: 'ROUTER MURTI · İLK DESTEKÇİLER',
    foundersTitle: 'Bize İlk İnanan 50 Kişi',
    foundersIntro: 'Freelance yolculuğumuz yeni başlıyor. Henüz yayınlanacak müşteri ismimiz yok; ilk 50 tamamlanan işin sahibine, izinleriyle burada teşekkür etmek istiyoruz.',
    foundersWaiting: 'İlk destekçilerimizi bekliyoruz',
    foundersThanks: 'Bize inandığınız için teşekkürler',
    foundersPrivacy: 'İsimler yalnızca tamamlanan gerçek işler ve açık yayın izniyle eklenir. İstenirse takma ad kullanılır veya isim kaldırılır.'
  }
};

for (const code of Object.keys(founderTranslations)) {
  Object.assign(translations[code], founderTranslations[code]);
}


const siteTranslations = {"tr": {"heroEyebrow": "ROUTER MURTI · YAZILIM VE BT ÇÖZÜMLERİ", "heroTitle": "Teknolojiyi Anlar. Sorunu Çözer.", "heroBody": "İşinize özel yazılım, web uygulamaları, otomasyon ve teknik çözümler. Önce ihtiyacı değerlendirir, sonra uygulanabilir kapsamı birlikte netleştiririz.", "requestBtn": "Projenizi Anlatın", "portfolioBtn": "Projeleri İnceleyin", "servicesTitle": "Çalışma Alanlarımız", "svc1": "Özel Yazılım", "svc1d": "İş akışına uygun uygulamalar ve araçlar.", "svc2": "Web Siteleri ve Yönetim Panelleri", "svc2d": "Kullanılabilir web arayüzleri ve yönetim ekranları.", "svc3": "Otomasyon ve Barkod Sistemleri", "svc3d": "Süreçleri düzenleyen, ihtiyaç odaklı otomasyonlar.", "svc4": "BT Çözümleri ve Teknik Destek", "svc4d": "Teknik sorun analizi ve uygulanabilir destek.", "servicesHero": "İhtiyaca göre şekillenen teknik çözümler", "servicesDesc": "Her talep önce teknik açıdan değerlendirilir. Kapsam, süre ve ücret onaydan önce yazılı olarak netleştirilir.", "portfolioHero": "Geliştirilen projeler", "portfolioDesc": "Tamamlanan çalışmalar ve geliştirme aşamasındaki projeler ayrı gösterilir. Gizli müşteri bilgileri paylaşılmaz.", "completed": "Tamamlanan çalışmalar", "inProgress": "Geliştirme aşamasında", "barcodDesc": "Havalimanı bagaj yönlendirme otomasyonu: uçuş verisine göre barkod oluşturma, yazdırma ve konveyör yönlendirme sinyalleri.", "tagDesc": "Telefonla alınan yolculuklar için ücret hesaplama ve sürücülere yönelik kayıt/yönetim araçları.", "beautyName": "Güzellik Reklam Hesaplayıcı", "beautyDesc": "Güzellik işletmelerine yönelik tahmini reklam bütçesi hesaplama aracı; sonuçlar garanti değildir.", "visitProject": "Projeye git ↗", "devStatus": "Geliştirme aşamasında; henüz tamamlanmış ürün olarak sunulmuyor.", "checkDesc": "Kod için otomatik statik ön analiz aracı. Kapsamı sınırlıdır, tam güvenlik denetimi değildir.", "checkBtn": "Ön analiz aracını aç", "processTitle": "Çalışma Sürecimiz", "processHero": "Başından sonuna açık ve kontrollü süreç", "processDesc": "İşin kapsamı ve yapılabilirliği anlaşılmadan kesin süre veya sonuç sözü verilmez.", "step1": "Talep", "step1d": "İhtiyacınızı ve mevcut sorunu anlatırsınız.", "step2": "Ön değerlendirme", "step2d": "Teknik yapılabilirlik ve olası riskler incelenir.", "step3": "Yazılı mutabakat", "step3d": "Kapsam, ücret, süre ve revizyon koşulları onaylanır.", "step4": "Geliştirme ve test", "step4d": "Uygun test ortamında kontroller yapılır; veri gizliliği gözetilir.", "step5": "Teslim", "step5d": "Tamamlanan kapsam ve bilinen sınırlamalar paylaşılır.", "contactEyebrow": "PROJE TALEP MERKEZİ", "contactHero": "Projenizi anlatın", "contactDesc": "Kısa bir açıklama ile başlayın. Talebiniz yalnızca WhatsApp'ı açtığınızda hazırlanır; göndermeden önce siz kontrol edersiniz.", "categoryLabel": "Hangi konuda destek istiyorsunuz?", "other": "Diğer", "detailLabel": "İhtiyacınızı anlatın", "scopeLabel": "Tahmini proje kapsamı", "scopeUndecided": "Henüz belirlemedim", "scopeSmall": "Küçük kapsamlı iş", "scopeMedium": "Orta kapsamlı proje", "scopeLarge": "Kapsamlı proje", "consentLabel": "Mesajımda şifre, API anahtarı veya özel müşteri verisi bulunmadığını kontrol ettim.", "privacyNote": "Form verileri sunucuya kaydedilmez. WhatsApp bağlantısını açmadan önce hassas bilgi paylaşmadığınızdan emin olun.", "whatsappBtn": "WhatsApp'ta mesaj hazırla"}, "en": {"heroEyebrow": "ROUTER MURTI · SOFTWARE & IT SOLUTIONS", "heroTitle": "Understands Technology. Solves Problems.", "heroBody": "Custom software, web applications, automation and IT solutions. We assess your needs first, then agree on a feasible scope.", "requestBtn": "Tell Us About Your Project", "portfolioBtn": "Explore Projects", "servicesTitle": "Our Services", "svc1": "Custom Software", "svc1d": "Applications and tools tailored to workflows.", "svc2": "Websites & Admin Panels", "svc2d": "Usable web interfaces and management dashboards.", "svc3": "Automation & Barcode Systems", "svc3d": "Practical automation designed around real processes.", "svc4": "IT Solutions & Technical Support", "svc4d": "Technical issue assessment and practical support.", "servicesHero": "Technical solutions shaped around your needs", "servicesDesc": "Every request is assessed for feasibility. Scope, timing and price are agreed in writing before work begins.", "portfolioHero": "Projects Developed", "portfolioDesc": "Completed work and ongoing projects are clearly separated. Private client data is never displayed.", "completed": "Completed Work", "inProgress": "In Development", "barcodDesc": "Airport baggage routing automation: flight-based barcode generation, printing and conveyor routing signals.", "tagDesc": "Fare calculation for phone bookings and record-management tools for drivers.", "beautyName": "Beauty Advertising Calculator", "beautyDesc": "Estimated advertising budget calculator for beauty businesses; results are not guaranteed.", "visitProject": "Visit project ↗", "devStatus": "In development; not presented as a finished product.", "checkDesc": "Automated static code pre-check. Limited scope; not a full security audit.", "checkBtn": "Open pre-check tool", "processTitle": "Our Process", "processHero": "A clear, controlled process from start to finish", "processDesc": "No firm timeline or outcome is promised before feasibility and scope are understood.", "step1": "Request", "step1d": "You describe your needs and the issue.", "step2": "Initial assessment", "step2d": "Technical feasibility and potential risks are assessed.", "step3": "Written agreement", "step3d": "Scope, price, timing and revision terms are approved.", "step4": "Development & testing", "step4d": "Checks are carried out in an appropriate test environment, respecting data privacy.", "step5": "Delivery", "step5d": "Completed work and known limitations are documented.", "contactEyebrow": "PROJECT REQUEST CENTER", "contactHero": "Tell us about your project", "contactDesc": "Start with a brief description. Your message is prepared in WhatsApp; you review it before sending.", "categoryLabel": "What do you need help with?", "other": "Other", "detailLabel": "Describe your needs", "scopeLabel": "Estimated project scope", "scopeUndecided": "Not decided yet", "scopeSmall": "Small task", "scopeMedium": "Medium project", "scopeLarge": "Large project", "consentLabel": "I checked that my message contains no passwords, API keys or private customer data.", "privacyNote": "Form data is not stored on a server. Do not include sensitive information in the WhatsApp message.", "whatsappBtn": "Prepare WhatsApp message"}, "de": {"heroEyebrow": "ROUTER MURTI · SOFTWARE- UND IT-LÖSUNGEN", "heroTitle": "Versteht Technologie. Löst Probleme.", "heroBody": "Individuelle Software, Webanwendungen, Automatisierung und IT-Lösungen. Wir prüfen zuerst den Bedarf und legen dann den machbaren Umfang fest.", "requestBtn": "Projekt anfragen", "portfolioBtn": "Projekte ansehen", "servicesTitle": "Unsere Leistungen", "svc1": "Individuelle Software", "svc1d": "Anwendungen und Werkzeuge für Ihre Abläufe.", "svc2": "Websites & Verwaltungsoberflächen", "svc2d": "Benutzerfreundliche Weboberflächen und Dashboards.", "svc3": "Automatisierung & Barcodesysteme", "svc3d": "Praxisnahe Automatisierung für konkrete Prozesse.", "svc4": "IT-Lösungen & Technischer Support", "svc4d": "Analyse technischer Probleme und praktische Unterstützung.", "servicesHero": "Technische Lösungen nach Ihrem Bedarf", "servicesDesc": "Jede Anfrage wird technisch geprüft. Umfang, Zeit und Preis werden vorab schriftlich vereinbart.", "portfolioHero": "Entwickelte Projekte", "portfolioDesc": "Abgeschlossene und laufende Projekte werden getrennt dargestellt. Vertrauliche Kundendaten werden nicht veröffentlicht.", "completed": "Abgeschlossene Arbeiten", "inProgress": "In Entwicklung", "barcodDesc": "Flughafen-Gepäcksteuerung: flugbezogene Barcode-Erstellung, Druck und Fördersignale.", "tagDesc": "Fahrpreisberechnung für Telefonbuchungen und Verwaltungswerkzeuge für Fahrer.", "beautyName": "Werbebudget-Rechner für Kosmetikbetriebe", "beautyDesc": "Schätzung von Werbebudgets für Kosmetikbetriebe; Ergebnisse sind nicht garantiert.", "visitProject": "Projekt öffnen ↗", "devStatus": "In Entwicklung; noch kein fertiges Produkt.", "checkDesc": "Automatische statische Code-Vorprüfung. Kein vollständiges Sicherheitsaudit.", "checkBtn": "Vorprüfung öffnen", "processTitle": "Unser Ablauf", "processHero": "Ein klarer und kontrollierter Ablauf", "processDesc": "Ohne Prüfung von Machbarkeit und Umfang werden keine festen Termine oder Ergebnisse zugesagt.", "step1": "Anfrage", "step1d": "Sie beschreiben Ihren Bedarf und das Problem.", "step2": "Vorprüfung", "step2d": "Machbarkeit und mögliche Risiken werden geprüft.", "step3": "Schriftliche Vereinbarung", "step3d": "Umfang, Preis, Zeitplan und Korrekturen werden vereinbart.", "step4": "Entwicklung & Tests", "step4d": "Tests erfolgen in geeigneter Umgebung unter Beachtung des Datenschutzes.", "step5": "Übergabe", "step5d": "Erledigte Arbeiten und bekannte Grenzen werden dokumentiert.", "contactEyebrow": "PROJEKTANFRAGE", "contactHero": "Beschreiben Sie Ihr Projekt", "contactDesc": "Beschreiben Sie Ihr Vorhaben kurz. Die Nachricht wird in WhatsApp vorbereitet; Sie prüfen sie vor dem Senden.", "categoryLabel": "Wobei benötigen Sie Hilfe?", "other": "Sonstiges", "detailLabel": "Beschreiben Sie Ihren Bedarf", "scopeLabel": "Geschätzter Projektumfang", "scopeUndecided": "Noch nicht entschieden", "scopeSmall": "Kleine Aufgabe", "scopeMedium": "Mittleres Projekt", "scopeLarge": "Großes Projekt", "consentLabel": "Ich habe geprüft, dass meine Nachricht keine Passwörter, API-Schlüssel oder privaten Kundendaten enthält.", "privacyNote": "Formulardaten werden nicht auf einem Server gespeichert. Geben Sie keine sensiblen Daten weiter.", "whatsappBtn": "WhatsApp-Nachricht vorbereiten"}, "es": {"heroEyebrow": "ROUTER MURTI · SOFTWARE Y SOLUCIONES TI", "heroTitle": "Entiende la tecnología. Resuelve problemas.", "heroBody": "Software a medida, aplicaciones web, automatización y soluciones técnicas. Primero evaluamos sus necesidades y definimos el alcance viable.", "requestBtn": "Cuéntenos su proyecto", "portfolioBtn": "Ver proyectos", "servicesTitle": "Nuestros servicios", "svc1": "Software a medida", "svc1d": "Aplicaciones y herramientas adaptadas a sus procesos.", "svc2": "Sitios web y paneles de gestión", "svc2d": "Interfaces web y paneles de administración útiles.", "svc3": "Automatización y códigos de barras", "svc3d": "Automatizaciones prácticas para procesos reales.", "svc4": "Soluciones TI y soporte técnico", "svc4d": "Análisis de problemas técnicos y asistencia práctica.", "servicesHero": "Soluciones técnicas según sus necesidades", "servicesDesc": "Cada solicitud se evalúa técnicamente. El alcance, plazo y precio se acuerdan por escrito antes de comenzar.", "portfolioHero": "Proyectos desarrollados", "portfolioDesc": "Separamos los proyectos terminados de los que están en desarrollo. No se publican datos privados de clientes.", "completed": "Trabajos terminados", "inProgress": "En desarrollo", "barcodDesc": "Automatización de equipajes aeroportuarios: generación e impresión de códigos de barras y señales de clasificación según el vuelo.", "tagDesc": "Cálculo de tarifas para reservas telefónicas y herramientas de gestión para conductores.", "beautyName": "Calculadora de publicidad para belleza", "beautyDesc": "Estimador de presupuesto publicitario para negocios de belleza; los resultados no están garantizados.", "visitProject": "Visitar proyecto ↗", "devStatus": "En desarrollo; todavía no es un producto terminado.", "checkDesc": "Análisis estático preliminar de código. No sustituye una auditoría completa de seguridad.", "checkBtn": "Abrir análisis preliminar", "processTitle": "Nuestro proceso", "processHero": "Un proceso claro y controlado de principio a fin", "processDesc": "No se prometen plazos ni resultados definitivos sin evaluar la viabilidad y el alcance.", "step1": "Solicitud", "step1d": "Describe su necesidad y el problema.", "step2": "Evaluación inicial", "step2d": "Se evalúan la viabilidad técnica y los posibles riesgos.", "step3": "Acuerdo por escrito", "step3d": "Se aprueban alcance, precio, plazo y revisiones.", "step4": "Desarrollo y pruebas", "step4d": "Se realizan pruebas en un entorno adecuado, respetando la privacidad.", "step5": "Entrega", "step5d": "Se documentan el trabajo realizado y sus limitaciones.", "contactEyebrow": "CENTRO DE SOLICITUDES", "contactHero": "Cuéntenos su proyecto", "contactDesc": "Empiece con una descripción breve. El mensaje se prepara en WhatsApp y usted lo revisa antes de enviarlo.", "categoryLabel": "¿En qué necesita ayuda?", "other": "Otro", "detailLabel": "Describa lo que necesita", "scopeLabel": "Alcance estimado", "scopeUndecided": "Aún no lo he decidido", "scopeSmall": "Trabajo pequeño", "scopeMedium": "Proyecto mediano", "scopeLarge": "Proyecto amplio", "consentLabel": "He comprobado que mi mensaje no contiene contraseñas, claves API ni datos privados de clientes.", "privacyNote": "Los datos del formulario no se guardan en un servidor. No incluya información sensible.", "whatsappBtn": "Preparar mensaje en WhatsApp"}};
for (const code of Object.keys(siteTranslations)) Object.assign(translations[code], siteTranslations[code]);

const locale = (navigator.languages || [navigator.language || 'en'])[0].slice(0, 2).toLowerCase();
const supported = ['tr', 'en', 'de', 'es'];
let lang = localStorage.getItem('rm-lang');
if (!supported.includes(lang)) lang = supported.includes(locale) ? locale : 'en';

const selector = document.getElementById('lang');
selector.value = lang;
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = (translations[lang] && translations[lang][key]) || key;
  });
}
selector.addEventListener('change', () => {
  lang = selector.value;
  localStorage.setItem('rm-lang', lang);
  applyLang();
});
applyLang();

const theme = localStorage.getItem('rm-theme');
if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('rm-theme', next);
});

