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

  // Skip the main React framework bundle (index-*.js) to keep React 19 + WaveBackground fast
  // and prevent top-level minified identifier collisions in ES module strict mode.
  if (file.startsWith('index-')) {
    console.log(`[Ruam] Skipping main framework bundle ${file}.`);
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
