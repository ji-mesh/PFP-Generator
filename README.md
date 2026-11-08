# `@jimesh/pfp-generator`

Universal, deterministic **6-layer Comic-Bust SVG Avatar Generator**, **Compact String/ID Attribute Codec (`pfp1-...`)**, **Procedural Name Generator**, and **Backend Persistence Server** for Autonomous Agents, Sovereign Experts, and Human Operators.

---

## Key Features

1. **Authentic Hand-Crafted Comic-Bust SVG Geometry (Zero Slopmocks)**
   - Built directly from the canonical `public/pfp/*.svg` vector pack (`coding_agent.svg`, `lila_agent.svg`, `ninja_agent.svg`, `orchestrator_agent.svg`, `browser_agent.svg`, `red_team_agent.svg`, `figma_agent.svg`, `voice_agent.svg`, `happy_agent.svg`, `founder.svg`, `ops.svg`, `product.svg`, `analyst.svg`, `qa.svg`).
   - Features bold `#000000` / `#0a0a0f` comic ink outlines, Ben-Day halftone dot clusters, 3D isometric extruded JiMesh cubes, fluttering ninja headbands & katanas, orchestrator conductor batons, dual toxic/sensor horn beacons, and comic nameplate banners.
2. **Compact String / ID Attribute Codec (`pfp1-...` — Zero-DB-Column Mode)**
   - Encode all 6 SVG layers + palette + optional persona callsign into a **single URL-safe string ID**:
     ```
     pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42
     ```
   - Store this single string in any existing `id`, `name`, or `avatar` field — no extra JSON columns required in your database schema!
   - Pass that string to `PFP.renderPfpSvg(id)` or `<img src="/api/v1/pfp/pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42.svg" />` to deterministically reconstruct the full 6-layer SVG in $O(1)$ time.
3. **Feature #2: Optional Procedural Name & Callsign Generator (`generatePersonaName`)**
   - Deterministically generates Agent/Expert/Operator names, callsigns, role titles, and comic banner labels from any seed or trait combination without polluting the core schema.
4. **100% Responsive Fluid ViewBox + Level-of-Detail (LOD) Scaling**
   - `viewBox="0 0 400 400"` with `width="100%" height="100%"` and `ResizeObserver` LOD switching:
     - **`micro` (`< 36px`)**: High-contrast bust + visor for tiny chat/table badges.
     - **`compact` (`36px – 95px`)**: Bust + headwear + chest emblem + halftone background.
     - **`full` (`>= 96px`)**: Full detail + comic sparkles + bottom nameplate banner.

---

## Repository Structure

```text
PFP-Generator/
├── index.html                        # Standalone interactive HTML Preview, Studio & Decoder
├── package.json                      # Importable NPM package (@jimesh/pfp-generator)
├── dist/
│   ├── pfp-generator.js              # Universal UMD / CJS / Browser bundle (window.PFP)
│   ├── pfp-generator.mjs             # ES Module bundle
│   └── index.d.ts                    # TypeScript declarations
├── src/
│   └── index.ts                      # TypeScript package entry point
├── schemas/
│   ├── pfp-ontology.ts               # SSOT TypeScript schema (@jimesh/schemas)
│   └── pfp-ontology.schema.json      # JSON Schema (Draft 2020-12)
├── backend/
│   ├── server.js                     # Standalone HTTP server + Express/Connect router
│   └── data/pfp-store.json           # Persistent JSON store for saved PFP profiles
├── public/pfp/                       # All 61 canonical static SVG assets & manifest.json
└── scripts/
    └── test.mjs                      # Automated determinism, codec, and LOD test suite
```

---

## Quick Start

### 1. Run the Interactive HTML Preview & Backend API Server

Zero external dependencies are required (`node >= 18`):

```bash
node backend/server.js
# -> Listening on http://127.0.0.1:4180
```

Or open `index.html` directly in any browser!

### 2. Import as a Package (ESM / CommonJS / TypeScript)

```ts
import PFP, {
  resolvePfpSpec,
  encodePfpId,
  decodePfpId,
  generatePersonaName,
  renderPfpSvg
} from '@jimesh/pfp-generator';

// A) Render directly from any seed or preset name
const svg = renderPfpSvg('ninja_agent', { fluid: true });

// B) Encode all PFP attributes into a single compact string ID (no JSON column needed!)
const spec = resolvePfpSpec('ses_alpha_01', 'agent', {
  headwear: 'crown',
  eyes: 'cyber_optic',
  chest: 'mesh_emblem'
});
const compactId = encodePfpId(spec, 'CyberKing_01');
// -> "pfp1-ag-c4-b4-ch6-e2-h5-a2-p1~CyberKing_01"

// C) Reconstruct & render the exact SVG anywhere from just that string
const decodedSpec = decodePfpId(compactId);
const reconstructedSvg = renderPfpSvg(compactId);

// D) Feature #2: Procedural Name + Compact ID Generator
const persona = generatePersonaName('agent-seed-99', { entityKind: 'agent' });
console.log(persona.name);      // e.g. "Nexus-42 // Weaver"
console.log(persona.compactId); // e.g. "pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42"
console.log(persona.svgUrl);    // e.g. "/api/v1/pfp/pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42.svg"
```

---

## Backend API Endpoints (`backend/server.js`)

Mount in Express (`app.use(createPfpRouter())`) or run standalone (`node backend/server.js`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/pfp/:idOrCompactSlug.svg` | Renders any saved ID, compact `pfp1-...` string, or preset (`ninja_agent.svg`) directly as `image/svg+xml`. |
| `GET` | `/api/v1/pfp/svg?seed=...&kind=agent` | Renders dynamic SVG with optional query overrides (`headwear`, `eyes`, `body`, `chest`, `background`, `size`). |
| `GET` | `/api/v1/pfp/generate-name?seed=...` | Runs Feature #2 (Name + Callsign + Compact ID generator). |
| `GET` | `/api/v1/pfp` | Lists all persisted PFP profiles and available presets. |
| `PUT` | `/api/v1/pfp/:id` | Persists a PFP specification + `compactId` to `backend/data/pfp-store.json`. |
| `DELETE` | `/api/v1/pfp/:id` | Deletes a persisted PFP profile. |

---

## Running Tests

```bash
npm test
```
