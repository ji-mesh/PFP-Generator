import assert from 'node:assert/strict';
import PFP from '../dist/pfp-generator.mjs';

console.log('Running @jimesh/pfp-generator test suite...');

// 1. Determinism test (FNV-1a + Mulberry32)
const specA1 = PFP.resolvePfpSpec('ses_orchestrator_01', 'agent');
const specA2 = PFP.resolvePfpSpec('ses_orchestrator_01', 'agent');
assert.deepEqual(specA1, specA2, 'Same seed must resolve to identical PfpSpec');

const specB = PFP.resolvePfpSpec('ses_red_team_99', 'agent');
assert.notDeepEqual(specA1, specB, 'Different seeds must produce distinct specs');

// 2. Compact String / ID Attribute Codec roundtrip test (`pfp1-...`)
const compactId = PFP.encodePfpId(specA1, 'Nexus_01');
assert.ok(compactId.startsWith('pfp1-ag-'), 'Compact ID must start with pfp1-ag-');
assert.ok(compactId.endsWith('~Nexus_01'), 'Compact ID must preserve optional name slug');

const decoded = PFP.decodePfpId(compactId);
assert.ok(decoded, 'decodePfpId must return a valid spec');
assert.equal(decoded.entityKind, specA1.entityKind);
assert.equal(decoded.headwear, specA1.headwear);
assert.equal(decoded.eyes, specA1.eyes);
assert.equal(decoded.body, specA1.body);
assert.equal(decoded.chest, specA1.chest);
assert.equal(decoded.background, specA1.background);
assert.equal(decoded.accessoryBadge, specA1.accessoryBadge);
assert.equal(decoded.displayName, 'Nexus 01');

// 3. Feature #2: Procedural Name Generator test
const persona = PFP.generatePersonaName('agent-alpha-7', { entityKind: 'agent' });
assert.ok(persona.name.length > 3, 'Generated persona must have a display name');
assert.ok(persona.compactId.startsWith('pfp1-ag-'), 'Generated persona must include compactId');
assert.ok(persona.svgUrl.endsWith('.svg'), 'Generated persona must include backend SVG endpoint URL');

// 4. Responsive SVG & LOD output test
const svgFull = PFP.renderPfpSvg(compactId, { fluid: true, lod: 'full' });
assert.ok(svgFull.includes('viewBox="0 0 400 400"'), 'SVG must use 400x400 viewBox');
assert.ok(svgFull.includes('width="100%" height="100%"'), 'Fluid SVG must use 100% dimensions');
assert.ok(svgFull.includes('data-pfp-lod="full"'), 'Full LOD attribute must be present');

const svgMicro = PFP.renderPfpSvg(compactId, { size: 24 });
assert.ok(svgMicro.includes('data-pfp-lod="micro"'), 'Size < 36px must automatically select micro LOD');
assert.ok(svgMicro.length < svgFull.length, 'Micro LOD must strip heavy details for crisp rendering');

// 5. Curated Preset & Creature Mascot resolution test
const ninjaSpec = PFP.resolvePfpSpec('ninja_agent', 'agent');
assert.equal(ninjaSpec.headwear, 'cyber_helmet');
assert.equal(ninjaSpec.chest, 'reactor_core');

const creaturePersona = PFP.generatePersonaName('kitsune-seed-01', { entityKind: 'creature' });
assert.ok(creaturePersona.compactId.startsWith('pfp1-cr-'), 'Creature compactId must use cr entity code');
const creatureSvg = PFP.renderPfpSvg(creaturePersona.compactId);
assert.ok(creatureSvg.includes('viewBox="0 0 400 400"'), 'Creature SVG must render valid 400x400 comic bust');

console.log('✓ All @jimesh/pfp-generator tests passed! Example compactId:', compactId);
