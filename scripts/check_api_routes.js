const fs = require('fs').promises;
const path = require('path');

const FRONTEND_DIR = path.resolve(__dirname, '../ngo-portal/src');
const BACKEND_DIR = path.resolve(__dirname, '../Backend');

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(res, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(res);
    }
  }
  return files;
}

function normalizeFrontendPath(raw) {
  // Convert template `${id}` to :param
  return raw.replace(/\${[^}]+}/g, ':param');
}

function normalizeBackendPath(raw) {
  // Backend paths already include /api prefix; keep as-is but normalize multiple slashes
  return raw.replace(/:\w+/g, ':param');
}

async function extractFrontend() {
  const files = await walk(FRONTEND_DIR);
  const endpoints = [];
  const re = /api\.(get|post|put|patch|delete)\(\s*([`'"])((?:.|\n)*?)\2/gi;
  for (const f of files) {
    const txt = await fs.readFile(f, 'utf8');
    let m;
    while ((m = re.exec(txt)) !== null) {
      const method = m[1].toUpperCase();
      let rawPath = m[3].trim();
      rawPath = normalizeFrontendPath(rawPath);
      // Prepend /api if path doesn't already start with /api and starts with /
      const full = rawPath.startsWith('/api') ? rawPath : (rawPath.startsWith('/') ? '/api' + rawPath : '/api/' + rawPath);
      endpoints.push({ method, path: full, file: f });
    }
  }
  return endpoints;
}

async function extractBackend() {
  const files = await walk(BACKEND_DIR);
  const endpoints = [];
  const re = /app\.(get|post|put|patch|delete)\(\s*([`'"])((?:.|\n)*?)\2/gi;
  for (const f of files) {
    const txt = await fs.readFile(f, 'utf8');
    let m;
    while ((m = re.exec(txt)) !== null) {
      const method = m[1].toUpperCase();
      let rawPath = m[3].trim();
      rawPath = normalizeBackendPath(rawPath);
      endpoints.push({ method, path: rawPath, file: f });
    }
  }
  return endpoints;
}

function findMatch(fe, backendList) {
  // Exact path match
  const exact = backendList.find(b => b.path === fe.path && b.method === fe.method);
  if (exact) return { type: 'exact', backend: exact };
  const pathMatch = backendList.find(b => b.path === fe.path);
  if (pathMatch) return { type: 'method_mismatch', backend: pathMatch };
  // Try matching parameterized paths: replace numbers/ids with :param
  const feNorm = fe.path.replace(/:\w+/g, ':param');
  const bMatch = backendList.find(b => b.path.replace(/:\w+/g, ':param') === feNorm);
  if (bMatch) return { type: 'param_match', backend: bMatch };
  return { type: 'missing' };
}

(async function main(){
  try {
    const fe = await extractFrontend();
    const be = await extractBackend();

    const report = [];
    for (const e of fe) {
      const m = findMatch(e, be);
      report.push({ frontend: e, match: m });
    }

    console.log('\nFrontend endpoints scanned:', fe.length);
    console.log('Backend endpoints scanned:', be.length);

    const missing = report.filter(r => r.match.type === 'missing');
    const methodMismatches = report.filter(r => r.match.type === 'method_mismatch');
    const paramMatches = report.filter(r => r.match.type === 'param_match');

    if (missing.length === 0 && methodMismatches.length === 0) {
      console.log('\nNo mismatched API routes found.');
    } else {
      console.log('\nMismatches found:');
      if (missing.length) {
        console.log('\n- Missing backend routes for frontend calls:');
        for (const m of missing) {
          console.log(`  Frontend ${m.frontend.method} ${m.frontend.path} (in ${m.frontend.file})`);
        }
      }
      if (methodMismatches.length) {
        console.log('\n- Method mismatches (path exists but method differs):');
        for (const mm of methodMismatches) {
          console.log(`  Frontend ${mm.frontend.method} ${mm.frontend.path} (in ${mm.frontend.file})`);
          console.log(`    Backend ${mm.match.backend.method} ${mm.match.backend.path} (in ${mm.match.backend.file})`);
        }
      }
      if (paramMatches.length) {
        console.log('\n- Parameterized path matches (ok but normalized):');
        for (const pm of paramMatches) {
          console.log(`  Frontend ${pm.frontend.method} ${pm.frontend.path} (in ${pm.frontend.file})`);
          console.log(`    Backend ${pm.match.backend.method} ${pm.match.backend.path} (in ${pm.match.backend.file})`);
        }
      }
    }

    // Also list backend endpoints that have no frontend caller
    const beUnused = be.filter(b => !fe.some(f => f.path.replace(/:\w+/g, ':param') === b.path.replace(/:\w+/g, ':param')));
    if (beUnused.length) {
      console.log('\nBackend endpoints without frontend callers (might be admin-only):');
      for (const u of beUnused) console.log(`  Backend ${u.method} ${u.path} (in ${u.file})`);
    }

    // Exit code 0
  } catch (err) {
    console.error('Error running route check:', err);
    process.exit(2);
  }
})();
