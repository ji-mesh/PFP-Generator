#!/usr/bin/env node
/**
 * @jimesh/pfp-generator — Backend Persistence & Dynamic SVG Server
 *
 * Works in two modes:
 * 1. Standalone zero-dependency Node.js HTTP server (`node backend/server.js` -> http://127.0.0.1:4180)
 * 2. Mountable Express / Connect middleware (`const { createPfpRouter } = require('./backend/server')`)
 *
 * Endpoints:
 * - GET    /api/v1/pfp                         -> List all persisted PFP records
 * - GET    /api/v1/pfp/svg?seed=...            -> Render dynamic SVG from query params or compactId
 * - GET    /api/v1/pfp/generate-name?seed=...  -> Feature #2: Generate Name + Callsign + Compact PFP ID
 * - GET    /api/v1/pfp/:idOrSlug.svg           -> Render SVG from persisted ID, compact `pfp1-...` slug, or preset
 * - GET    /api/v1/pfp/:id                     -> Resolve JSON spec + compactId for an ID or slug
 * - PUT    /api/v1/pfp/:id                     -> Persist PFP spec & compactId to disk (`backend/data/pfp-store.json`)
 * - DELETE /api/v1/pfp/:id                     -> Delete persisted PFP record
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PFP = require('../dist/pfp-generator.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_DATA_FILE = path.join(__dirname, 'data', 'pfp-store.json');
const PUBLIC_PFP_DIR = path.join(ROOT_DIR, 'public', 'pfp');

function ensureStoreFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    const initialData = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      records: {}
    };
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readStore(filePath) {
  ensureStoreFile(filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.records === 'object' ? parsed : { version: '1.0.0', records: {} };
  } catch (_err) {
    return { version: '1.0.0', records: {} };
  }
}

function writeStore(filePath, storeObj) {
  ensureStoreFile(filePath);
  storeObj.updatedAt = new Date().toISOString();
  fs.writeFileSync(filePath, JSON.stringify(storeObj, null, 2), 'utf8');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf8');
      if (body.length > 512 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-JiMesh-Trace-Id'
  });
  res.end(body);
}

function sendSvg(res, svgMarkup) {
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=60',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(svgMarkup);
}

/**
 * Creates a request handler usable in Express (`app.use(createPfpRouter())`)
 * or raw Node `http.createServer`.
 */
