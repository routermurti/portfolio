const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'assets', name), 'utf8');
function scanner() {
  const context = vm.createContext({});
  vm.runInContext(source('security-scan.js'), context);
  return context;
}
test('sensitive keys survive prose prefixes, JSON and HTML attribute reordering', () => {
  const c = scanner();
  for (const input of [
    'api_key="audit_nonsecret_123456"',
    'Form denemesi: api_key="audit_nonsecret_123456"',
    'Not: password="audit_nonsecret_123456"',
    '{"description": "example", "accessToken": "audit_nonsecret_123456"}',
    'config.api_key = "audit_nonsecret_123456"',
    'APP_SECRET = "audit_nonsecret_123456"',
    '<input type="password" value="audit_nonsecret_123456">',
    '<input value="audit_nonsecret_123456" type="password">',
    '<input value=audit_nonsecret_123456 autocomplete=current-password>'
  ]) assert.ok(c.RmSecurityScan.scan(input).length, input);
});
test('placeholder and ordinary code remain usable; outputs never echo values', () => {
  const c = scanner();
  for (const input of ['', null, '.a {color: red}', '<h1>Test</h1>', 'api_key="YOUR_API_KEY"', 'user@example.test']) {
    assert.equal(c.RmSecurityScan.scan(input).length, 0);
  }
  assert.equal(JSON.stringify(c.RmSecurityScan.scan('password="audit_nonsecret_123456"')).includes('audit_nonsecret'), false);
  assert.ok(c.RmSecurityScan.scan('user@example.com').includes('Kişisel veri'));
  assert.ok(c.RmSecurityScan.scan('-----BEGIN PRIVATE KEY-----').includes('Özel anahtar'));
  assert.ok(c.RmSecurityScan.scan('postgres://audit:nonsecret@example.test/db').length);
  assert.ok(c.RmSecurityScan.scan('x '.repeat(890) + 'ghp_' + 'a'.repeat(36)).includes('Erişim belirteci'));
});
test('100K adversarial inputs complete within a one-second VM execution budget', () => {
  const c = scanner();
  for (const input of ['a.'.repeat(50000), 'api_key_'.repeat(12500), 'a '.repeat(50000), '<input '.repeat(14000), 'eyJaaaaaaa-'.repeat(9000)]) {
    c.input = input;
    const start = performance.now();
    vm.runInContext('RmSecurityScan.scan(input)', c, { timeout: 1000 });
    console.log('scanner', input.length, Math.round(performance.now() - start), 'ms');
  }
});
function workerContext() {
  const c = vm.createContext({}); c.self = c;
  c.importScripts = (...names) => names.forEach(name => vm.runInContext(source(name.split('?')[0]), c));
  vm.runInContext(source('analysis-worker.js'), c); return c;
}
test('worker returns categories/structural results only and rejects oversized input', () => {
  const c = workerContext(); let output; c.postMessage = data => { output = data; };
  c.onmessage({ data: { source: { text: '.a {', kind: 'css' }, problem: '' } });
  assert.equal(output.syntax.count, 1);
  c.onmessage({ data: { source: { text: 'Not: password="audit_nonsecret_123456"', kind: 'html' }, problem: '' } });
  assert.ok(output.sensitive.length); assert.equal(output.syntax, null);
  assert.equal(JSON.stringify(output).includes('audit_nonsecret'), false);
  c.onmessage({ data: { source: { text: 'a'.repeat(110001), kind: 'css' }, problem: '' } });
  assert.equal(output.error, true);
});
function ui() {
  class Element {
    constructor() { this.value=''; this.checked=false; this.disabled=false; this.hidden=false; this.children=[]; this.listeners={}; this.textContent=''; }
    addEventListener(type, fn) { this.listeners[type] = fn; }
    append(...children) { this.children.push(...children); }
    replaceChildren() { this.children=[]; }
    setAttribute() {}
    querySelectorAll() { return this.controls || []; }
  }
  const ids = Object.fromEntries(['rmAnalysisForm','rmAnalysisResult','rmAnalyzeBtn','rmCode','rmFile','rmUrl','rmCodeType','rmSafeConsent','rmCodePane','rmFilePane','rmUrlPane','rmProblem'].map(id=>[id,new Element()]));
  const radio = { value: 'code' }; const form = ids.rmAnalysisForm;
  form.querySelector = selector => selector.includes(':checked') ? radio : null;
  ids.rmCodePane.controls=[ids.rmCode,ids.rmCodeType]; ids.rmFilePane.controls=[ids.rmFile]; ids.rmUrlPane.controls=[ids.rmUrl];
  let terminated=0, hang=false;
  class Worker {
    constructor() { this.c=workerContext(); this.c.postMessage=data=>setImmediate(()=>{if(!this.stopped)this.onmessage({data});}); }
    postMessage(data) { if(!hang) this.c.onmessage({data}); }
    terminate() { this.stopped=true; terminated++; }
  }
  const c=vm.createContext({URL,Worker,setTimeout,clearTimeout,document:{currentScript:{src:'https://example.test/assets/code-check.js'}, getElementById:id=>ids[id],addEventListener(){},createElement:()=>new Element(),createTextNode:text=>text}});
  c.window=c; c.RmUi={t:key=>key,language:()=> 'tr'}; c.RmSecurityScan={}; c.RmSyntaxCheck={};
  vm.runInContext(source('code-check.js'),c);
  return {ids,radio,refresh:()=>form.listeners.input(),submit:()=>form.listeners.submit({preventDefault(){}}),hang:()=>{hang=true;},terminated:()=>terminated};
}
test('inactive invalid URL is disabled; code, file and URL panes enable only their controls', async () => {
  const u=ui(); u.radio.value='url';u.refresh(); assert.equal(u.ids.rmUrl.disabled,false);
  u.ids.rmUrl.value='not-a-url';u.radio.value='code';u.ids.rmCode.value='.a {';u.ids.rmCodeType.value='css';u.ids.rmSafeConsent.checked=true;u.refresh();
  assert.equal(u.ids.rmUrl.disabled,true);assert.equal(u.ids.rmCode.disabled,false);
  await u.submit();assert.equal(u.ids.rmAnalysisResult.hidden,false);assert.equal(u.terminated(),1);
  u.radio.value='file';u.refresh();assert.equal(u.ids.rmFile.disabled,false);assert.equal(u.ids.rmCode.disabled,true);
});
test('editing cancels pending worker and clears stale results without locking submit', async () => {
  const u=ui();u.ids.rmCode.value='.a {}';u.ids.rmSafeConsent.checked=true;u.refresh();u.hang();
  const pending=u.submit();await Promise.resolve();u.refresh();await pending;
  assert.equal(u.terminated(),1);assert.equal(u.ids.rmAnalysisResult.hidden,true);assert.equal(u.ids.rmAnalyzeBtn.disabled,false);
});
