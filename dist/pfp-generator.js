/**
 * @jimesh/pfp-generator — Universal Responsive SVG Avatar Engine, Compact ID Codec & Name Generator
 *
 * - Zero Slopmocks: Built directly from the authentic hand-crafted JiMesh comic-bust SVG geometry
 *   (6px comic ink outlines, halftone dot patterns, 3D isometric extruded JiMesh cube, dual toxic beacons,
 *   fluttering ninja headband & katana, orchestrator baton, browser window visor, and human operator busts).
 * - Compact String / ID Attribute Codec (`pfp1-...~Callsign`): Encode all 6 layers + palette + name
 *   into a single URL-safe string ID so avatars can be reconstructed without extra DB columns.
 * - Optional Procedural Name Generator (Feature #2): Deterministically generates Agent/Expert/Operator
 *   names, callsigns, and comic nameplate banners from any seed or trait combination.
 * - Responsive Fluid ViewBox + ResizeObserver LOD (`micro` <36px, `compact` 36-95px, `full` >=96px).
 * - Universal UMD/CJS/Browser module (`window.PFP` + Node.js `module.exports`).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PFP = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var HEADWEAR_VALUES = [
    'none', 'cap', 'fedora', 'headset', 'beanie',
    'crown', 'halo', 'cyber_visor', 'cyber_helmet', 'beret'
  ];

  var EYES_VALUES = [
    'normal', 'focused', 'cyber_optic', 'happy', 'glasses',
    'sunglasses', 'laser', 'wink', 'terminal_glow'
  ];

  var BODY_VALUES = [
    'hoodie', 'suit', 'robot_chassis', 'casual_tee',
    'cyber_armor', 'lab_coat', 'turtleneck'
  ];

  var CHEST_VALUES = [
    'none', 'tie', 'reactor_core', 'necklace',
    'pocket', 'harness', 'mesh_emblem'
  ];

  var BACKGROUND_VALUES = [
    'mesh_gradient', 'cyber_grid', 'pastel_dots', 'geometric',
    'matrix_rain', 'deep_space', 'solid_mesh'
  ];

  var ACCESSORY_VALUES = [
    'none', 'crm_shield', 'code_brackets', 'marketing_megaphone',
    'devops_gear', 'security_lock', 'ai_spark', 'nango_sync_badge', 'composio_connector'
  ];

  var ENTITY_CODE_TO_KIND = { ag: 'agent', ex: 'expert', hu: 'human' };
  var ENTITY_KIND_TO_CODE = { agent: 'ag', expert: 'ex', human: 'hu' };

  var ALL_PALETTES = [
    { id: 'coding_cyan', name: 'Coding Cyan', primary: '#0ea5e9', secondary: '#0369a1', accent: '#7dd3fc', background: '#071926', skinOrChassis: '#0ea5e9' },
    { id: 'lila_toxic', name: 'Lila Toxic', primary: '#9333ea', secondary: '#581c87', accent: '#a3e635', background: '#170926', skinOrChassis: '#9333ea' },
    { id: 'ninja_stealth', name: 'Ninja Stealth', primary: '#334155', secondary: '#0f172a', accent: '#c084fc', background: '#0d0b18', skinOrChassis: '#1e293b' },
    { id: 'orch_violet', name: 'Orchestrator Violet', primary: '#8b5cf6', secondary: '#4c1d95', accent: '#e9d5ff', background: '#110926', skinOrChassis: '#7c3aed' },
    { id: 'red_adversary', name: 'Red Team Crimson', primary: '#ef4444', secondary: '#991b1b', accent: '#fca5a5', background: '#210709', skinOrChassis: '#dc2626' },
    { id: 'figma_emerald', name: 'Design Emerald', primary: '#10b981', secondary: '#047857', accent: '#6ee7b7', background: '#041a12', skinOrChassis: '#10b981' },
    { id: 'voice_amber', name: 'Voice Amber', primary: '#f59e0b', secondary: '#b45309', accent: '#fef08a', background: '#241204', skinOrChassis: '#f59e0b' },
    { id: 'happy_pink', name: 'Joy Magenta', primary: '#ec4899', secondary: '#9d174d', accent: '#fbcfe8', background: '#26081c', skinOrChassis: '#ec4899' },
    { id: 'exp_sovereign', name: 'Sovereign Gold', primary: '#7c3aed', secondary: '#4c1d95', accent: '#fbbf24', background: '#120924', skinOrChassis: '#8b5cf6' },
    { id: 'exp_cyber', name: 'SecOps Emerald', primary: '#059669', secondary: '#065f46', accent: '#38bdf8', background: '#041a14', skinOrChassis: '#10b981' },
    { id: 'exp_crimson', name: 'Adversary Ruby', primary: '#e11d48', secondary: '#881337', accent: '#fde047', background: '#1f0610', skinOrChassis: '#f43f5e' },
    { id: 'exp_cobalt', name: 'Architect Cobalt', primary: '#2563eb', secondary: '#1e3a8a', accent: '#67e8f9', background: '#07132b', skinOrChassis: '#3b82f6' },
    { id: 'hum_founder', name: 'Founder Violet', primary: '#7c3aed', secondary: '#4c1d95', accent: '#c084fc', background: '#160d29', skinOrChassis: '#f3c6a5' },
    { id: 'hum_ops', name: 'Ops Cyan', primary: '#0284c7', secondary: '#0369a1', accent: '#38bdf8', background: '#081c29', skinOrChassis: '#eab68c' },
    { id: 'hum_product', name: 'Product Emerald', primary: '#10b981', secondary: '#047857', accent: '#6ee7b7', background: '#071f18', skinOrChassis: '#c68b59' },
    { id: 'hum_analyst', name: 'Analyst Amber', primary: '#d97706', secondary: '#92400e', accent: '#fcd34d', background: '#211305', skinOrChassis: '#f5d0b5' },
    { id: 'hum_qa', name: 'QA Rose', primary: '#e11d48', secondary: '#9f1239', accent: '#fda4af', background: '#240812', skinOrChassis: '#8d5524' },
    { id: 'hum_sales', name: 'Sales Indigo', primary: '#4f46e5', secondary: '#312e81', accent: '#818cf8', background: '#0c0a24', skinOrChassis: '#f1c27d' }
  ];

  var PALETTES = {
    agent: ALL_PALETTES.slice(0, 12),
    expert: ALL_PALETTES.slice(0, 12),
    human: ALL_PALETTES.slice(12).concat(ALL_PALETTES.slice(0, 6)),
    all: ALL_PALETTES
  };

  var CUSTOM_PALETTES_STORAGE_KEY = 'jimesh_pfp_custom_palettes_v1';
  var CUSTOM_PRESETS_STORAGE_KEY = 'jimesh_pfp_custom_presets_v1';
  var memoryCustomPalettes = [];
  var memoryCustomPresets = {};

  function getCustomPalettes() {
    if (typeof localStorage !== 'undefined') {
      try {
        var raw = localStorage.getItem(CUSTOM_PALETTES_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (_e) {}
    }
    return memoryCustomPalettes.slice();
  }

  function saveCustomPalette(paletteObj) {
    if (!paletteObj || !paletteObj.primary) return null;
    var list = getCustomPalettes();
    var entry = {
      id: paletteObj.id || ('custom_pal_' + Date.now().toString(36)),
      name: String(paletteObj.name || 'Custom Palette').trim(),
      primary: paletteObj.primary || '#0ea5e9',
      secondary: paletteObj.secondary || '#0369a1',
      accent: paletteObj.accent || '#7dd3fc',
      background: paletteObj.background || '#071926',
      skinOrChassis: paletteObj.skinOrChassis || '#0ea5e9',
      isCustom: true
    };
    list = list.filter(function (p) { return p.id !== entry.id && p.name !== entry.name; });
    list.unshift(entry);
    memoryCustomPalettes = list;
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(CUSTOM_PALETTES_STORAGE_KEY, JSON.stringify(list)); } catch (_e) {}
    }
    return entry;
  }

  function deleteCustomPalette(id) {
    var list = getCustomPalettes().filter(function (p) { return p.id !== id; });
    memoryCustomPalettes = list;
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(CUSTOM_PALETTES_STORAGE_KEY, JSON.stringify(list)); } catch (_e) {}
    }
    return list;
  }

  /**
   * Curated Preset Registry mapping directly to `public/pfp/<preset>.svg`
   * AND providing exact composable 6-layer traits when customized.
   */
  var PRESET_CATALOG = {
    coding_agent: {
      presetId: 'coding_agent',
      svgFile: '/pfp/coding_agent.svg',
      entityKind: 'agent',
      title: 'CODING AGENT // PR SYNTH',
      background: 'mesh_gradient',
      body: 'robot_chassis',
      chest: 'mesh_emblem',
      eyes: 'terminal_glow',
      headwear: 'none',
      accessoryBadge: 'code_brackets',
      palette: PALETTES.agent[0]
    },
    lila_agent: {
      presetId: 'lila_agent',
      svgFile: '/pfp/lila_agent.svg',
      entityKind: 'agent',
      title: 'LILA AGENT // TOXIC CORE',
      background: 'deep_space',
      body: 'cyber_armor',
      chest: 'mesh_emblem',
      eyes: 'cyber_optic',
      headwear: 'cyber_visor',
      accessoryBadge: 'ai_spark',
      palette: PALETTES.agent[1]
    },
    browser_agent: {
      presetId: 'browser_agent',
      svgFile: '/pfp/browser_agent.svg',
      entityKind: 'agent',
      title: 'BROWSER AGENT // WEB RPA',
      background: 'cyber_grid',
      body: 'robot_chassis',
      chest: 'harness',
      eyes: 'focused',
      headwear: 'cyber_visor',
      accessoryBadge: 'composio_connector',
      palette: PALETTES.agent[0]
    },
    orchestrator_agent: {
      presetId: 'orchestrator_agent',
      svgFile: '/pfp/orchestrator_agent.svg',
      entityKind: 'agent',
      title: 'ORCHESTRATOR AGENT',
      background: 'solid_mesh',
      body: 'suit',
      chest: 'tie',
      eyes: 'cyber_optic',
      headwear: 'none',
      accessoryBadge: 'nango_sync_badge',
      palette: PALETTES.agent[3]
    },
    ninja_agent: {
      presetId: 'ninja_agent',
      svgFile: '/pfp/ninja_agent.svg',
      entityKind: 'agent',
      title: 'NINJA AGENT // STEALTH OPS',
      background: 'matrix_rain',
      body: 'cyber_armor',
      chest: 'reactor_core',
      eyes: 'focused',
      headwear: 'cyber_helmet',
      accessoryBadge: 'security_lock',
      palette: PALETTES.agent[2]
    },
    red_team_agent: {
      presetId: 'red_team_agent',
      svgFile: '/pfp/red_team_agent.svg',
      entityKind: 'agent',
      title: 'RED TEAM // ADVERSARY SIM',
      background: 'geometric',
      body: 'cyber_armor',
      chest: 'reactor_core',
      eyes: 'laser',
      headwear: 'fedora',
      accessoryBadge: 'security_lock',
      palette: PALETTES.agent[4]
    },
    figma_agent: {
      presetId: 'figma_agent',
      svgFile: '/pfp/figma_agent.svg',
      entityKind: 'agent',
      title: 'DESIGN AGENT // FIGMA & SVG',
      background: 'pastel_dots',
      body: 'robot_chassis',
      chest: 'pocket',
      eyes: 'normal',
      headwear: 'beret',
      accessoryBadge: 'ai_spark',
      palette: PALETTES.agent[5]
    },
    voice_agent: {
      presetId: 'voice_agent',
      svgFile: '/pfp/voice_agent.svg',
      entityKind: 'agent',
      title: 'VOICE AGENT // WEBRTC SIP',
      background: 'solid_mesh',
      body: 'robot_chassis',
      chest: 'pocket',
      eyes: 'normal',
      headwear: 'headset',
      accessoryBadge: 'marketing_megaphone',
      palette: PALETTES.agent[6]
    },
    happy_agent: {
      presetId: 'happy_agent',
      svgFile: '/pfp/happy_agent.svg',
      entityKind: 'agent',
      title: 'HAPPY AGENT // SUCCESS BOT',
      background: 'pastel_dots',
      body: 'casual_tee',
      chest: 'mesh_emblem',
      eyes: 'happy',
      headwear: 'halo',
      accessoryBadge: 'crm_shield',
      palette: PALETTES.agent[7]
    },
    founder: {
      presetId: 'founder',
      svgFile: '/pfp/founder.svg',
      entityKind: 'human',
      title: 'FOUNDER // EXECUTIVE',
      background: 'mesh_gradient',
      body: 'suit',
      chest: 'tie',
      eyes: 'normal',
      headwear: 'none',
      accessoryBadge: 'ai_spark',
      palette: PALETTES.human[0]
    },
    ops: {
      presetId: 'ops',
      svgFile: '/pfp/ops.svg',
      entityKind: 'human',
      title: 'SRE // DEVOPS LEAD',
      background: 'cyber_grid',
      body: 'hoodie',
      chest: 'harness',
      eyes: 'glasses',
      headwear: 'headset',
      accessoryBadge: 'devops_gear',
      palette: PALETTES.human[1]
    },
    product: {
      presetId: 'product',
      svgFile: '/pfp/product.svg',
      entityKind: 'human',
      title: 'PRODUCT // ROADMAP',
      background: 'geometric',
      body: 'turtleneck',
      chest: 'mesh_emblem',
      eyes: 'happy',
      headwear: 'cap',
      accessoryBadge: 'crm_shield',
      palette: PALETTES.human[2]
    },
    analyst: {
      presetId: 'analyst',
      svgFile: '/pfp/analyst.svg',
      entityKind: 'human',
      title: 'DATA ANALYST // BI',
      background: 'deep_space',
      body: 'lab_coat',
      chest: 'pocket',
      eyes: 'glasses',
      headwear: 'none',
      accessoryBadge: 'code_brackets',
      palette: PALETTES.human[3]
    },
    qa: {
      presetId: 'qa',
      svgFile: '/pfp/qa.svg',
      entityKind: 'human',
      title: 'QA ENGINEER // VERIFICATION',
      background: 'matrix_rain',
      body: 'hoodie',
      chest: 'necklace',
      eyes: 'focused',
      headwear: 'beanie',
      accessoryBadge: 'security_lock',
      palette: PALETTES.human[4]
    },
    fin_agent: {
      presetId: 'fin_agent',
      svgFile: '/pfp/fin_agent.svg',
      entityKind: 'agent',
      title: 'FIN AGENT // LEDGER CORE',
      background: 'geometric',
      body: 'suit',
      chest: 'tie',
      eyes: 'focused',
      headwear: 'crown',
      accessoryBadge: 'crm_shield',
      palette: ALL_PALETTES[8]
    },
    green_agent: {
      presetId: 'green_agent',
      svgFile: '/pfp/green_agent.svg',
      entityKind: 'agent',
      title: 'GREEN AGENT // HEALTH MONITOR',
      background: 'cyber_grid',
      body: 'robot_chassis',
      chest: 'reactor_core',
      eyes: 'cyber_optic',
      headwear: 'none',
      accessoryBadge: 'devops_gear',
      palette: ALL_PALETTES[5]
    },
    orange_agent: {
      presetId: 'orange_agent',
      svgFile: '/pfp/orange_agent.svg',
      entityKind: 'agent',
      title: 'ORANGE AGENT // PIPELINE OPS',
      background: 'solid_mesh',
      body: 'cyber_armor',
      chest: 'harness',
      eyes: 'terminal_glow',
      headwear: 'cap',
      accessoryBadge: 'composio_connector',
      palette: ALL_PALETTES[6]
    },
    blue_agent: {
      presetId: 'blue_agent',
      svgFile: '/pfp/blue_agent.svg',
      entityKind: 'agent',
      title: 'BLUE TEAM // DEFENDER',
      background: 'deep_space',
      body: 'cyber_armor',
      chest: 'mesh_emblem',
      eyes: 'cyber_optic',
      headwear: 'cyber_helmet',
      accessoryBadge: 'security_lock',
      palette: ALL_PALETTES[11]
    },
    bad_agent: {
      presetId: 'bad_agent',
      svgFile: '/pfp/bad_agent.svg',
      entityKind: 'agent',
      title: 'ROGUE AGENT // CHAOS SIM',
      background: 'matrix_rain',
      body: 'cyber_armor',
      chest: 'reactor_core',
      eyes: 'laser',
      headwear: 'cyber_visor',
      accessoryBadge: 'security_lock',
      palette: ALL_PALETTES[4]
    },
    sales1: {
      presetId: 'sales1',
      svgFile: '/pfp/sales1.svg',
      entityKind: 'human',
      title: 'ACCOUNT EXEC // ENTERPRISE',
      background: 'mesh_gradient',
      body: 'suit',
      chest: 'tie',
      eyes: 'happy',
      headwear: 'none',
      accessoryBadge: 'crm_shield',
      palette: ALL_PALETTES[17]
    },
    support_female: {
      presetId: 'support_female',
      svgFile: '/pfp/support_female.svg',
      entityKind: 'human',
      title: 'SUPPORT LEAD // HELPDESK',
      background: 'pastel_dots',
      body: 'turtleneck',
      chest: 'necklace',
      eyes: 'happy',
      headwear: 'headset',
      accessoryBadge: 'marketing_megaphone',
      palette: ALL_PALETTES[14]
    },
    customer_success: {
      presetId: 'customer_success',
      svgFile: '/pfp/customer_success.svg',
      entityKind: 'human',
      title: 'CUSTOMER SUCCESS // ONBOARDING',
      background: 'solid_mesh',
      body: 'casual_tee',
      chest: 'mesh_emblem',
      eyes: 'wink',
      headwear: 'beret',
      accessoryBadge: 'crm_shield',
      palette: ALL_PALETTES[12]
    }
  };

  function getCustomPresets() {
    if (typeof localStorage !== 'undefined') {
      try {
        var raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch (_e) {}
    }
    return Object.assign({}, memoryCustomPresets);
  }

  function saveCustomPreset(nameOrId, specInput) {
    var rawTitle = String(nameOrId || (specInput && specInput.displayName) || 'Custom Preset').trim();
    var presetId = 'custom_' + rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 28);
    if (presetId === 'custom_') presetId = 'custom_' + Date.now().toString(36);

    var spec = (specInput && typeof specInput === 'object' && specInput.headwear)
      ? Object.assign({}, specInput)
      : resolvePfpSpec(rawTitle, 'agent');
    spec.displayName = rawTitle;
    spec.compactId = encodePfpId(spec, rawTitle);

    var record = {
      presetId: presetId,
      title: rawTitle.toUpperCase(),
      entityKind: spec.entityKind || 'agent',
      background: spec.background,
      body: spec.body,
      chest: spec.chest,
      eyes: spec.eyes,
      headwear: spec.headwear,
      accessoryBadge: spec.accessoryBadge,
      palette: Object.assign({}, spec.palette),
      compactId: spec.compactId,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    var map = getCustomPresets();
    map[presetId] = record;
    memoryCustomPresets = map;
    PRESET_CATALOG[presetId] = record;

    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(map)); } catch (_e) {}
    }
    return record;
  }

  function deleteCustomPreset(presetId) {
    var map = getCustomPresets();
    delete map[presetId];
    delete memoryCustomPresets[presetId];
    if (PRESET_CATALOG[presetId] && PRESET_CATALOG[presetId].isCustom) {
      delete PRESET_CATALOG[presetId];
    }
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(map)); } catch (_e) {}
    }
    return map;
  }

  function getAllPresets() {
    var custom = getCustomPresets();
    Object.keys(custom).forEach(function (k) {
      PRESET_CATALOG[k] = custom[k];
    });
    return PRESET_CATALOG;
  }

  // ---------------------------------------------------------------------------
  // DETERMINISTIC PRNG (FNV-1a + Mulberry32)
  // ---------------------------------------------------------------------------

  function fnv1aHash(str) {
    var s = String(str || 'jimesh-default').normalize ? String(str || 'jimesh-default').normalize('NFC') : String(str || 'jimesh-default');
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function createMulberry32(seedInt) {
    var a = seedInt >>> 0;
    return function () {
      var t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, list) {
    return list[Math.floor(rng() * list.length) % list.length];
  }

  function escapeXml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ---------------------------------------------------------------------------
  // FEATURE #2: PROCEDURAL NAME & CALLSIGN GENERATOR (OPTIONAL / NON-INVASIVE)
  // ---------------------------------------------------------------------------

  var NAME_PREFIXES_AGENT = [
    'Nexus', 'Cipher', 'Vortex', 'Aegis', 'Kestrel', 'Pulse',
    'Obsidian', 'Helix', 'Vector', 'Chronos', 'Astra', 'Onyx',
    'Spectre', 'Quantum', 'Stratos', 'Synth'
  ];

  var NAME_CORES_AGENT = [
    'Weaver', 'Runner', 'Sentinel', 'Compiler', 'Harvester', 'Phantom',
    'Conductor', 'Striker', 'Watcher', 'Daemon', 'Breaker', 'Forge',
    'Navigator', 'Oracle', 'Guard', 'Spark'
  ];

  var HUMAN_FIRST_NAMES = [
    'Kira', 'Siddharth', 'Elena', 'Marcus', 'Aria', 'Kushal',
    'Lukas', 'Sora', 'Nadia', 'Devon', 'Talia', 'Viktor',
    'Maya', 'Julian', 'Zara', 'Henrik'
  ];

  var HUMAN_LAST_NAMES = [
    'Vance', 'Kovacs', 'Mercer', 'Lindqvist', 'Rostova', 'Thorne',
    'Sato', 'Sterling', 'Solis', 'patel', 'Moreau', 'Valen',
    'Chen', 'verma', 'Kessler', 'Novak'
  ];

  var ROLE_BY_HEADWEAR = {
    none: 'CORE SYNTH',
    cap: 'FIELD OPS',
    fedora: 'RED TEAM',
    headset: 'WEBRTC VOICE',
    beanie: 'KERNEL DEV',
    crown: 'SOVEREIGN',
    halo: 'GUARDIAN AI',
    cyber_visor: 'WEB RPA',
    cyber_helmet: 'STEALTH OPS',
    beret: 'DESIGN ARCHITECT'
  };

  var ROLE_BY_BADGE = {
    none: 'MESH NODE',
    crm_shield: 'CRM PIPELINE',
    code_brackets: 'PR SYNTH',
    marketing_megaphone: 'GROWTH OPS',
    devops_gear: 'SRE INFRA',
    security_lock: 'SECOPS AUDIT',
    ai_spark: 'NEURAL CORE',
    nango_sync_badge: 'NANGO SYNC',
    composio_connector: 'COMPOSIO RPC'
  };

  /**
   * Deterministically generates a thematic name, callsign, role badge, and
   * compact PFP string ID from a seed or spec. Does NOT require storing extra
   * fields in the database schema — the name and all traits can be reconstructed
   * from the compactId string alone.
   */
  function generatePersonaName(seedOrSpec, options) {
    var opts = options || {};
    var spec = (seedOrSpec && typeof seedOrSpec === 'object' && seedOrSpec.headwear)
      ? seedOrSpec
      : resolvePfpSpec(
          typeof seedOrSpec === 'string' ? seedOrSpec : (opts.seed || 'jimesh-persona'),
          opts.entityKind || 'agent',
          opts.overrides
        );

    var rng = createMulberry32(fnv1aHash(spec.seed + '::name::' + spec.headwear + '::' + spec.eyes));
    var kind = spec.entityKind || 'agent';
    var displayName = '';
    var callsign = '';

    if (kind === 'human') {
      var first = pick(rng, HUMAN_FIRST_NAMES);
      var last = pick(rng, HUMAN_LAST_NAMES);
      last = last.charAt(0).toUpperCase() + last.slice(1);
      displayName = first + ' ' + last;
      callsign = first.toUpperCase() + '_' + last.slice(0, 3).toUpperCase();
    } else {
      var prefix = pick(rng, NAME_PREFIXES_AGENT);
      var core = pick(rng, NAME_CORES_AGENT);
      var unitNum = String(Math.floor(rng() * 90) + 10);
      displayName = prefix + '-' + unitNum + ' // ' + core;
      callsign = prefix + '-' + unitNum;
    }

    if (opts.customName && String(opts.customName).trim()) {
      displayName = String(opts.customName).trim();
      callsign = displayName.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 24);
    }

    var roleLeft = ROLE_BY_HEADWEAR[spec.headwear] || 'MESH AGENT';
    var roleRight = ROLE_BY_BADGE[spec.accessoryBadge] || 'AUTONOMOUS';
    var bannerText = (callsign.replace(/_/g, ' ').toUpperCase() + ' // ' + roleRight).slice(0, 30);
    var compactId = encodePfpId(spec, callsign);

    return {
      name: displayName,
      callsign: callsign,
      roleTitle: roleLeft + ' // ' + roleRight,
      bannerText: bannerText,
      compactId: compactId,
      svgUrl: '/api/v1/pfp/' + encodeURIComponent(compactId) + '.svg',
      spec: spec
    };
  }

  // ---------------------------------------------------------------------------
  // COMPACT STRING / ID ATTRIBUTE CODEC (`pfp1-...`)
  // ---------------------------------------------------------------------------

  function findPaletteIndex(entityKind, palette) {
    if (!palette) return 0;
    var pool = PALETTES[entityKind] || PALETTES.agent;
    for (var i = 0; i < pool.length; i++) {
      if (
        pool[i].primary.toLowerCase() === String(palette.primary || '').toLowerCase() &&
        pool[i].accent.toLowerCase() === String(palette.accent || '').toLowerCase()
      ) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Encodes a full `BasePfpProps` specification into a compact, URL-safe ID string.
   * Format: `pfp1-<ag|ex|hu>-c<bg>-b<body>-ch<chest>-e<eyes>-h<head>-a<acc>-p<pal>[~NameSlug]`
   * Example: `pfp1-ag-c1-b4-ch6-e2-h8-a5-p2~Nexus-42`
   */
  function encodePfpId(spec, optionalNameSlug) {
    var s = (spec && spec.headwear) ? spec : resolvePfpSpec(spec || 'default', 'agent');
    var kindCode = ENTITY_KIND_TO_CODE[s.entityKind] || 'ag';
    var bgIdx = Math.max(0, BACKGROUND_VALUES.indexOf(s.background));
    var bodyIdx = Math.max(0, BODY_VALUES.indexOf(s.body));
    var chestIdx = Math.max(0, CHEST_VALUES.indexOf(s.chest));
    var eyesIdx = Math.max(0, EYES_VALUES.indexOf(s.eyes));
    var headIdx = Math.max(0, HEADWEAR_VALUES.indexOf(s.headwear));
    var accIdx = Math.max(0, ACCESSORY_VALUES.indexOf(s.accessoryBadge));

    var palIdx = findPaletteIndex(s.entityKind || 'agent', s.palette);
    var palToken = 'p0';
    if (palIdx >= 0) {
      palToken = 'p' + palIdx;
    } else if (s.palette && s.palette.primary) {
      var cleanHex = function (h) { return String(h || '#0ea5e9').replace('#', '').slice(0, 6); };
      palToken = 'px' + [
        cleanHex(s.palette.primary),
        cleanHex(s.palette.secondary),
        cleanHex(s.palette.accent),
        cleanHex(s.palette.background),
        cleanHex(s.palette.skinOrChassis)
      ].join('_');
    }

    var baseId = [
      'pfp1',
      kindCode,
      'c' + bgIdx,
      'b' + bodyIdx,
      'ch' + chestIdx,
      'e' + eyesIdx,
      'h' + headIdx,
      'a' + accIdx,
      palToken
    ].join('-');

    var nameTag = optionalNameSlug || s.displayName || '';
    if (nameTag) {
      var safeName = String(nameTag).trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 28);
      if (safeName) {
        return baseId + '~' + safeName;
      }
    }
    return baseId;
  }

  /**
   * Decodes a compact `pfp1-...` string (or preset slug like `ninja_agent`) back into
   * a complete `BasePfpProps` object. Returns `null` if input is not a compact ID or preset.
   */
  function decodePfpId(idString) {
    if (!idString || typeof idString !== 'string') return null;
    var raw = decodeURIComponent(idString.trim()).replace(/\.svg$/i, '');

    // Check if it matches a named preset in PRESET_CATALOG
    if (PRESET_CATALOG[raw]) {
      var preset = PRESET_CATALOG[raw];
      return {
        avatarId: preset.presetId,
        seed: preset.presetId,
        presetId: preset.presetId,
        entityKind: preset.entityKind,
        displayName: preset.title,
        background: preset.background,
        body: preset.body,
        chest: preset.chest,
        eyes: preset.eyes,
        headwear: preset.headwear,
        accessoryBadge: preset.accessoryBadge,
        palette: Object.assign({}, preset.palette),
        scale: 1,
        borderRadius: 9999
      };
    }

    if (raw.indexOf('pfp1-') !== 0) {
      return null;
    }

    var tildeParts = raw.split('~');
    var corePart = tildeParts[0];
    var nameSlug = tildeParts[1] ? tildeParts[1].replace(/_/g, ' ') : '';

    var tokens = corePart.split('-');
    if (tokens.length < 9) return null;

    var entityKind = ENTITY_CODE_TO_KIND[tokens[1]] || 'agent';
    var bgIdx = parseInt(tokens[2].replace('c', ''), 10) || 0;
    var bodyIdx = parseInt(tokens[3].replace('b', ''), 10) || 0;
    var chestIdx = parseInt(tokens[4].replace('ch', ''), 10) || 0;
    var eyesIdx = parseInt(tokens[5].replace('e', ''), 10) || 0;
    var headIdx = parseInt(tokens[6].replace('h', ''), 10) || 0;
    var accIdx = parseInt(tokens[7].replace('a', ''), 10) || 0;
    var palToken = tokens.slice(8).join('-');

    var pool = PALETTES[entityKind] || PALETTES.agent;
    var palette = Object.assign({}, pool[0]);

    if (palToken.indexOf('px') === 0) {
      var hexes = palToken.slice(2).split('_');
      if (hexes.length >= 5) {
        palette = {
          primary: '#' + hexes[0],
          secondary: '#' + hexes[1],
          accent: '#' + hexes[2],
          background: '#' + hexes[3],
          skinOrChassis: '#' + hexes[4]
        };
      }
    } else {
      var pIdx = parseInt(palToken.replace('p', ''), 10) || 0;
      palette = Object.assign({}, pool[pIdx % pool.length]);
    }

    var spec = {
      avatarId: raw,
      seed: raw,
      compactId: raw,
      entityKind: entityKind,
      displayName: nameSlug || undefined,
      background: BACKGROUND_VALUES[bgIdx % BACKGROUND_VALUES.length],
      body: BODY_VALUES[bodyIdx % BODY_VALUES.length],
      chest: CHEST_VALUES[chestIdx % CHEST_VALUES.length],
      eyes: EYES_VALUES[eyesIdx % EYES_VALUES.length],
      headwear: HEADWEAR_VALUES[headIdx % HEADWEAR_VALUES.length],
      accessoryBadge: ACCESSORY_VALUES[accIdx % ACCESSORY_VALUES.length],
      palette: palette,
      scale: 1,
      borderRadius: 9999
    };

    return spec;
  }

  // ---------------------------------------------------------------------------
  // SPEC RESOLVER
  // ---------------------------------------------------------------------------

  function resolvePfpSpec(idOrSeed, entityKind, overrides) {
    // 1. Check if idOrSeed is already a compact `pfp1-...` string or known preset
    if (typeof idOrSeed === 'string') {
      var decoded = decodePfpId(idOrSeed);
      if (decoded) {
        if (overrides && typeof overrides === 'object') {
          decoded = Object.assign({}, decoded, overrides);
          if (overrides.palette) {
            decoded.palette = Object.assign({}, decoded.palette, overrides.palette);
          }
        }
        decoded.compactId = encodePfpId(decoded, decoded.displayName);
        return decoded;
      }
    }

    var kind = entityKind === 'human' || entityKind === 'expert' ? entityKind : 'agent';
    var seedStr = String(idOrSeed || 'jimesh-entity').trim() || 'jimesh-entity';
    var hash = fnv1aHash(kind + '::' + seedStr);
    var rng = createMulberry32(hash);

    var palettePool = PALETTES[kind] || PALETTES.agent;
    var basePalette = palettePool[Math.floor(rng() * palettePool.length) % palettePool.length];

    var bodyPool = kind === 'human'
      ? ['hoodie', 'suit', 'casual_tee', 'lab_coat', 'turtleneck']
      : ['robot_chassis', 'cyber_armor', 'suit', 'hoodie', 'lab_coat', 'casual_tee'];

    var eyePool = kind === 'human'
      ? ['normal', 'focused', 'happy', 'glasses', 'sunglasses', 'wink']
      : ['cyber_optic', 'terminal_glow', 'laser', 'focused', 'normal', 'happy'];

    var headwearPool = kind === 'human'
      ? ['none', 'cap', 'headset', 'beanie', 'fedora', 'beret']
      : kind === 'expert'
        ? ['crown', 'halo', 'cyber_visor', 'cyber_helmet', 'headset', 'fedora']
        : ['none', 'cyber_visor', 'cyber_helmet', 'headset', 'halo', 'crown', 'beret'];

    var chestPool = kind === 'human'
      ? ['none', 'tie', 'necklace', 'pocket', 'mesh_emblem', 'harness']
      : ['mesh_emblem', 'reactor_core', 'harness', 'tie', 'pocket'];

    var spec = {
      avatarId: 'pfp-' + seedStr.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48),
      seed: seedStr,
      entityKind: kind,
      headwear: pick(rng, headwearPool),
      eyes: pick(rng, eyePool),
      body: pick(rng, bodyPool),
      chest: pick(rng, chestPool),
      background: pick(rng, BACKGROUND_VALUES),
      palette: {
        primary: basePalette.primary,
        secondary: basePalette.secondary,
        accent: basePalette.accent,
        background: basePalette.background,
        skinOrChassis: basePalette.skinOrChassis
      },
      accessoryBadge: pick(rng, ACCESSORY_VALUES),
      scale: 1,
      borderRadius: 9999
    };

    if (overrides && typeof overrides === 'object') {
      if (HEADWEAR_VALUES.indexOf(overrides.headwear) !== -1) spec.headwear = overrides.headwear;
      if (EYES_VALUES.indexOf(overrides.eyes) !== -1) spec.eyes = overrides.eyes;
      if (BODY_VALUES.indexOf(overrides.body) !== -1) spec.body = overrides.body;
      if (CHEST_VALUES.indexOf(overrides.chest) !== -1) spec.chest = overrides.chest;
      if (BACKGROUND_VALUES.indexOf(overrides.background) !== -1) spec.background = overrides.background;
      if (ACCESSORY_VALUES.indexOf(overrides.accessoryBadge) !== -1) spec.accessoryBadge = overrides.accessoryBadge;
      if (overrides.entityKind) spec.entityKind = overrides.entityKind;
      if (overrides.displayName) spec.displayName = overrides.displayName;
      if (overrides.palette && typeof overrides.palette === 'object') {
        spec.palette = Object.assign({}, spec.palette, overrides.palette);
      }
    }

    spec.compactId = encodePfpId(spec, spec.displayName);
    return spec;
  }

  // ---------------------------------------------------------------------------
  // AUTHENTIC COMIC-BUST SVG LAYER RENDERERS (EXTRACTED FROM public/pfp/*.svg)
  // ---------------------------------------------------------------------------

  function renderBackgroundLayer(spec, uid, lod) {
    var p = spec.palette;
    var bg = spec.background;
    var parts = [];

    // Authentic 500x500 inner comic frame + radial glow + halftone dots from coding_agent.svg / lila_agent.svg
    parts.push('<rect width="500" height="500" rx="40" fill="url(#' + uid + '-bg)" stroke="' + escapeXml(p.primary) + '" stroke-width="2"/>');
    parts.push('<circle cx="250" cy="230" r="165" fill="' + escapeXml(p.primary) + '" opacity="0.18" filter="url(#' + uid + '-glow)"/>');

    if (lod !== 'micro') {
      // Authentic comic halftone clusters
      parts.push(
        '<g opacity="0.52">' +
          '<circle cx="384" cy="136" r="112" fill="url(#' + uid + '-ht)"/>' +
          '<circle cx="96" cy="334" r="76" fill="url(#' + uid + '-ht)"/>' +
        '</g>'
      );

      if (bg === 'cyber_grid') {
        parts.push(
          '<g stroke="' + escapeXml(p.accent) + '" stroke-width="1.5" opacity="0.22">' +
            '<line x1="0" y1="120" x2="500" y2="120"/><line x1="0" y1="200" x2="500" y2="200"/>' +
            '<line x1="0" y1="280" x2="500" y2="280"/><line x1="0" y1="360" x2="500" y2="360"/>' +
            '<line x1="120" y1="0" x2="60" y2="500"/><line x1="250" y1="0" x2="250" y2="500"/>' +
            '<line x1="380" y1="0" x2="440" y2="500"/>' +
          '</g>'
        );
      } else if (bg === 'matrix_rain') {
        parts.push(
          '<g stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-linecap="round" opacity="0.35">' +
            '<line x1="92" y1="45" x2="92" y2="135" stroke-dasharray="10 14"/>' +
            '<line x1="154" y1="20" x2="154" y2="110" stroke-dasharray="6 12"/>' +
            '<line x1="354" y1="35" x2="354" y2="145" stroke-dasharray="12 14"/>' +
            '<line x1="412" y1="70" x2="412" y2="180" stroke-dasharray="8 12"/>' +
          '</g>'
        );
      } else if (bg === 'geometric') {
        parts.push(
          '<polygon points="250,36 436,140 436,340 250,444 64,340 64,140" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="2.5" stroke-dasharray="12 8" opacity="0.3"/>'
        );
      } else if (bg === 'deep_space') {
        parts.push(
          '<ellipse cx="250" cy="240" rx="195" ry="72" transform="rotate(-22 250 240)" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="2.5" opacity="0.32"/>'
        );
      } else if (bg === 'solid_mesh') {
        // Broadcast pulse waves from orchestrator_agent.svg
        parts.push(
          '<g fill="none" stroke="' + escapeXml(p.accent) + '" stroke-linecap="round" opacity="0.4">' +
            '<path d="M 92,155 A 170,170 0 0,1 408,155" stroke-width="4" stroke-dasharray="10 12"/>' +
            '<path d="M 68,125 A 205,205 0 0,1 432,125" stroke-width="3" stroke-dasharray="6 14"/>' +
          '</g>'
        );
      }

      // Authentic comic speed lines (top-right, from coding_agent.svg)
      parts.push(
        '<g stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-linecap="round" opacity="0.5">' +
          '<line x1="292" y1="70" x2="316" y2="52"/>' +
          '<line x1="300" y1="86" x2="326" y2="72"/>' +
          '<line x1="304" y1="104" x2="330" y2="94"/>' +
        '</g>'
      );
    }

    return parts.join('');
  }

  function renderChestEmblem(spec, uid, isHuman) {
    var p = spec.palette;
    var ch = spec.chest;
    if (ch === 'none') return '';

    var yOffset = isHuman ? 124 : 80;

    if (ch === 'mesh_emblem') {
      // Authentic 3D Isometric Extruded JiMesh Cube from lila_agent.svg / coding_agent.svg
      return (
        '<g transform="translate(0, ' + yOffset + ') scale(' + (isHuman ? '0.82' : '0.95') + ')">' +
          '<circle cx="0" cy="-2" r="34" fill="' + escapeXml(p.accent) + '" opacity="0.22" filter="url(#' + uid + '-glow)"/>' +
          '<g stroke="#000000" stroke-width="4.5" stroke-linejoin="round">' +
            '<path d="M 0,-32 L 28,-16 L 0,0 L -28,-16 Z" fill="' + escapeXml(p.accent) + '"/>' +
            '<path d="M -28,-16 L 0,0 L 0,32 L -28,16 Z" fill="' + escapeXml(p.primary) + '"/>' +
            '<path d="M 28,-16 L 0,0 L 0,32 L 28,16 Z" fill="' + escapeXml(p.secondary) + '"/>' +
          '</g>' +
          '<g stroke="#000000" stroke-width="3" stroke-linejoin="round">' +
            '<path d="M 0,-17 L 15,-8.5 L 0,0 L -15,-8.5 Z" fill="#ffffff"/>' +
            '<path d="M -15,-8.5 L 0,0 L 0,17 L -15,8.5 Z" fill="' + escapeXml(p.accent) + '"/>' +
            '<path d="M 15,-8.5 L 0,0 L 0,17 L 15,8.5 Z" fill="' + escapeXml(p.primary) + '"/>' +
          '</g>' +
          '<circle cx="0" cy="-2" r="4" fill="#ffffff"/>' +
        '</g>'
      );
    }

    if (ch === 'reactor_core') {
      // Authentic rotating 4-point Shuriken / Reactor Star from ninja_agent.svg
      return (
        '<g transform="translate(0, ' + yOffset + ')">' +
          '<circle cx="0" cy="0" r="26" fill="#090d16" stroke="#000000" stroke-width="6"/>' +
          '<path d="M 0,-22 L 6,-6 L 22,0 L 6,6 L 0,22 L -6,6 L -22,0 L -6,-6 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4" filter="url(#' + uid + '-glow)">' +
            '<animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite"/>' +
          '</path>' +
          '<circle cx="0" cy="0" r="5" fill="#ffffff"/>' +
        '</g>'
      );
    }

    if (ch === 'tie') {
      if (!isHuman) {
        // Orchestrator Bow-Tie & Dispatch Lines from orchestrator_agent.svg
        return (
          '<g transform="translate(0, ' + yOffset + ')">' +
            '<g stroke="' + escapeXml(p.accent) + '" stroke-width="3.5" opacity="0.85">' +
              '<line x1="-22" y1="-8" x2="0" y2="28"/><line x1="22" y1="-8" x2="0" y2="28"/><line x1="0" y1="-12" x2="0" y2="28"/>' +
            '</g>' +
            '<circle cx="0" cy="28" r="8" fill="#ffffff" stroke="#000000" stroke-width="4"/>' +
            '<g transform="translate(0, -40)">' +
              '<polygon points="-24,-12 0,0 -24,12" fill="#e879f9" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>' +
              '<polygon points="24,-12 0,0 24,12" fill="#e879f9" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>' +
              '<circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#000000" stroke-width="4"/>' +
            '</g>' +
          '</g>'
        );
      }
      // Executive Tie from founder.svg
      return (
        '<path d="M -8,72 L 8,72 L 12,150 L 0,166 L -12,150 Z" fill="' + escapeXml(p.accent) + '" stroke="#0a0a0f" stroke-width="4"/>'
      );
    }

    if (ch === 'harness') {
      // Tactical Chest Rig + HTTP:200 Status Pill from browser_agent.svg
      return (
        '<g transform="translate(0, ' + yOffset + ')">' +
          '<line x1="-36" y1="-48" x2="-18" y2="28" stroke="#000000" stroke-width="9" stroke-linecap="round"/>' +
          '<line x1="36" y1="-48" x2="18" y2="28" stroke="#000000" stroke-width="9" stroke-linecap="round"/>' +
          '<rect x="-38" y="-16" width="76" height="32" rx="10" fill="#04151f" stroke="#000000" stroke-width="6"/>' +
          '<circle cx="-20" cy="0" r="6" fill="#10b981"/>' +
          '<line x1="-6" y1="-4" x2="24" y2="-4" stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="-6" y1="5" x2="16" y2="5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>' +
        '</g>'
      );
    }

    if (ch === 'pocket') {
      // Audio Equalizer / Palette Bars from voice_agent.svg
      return (
        '<g transform="translate(0, ' + yOffset + ')">' +
          '<rect x="-30" y="-12" width="8" height="24" rx="3" fill="' + escapeXml(p.accent) + '"/>' +
          '<rect x="-18" y="-20" width="8" height="40" rx="3" fill="' + escapeXml(p.accent) + '"/>' +
          '<rect x="-6" y="-28" width="8" height="56" rx="3" fill="#ffffff" filter="url(#' + uid + '-glow)"/>' +
          '<rect x="6" y="-18" width="8" height="36" rx="3" fill="' + escapeXml(p.accent) + '"/>' +
          '<rect x="18" y="-10" width="8" height="20" rx="3" fill="' + escapeXml(p.accent) + '"/>' +
        '</g>'
      );
    }

    if (ch === 'necklace') {
      return (
        '<g transform="translate(0, ' + (isHuman ? 82 : 42) + ')">' +
          '<path d="M -34,-10 Q 0,24 34,-10" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="5" stroke-linecap="round"/>' +
          '<polygon points="0,10 12,24 0,38 -12,24" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>' +
        '</g>'
      );
    }

    return '';
  }

  function renderAgentBust(spec, uid, lod) {
    var p = spec.palette;
    var parts = [];

    parts.push('<g transform="translate(250, 240) scale(0.95)">');
    // Ground hover shadow from coding_agent.svg
    parts.push('<ellipse cx="0" cy="185" rx="90" ry="18" fill="#000000" opacity="0.55"/>');

    // Katana on back if cyber_armor (from ninja_agent.svg)
    if (spec.body === 'cyber_armor') {
      parts.push(
        '<g transform="rotate(28, 42, -55)">' +
          '<rect x="44" y="-158" width="14" height="58" rx="4" fill="#0f172a" stroke="#000000" stroke-width="7"/>' +
          '<path d="M 45,-144 L 57,-136 M 45,-128 L 57,-120 M 45,-112 L 57,-104" stroke="' + escapeXml(p.accent) + '" stroke-width="3"/>' +
          '<rect x="36" y="-102" width="30" height="8" rx="3" fill="#eab308" stroke="#000000" stroke-width="5"/>' +
        '</g>'
      );
    }

    // Arms / Grippers / Conductor Baton based on body style
    if (spec.body === 'suit' && lod !== 'micro') {
      // Orchestrator Conductor Arms + Glowing Baton from orchestrator_agent.svg
      parts.push(
        '<path d="M -52,38 C -92,22 -118,-12 -124,-48" fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round"/>' +
        '<path d="M -52,38 C -92,22 -118,-12 -124,-48" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="-124" cy="-52" r="14" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6"/>' +
        '<path d="M 52,38 C 92,22 116,-14 122,-52" fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round"/>' +
        '<path d="M 52,38 C 92,22 116,-14 122,-52" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="122" cy="-56" r="14" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6"/>' +
        '<line x1="122" y1="-58" x2="158" y2="-122" stroke="#000000" stroke-width="11" stroke-linecap="round"/>' +
        '<line x1="122" y1="-58" x2="158" y2="-122" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>' +
        '<circle cx="160" cy="-125" r="9" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>'
      );
    } else if (spec.body === 'cyber_armor' && lod !== 'micro') {
      // Armored Claws from lila_agent.svg
      parts.push(
        '<path d="M -52,38 C -98,42 -116,4 -112,-28" fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round"/>' +
        '<path d="M -52,38 C -98,42 -116,4 -112,-28" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="-112" cy="-32" r="15" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6"/>' +
        '<path d="M 52,38 C 98,42 116,4 112,-28" fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round"/>' +
        '<path d="M 52,38 C 98,42 116,4 112,-28" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="112" cy="-32" r="15" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6"/>'
      );
    } else if (spec.body === 'casual_tee' && lod !== 'micro') {
      // Floating Repulsor Pods from happy_agent.svg
      parts.push(
        '<ellipse cx="-102" cy="48" rx="18" ry="12" transform="rotate(-25 -102 48)" fill="url(#' + uid + '-body)" stroke="#000000" stroke-width="7"/>' +
        '<ellipse cx="102" cy="48" rx="18" ry="12" transform="rotate(25 102 48)" fill="url(#' + uid + '-body)" stroke="#000000" stroke-width="7"/>'
      );
    }

    // Authentic Robot Torso & Hover Base from coding_agent.svg
    parts.push('<path d="M -52,22 C -66,58 -56,118 0,144 C 56,118 66,58 52,22 Z" fill="url(#' + uid + '-body)" stroke="#000000" stroke-width="11" stroke-linejoin="round"/>');
    parts.push('<ellipse cx="0" cy="153" rx="56" ry="10" fill="#091526" stroke="#000000" stroke-width="6"/>');
    parts.push('<ellipse cx="0" cy="153" rx="32" ry="5" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="3"/>');

    // Collar / Outfit accents for hoodie / lab_coat / turtleneck on robot chassis
    if (spec.body === 'hoodie') {
      parts.push('<path d="M -38,24 Q 0,48 38,24" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="5" stroke-linecap="round"/>');
      parts.push('<line x1="-16" y1="34" x2="-16" y2="68" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>');
      parts.push('<line x1="16" y1="34" x2="16" y2="68" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>');
    } else if (spec.body === 'lab_coat') {
      parts.push('<path d="M -28,24 L -10,126 M 28,24 L 10,126" stroke="#ffffff" stroke-width="4" opacity="0.85"/>');
    }

    // Chest Emblem
    if (lod !== 'micro') {
      parts.push(renderChestEmblem(spec, uid, false));
    }

    // Headwear / Antennas BEHIND or ON TOP of Head
    var hw = spec.headwear;
    if (hw === 'none' || hw === 'beret' || hw === 'cap') {
      // Classic Central Beacon Antenna from coding_agent.svg
      parts.push(
        '<line x1="0" y1="-85" x2="0" y2="-140" stroke="#000000" stroke-width="12" stroke-linecap="round"/>' +
        '<circle cx="0" cy="-155" r="24" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="9" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="-7" cy="-162" r="6" fill="#ffffff" opacity="0.9"/>'
      );
    } else if (hw === 'cyber_visor') {
      // Dual Angled Toxic/Sensor Horn Beacons from lila_agent.svg / browser_agent.svg
      parts.push(
        '<line x1="-38" y1="-88" x2="-64" y2="-142" stroke="#000000" stroke-width="11" stroke-linecap="round"/>' +
        '<circle cx="-68" cy="-150" r="18" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="-73" cy="-155" r="5" fill="#ffffff"/>' +
        '<line x1="38" y1="-88" x2="64" y2="-142" stroke="#000000" stroke-width="11" stroke-linecap="round"/>' +
        '<circle cx="68" cy="-150" r="18" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="63" cy="-155" r="5" fill="#ffffff"/>'
      );
    } else if (hw === 'halo') {
      // Audio Wave / Angelic Halo from voice_agent.svg
      parts.push(
        '<ellipse cx="0" cy="-148" rx="62" ry="16" fill="none" stroke="#000000" stroke-width="11"/>' +
        '<ellipse cx="0" cy="-148" rx="62" ry="16" fill="none" stroke="#fde047" stroke-width="6" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="0" cy="-120" r="16" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7"/>'
      );
    }

    // Authentic Lateral Ear Pods from coding_agent.svg (or Headset Cups from voice_agent.svg)
    if (hw === 'headset') {
      parts.push(
        '<rect x="-104" y="-62" width="24" height="50" rx="11" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8"/>' +
        '<rect x="80" y="-62" width="24" height="50" rx="11" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8"/>' +
        '<path d="M 85,-35 L 45,5 L 18,5" fill="none" stroke="#000000" stroke-width="7.5" stroke-linecap="round"/>' +
        '<circle cx="14" cy="5" r="7" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="3" filter="url(#' + uid + '-glow)"/>'
      );
    } else {
      parts.push(
        '<circle cx="-84" cy="-34" r="15" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8.5"/>' +
        '<circle cx="-84" cy="-34" r="4" fill="' + escapeXml(p.accent) + '"/>' +
        '<circle cx="84" cy="-34" r="15" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8.5"/>' +
        '<circle cx="84" cy="-34" r="4" fill="' + escapeXml(p.accent) + '"/>'
      );
    }

    // Authentic Robot Head Chassis & Crest Plate from coding_agent.svg
    parts.push('<rect x="-86" y="-95" width="172" height="120" rx="60" fill="url(#' + uid + '-body)" stroke="#000000" stroke-width="11"/>');
    parts.push('<path d="M -36 -95 L 36 -95 L 36 -55 L -36 -55 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7.5"/>');

    // Authentic Visor Screen from coding_agent.svg
    parts.push('<rect x="-65" y="-55" width="130" height="62" rx="18" fill="#04151f" stroke="#000000" stroke-width="8"/>');

    // Visor Eyes & Expression
    var eyes = spec.eyes;
    if (eyes === 'terminal_glow') {
      // `< >` Syntax Brackets from coding_agent.svg
      parts.push(
        '<path d="M -18,-36 L -38,-24 L -18,-12" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + uid + '-glow)"/>' +
        '<path d="M 18,-36 L 38,-24 L 18,-12" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + uid + '-glow)"/>' +
        '<path d="M -13,-9 Q 0,3 13,-9 Q 0,-4 -13,-9 Z" fill="#04151f" stroke="' + escapeXml(p.accent) + '" stroke-width="3.5" stroke-linejoin="round"/>'
      );
    } else if (eyes === 'cyber_optic') {
      // Glowing Dual Iris + Fangs from lila_agent.svg
      parts.push(
        '<circle cx="-28" cy="-24" r="13" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="28" cy="-24" r="13" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="-32" cy="-28" r="4" fill="#ffffff"/><circle cx="24" cy="-28" r="4" fill="#ffffff"/>' +
        '<path d="M -22,-6 Q 0,6 22,-6" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<polygon points="-14,-4 -10,5 -6,-3" fill="#ffffff"/>' +
        '<polygon points="6,-3 10,5 14,-4" fill="#ffffff"/>'
      );
    } else if (eyes === 'focused') {
      // Angled Shuriken / Browser Focused Eyes from ninja_agent.svg
      parts.push(
        '<polygon points="-44,-30 -14,-20 -18,-12 -46,-20" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<polygon points="44,-30 14,-20 18,-12 46,-20" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="-28" cy="-22" r="3" fill="#ffffff"/><circle cx="28" cy="-22" r="3" fill="#ffffff"/>'
      );
    } else if (eyes === 'laser') {
      // Crimson Laser Beam Visor from red_team_agent.svg
      parts.push(
        '<rect x="-54" y="-32" width="108" height="14" rx="7" fill="#ef4444" filter="url(#' + uid + '-glow)"/>' +
        '<rect x="-46" y="-28" width="92" height="6" rx="3" fill="#ffffff"/>' +
        '<path d="M -18,-6 L 0,-12 L 18,-6" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>'
      );
    } else if (eyes === 'happy') {
      // Joyful Arched Eyes from happy_agent.svg
      parts.push(
        '<path d="M -42,-20 Q -28,-38 -14,-20" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6.5" stroke-linecap="round" filter="url(#' + uid + '-glow)"/>' +
        '<path d="M 14,-20 Q 28,-38 42,-20" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6.5" stroke-linecap="round" filter="url(#' + uid + '-glow)"/>' +
        '<path d="M -16,-8 Q 0,8 16,-8 Z" fill="' + escapeXml(p.accent) + '"/>'
      );
    } else if (eyes === 'wink') {
      parts.push(
        '<path d="M -40,-30 L -20,-22 L -40,-14" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="28" cy="-24" r="12" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="24" cy="-28" r="4" fill="#ffffff"/>' +
        '<path d="M -12,-8 Q 0,3 12,-8" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="3.5" stroke-linecap="round"/>'
      );
    } else if (eyes === 'glasses' || eyes === 'sunglasses') {
      var lensFill = eyes === 'sunglasses' ? '#090d16' : 'rgba(125,211,252,0.22)';
      parts.push(
        '<circle cx="-28" cy="-24" r="10" fill="' + escapeXml(p.accent) + '"/>' +
        '<circle cx="28" cy="-24" r="10" fill="' + escapeXml(p.accent) + '"/>' +
        '<rect x="-52" y="-42" width="44" height="34" rx="8" fill="' + lensFill + '" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<rect x="8" y="-42" width="44" height="34" rx="8" fill="' + lensFill + '" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<line x1="-8" y1="-26" x2="8" y2="-26" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>'
      );
    } else {
      // Classic Glowing Dual Orbs from figma_agent.svg / voice_agent.svg
      parts.push(
        '<circle cx="-28" cy="-24" r="12" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="28" cy="-24" r="12" fill="' + escapeXml(p.accent) + '" filter="url(#' + uid + '-glow)"/>' +
        '<circle cx="-32" cy="-29" r="3.5" fill="#ffffff"/><circle cx="24" cy="-29" r="3.5" fill="#ffffff"/>' +
        '<path d="M -13,-9 Q 0,3 13,-9 Q 0,-4 -13,-9 Z" fill="#04151f" stroke="' + escapeXml(p.accent) + '" stroke-width="3.5" stroke-linejoin="round"/>'
      );
    }

    // Foreground Headwear Overlays (Ninja Headband, Crown, Fedora, Beanie, Cap, Beret)
    if (hw === 'cyber_helmet') {
      // Authentic Fluttering Ninja Headband + Forehead Plate from ninja_agent.svg
      parts.push(
        '<g>' +
          '<path d="M 74,-82 C 112,-98 144,-72 168,-92 C 148,-58 116,-64 78,-64 Z" fill="#7c3aed" stroke="#000000" stroke-width="6" stroke-linejoin="round">' +
            '<animateTransform attributeName="transform" type="rotate" values="0 74 -72; -6 74 -72; 0 74 -72" dur="2.6s" repeatCount="indefinite"/>' +
          '</path>' +
          '<path d="M -86,-76 Q 0,-90 86,-76 L 86,-56 Q 0,-70 -86,-56 Z" fill="#6d28d9" stroke="#000000" stroke-width="7"/>' +
          '<rect x="-28" y="-82" width="56" height="20" rx="5" fill="#cbd5e1" stroke="#000000" stroke-width="5"/>' +
          '<line x1="-14" y1="-72" x2="14" y2="-72" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>' +
        '</g>'
      );
    } else if (hw === 'crown') {
      parts.push(
        '<polygon points="-58,-90 -44,-138 -18,-108 0,-148 18,-108 44,-138 58,-90" fill="#fbbf24" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<circle cx="0" cy="-116" r="7" fill="#ef4444" stroke="#000000" stroke-width="3"/>' +
        '<circle cx="-30" cy="-108" r="5" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="2.5"/>' +
        '<circle cx="30" cy="-108" r="5" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="2.5"/>'
      );
    } else if (hw === 'fedora') {
      parts.push(
        '<ellipse cx="0" cy="-88" rx="108" ry="18" fill="#1e293b" stroke="#000000" stroke-width="8"/>' +
        '<path d="M -64,-88 C -56,-142 56,-142 64,-88 Z" fill="#0f172a" stroke="#000000" stroke-width="8"/>' +
        '<rect x="-60" y="-100" width="120" height="12" rx="4" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>'
      );
    } else if (hw === 'beanie') {
      parts.push(
        '<path d="M -82,-76 C -78,-138 78,-138 82,-76 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8"/>' +
        '<rect x="-86" y="-86" width="172" height="22" rx="10" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7"/>'
      );
    } else if (hw === 'cap') {
      parts.push(
        '<path d="M -82,-78 C -80,-136 80,-136 82,-78 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8"/>' +
        '<path d="M -20,-84 L 112,-76 C 112,-62 42,-58 -20,-68 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7"/>'
      );
    } else if (hw === 'beret') {
      parts.push(
        '<path d="M -78,-84 C -92,-132 48,-148 92,-96 C 64,-78 -40,-76 -78,-84 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8"/>' +
        '<circle cx="-28" cy="-98" r="7" fill="#ffffff" stroke="#000000" stroke-width="4"/>'
      );
    }

    parts.push('</g>');
    return parts.join('');
  }

  function renderHumanBust(spec, uid, lod) {
    var p = spec.palette;
    var skin = p.skinOrChassis || '#f3c6a5';
    var parts = [];

    // Authentic Human Operator Coordinate Space from founder.svg / ops.svg / woman5.svg
    parts.push('<g transform="translate(250, 255) scale(1.08)">');

    // Torso Outfit
    if (spec.body === 'suit') {
      // Blazer + White Dress Shirt from founder.svg
      parts.push(
        '<path d="M -82,192 C -80,104 -46,68 0,68 C 46,68 80,104 82,192 Z" fill="url(#' + uid + '-body)" stroke="#0a0a0f" stroke-width="8" stroke-linejoin="round"/>' +
        '<polygon points="-24,68 24,68 0,142" fill="#f8fafc" stroke="#0a0a0f" stroke-width="5" stroke-linejoin="round"/>'
      );
    } else if (spec.body === 'hoodie') {
      // DevOps Hoodie + Drawstrings from ops.svg
      parts.push(
        '<path d="M -84,192 C -82,102 -48,66 0,66 C 48,66 82,102 84,192 Z" fill="url(#' + uid + '-body)" stroke="#0a0a0f" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M -42,66 Q 0,100 42,66" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<line x1="-16" y1="84" x2="-16" y2="128" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="16" y1="84" x2="16" y2="128" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>'
      );
    } else if (spec.body === 'lab_coat') {
      parts.push(
        '<path d="M -82,192 C -80,104 -46,68 0,68 C 46,68 80,104 82,192 Z" fill="#f1f5f9" stroke="#0a0a0f" stroke-width="8"/>' +
        '<polygon points="-22,68 22,68 0,152" fill="' + escapeXml(p.primary) + '" stroke="#0a0a0f" stroke-width="5"/>'
      );
    } else {
      // Turtleneck / Crew Tee from product.svg / woman5.svg
      parts.push(
        '<path d="M -80,192 C -78,104 -44,68 0,68 C 44,68 78,104 80,192 Z" fill="url(#' + uid + '-body)" stroke="#0a0a0f" stroke-width="8" stroke-linejoin="round"/>' +
        '<rect x="-22" y="54" width="44" height="24" rx="8" fill="' + escapeXml(p.secondary) + '" stroke="#0a0a0f" stroke-width="6"/>'
      );
    }

    // Chest Emblem
    if (lod !== 'micro') {
      parts.push(renderChestEmblem(spec, uid, true));
    }

    // Neck + Ears + Head from founder.svg
    parts.push('<rect x="-18" y="34" width="36" height="42" rx="12" fill="' + escapeXml(skin) + '" stroke="#0a0a0f" stroke-width="7"/>');
    parts.push('<circle cx="-58" cy="-4" r="14" fill="' + escapeXml(skin) + '" stroke="#0a0a0f" stroke-width="7"/>');
    parts.push('<circle cx="58" cy="-4" r="14" fill="' + escapeXml(skin) + '" stroke="#0a0a0f" stroke-width="7"/>');
    parts.push('<rect x="-56" y="-74" width="112" height="122" rx="52" fill="' + escapeXml(skin) + '" stroke="#0a0a0f" stroke-width="8"/>');

    // Subtle cheek blush + warm expression from founder.svg / woman5.svg
    parts.push('<ellipse cx="-32" cy="8" rx="10" ry="5" fill="#f43f5e" opacity="0.28"/>');
    parts.push('<ellipse cx="32" cy="8" rx="10" ry="5" fill="#f43f5e" opacity="0.28"/>');
    parts.push('<path d="M -16,20 Q 0,32 16,20" fill="none" stroke="#0a0a0f" stroke-width="5" stroke-linecap="round"/>');

    // Eyes
    var eyes = spec.eyes;
    if (eyes === 'happy') {
      parts.push(
        '<path d="M -34,-12 Q -22,-24 -10,-12" fill="none" stroke="#0a0a0f" stroke-width="5.5" stroke-linecap="round"/>' +
        '<path d="M 10,-12 Q 22,-24 34,-12" fill="none" stroke="#0a0a0f" stroke-width="5.5" stroke-linecap="round"/>'
      );
    } else if (eyes === 'wink') {
      parts.push(
        '<path d="M -32,-16 L -14,-10 L -32,-4" fill="none" stroke="#0a0a0f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="22" cy="-12" r="7.5" fill="#0a0a0f"/><circle cx="20" cy="-15" r="2.5" fill="#ffffff"/>'
      );
    } else {
      parts.push(
        '<circle cx="-22" cy="-12" r="7.5" fill="#0a0a0f"/><circle cx="-24" cy="-15" r="2.5" fill="#ffffff"/>' +
        '<circle cx="22" cy="-12" r="7.5" fill="#0a0a0f"/><circle cx="20" cy="-15" r="2.5" fill="#ffffff"/>' +
        '<path d="M -34,-26 Q -22,-32 -10,-26" fill="none" stroke="#0a0a0f" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M 10,-26 Q 22,-32 34,-26" fill="none" stroke="#0a0a0f" stroke-width="4.5" stroke-linecap="round"/>'
      );
    }

    if (eyes === 'glasses' || eyes === 'sunglasses') {
      var fillGlass = eyes === 'sunglasses' ? '#0f172a' : 'rgba(56,189,248,0.18)';
      parts.push(
        '<circle cx="-22" cy="-12" r="18" fill="' + fillGlass + '" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<circle cx="22" cy="-12" r="18" fill="' + fillGlass + '" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<line x1="-4" y1="-12" x2="4" y2="-12" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>'
      );
    }

    // Hair & Headwear from founder.svg / ops.svg
    var hw = spec.headwear;
    if (hw === 'none' || hw === 'headset') {
      // Swept-back executive/operator hair from founder.svg
      parts.push(
        '<path d="M -58,-28 C -64,-82 -24,-96 12,-92 C 48,-88 64,-68 58,-24 C 46,-54 18,-64 -18,-58 C -42,-54 -52,-42 -58,-28 Z" fill="#1e1b4b" stroke="#0a0a0f" stroke-width="7" stroke-linejoin="round"/>'
      );
      if (hw === 'headset') {
        parts.push(
          '<path d="M -64,-8 C -68,-88 68,-88 64,-8" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="8"/>' +
          '<rect x="-74" y="-22" width="18" height="36" rx="8" fill="' + escapeXml(p.primary) + '" stroke="#0a0a0f" stroke-width="6"/>' +
          '<rect x="56" y="-22" width="18" height="36" rx="8" fill="' + escapeXml(p.primary) + '" stroke="#0a0a0f" stroke-width="6"/>' +
          '<path d="M 62,8 Q 42,32 14,28" fill="none" stroke="#0a0a0f" stroke-width="5" stroke-linecap="round"/>' +
          '<circle cx="12" cy="28" r="5" fill="' + escapeXml(p.accent) + '"/>'
        );
      }
    } else if (hw === 'crown') {
      parts.push(
        '<polygon points="-48,-68 -36,-112 -14,-86 0,-120 14,-86 36,-112 48,-68" fill="#fbbf24" stroke="#0a0a0f" stroke-width="7" stroke-linejoin="round"/>'
      );
    } else if (hw === 'beanie') {
      parts.push(
        '<path d="M -58,-42 C -56,-102 56,-102 58,-42 Z" fill="' + escapeXml(p.primary) + '" stroke="#0a0a0f" stroke-width="7"/>' +
        '<rect x="-62" y="-54" width="124" height="20" rx="9" fill="' + escapeXml(p.accent) + '" stroke="#0a0a0f" stroke-width="6"/>'
      );
    } else if (hw === 'cap') {
      parts.push(
        '<path d="M -58,-44 C -56,-100 56,-100 58,-44 Z" fill="' + escapeXml(p.primary) + '" stroke="#0a0a0f" stroke-width="7"/>' +
        '<path d="M -10,-52 L 88,-44 C 88,-32 32,-28 -10,-38 Z" fill="' + escapeXml(p.accent) + '" stroke="#0a0a0f" stroke-width="6"/>'
      );
    } else {
      parts.push(
        '<path d="M -58,-28 C -64,-82 -24,-96 12,-92 C 48,-88 64,-68 58,-24 Z" fill="' + escapeXml(p.secondary) + '" stroke="#0a0a0f" stroke-width="7"/>'
      );
    }

    parts.push('</g>');
    return parts.join('');
  }

  function renderCornerBadgeAndSparkles(spec, uid, lod) {
    if (lod === 'micro') return '';
    var p = spec.palette;
    var parts = [];

    // Authentic 4-point comic sparkles from coding_agent.svg / lila_agent.svg
    parts.push(
      '<g id="' + uid + '-sparkles">' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="#ffffff" opacity="0.95" transform="translate(108,138) scale(0.9)"/>' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="' + escapeXml(p.accent) + '" opacity="0.9" transform="translate(392,112) scale(1.15)"/>' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="' + escapeXml(p.accent) + '" opacity="0.75" transform="translate(402,318) scale(0.75)"/>' +
      '</g>'
    );

    if (lod === 'full') {
      // Authentic Comic Nameplate Pill Banner at bottom (y=436) from coding_agent.svg
      var bannerLabel = spec.displayName
        ? String(spec.displayName).toUpperCase()
        : (ROLE_BY_HEADWEAR[spec.headwear] || 'JIMESH') + ' // ' + (ROLE_BY_BADGE[spec.accessoryBadge] || 'AGENT');
      bannerLabel = bannerLabel.slice(0, 28);
      parts.push(
        '<rect x="75" y="436" width="350" height="31" rx="15.5" fill="#0b111c" opacity="0.9" stroke="' + escapeXml(p.accent) + '" stroke-width="2.5" filter="url(#' + uid + '-glow)"/>' +
        '<text x="250" y="456" fill="' + escapeXml(p.accent) + '" font-family="system-ui, -apple-system, sans-serif" font-size="15.5" font-weight="800" text-anchor="middle" letter-spacing="1.4">' +
          escapeXml(bannerLabel) +
        '</text>'
      );
    }

    return parts.join('');
  }

  // ---------------------------------------------------------------------------
  // MAIN RESPONSIVE SVG RENDERER
  // ---------------------------------------------------------------------------

  function renderPfpSvg(specOrSeed, options) {
    var opts = options || {};
    var spec = (specOrSeed && typeof specOrSeed === 'object' && specOrSeed.palette)
      ? specOrSeed
      : resolvePfpSpec(specOrSeed, opts.entityKind || 'agent', opts.overrides);

    if (!spec.compactId) {
      spec.compactId = encodePfpId(spec, spec.displayName);
    }

    var numericSize = typeof opts.size === 'number' && opts.size > 0 ? opts.size : 0;
    var lod = opts.lod || (numericSize > 0 && numericSize < 36 ? 'micro' : numericSize > 0 && numericSize < 96 ? 'compact' : 'full');
    var fluid = opts.fluid !== false;
    var uid = 'pfp-' + fnv1aHash(spec.seed + '-' + spec.headwear + '-' + spec.eyes + '-' + spec.chest).toString(36);
    var p = spec.palette;

    var sizeAttrs = fluid && !opts.fixedPx
      ? 'width="100%" height="100%" style="display:block;width:100%;height:100%;max-width:100%;max-height:100%;aspect-ratio:1/1;"'
      : 'width="' + (numericSize || 128) + '" height="' + (numericSize || 128) + '" style="display:block;aspect-ratio:1/1;"';

    var bustContent = spec.entityKind === 'human'
      ? renderHumanBust(spec, uid, lod)
      : renderAgentBust(spec, uid, lod);

    var shape = opts.shape || 'circle';
    var clipShapeSvg = shape === 'square'
      ? '<rect x="0" y="0" width="400" height="400" rx="0"/>'
      : shape === 'rounded'
        ? '<rect x="0" y="0" width="400" height="400" rx="64"/>'
        : '<circle cx="200" cy="200" r="200"/>';

    var borderOverlaySvg = shape === 'square'
      ? '<rect x="2" y="2" width="396" height="396" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4" opacity="0.55"/>'
      : shape === 'rounded'
        ? '<rect x="2" y="2" width="396" height="396" rx="62" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4" opacity="0.55"/>'
        : '<circle cx="200" cy="200" r="196" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4" opacity="0.55"/>';

    // Uses the exact `viewBox="0 0 400 400"` and `transform="translate(200,176) scale(1.5) translate(-250,-207)"`
    // coordinate framing from `public/pfp/coding_agent.svg` and `lila_agent.svg`!
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" ' + sizeAttrs +
      ' role="img" aria-label="' + escapeXml(spec.displayName || spec.avatarId || spec.seed) + '" data-pfp-id="' + escapeXml(spec.compactId) + '" data-pfp-lod="' + lod + '">' +
        '<defs>' +
          '<clipPath id="' + uid + '-clip">' + clipShapeSvg + '</clipPath>' +
          '<radialGradient id="' + uid + '-bg" cx="50%" cy="50%" r="70%">' +
            '<stop offset="0%" stop-color="' + escapeXml(p.secondary) + '"/>' +
            '<stop offset="65%" stop-color="' + escapeXml(p.background) + '"/>' +
            '<stop offset="100%" stop-color="#04070d"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + '-body" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="' + escapeXml(p.primary) + '"/>' +
            '<stop offset="100%" stop-color="' + escapeXml(p.secondary) + '"/>' +
          '</linearGradient>' +
          '<filter id="' + uid + '-glow" x="-20%" y="-20%" width="140%" height="140%">' +
            '<feGaussianBlur stdDeviation="8" result="blur"/>' +
            '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
          '</filter>' +
          '<pattern id="' + uid + '-ht" width="13" height="13" patternUnits="userSpaceOnUse">' +
            '<circle cx="4" cy="4" r="2" fill="' + escapeXml(p.accent) + '" opacity="0.45"/>' +
          '</pattern>' +
        '</defs>' +
        '<g clip-path="url(#' + uid + '-clip)">' +
          '<g transform="translate(200,176) scale(1.5) translate(-250,-207)">' +
            renderBackgroundLayer(spec, uid, lod) +
            bustContent +
            renderCornerBadgeAndSparkles(spec, uid, lod) +
          '</g>' +
          borderOverlaySvg +
        '</g>' +
      '</svg>'
    );
  }

  function toDataUri(specOrSeed, options) {
    var svg = renderPfpSvg(specOrSeed, options);
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function mountResponsiveAvatar(container, specOrSeed, options) {
    if (!container || typeof container.innerHTML === 'undefined') return null;
    var opts = Object.assign({ fluid: true }, options);
    var currentLod = '';

    function updateRender(widthPx) {
      var nextLod = widthPx > 0 && widthPx < 36 ? 'micro' : widthPx > 0 && widthPx < 96 ? 'compact' : 'full';
      if (nextLod !== currentLod) {
        currentLod = nextLod;
        container.innerHTML = renderPfpSvg(specOrSeed, Object.assign({}, opts, { lod: nextLod, size: widthPx || 128 }));
      }
    }

    var rect = container.getBoundingClientRect ? container.getBoundingClientRect() : { width: 128 };
    updateRender(rect.width || 128);

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var w = entries[i].contentRect && entries[i].contentRect.width;
          if (w > 0) updateRender(w);
        }
      });
      ro.observe(container);
      return function disconnect() { ro.disconnect(); };
    }
    return function noop() {};
  }

  // ---------------------------------------------------------------------------
  // EXPORT AS SVG / PNG / WEBP + INTERACTIVE EXPORT MODAL
  // ---------------------------------------------------------------------------

  /**
   * Renders and downloads an avatar as `.svg`, `.png`, or `.webp` at the chosen
   * pixel dimensions (`size` or `width`x`height`), crop `shape` ('circle'|'rounded'|'square'),
   * and `lod` ('auto'|'full'|'compact'|'micro').
   */
  function exportAvatar(specOrSeed, exportOpts) {
    if (typeof document === 'undefined') return Promise.resolve(null);
    var opts = exportOpts || {};
    var spec = (specOrSeed && typeof specOrSeed === 'object' && specOrSeed.palette)
      ? specOrSeed
      : resolvePfpSpec(specOrSeed || 'jimesh-agent', opts.entityKind || 'agent');
    var format = String(opts.format || 'svg').toLowerCase();
    var widthPx = Math.max(16, Math.min(4096, Number(opts.width || opts.size || 512)));
    var heightPx = Math.max(16, Math.min(4096, Number(opts.height || opts.size || widthPx)));
    var shape = opts.shape || 'circle';
    var lodChoice = opts.lod && opts.lod !== 'auto'
      ? opts.lod
      : (widthPx < 36 ? 'micro' : widthPx < 96 ? 'compact' : 'full');

    var svgMarkup = renderPfpSvg(spec, {
      size: widthPx,
      fixedPx: !opts.fluidSvg,
      fluid: Boolean(opts.fluidSvg),
      lod: lodChoice,
      shape: shape
    });

    var baseFileName = (opts.filename || spec.compactId || spec.avatarId || 'jimesh-pfp')
      .replace(/[^a-zA-Z0-9_~.-]/g, '_');

    function triggerDownload(url, filename) {
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    if (format === 'svg') {
      var svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      var svgUrl = URL.createObjectURL(svgBlob);
      triggerDownload(svgUrl, baseFileName + '-' + widthPx + 'x' + heightPx + '.svg');
      setTimeout(function () { URL.revokeObjectURL(svgUrl); }, 4000);
      return Promise.resolve({ format: 'svg', width: widthPx, height: heightPx, svg: svgMarkup });
    }

    // Rasterize SVG via offscreen HTML5 Canvas for PNG / WebP
    return new Promise(function (resolve, reject) {
      var svgBlob2 = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      var blobUrl = URL.createObjectURL(svgBlob2);
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = widthPx;
          canvas.height = heightPx;
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, widthPx, heightPx);
          ctx.drawImage(img, 0, 0, widthPx, heightPx);
          URL.revokeObjectURL(blobUrl);

          var mime = format === 'webp' ? 'image/webp' : 'image/png';
          var ext = format === 'webp' ? 'webp' : 'png';
          var dataUrl = canvas.toDataURL(mime, 0.96);
          triggerDownload(dataUrl, baseFileName + '-' + widthPx + 'x' + heightPx + '.' + ext);
          resolve({ format: ext, width: widthPx, height: heightPx, dataUrl: dataUrl });
        } catch (err) {
          URL.revokeObjectURL(blobUrl);
          reject(err);
        }
      };
      img.onerror = function (err) {
        URL.revokeObjectURL(blobUrl);
        reject(err);
      };
      img.src = blobUrl;
    });
  }

  /**
   * Opens an interactive Download / Export Modal allowing the user to select:
   * - Format: SVG (Vector), PNG (Transparent Raster), or WebP
   * - Size / Resolution: 32x32, 64x64, 128x128, 256x256, 400x400, 512x512, 1024x1024, 2048x2048, or Custom W x H
   * - Frame / Shape: Circle (Transparent corners), Rounded Square, or Full Square
   * - Detail Level (LOD): Auto, Full, Compact, or Micro
   */
  function openExportModal(specOrSeed, modalOptions) {
    if (typeof document === 'undefined') return;
    var opts = modalOptions || {};
    var spec = (specOrSeed && typeof specOrSeed === 'object' && specOrSeed.palette)
      ? specOrSeed
      : resolvePfpSpec(specOrSeed || 'jimesh-agent', opts.entityKind || 'agent');
    if (!spec.compactId) {
      spec.compactId = encodePfpId(spec, spec.displayName);
    }

    var existing = document.getElementById('jimesh-pfp-export-modal');
    if (existing) existing.remove();

    var state = {
      format: opts.defaultFormat || 'png',
      width: Number(opts.defaultSize) || 512,
      height: Number(opts.defaultSize) || 512,
      shape: opts.defaultShape || 'circle',
      lod: 'auto'
    };

    var SIZE_PRESETS = [32, 64, 128, 256, 400, 512, 1024, 2048];

    var overlay = document.createElement('div');
    overlay.id = 'jimesh-pfp-export-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,8,17,0.85);backdrop-filter:blur(8px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif;';

    var sizeBtnsHtml = SIZE_PRESETS.map(function (sz) {
      return '<button type="button" class="pfp-exp-size-btn" data-size="' + sz + '" style="padding:7px 11px;border-radius:8px;border:1px solid rgba(148,163,184,0.25);background:#090d16;color:#e2e8f0;font-size:12px;font-weight:600;cursor:pointer;">' + sz + '×' + sz + '</button>';
    }).join('');

    overlay.innerHTML =
      '<div style="background:#0f172a;border:1px solid rgba(56,189,248,0.35);border-radius:16px;max-width:620px;width:100%;color:#f8fafc;box-shadow:0 24px 64px rgba(0,0,0,0.7);padding:22px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(148,163,184,0.15);padding-bottom:12px;margin-bottom:16px;">' +
          '<div>' +
            '<div style="font-size:16px;font-weight:700;color:#f8fafc;">⬇ Export &amp; Download Avatar (SVG / PNG)</div>' +
            '<div style="font-size:12px;color:#94a3b8;">ID: <code style="color:#38bdf8;">' + escapeXml(spec.compactId) + '</code></div>' +
          '</div>' +
          '<button type="button" id="pfp-exp-close" style="background:transparent;border:1px solid rgba(148,163,184,0.3);color:#cbd5e1;border-radius:8px;padding:4px 10px;cursor:pointer;">✕</button>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:180px 1fr;gap:20px;align-items:start;">' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;background:#090d16;padding:16px;border-radius:12px;border:1px solid rgba(148,163,184,0.15);">' +
            '<div id="pfp-exp-preview" style="width:140px;height:140px;display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#111827 0% 25%, #090d16 0% 50%) 50% / 16px 16px;border-radius:12px;overflow:hidden;"></div>' +
            '<div id="pfp-exp-summary" style="font-size:11px;color:#7dd3fc;font-weight:600;text-align:center;">PNG · 512×512 px</div>' +
          '</div>' +

          '<div style="display:flex;flex-direction:column;gap:14px;">' +
            '<div>' +
              '<div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">1. Select File Format</div>' +
              '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
                '<button type="button" class="pfp-exp-fmt-btn" data-fmt="png" style="padding:9px;border-radius:8px;border:1px solid #38bdf8;background:rgba(56,189,248,0.16);color:#f8fafc;font-weight:700;font-size:12px;cursor:pointer;">PNG (Raster)</button>' +
                '<button type="button" class="pfp-exp-fmt-btn" data-fmt="svg" style="padding:9px;border-radius:8px;border:1px solid rgba(148,163,184,0.25);background:#090d16;color:#cbd5e1;font-weight:700;font-size:12px;cursor:pointer;">SVG (Vector)</button>' +
                '<button type="button" class="pfp-exp-fmt-btn" data-fmt="webp" style="padding:9px;border-radius:8px;border:1px solid rgba(148,163,184,0.25);background:#090d16;color:#cbd5e1;font-weight:700;font-size:12px;cursor:pointer;">WebP</button>' +
              '</div>' +
            '</div>' +

            '<div>' +
              '<div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">2. Size / Resolution (px)</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">' + sizeBtnsHtml + '</div>' +
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
                '<label style="font-size:11px;color:#94a3b8;">Custom Width (px)<input type="number" id="pfp-exp-w" min="16" max="4096" value="512" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);"/></label>' +
                '<label style="font-size:11px;color:#94a3b8;">Custom Height (px)<input type="number" id="pfp-exp-h" min="16" max="4096" value="512" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);"/></label>' +
              '</div>' +
            '</div>' +

            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
              '<label style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;">3. Crop / Frame Shape' +
                '<select id="pfp-exp-shape" style="width:100%;margin-top:5px;padding:8px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' +
                  '<option value="circle">Circle (Transparent Corners)</option>' +
                  '<option value="rounded">Rounded Square (rx=64)</option>' +
                  '<option value="square">Full Square (No Corner Clip)</option>' +
                '</select>' +
              '</label>' +
              '<label style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;">4. Detail Level (LOD)' +
                '<select id="pfp-exp-lod" style="width:100%;margin-top:5px;padding:8px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' +
                  '<option value="auto">Auto (By Pixel Size)</option>' +
                  '<option value="full">Full (With Banner &amp; Sparkles)</option>' +
                  '<option value="compact">Compact (No Text Banner)</option>' +
                  '<option value="micro">Micro (Minimal Icon)</option>' +
                '</select>' +
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:14px;border-top:1px solid rgba(148,163,184,0.15);">' +
          '<button type="button" id="pfp-exp-cancel" style="padding:9px 14px;border-radius:8px;border:1px solid rgba(148,163,184,0.3);background:transparent;color:#cbd5e1;cursor:pointer;">Cancel</button>' +
          '<button type="button" id="pfp-exp-download" style="padding:9px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#ffffff;font-weight:700;font-size:13px;cursor:pointer;">⬇ Download Now</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var previewBox = overlay.querySelector('#pfp-exp-preview');
    var summaryBox = overlay.querySelector('#pfp-exp-summary');
    var inpW = overlay.querySelector('#pfp-exp-w');
    var inpH = overlay.querySelector('#pfp-exp-h');
    var selShape = overlay.querySelector('#pfp-exp-shape');
    var selLod = overlay.querySelector('#pfp-exp-lod');
    var fmtBtns = overlay.querySelectorAll('.pfp-exp-fmt-btn');
    var sizeBtns = overlay.querySelectorAll('.pfp-exp-size-btn');

    function updateModalUI() {
      var effectiveLod = state.lod !== 'auto'
        ? state.lod
        : (state.width < 36 ? 'micro' : state.width < 96 ? 'compact' : 'full');

      previewBox.innerHTML = renderPfpSvg(spec, {
        fluid: true,
        lod: effectiveLod,
        shape: state.shape
      });

      summaryBox.textContent = state.format.toUpperCase() + ' · ' + state.width + '×' + state.height + ' px · ' + state.shape.toUpperCase();

      Array.prototype.forEach.call(fmtBtns, function (b) {
        var active = b.getAttribute('data-fmt') === state.format;
        b.style.borderColor = active ? '#38bdf8' : 'rgba(148,163,184,0.25)';
        b.style.background = active ? 'rgba(56,189,248,0.18)' : '#090d16';
        b.style.color = active ? '#f8fafc' : '#cbd5e1';
      });

      Array.prototype.forEach.call(sizeBtns, function (b) {
        var sz = Number(b.getAttribute('data-size'));
        var active = sz === state.width && sz === state.height;
        b.style.borderColor = active ? '#38bdf8' : 'rgba(148,163,184,0.25)';
        b.style.background = active ? 'rgba(56,189,248,0.18)' : '#090d16';
      });
    }

    Array.prototype.forEach.call(fmtBtns, function (btn) {
      btn.addEventListener('click', function () {
        state.format = btn.getAttribute('data-fmt');
        updateModalUI();
      });
    });

    Array.prototype.forEach.call(sizeBtns, function (btn) {
      btn.addEventListener('click', function () {
        var sz = Number(btn.getAttribute('data-size')) || 512;
        state.width = sz;
        state.height = sz;
        inpW.value = String(sz);
        inpH.value = String(sz);
        updateModalUI();
      });
    });

    inpW.addEventListener('input', function () {
      state.width = Math.max(16, Math.min(4096, Number(inpW.value) || 512));
      updateModalUI();
    });
    inpH.addEventListener('input', function () {
      state.height = Math.max(16, Math.min(4096, Number(inpH.value) || 512));
      updateModalUI();
    });
    selShape.addEventListener('change', function () {
      state.shape = selShape.value;
      updateModalUI();
    });
    selLod.addEventListener('change', function () {
      state.lod = selLod.value;
      updateModalUI();
    });

    function close() { overlay.remove(); }
    overlay.querySelector('#pfp-exp-close').addEventListener('click', close);
    overlay.querySelector('#pfp-exp-cancel').addEventListener('click', close);

    overlay.querySelector('#pfp-exp-download').addEventListener('click', function () {
      exportAvatar(spec, {
        format: state.format,
        width: state.width,
        height: state.height,
        shape: state.shape,
        lod: state.lod
      }).then(function () {
        close();
      });
    });

    updateModalUI();
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE BUILDER MODAL (FOR EMBEDDING IN DASHBOARDS)
  // ---------------------------------------------------------------------------

  function openBuilderModal(config) {
    if (typeof document === 'undefined') return;
    var cfg = config || {};
    var entityId = cfg.entityId || 'agent-default';
    var entityKind = cfg.entityKind || 'agent';
    var currentSpec = resolvePfpSpec(cfg.initialSeed || entityId, entityKind, cfg.initialSpec || {});

    var existing = document.getElementById('jimesh-pfp-builder-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'jimesh-pfp-builder-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,8,17,0.84);backdrop-filter:blur(8px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif;';

    var palettePool = PALETTES[entityKind] || PALETTES.agent;

    function buildSelectOptions(values, selected) {
      return values.map(function (v) {
        return '<option value="' + v + '"' + (v === selected ? ' selected' : '') + '>' + v.replace(/_/g, ' ').toUpperCase() + '</option>';
      }).join('');
    }

    var paletteButtonsHtml = palettePool.map(function (pal, idx) {
      return '<button type="button" class="pfp-pal-btn" data-pal-idx="' + idx + '" style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,0.25);background:#0f172a;color:#e2e8f0;font-size:11px;cursor:pointer;">' +
        '<span style="width:12px;height:12px;border-radius:999px;background:' + pal.primary + ';border:2px solid ' + pal.accent + ';display:inline-block;"></span>' +
        pal.name +
      '</button>';
    }).join('');

    overlay.innerHTML =
      '<div style="background:#0f172a;border:1px solid rgba(56,189,248,0.3);border-radius:16px;max-width:740px;width:100%;max-height:92vh;overflow:auto;color:#f8fafc;box-shadow:0 24px 64px rgba(0,0,0,0.65);padding:20px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(148,163,184,0.15);padding-bottom:12px;margin-bottom:16px;">' +
          '<div>' +
            '<div style="font-size:16px;font-weight:700;color:#f8fafc;">JiMesh PFP Studio — ' + escapeXml(cfg.entityName || entityId) + '</div>' +
            '<div style="font-size:12px;color:#94a3b8;">Authentic Comic-Bust SVG Layers · Compact ID Codec (<code id="pfp-modal-compact-id" style="color:#38bdf8;">' + escapeXml(currentSpec.compactId) + '</code>)</div>' +
          '</div>' +
          '<button type="button" id="pfp-modal-close" style="background:transparent;border:1px solid rgba(148,163,184,0.3);color:#cbd5e1;border-radius:8px;padding:4px 10px;cursor:pointer;">✕</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:minmax(180px,220px) 1fr;gap:20px;align-items:start;">' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;background:#090d16;padding:16px;border-radius:12px;border:1px solid rgba(148,163,184,0.12);">' +
            '<div id="pfp-modal-preview" style="width:168px;height:168px;border-radius:999px;overflow:hidden;"></div>' +
            '<div style="display:flex;flex-direction:column;gap:8px;width:100%;">' +
              '<button type="button" id="pfp-modal-random" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;font-weight:600;font-size:12px;cursor:pointer;">🎲 Roll Traits + Name</button>' +
              '<button type="button" id="pfp-modal-export" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(16,185,129,0.45);background:rgba(16,185,129,0.14);color:#6ee7b7;font-weight:700;font-size:12px;cursor:pointer;">⬇ Download SVG / PNG</button>' +
            '</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
            '<label style="font-size:11px;color:#94a3b8;">HEADWEAR<select id="pfp-sel-headwear" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(HEADWEAR_VALUES, currentSpec.headwear) + '</select></label>' +
            '<label style="font-size:11px;color:#94a3b8;">EYES / VISOR<select id="pfp-sel-eyes" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(EYES_VALUES, currentSpec.eyes) + '</select></label>' +
            '<label style="font-size:11px;color:#94a3b8;">BODY / CHASSIS<select id="pfp-sel-body" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(BODY_VALUES, currentSpec.body) + '</select></label>' +
            '<label style="font-size:11px;color:#94a3b8;">CHEST EMBLEM<select id="pfp-sel-chest" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(CHEST_VALUES, currentSpec.chest) + '</select></label>' +
            '<label style="font-size:11px;color:#94a3b8;">BACKGROUND<select id="pfp-sel-background" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(BACKGROUND_VALUES, currentSpec.background) + '</select></label>' +
            '<label style="font-size:11px;color:#94a3b8;">ROLE / BADGE<select id="pfp-sel-accessory" style="width:100%;margin-top:4px;padding:7px;border-radius:8px;background:#090d16;color:#f8fafc;border:1px solid rgba(148,163,184,0.25);">' + buildSelectOptions(ACCESSORY_VALUES, currentSpec.accessoryBadge) + '</select></label>' +
            '<div style="grid-column:1/-1;margin-top:4px;">' +
              '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">COLOR PALETTE PRESETS</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + paletteButtonsHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;padding-top:12px;border-top:1px solid rgba(148,163,184,0.15);">' +
          '<button type="button" id="pfp-modal-cancel" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(148,163,184,0.3);background:transparent;color:#cbd5e1;cursor:pointer;">Cancel</button>' +
          '<button type="button" id="pfp-modal-save" style="padding:8px 18px;border-radius:8px;border:none;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#ffffff;font-weight:600;cursor:pointer;">Save PFP Avatar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var previewEl = overlay.querySelector('#pfp-modal-preview');
    var codeEl = overlay.querySelector('#pfp-modal-compact-id');

    function refreshPreview() {
      currentSpec.compactId = encodePfpId(currentSpec, currentSpec.displayName);
      previewEl.innerHTML = renderPfpSvg(currentSpec, { fluid: true, lod: 'full' });
      if (codeEl) codeEl.textContent = currentSpec.compactId;
    }
    refreshPreview();

    var mapSelectors = [
      ['#pfp-sel-headwear', 'headwear'],
      ['#pfp-sel-eyes', 'eyes'],
      ['#pfp-sel-body', 'body'],
      ['#pfp-sel-chest', 'chest'],
      ['#pfp-sel-background', 'background'],
      ['#pfp-sel-accessory', 'accessoryBadge']
    ];

    mapSelectors.forEach(function (pair) {
      var el = overlay.querySelector(pair[0]);
      if (el) {
        el.addEventListener('change', function () {
          currentSpec[pair[1]] = el.value;
          refreshPreview();
        });
      }
    });

    var palBtns = overlay.querySelectorAll('.pfp-pal-btn');
    for (var i = 0; i < palBtns.length; i++) {
      palBtns[i].addEventListener('click', function (ev) {
        var idx = Number(ev.currentTarget.getAttribute('data-pal-idx')) || 0;
        var chosen = palettePool[idx];
        if (chosen) {
          currentSpec.palette = Object.assign({}, chosen);
          refreshPreview();
        }
      });
    }

    overlay.querySelector('#pfp-modal-random').addEventListener('click', function () {
      var randSeed = entityId + '-' + Math.random().toString(36).slice(2, 8);
      var persona = generatePersonaName(randSeed, { entityKind: entityKind });
      currentSpec = persona.spec;
      currentSpec.displayName = persona.callsign;
      mapSelectors.forEach(function (pair) {
        var el = overlay.querySelector(pair[0]);
        if (el) el.value = currentSpec[pair[1]];
      });
      refreshPreview();
    });

    function closeModal() { overlay.remove(); }
    overlay.querySelector('#pfp-modal-close').addEventListener('click', closeModal);
    overlay.querySelector('#pfp-modal-cancel').addEventListener('click', closeModal);
    overlay.querySelector('#pfp-modal-export').addEventListener('click', function () {
      openExportModal(currentSpec);
    });

    overlay.querySelector('#pfp-modal-save').addEventListener('click', function () {
      if (typeof cfg.onSave === 'function') {
        cfg.onSave(currentSpec, renderPfpSvg(currentSpec, { fluid: true }));
      }
      closeModal();
    });
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API SURFACE (`window.PFP` & CommonJS / ESM)
  // ---------------------------------------------------------------------------

  return {
    HEADWEAR_VALUES: HEADWEAR_VALUES,
    EYES_VALUES: EYES_VALUES,
    BODY_VALUES: BODY_VALUES,
    CHEST_VALUES: CHEST_VALUES,
    BACKGROUND_VALUES: BACKGROUND_VALUES,
    ACCESSORY_VALUES: ACCESSORY_VALUES,
    PALETTES: PALETTES,
    ALL_PALETTES: ALL_PALETTES,
    PRESET_CATALOG: PRESET_CATALOG,

    getCustomPalettes: getCustomPalettes,
    saveCustomPalette: saveCustomPalette,
    deleteCustomPalette: deleteCustomPalette,
    getCustomPresets: getCustomPresets,
    saveCustomPreset: saveCustomPreset,
    deleteCustomPreset: deleteCustomPreset,
    getAllPresets: getAllPresets,

    fnv1aHash: fnv1aHash,
    createMulberry32: createMulberry32,
    resolvePfpSpec: resolvePfpSpec,
    encodePfpId: encodePfpId,
    decodePfpId: decodePfpId,
    generatePersonaName: generatePersonaName,
    renderPfpSvg: renderPfpSvg,
    toDataUri: toDataUri,
    mountResponsiveAvatar: mountResponsiveAvatar,
    exportAvatar: exportAvatar,
    openExportModal: openExportModal,
    openBuilderModal: openBuilderModal,

    // Ergonomic aliases
    forAgent: function (idOrSeed, overrides) {
      return renderPfpSvg(resolvePfpSpec(idOrSeed, 'agent', overrides), { fluid: true });
    },
    forExpert: function (idOrSeed, overrides) {
      return renderPfpSvg(resolvePfpSpec(idOrSeed, 'expert', overrides), { fluid: true });
    },
    forHuman: function (idOrSeed, overrides) {
      return renderPfpSvg(resolvePfpSpec(idOrSeed, 'human', overrides), { fluid: true });
    },
    renderSvg: function (idOrSeed, kind, sizeOrOptions) {
      var opts = typeof sizeOrOptions === 'number' ? { size: sizeOrOptions, fluid: true } : (sizeOrOptions || { fluid: true });
      var spec = (idOrSeed && typeof idOrSeed === 'object') ? idOrSeed : resolvePfpSpec(idOrSeed, kind || 'agent', opts.overrides);
      return renderPfpSvg(spec, opts);
    },
    pickUrl: function (idOrSeed, kind) {
      var spec = resolvePfpSpec(idOrSeed, kind || 'agent');
      return toDataUri(spec, { fluid: true });
    }
  };
});
