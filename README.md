# `@jimesh/pfp-generator`

Universal, deterministic **6-layer Comic-Bust SVG Avatar Generator**, **Compact String/ID Attribute Codec (`pfp1-...`)**, **Procedural Name Generator**, and **Backend Persistence Server** for Autonomous Agents, Cyber Creatures/Mascots, and Human Operators.

| Agents | Humans | Creatures |
| :---: | :---: | :---: |
| <img width="280" alt="Agents PFP Preview" src="https://github.com/user-attachments/assets/17413dc9-70a3-402a-a3e0-9442f38be723" /> | <img width="280" alt="Humans PFP Preview" src="https://github.com/user-attachments/assets/176a951a-4482-43be-ac10-aa68d8cafcbc" /> | <img width="280" alt="Creatures PFP Preview" src="https://github.com/user-attachments/assets/82882931-f879-4748-9e7f-7ff8c4305822" /> |

> Generate deterministic Agents, Humans, and Creatures/Mascots from any seed or compact string ID.

<img width="1457" height="1073" alt="Interactive Studio" src="https://github.com/user-attachments/assets/10873bbc-b3c6-4145-bc8a-4abfb86c7355" />

> Click to create & customize new PFPs across 6 SVG layers + custom palettes.

<img width="1350" height="576" alt="Presets Gallery" src="https://github.com/user-attachments/assets/4dd902b4-e694-4660-847b-be620dc1e1cd" />

> Save your own custom presets and export as SVG, PNG, or WebP in any resolution.

| <img width="388" height="627" alt="image" src="https://github.com/user-attachments/assets/17413dc9-70a3-402a-a3e0-9442f38be723" /> | <img width="388" height="627" alt="image" src="https://github.com/user-attachments/assets/176a951a-4482-43be-ac10-aa68d8cafcbc" /> | <img width="388" height="627" alt="image" src="https://github.com/user-attachments/assets/82882931-f879-4748-9e7f-7ff8c4305822" /> |

> generate agents, humans, creatures...




---

## Key Features

1. **Authentic Hand-Crafted Comic-Bust SVG Geometry (Zero Slopmocks)**
   - Built directly from the canonical `public/pfp/*.svg` vector pack (`coding_agent.svg`, `lila_agent.svg`, `ninja_agent.svg`, `orchestrator_agent.svg`, `browser_agent.svg`, `red_team_agent.svg`, `figma_agent.svg`, `voice_agent.svg`, `happy_agent.svg`, `founder.svg`, `ops.svg`, `product.svg`, `analyst.svg`, `qa.svg`) plus 7 distinct Creature/Mascot species (Dragon, Dire Wolf, Grizzly Bear, Night Owl, Kraken/Cthulhu, Minotaur Bull, Kitsune Fox).
   - Features bold `#000000` / `#0a0a0f` comic ink outlines, Ben-Day halftone dot clusters, 3D isometric extruded JiMesh cubes, fluttering ninja headbands & katanas, orchestrator conductor batons, dual toxic/sensor horn beacons, and comic nameplate banners.
2. **Compact String / ID Attribute Codec (`pfp1-...` — Zero-DB-Column Mode)**
   - Encode all 6 SVG layers + palette + optional persona callsign into a **single URL-safe string ID**:
     ```
     pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42
     ```
   - Store this single string in any existing `id`, `name`, or `avatar` field — no extra JSON columns required in your database schema!
   - Pass that string to `PFP.renderPfpSvg(id)` or `<img src="/api/v1/pfp/pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42.svg" />` to deterministically reconstruct the full 6-layer SVG in $O(1)$ time.
3. **Feature #2: Optional Procedural Name & Callsign Generator (`generatePersonaName`)**
   - Deterministically generates Agent, Creature/Mascot, and Human Operator names, callsigns, role titles, and comic banner labels from any seed or trait combination without polluting the core schema.
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
├── start.sh                          # One-click Linux/macOS server + browser launcher
├── start-windows.bat                 # One-click Windows server + browser launcher
├── PFP-Generator.desktop             # Linux Desktop double-click launcher
├── package.json                      # Importable NPM package (@jimesh/pfp-generator)
├── dist/
│   ├── pfp-generator.js              # Universal UMD / CJS / Browser bundle (window.PFP)
│   ├── pfp-generator.mjs             # ES Module bundle
│   └── index.d.ts                    # TypeScript declarations
├── src/
│   └── index.ts                      # TypeScript package entry point
├── schemas/
│   ├── pfp-ontology.ts               # Pure SSOT TypeScript schema for PFP Generator
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
./start.sh
# or: node backend/server.js -> http://127.0.0.1:4180
```

Or open `index.html` directly in any browser!

### 2. Import as a Package (ESM / CommonJS / TypeScript)

```ts
import PFP, {
  resolvePfpSpec,
  encodePfpId,
  decodePfpId,
  generatePersonaName,
  renderPfpSvg,
  openExportModal
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
const persona = generatePersonaName('kitsune-seed-99', { entityKind: 'creature' });
console.log(persona.name);      // e.g. "Kitsune-42 // Cyber Fox"
console.log(persona.compactId); // e.g. "pfp1-cr-c5-b5-ch6-e2-h6-a6-p6~Kitsune-42"
console.log(persona.svgUrl);    // e.g. "/api/v1/pfp/pfp1-cr-c5-b5-ch6-e2-h6-a6-p6~Kitsune-42.svg"
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
| `PUT` | `/api/v1/pfp/:id` | Persists a PFP specification + `compactId` to `backend/data/pfp-store.json` and writes `public/pfp/custom_<id>.svg`. |
| `DELETE` | `/api/v1/pfp/:id` | Deletes a persisted PFP profile. |

---

## Running Tests

```bash
npm test
```
