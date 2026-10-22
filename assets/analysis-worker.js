'use strict';
importScripts('security-scan.js?v=security-20261022', 'syntax-check.js?v=security-20261022');
self.onmessage = event => {
  try {
    const { source, problem } = event.data;
    const input = [problem, source.text, source.fileName, source.rawUrl].filter(Boolean).join('\n');
    if (input.length > 110000) throw new Error('Input too large');
    const sensitive = self.RmSecurityScan.scan(input);
    const syntax = sensitive.length || source.unsupported ? null : self.RmSyntaxCheck.check(source.text, source.kind);
    self.postMessage({ sensitive, syntax });
  } catch {
    self.postMessage({ error: true });
  }
};
