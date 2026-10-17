# Customer Input Security Hardening Implementation Plan

**Goal:** Harden the supplied static client-side code checker so sensitive content is detected before any user-controlled text is placed in an outbound WhatsApp link, while minimizing data disclosure and adding repeatable regression tests.

**Architecture:** Keep analysis local in the browser and introduce a small pure scanner module that returns only generic categories, never matched values. Integrate it at the user-data boundary and keep raw source/file names out of outbound messages; test the scanner with Node's built-in test runner. This does not create a backend, a trusted security boundary, or a guarantee of secret detection.

**Tech Stack:** Static HTML, vanilla JavaScript, Node.js built-in `node:test`.

**Spec:** User-provided ZIP; `code-center.html` states uploaded content is read locally and not uploaded.

## Global Constraints
- Operate only on the provided archive and its local tests.
- Do not execute customer code, fetch supplied site URLs, or attack external/production systems.
- Do not persist, log, or echo matched secrets.
- Preserve the existing client-side-only behavior and disclose its limitations.

## Review Focus
- API keys, private keys, access tokens, credentials and credential-bearing URLs must trigger a generic warning without echoing values.
- Sensitive values in the problem description, URL field, or file name must be scanned as well as pasted/file content.
- Safe placeholder values and normal HTML/CSS should not be unnecessarily rejected where practical.
- User-provided code, file names and problem text must not be inserted into generated WhatsApp message by default.
- HTML/script payloads must remain data and never be executed or inserted as markup.

---

### Task 1: Add pure secret scanner and regression tests

**Files:**
- Create: `assets/security-scan.js`
- Create: `tests/security-scan.test.js`

**Interfaces:**
- Produces `window.RmSecurityScan.scan(value) -> string[]`; returns category labels only, no matched values.

- [x] Add tests for common credential/private-key/token formats, PII indicators, false-positive-safe placeholders, null/empty values, and value non-disclosure.
- [x] Run `node --test tests/security-scan.test.js` and confirm the expected behavior.
- [x] Implement the pure scanner with documented limitations.
- [x] Re-run the test suite.

### Task 2: Integrate checks at the outbound data boundary

**Files:**
- Modify: `code-center.html`
- Modify: `assets/code-check.js`
- Modify: `assets/app.js` to remove the dormant raw-text WhatsApp handler.

**Interfaces:**
- Consumes `window.RmSecurityScan.scan`.
- Produces a local blocked warning when any user-supplied field is flagged; outbound WhatsApp text contains only generic analysis metadata and no submitted source, filename, URL, or free-text problem description.

- [x] Add a testable UI flow for checking pasted code, file text/name and description before report generation.
- [x] Test blocked payload behavior and verify no matched value is exposed.
- [x] Integrate the scanner, retain size/type validation, and make WhatsApp copy explicitly data-minimizing.
- [x] Run tests and syntax checks.

### Task 3: Verify local-only behavior and report limits

**Files:**
- Create: `SECURITY-REVIEW.md`

- [x] Run regression tests, syntax checks and static sink/network scans.
- [x] Record tested vectors, findings fixed, remaining limitations, and that no external target or backend was tested.
