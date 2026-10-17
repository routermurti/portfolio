(() => {
  'use strict';

  const PLACEHOLDER = /^(?:your(?:[_ -].*)?|example(?:[_ -].*)?|sample(?:[_ -].*)?|dummy(?:[_ -].*)?|placeholder(?:[_ -].*)?|replace[_ -]?me(?:[_ -].*)?|change[_ -]?me(?:[_ -].*)?|redacted|xxx+|<[^>]+>|process\.env\.[\w.]+|import\.meta\.env\.[\w.]+|undefined|null)$/i;
  const ASSIGNMENT = /(?:^|[\s;,{?&.])(?:export\s+)?["'`]?([A-Za-z_$-][\w$.-]*)["'`]?\s*(?:=(?!=)|:(?!\/\/))\s*(?:"([^"\r\n]*)"|'([^'\r\n]*)'|`([^`\r\n]*)`|([^\s"'`;<>]+))/gm;
  const KNOWN_SECRET_PATTERNS = [
    { category: 'Özel anahtar', pattern: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/i },
    { category: 'API anahtarı', pattern: /\b(?:(?:sk|rk)_(?:live|test)_|sk-(?:proj|ant(?:-api\d{2})?|live|test)-)[A-Za-z0-9_-]{16,}\b/i },
    { category: 'API anahtarı', pattern: /\b(?:AIza[0-9A-Za-z_-]{30,}|GOCSPX-[A-Za-z0-9_-]{16,}|re_[A-Za-z0-9_-]{20,}|SG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,})\b/ },
    { category: 'Erişim belirteci', pattern: /\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|glpat-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|(?:AKIA|ASIA)[A-Z0-9]{16})\b/ },
    { category: 'Erişim belirteci', pattern: /\b(?:npm_[A-Za-z0-9]{20,}|pypi-[A-Za-z0-9_-]{20,})\b/ },
    { category: 'Webhook adresi', pattern: /https:\/\/(?:discord(?:app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]{15,}|hooks\.slack\.com\/services\/[A-Za-z0-9_\/-]{15,})/i },
    { category: 'Erişim belirteci', pattern: /\bBearer\s+[A-Za-z0-9_~+\/.=-]{16,}/i },
    { category: 'Erişim belirteci', pattern: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/ }
  ];
  const SECRET_KEY = /(?:^|[_.-])(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key|secret|token|authorization|credentials?|password|passwd|pwd|key)(?:$|[_-]|[:=])/i;
  const SENSITIVE_HTML = /<input\b[^>]*\b(?:type\s*=\s*['"]?password|autocomplete\s*=\s*['"]?current-password)[^>]*\bvalue\s*=\s*['"][^'"]{4,}['"]/i;
  const EMAIL = /\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/gi;
  const RESERVED_EMAIL_DOMAIN = /\.(?:test|example|invalid|localhost)$/i;
  const CREDENTIAL_URL = /\b(?:https?|postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis):\/\/[^\s/@:]+:[^\s/@]+@/i;
  const CARD_CANDIDATE = /\b(?:\d[ -]?){13,19}\b/g;

  function isLikelyCardNumber(candidate) {
    const digits = candidate.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19 || /^([0-9])\1+$/.test(digits)) return false;
    let sum = 0;
    let doubleDigit = false;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let digit = Number(digits[index]);
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
  }

  function hasNonPlaceholderEmail(input) {
    EMAIL.lastIndex = 0;
    let match;
    while ((match = EMAIL.exec(input)) !== null) {
      if (!RESERVED_EMAIL_DOMAIN.test(match[1])) return true;
    }
    return false;
  }

  function scan(input) {
    if (typeof input !== 'string' || input.length === 0) return [];

    const categories = new Set();
    for (const item of KNOWN_SECRET_PATTERNS) {
      if (item.pattern.test(input)) categories.add(item.category);
    }
    if (CREDENTIAL_URL.test(input)) categories.add('Bağlantı kimlik bilgisi');
    if (SENSITIVE_HTML.test(input)) categories.add('Parola/kimlik bilgisi');
    if (hasNonPlaceholderEmail(input)) categories.add('Kişisel veri');

    ASSIGNMENT.lastIndex = 0;
    let match;
    while ((match = ASSIGNMENT.exec(input)) !== null) {
      const key = match[1];
      const value = match.slice(2).find((part) => part !== undefined) || '';
      if (!SECRET_KEY.test(key) || value.length < 4 || PLACEHOLDER.test(value.trim())) continue;
      if (/(?:password|passwd|pwd)/i.test(key)) categories.add('Parola/kimlik bilgisi');
      else if (/(?:token|auth)/i.test(key)) categories.add('Erişim belirteci');
      else categories.add('API anahtarı');
    }

    CARD_CANDIDATE.lastIndex = 0;
    let card;
    while ((card = CARD_CANDIDATE.exec(input)) !== null) {
      if (isLikelyCardNumber(card[0])) {
        categories.add('Ödeme verisi');
        break;
      }
    }

    return Array.from(categories).sort();
  }

  window.RmSecurityScan = Object.freeze({ scan });
})();
