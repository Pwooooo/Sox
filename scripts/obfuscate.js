import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distAssetsDir = path.resolve(__dirname, '../dist/assets');

if (!fs.existsSync(distAssetsDir)) {
  console.log('[Ruam] dist/assets not found, skipping obfuscation.');
  process.exit(0);
}

const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js') && !f.includes('.obf.'));

console.log(`[Ruam] Found ${jsFiles.length} JavaScript asset(s) in dist/assets.`);

for (const file of jsFiles) {
  const fullPath = path.join(distAssetsDir, file);

  // Skip bundles whose React/Three.js internals or top-level ESM patterns break under full-file Ruam VM.
  if (
    file.startsWith('index-') ||
    file.startsWith('src-') ||
    file.startsWith('main-') ||
    file.startsWith('AuthModal-') ||
    file.startsWith('RobloxStudioView-') ||
    file.startsWith('scenestudio-')
  ) {
    console.log(`[Ruam] Skipping bundle ${file}.`);
    execSync(`node --check "${fullPath}"`, { stdio: 'inherit' });
    continue;
  }

  const originalCode = fs.readFileSync(fullPath, 'utf8');
  console.log(`[Ruam] Virtualizing ${file}...`);

  try {
    execSync(`npx ruam "${fullPath}" --preset low`, { stdio: 'inherit' });

    let code = fs.readFileSync(fullPath, 'utf8');
    // Block-scope any top-level `var k` initializer loop injected by Ruam's alphabet table
    code = code.replace(
      /for\s*\(\s*var\s+k\s*=\s*0\s*;\s*k\s*<\s*([A-Za-z0-9_$]+)(?:\['length'\]|\.length)\s*;\s*k\+\+\s*\)\s*\{\s*([A-Za-z0-9_$]+)\[\1(?:\['charCodeAt'\]|\.charCodeAt)\(k\)\]\s*=\s*k;\s*\}/g,
      '{ for (let _rk = 0; _rk < $1.length; _rk++) { $2[$1.charCodeAt(_rk)] = _rk; } }'
    );
    code = code.replace(
      /\{\s*var\s+k\s*=\s*0;\s*while\s*\(\s*k\s*<\s*([A-Za-z0-9_$]+)(?:\['length'\]|\.length)\s*\)\s*\{\s*([A-Za-z0-9_$]+)\[\1(?:\['charCodeAt'\]|\.charCodeAt)\(k\)\]\s*=\s*k;\s*k\+\+;\s*\}\s*\}/g,
      '{ let _rk = 0; while (_rk < $1.length) { $2[$1.charCodeAt(_rk)] = _rk; _rk++; } }'
    );
    code = bindImportsToRuamScope(code);
    fs.writeFileSync(fullPath, code, 'utf8');

    execSync(`node --check "${fullPath}"`, { stdio: 'inherit' });
    console.log(`[Ruam] Successfully virtualized and verified ${file}!`);
  } catch (err) {
    console.error(`[Ruam] Warning: Validation or obfuscation failed for ${file}, restoring original bundle:`, err.message);
    fs.writeFileSync(fullPath, originalCode, 'utf8');
    execSync(`node --check "${fullPath}"`, { stdio: 'inherit' });
  }
}

console.log('[Ruam] All JavaScript chunks processed and syntax-verified.');

/**
 * Ruam's scope object captures local `var`/`function` bindings, but omits ESM `import`
 * bindings. Expose each imported local identifier on the Ruam scope object so virtualized
 * functions can resolve imported React hooks, components, and helpers at runtime.
 */
function bindImportsToRuamScope(code) {
  const scopeMatch = code.match(/var\s+([A-Za-z0-9_$]+)\s*=\s*(?:Object\.create\(null\)|\{\})\s*;\s*\r?\nObject\.defineProperty\(\1,/);
  if (!scopeMatch) return code;
  const scopeVar = scopeMatch[1];

  const existing = new Set();
  const existingRe = new RegExp(`Object\\.defineProperty\\(${scopeVar},\\s*"([^"]+)"`, 'g');
  for (const m of code.matchAll(existingRe)) existing.add(m[1]);

  const imported = new Set();
  const importRe = /^import\s+([\s\S]*?)\s+from\s+["'][^"']+["']\s*;/gm;
  for (const m of code.matchAll(importRe)) {
    const clause = m[1].trim();
    const braceMatch = clause.match(/\{([\s\S]*)\}/);
    if (braceMatch) {
      for (const part of braceMatch[1].split(',')) {
        const item = part.trim();
        if (!item) continue;
        const asMatch = item.match(/\bas\s+([A-Za-z0-9_$]+)$/);
        imported.add(asMatch ? asMatch[1] : item);
      }
    }
    const beforeBrace = braceMatch ? clause.slice(0, braceMatch.index).replace(/,\s*$/, '').trim() : clause;
    if (beforeBrace) {
      const nsMatch = beforeBrace.match(/^\*\s+as\s+([A-Za-z0-9_$]+)$/);
      imported.add(nsMatch ? nsMatch[1] : beforeBrace);
    }
  }

  const additions = [];
  for (const name of imported) {
    if (!existing.has(name) && /^[A-Za-z0-9_$]+$/.test(name)) {
      additions.push(`Object.defineProperty(${scopeVar}, "${name}", { value: ${name}, writable: !0, enumerable: !0, configurable: !0 });`);
    }
  }
  if (additions.length === 0) return code;

  const insertAt = code.search(/^import\s+/m);
  if (insertAt === -1) return code;
  return code.slice(0, insertAt) + additions.join('\n') + '\n' + code.slice(insertAt);
}