function createPfpRouter(options) {
  const opts = options || {};
  const dataFile = opts.dataFile || DEFAULT_DATA_FILE;

  return async function pfpRequestHandler(req, res, next) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsedUrl.pathname || '/');
    const query = parsedUrl.query || {};

    if (req.method === 'OPTIONS' && pathname.startsWith('/api/v1/pfp')) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-JiMesh-Trace-Id'
      });
      return res.end();
    }

    // 1. GET /api/v1/pfp/svg?seed=...&kind=...
    if (req.method === 'GET' && pathname === '/api/v1/pfp/svg') {
      const seedOrId = String(query.id || query.compactId || query.seed || 'jimesh-default');
      const kind = String(query.kind || 'agent');
      const size = Number(query.size) || 0;
      const overrides = {};
      if (query.headwear) overrides.headwear = String(query.headwear);
      if (query.eyes) overrides.eyes = String(query.eyes);
      if (query.body) overrides.body = String(query.body);
      if (query.chest) overrides.chest = String(query.chest);
      if (query.background) overrides.background = String(query.background);
      if (query.accessoryBadge) overrides.accessoryBadge = String(query.accessoryBadge);
      if (query.displayName) overrides.displayName = String(query.displayName);

      const spec = PFP.resolvePfpSpec(seedOrId, kind, overrides);
      const svg = PFP.renderPfpSvg(spec, { size: size, fluid: ! query.fixedPx });
      return sendSvg(res, svg);
    }

    // 2. GET /api/v1/pfp/generate-name?seed=...&kind=... (Feature #2)
    if (req.method === 'GET' && pathname === '/api/v1/pfp/generate-name') {
      const seed = String(query.seed || 'agent-' + Date.now().toString(36));
      const kind = String(query.kind || 'agent');
      const persona = PFP.generatePersonaName(seed, {
        entityKind: kind,
        customName: query.customName ? String(query.customName) : undefined
      });
      return sendJson(res, 200, {
        ok: true,
        ts: new Date().toISOString(),
        persona: persona
      });
    }

    // 3. GET /api/v1/pfp/:idOrSlug.svg
    const svgMatch = pathname.match(/^\/api\/v1\/pfp\/([^/]+)\.svg$/i);
    if (req.method === 'GET' && svgMatch) {
      const idOrSlug = svgMatch[1];
      const store = readStore(dataFile);
      const saved = store.records[idOrSlug];
      if (saved && saved.spec) {
        return sendSvg(res, PFP.renderPfpSvg(saved.spec, { fluid: true }));
      }
      // Check if it's a compact `pfp1-...` string or preset or seed
      const spec = PFP.resolvePfpSpec(idOrSlug, String(query.kind || 'agent'));
      return sendSvg(res, PFP.renderPfpSvg(spec, { fluid: true }));
    }

    // 4. GET /api/v1/pfp (list all saved records + presets)
    if (req.method === 'GET' && pathname === '/api/v1/pfp') {
      const store = readStore(dataFile);
      return sendJson(res, 200, {
        ok: true,
        ts: new Date().toISOString(),
        count: Object.keys(store.records).length,
        records: store.records,
        presets: Object.keys(PFP.PRESET_CATALOG)
      });
    }

    // 5. GET /api/v1/pfp/:id (resolve single saved record or decode compactId)
    const itemMatch = pathname.match(/^\/api\/v1\/pfp\/([^/]+)$/);
    if (req.method === 'GET' && itemMatch) {
      const id = itemMatch[1];
      const store = readStore(dataFile);
      if (store.records[id]) {
        return sendJson(res, 200, { ok: true, persisted: true, record: store.records[id] });
      }
      const spec = PFP.resolvePfpSpec(id, String(query.kind || 'agent'));
      return sendJson(res, 200, {
        ok: true,
        persisted: false,
        record: {
          id: id,
          compactId: spec.compactId,
          svgUrl: '/api/v1/pfp/' + encodeURIComponent(spec.compactId) + '.svg',
          spec: spec
        }
      });
    }

    // 6. PUT /api/v1/pfp/:id or POST /api/v1/pfp (persist PFP spec / compactId)
    if ((req.method === 'PUT' && itemMatch) || (req.method === 'POST' && pathname === '/api/v1/pfp')) {
      try {
        const body = await parseJsonBody(req);
        const targetId = itemMatch ? itemMatch[1] : String(body.id || body.avatarId || body.compactId || 'pfp-' + Date.now().toString(36));
        const inputSpec = body.pfp_spec || body.spec || body;
        const kind = String(inputSpec.entityKind || body.entityKind || 'agent');

        // Support saving either via compactId string OR full trait object
        const resolved = inputSpec.compactId && !inputSpec.headwear
          ? PFP.resolvePfpSpec(inputSpec.compactId, kind)
          : PFP.resolvePfpSpec(inputSpec.seed || targetId, kind, inputSpec);

        if (body.displayName || inputSpec.displayName) {
          resolved.displayName = String(body.displayName || inputSpec.displayName).trim();
        }
        resolved.compactId = PFP.encodePfpId(resolved, resolved.displayName);

        const safeSlug = targetId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'custom';
        const svgFileName = safeSlug.startsWith('custom_') ? (safeSlug + '.svg') : ('custom_' + safeSlug + '.svg');
        const svgDiskPath = path.join(PUBLIC_PFP_DIR, svgFileName);
        const renderedSvg = PFP.renderPfpSvg(resolved, { size: 400, fixedPx: true, lod: 'full' });
        try {
          if (fs.existsSync(PUBLIC_PFP_DIR)) {
            fs.writeFileSync(svgDiskPath, renderedSvg, 'utf8');
          }
        } catch (_writeErr) {}

        const store = readStore(dataFile);
        const record = {
          id: targetId,
          compactId: resolved.compactId,
          displayName: resolved.displayName || null,
          entityKind: resolved.entityKind,
          svgUrl: '/api/v1/pfp/' + encodeURIComponent(resolved.compactId) + '.svg',
          staticSvgFile: '/pfp/' + svgFileName,
          spec: resolved,
          updatedAt: new Date().toISOString()
        };
        store.records[targetId] = record;
        writeStore(dataFile, store);

        return sendJson(res, 200, {
          ok: true,
          ts: record.updatedAt,
          record: record
        });
      } catch (err) {
        return sendJson(res, 400, { ok: false, error: err.message });
      }
    }

    // 7. DELETE /api/v1/pfp/:id
    if (req.method === 'DELETE' && itemMatch) {
      const id = itemMatch[1];
      const store = readStore(dataFile);
      const existed = Boolean(store.records[id]);
      delete store.records[id];
      writeStore(dataFile, store);
      return sendJson(res, 200, { ok: true, deleted: existed, id: id });
    }

    if (typeof next === 'function') {
      return next();
    }
    return false;
  };
}

// ---------------------------------------------------------------------------
// STANDALONE HTTP SERVER (FOR LOCAL PREVIEW & API TESTING)
// ---------------------------------------------------------------------------

function startStandaloneServer(port) {
  const listenPort = Number(port || process.env.PORT || 4180);
  const apiHandler = createPfpRouter();

  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.ts': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
  };

  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsedUrl.pathname || '/');

    if (pathname.startsWith('/api/v1/pfp')) {
      return apiHandler(req, res);
    }

    // Serve static files from repo root & public/pfp
    let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
    if (pathname.startsWith('/pfp/') && !fs.existsSync(filePath)) {
      filePath = path.join(PUBLIC_PFP_DIR, pathname.replace(/^\/pfp\//, ''));
    }

    // Prevent directory traversal outside ROOT_DIR
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Not found: ' + pathname }));
  });

  server.listen(listenPort, '0.0.0.0', () => {
    console.log('[@jimesh/pfp-generator] Preview & API server listening on http://127.0.0.1:' + listenPort);
  });

  return server;
}

if (require.main === module) {
  startStandaloneServer();
}

module.exports = {
  createPfpRouter: createPfpRouter,
  startStandaloneServer: startStandaloneServer
};
