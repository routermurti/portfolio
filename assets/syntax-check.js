(() => {
  'use strict';
  // Conservative structural hints, not a validator. Never executes input.
  function check(text, kind) {
    const lines = text.split(/\r\n|\r|\n/).length;
    let count = 0;
    if (kind === 'css') {
      let state = 'normal', quote = '', depth = 0;
      for (let i = 0; i < text.length; i++) {
        const c = text[i], next = text[i + 1];
        if (state === 'comment') { if (c === '*' && next === '/') { state = 'normal'; i++; } continue; }
        if (state === 'string') { if (c === '\\') { i++; continue; } if (c === quote) state = 'normal'; continue; }
        if (c === '/' && next === '*') { state = 'comment'; i++; continue; }
        if (c === '"' || c === "'") { state = 'string'; quote = c; continue; }
        if (c === '{') depth++;
        if (c === '}') { if (depth === 0) count++; else depth--; }
      }
      if (depth) count++;
      if (state === 'comment' || state === 'string') count++;
    } else if (kind === 'html') {
      const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
      // Optional end tags can be omitted in valid HTML; skip those to avoid false positives.
      const optional = new Set('html head body li dt dd p rt rp optgroup option colgroup thead tbody tfoot tr td th'.split(' '));
      const stack = [];
      const tags = /<!--[\s\S]*?-->|<![^>]*>|<\/?(?:script|style)\b[^>]*>[\s\S]*?<\/\s*(?:script|style)\s*>|<\s*(\/?)\s*([a-z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/gi;
      let match;
      while ((match = tags.exec(text)) !== null) {
        if (!match[2]) continue;
        const tag = match[2].toLowerCase();
        if (voidTags.has(tag) || optional.has(tag) || /\/\s*>$/.test(match[0])) continue;
        if (!match[1]) stack.push(tag);
        else if (stack.at(-1) === tag) stack.pop();
        else if (stack.includes(tag)) { count++; while (stack.length && stack.at(-1) !== tag) stack.pop(); stack.pop(); }
        else count++;
      }
      count += stack.length;
    }
    return { lines, count };
  }
  window.RmSyntaxCheck = Object.freeze({ check });
})();
