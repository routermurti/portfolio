(() => {
  'use strict';

  const form = document.getElementById('rmAnalysisForm');
  if (!form || !window.RmSecurityScan || !window.RmSyntaxCheck) return;

  const $ = (id) => document.getElementById(id);
  const resultBox = $('rmAnalysisResult');
  const analyzeButton = $('rmAnalyzeBtn');
  const panes = {
    code: $('rmCodePane'),
    file: $('rmFilePane'),
    url: $('rmUrlPane')
  };

  function selectedMode() {
    const selected = document.querySelector('input[name="sourceType"]:checked');
    return selected ? selected.value : 'code';
  }

  function renderMessage(titleText, messageText, categories = []) {
    resultBox.replaceChildren();
    resultBox.hidden = false;

    const title = document.createElement('h2');
    title.className = 'rm-report-title';
    title.textContent = titleText;
    resultBox.append(title);

    const message = document.createElement('p');
    message.textContent = messageText;
    resultBox.append(message);

    if (categories.length) {
      const list = document.createElement('p');
      list.textContent = "Olası hassas bilgi türleri: " + categories.join(', ');
      resultBox.append(list);
    }
  }

  function updateButtonState() {
    const mode = selectedMode();
    const hasSource = mode === 'code'
      ? Boolean($('rmCode').value.trim())
      : mode === 'file'
        ? Boolean($('rmFile').files && $('rmFile').files.length)
        : Boolean($('rmUrl').value.trim());
    analyzeButton.disabled = !($('rmSafeConsent').checked && hasSource);
  }

  function refresh() {
    const mode = selectedMode();
    Object.entries(panes).forEach(([name, pane]) => {
      pane.hidden = name !== mode;
    });
    updateButtonState();
    resultBox.hidden = true;
    resultBox.replaceChildren();
  }

  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  function findSyntaxIssues(text, kind) {
    return window.RmSyntaxCheck.check(text, kind);
  }

  async function readSource(mode) {
    if (mode === 'code') {
      return { text: $('rmCode').value, kind: $('rmCodeType').value };
    }

    if (mode === 'file') {
      const file = $('rmFile').files && $('rmFile').files[0];
      if (!file) return { error: 'Bir HTML veya CSS dosyası seçin.' };
      if (file.size > 102400 || !/\.(html?|css)$/i.test(file.name)) {
        return { error: "En fazla 100 KB boyutunda, .html, .htm veya .css uzantılı bir dosya seçin." };
      }
      let text;
      try {
        text = await file.text();
      } catch {
        return { error: "Dosya tarayıcı içinde okunamadı. Dosyanın erişilebilir bir metin dosyası olduğunu kontrol edin." };
      }
      if (text.includes('\0')) return { error: "Bu dosyanın içeriği metin olarak incelenemiyor. Bir HTML veya CSS metin dosyası seçin." };
      return { text, kind: /\.css$/i.test(file.name) ? 'css' : 'html', fileName: file.name };
    }

    const rawUrl = $('rmUrl').value.trim();
    try {
      const parsed = new URL(rawUrl);
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('unsupported scheme');
      return { unsupported: true, rawUrl };
    } catch {
      return { error: "http:// veya https:// ile başlayan geçerli bir site adresi girin." };
    }
  }

  function getScannedInput(mode, source) {
    const parts = [$('rmProblem').value];
    if (mode === 'code') parts.push($('rmCode').value);
    if (mode === 'file') {
      parts.push(source.text || '');
      parts.push(source.fileName || '');
    }
    if (mode === 'url') parts.push(source.rawUrl || $('rmUrl').value);
    return parts.filter(Boolean).join('\n');
  }

  function showReport(data) {
    resultBox.replaceChildren();
    resultBox.hidden = false;

    const title = document.createElement('h2');
    title.className = 'rm-report-title';
    title.textContent = data.unsupported ? "Ayrıntılı inceleme gerekli" : "Ön kontrol tamamlandı";
    resultBox.append(title);

    const detail = document.createElement('p');
    detail.textContent = data.unsupported
      ? "Bu sürüm, site adresi üzerinden otomatik inceleme yapmaz. Siteye bağlanılmadı ve kaynak kodu alınmadı. Bu nedenle sitenin hataları veya güvenliği hakkında değerlendirme yapılmış değildir."
      : data.count
        ? "Temel söz dizimi kontrolünde " + data.count + " olası bulgu saptandı. Bu sayı, kesinleşmiş hata sayısını göstermez; bulguların ayrıca incelenmesi gerekir."
        : "Bu sınırlı ön kontrolde belirgin bir sorun belirtisi saptanmadı. Sonuç, kodun hatasız veya güvenli olduğunu göstermez; araç tüm hata türlerini denetlemez.";
    resultBox.append(detail);

    if (!data.unsupported) {
      const count = document.createElement('div');
      count.className = 'rm-report-metric';
      count.textContent = data.count + ' olası bulgu';
      resultBox.append(count);
    }

    const note = document.createElement('p');
    note.textContent = "WhatsApp için hazırlanan taslakta yalnızca genel ön kontrol özeti yer alır. Kaynak kodu, dosya adı, site adresi ve sorun açıklaması otomatik olarak eklenmez. Başka bir içerik paylaşacaksanız önce hassas bilgileri kaldırın; bu tarayıcı içi tarama, tüm gizli bilgileri bulmayı garanti etmez.";
    resultBox.append(note);

    const consentLabel = document.createElement('label');
    const consent = document.createElement('input');
    consent.type = 'checkbox';
    consentLabel.append(consent, document.createTextNode(" Genel ön kontrol özetini WhatsApp mesaj taslağı olarak açmayı onaylıyorum."));
    resultBox.append(consentLabel);

    const actions = document.createElement('div');
    actions.className = 'rm-report-actions';
    const link = document.createElement('a');
    link.textContent = "Genel özeti WhatsApp’ta aç";
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.href = '#';
    link.className = 'is-disabled';
    link.tabIndex = -1;
    link.setAttribute('aria-disabled', 'true');

    const message = [
      'Smart Code Check v0.2.0',
      "Ayrıntılı inceleme talebi",
      'Ön kontrol: ' + (data.unsupported ? "Site adresi üzerinden otomatik inceleme yapılmadı" : data.count + ' olası bulgu'),
      "Kaynak kodunu veya sorun açıklamasını paylaşmam gerekirse önce içerikte hassas bilgi bulunmadığını kendim kontrol edeceğim."
    ].join('\n\n');

    consent.addEventListener('change', () => {
      const enabled = consent.checked;
      link.href = enabled ? 'https://wa.me/905520661318?text=' + encodeURIComponent(message) : '#';
      link.className = enabled ? '' : 'is-disabled';
      link.tabIndex = enabled ? 0 : -1;
      link.setAttribute('aria-disabled', String(!enabled));
    });
    link.addEventListener('click', (event) => {
      if (!consent.checked) event.preventDefault();
    });

    actions.append(link);
    resultBox.append(actions);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (analyzeButton.disabled) return;

    analyzeButton.disabled = true;
    try {
      const mode = selectedMode();
      const source = await readSource(mode);
      if (source.error) {
        renderMessage("İçerik kontrolü", source.error);
        return;
      }

      const sensitiveCategories = window.RmSecurityScan.scan(getScannedInput(mode, source));
      if (sensitiveCategories.length) {
        renderMessage(
          "Hassas bilgi uyarısı: İnceleme durduruldu",
          "İçerikte hassas bilgi bulunabileceğini gösteren bir belirti saptandı. İlgili değerler ekranda gösterilmedi; içerik dışarı gönderilmedi ve sunucuya kaydedilmedi. Hassas bilgileri kaldırıp yeniden deneyin. Otomatik taramanın tüm hassas bilgileri bulamayabileceğini unutmayın.",
          sensitiveCategories
        );
        return;
      }

      if (source.unsupported) {
        showReport({ unsupported: true });
        return;
      }

      showReport(findSyntaxIssues(source.text, source.kind));
    } catch {
      renderMessage("Ön kontrol tamamlanamadı", "İçerik tarayıcı içinde işlenemedi. Hata mesajına kaynak kodu veya hassas bilgi eklenmedi.");
    } finally {
      updateButtonState();
    }
  });

  refresh();
})();

