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
    'crown', 'halo', 'cyber_visor', 'cyber_helmet', 'beret',
    'ninja_headband', 'cyber_horns', 'browser_header',
    'ponytail', 'braid_flower', 'afro', 'man_bun', 'curly_hair'
  ];

  var EYES_VALUES = [
    'normal', 'focused', 'cyber_optic', 'happy', 'glasses',
    'sunglasses', 'laser', 'wink', 'terminal_glow',
    'hud_visor', 'evil_slits', 'cursor_arrows'
  ];

  var BODY_VALUES = [
    'hoodie', 'suit', 'robot_chassis', 'casual_tee',
    'cyber_armor', 'lab_coat', 'turtleneck',
    'trench_coat', 'plaid_shirt'
  ];

  var CHEST_VALUES = [
    'none', 'tie', 'reactor_core', 'necklace',
    'pocket', 'harness', 'mesh_emblem',
    'bow_tie', 'laptop', 'tablet_chart', 'vault_coin',
    'rocket_badge', 'shield_check', 'neck_headphones'
  ];

  var BACKGROUND_VALUES = [
    'mesh_gradient', 'cyber_grid', 'pastel_dots', 'geometric',
    'matrix_rain', 'deep_space', 'solid_mesh'
  ];

  var ACCESSORY_VALUES = [
    'none', 'crm_shield', 'code_brackets', 'marketing_megaphone',
    'devops_gear', 'security_lock', 'ai_spark', 'nango_sync_badge', 'composio_connector'
  ];

  var CREATURE_SPECIES_VALUES = [
    'fox', 'dragon', 'wolf', 'bear', 'owl', 'kraken', 'bull'
  ];

  var ENTITY_CODE_TO_KIND = {
    ag: 'agent',
    cr: 'creature',
    cr0: 'creature',
    cr1: 'creature',
    cr2: 'creature',
    cr3: 'creature',
    cr4: 'creature',
    cr5: 'creature',
    cr6: 'creature',
    ex: 'creature',
    hu: 'human'
  };
  var ENTITY_KIND_TO_CODE = { agent: 'ag', creature: 'cr', expert: 'cr', human: 'hu' };

  var ALL_PALETTES = [
    { id: 'coding_cyan', name: 'Coding Cyan', primary: '#0284c7', secondary: '#22d3ee', accent: '#f59e0b', background: '#071524', skinOrChassis: '#38bdf8' },
    { id: 'lila_toxic', name: 'Lila Toxic', primary: '#6d28d9', secondary: '#c084fc', accent: '#baff29', background: '#110622', skinOrChassis: '#7c3aed' },
    { id: 'ninja_stealth', name: 'Ninja Stealth', primary: '#334155', secondary: '#94a3b8', accent: '#c084fc', background: '#0d0b18', skinOrChassis: '#475569' },
    { id: 'orch_violet', name: 'Orchestrator Violet', primary: '#6d28d9', secondary: '#c084fc', accent: '#e879f9', background: '#110926', skinOrChassis: '#8b5cf6' },
    { id: 'red_adversary', name: 'Red Team Crimson', primary: '#dc2626', secondary: '#f87171', accent: '#fbbf24', background: '#1c080a', skinOrChassis: '#ef4444' },
    { id: 'figma_emerald', name: 'Emerald Matrix', primary: '#059669', secondary: '#34d399', accent: '#38bdf8', background: '#051812', skinOrChassis: '#10b981' },
    { id: 'voice_amber', name: 'Solar Gold', primary: '#d97706', secondary: '#fbbf24', accent: '#a855f7', background: '#191105', skinOrChassis: '#f59e0b' },
    { id: 'happy_pink', name: 'Joy Magenta', primary: '#db2777', secondary: '#f472b6', accent: '#fef08a', background: '#26081c', skinOrChassis: '#ec4899' },
    { id: 'exp_sovereign', name: 'Sovereign Gold', primary: '#7c3aed', secondary: '#c084fc', accent: '#fbbf24', background: '#120924', skinOrChassis: '#8b5cf6' },
    { id: 'exp_cyber', name: 'SecOps Emerald', primary: '#059669', secondary: '#34d399', accent: '#38bdf8', background: '#041a14', skinOrChassis: '#10b981' },
    { id: 'exp_crimson', name: 'Adversary Ruby', primary: '#e11d48', secondary: '#fb7185', accent: '#fde047', background: '#1f0610', skinOrChassis: '#f43f5e' },
    { id: 'exp_cobalt', name: 'Obsidian Indigo', primary: '#4f46e5', secondary: '#818cf8', accent: '#ec4899', background: '#090d1c', skinOrChassis: '#6366f1' },
    { id: 'hum_founder', name: 'Founder Violet', primary: '#7c3aed', secondary: '#38bdf8', accent: '#c084fc', background: '#160d29', skinOrChassis: '#f3c6a5' },
    { id: 'hum_ops', name: 'Ops Cyan', primary: '#2563eb', secondary: '#22d3ee', accent: '#38bdf8', background: '#081c29', skinOrChassis: '#eab68c' },
    { id: 'hum_product', name: 'Product Emerald', primary: '#059669', secondary: '#34d399', accent: '#6ee7b7', background: '#071f18', skinOrChassis: '#c68b59' },
    { id: 'hum_analyst', name: 'Analyst Amber', primary: '#d97706', secondary: '#fbbf24', accent: '#38bdf8', background: '#211305', skinOrChassis: '#f5d0b5' },
    { id: 'hum_qa', name: 'QA Rose', primary: '#e11d48', secondary: '#fb7185', accent: '#fda4af', background: '#240812', skinOrChassis: '#8d5524' },
    { id: 'hum_sales', name: 'Sales Indigo', primary: '#4f46e5', secondary: '#818cf8', accent: '#f59e0b', background: '#0c0a24', skinOrChassis: '#f1c27d' }
  ];

  var PALETTES = {
    agent: ALL_PALETTES.slice(0, 12),
    creature: ALL_PALETTES.slice(0, 12),
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
    },
    lila_agent2: {
      presetId: 'lila_agent2',
      svgFile: '/pfp/lila_agent2.svg',
      entityKind: 'agent',
      title: 'LILA PRIME // HEX CORE',
      background: 'deep_space',
      body: 'robot_chassis',
      chest: 'mesh_emblem',
      eyes: 'cyber_optic',
      headwear: 'cyber_horns',
      accessoryBadge: 'ai_spark',
      palette: ALL_PALETTES[1]
    },
    man1: {
      presetId: 'man1',
      svgFile: '/pfp/man1.svg',
      entityKind: 'human',
      title: 'FULLSTACK ENGINEER // LAPTOP',
      background: 'cyber_grid',
      body: 'hoodie',
      chest: 'laptop',
      eyes: 'normal',
      headwear: 'headset',
      accessoryBadge: 'code_brackets',
      palette: ALL_PALETTES[13]
    },
    man2: {
      presetId: 'man2',
      svgFile: '/pfp/man2.svg',
      entityKind: 'human',
      title: 'SYSTEMS ARCHITECT // TABLET',
      background: 'geometric',
      body: 'turtleneck',
      chest: 'tablet_chart',
      eyes: 'glasses',
      headwear: 'curly_hair',
      accessoryBadge: 'devops_gear',
      palette: ALL_PALETTES[15]
    },
    man3: {
      presetId: 'man3',
      svgFile: '/pfp/man3.svg',
      entityKind: 'human',
      title: 'RED TEAM OPERATOR // EXPLOIT',
      background: 'matrix_rain',
      body: 'trench_coat',
      chest: 'laptop',
      eyes: 'evil_slits',
      headwear: 'fedora',
      accessoryBadge: 'security_lock',
      palette: ALL_PALETTES[4]
    },
    man4: {
      presetId: 'man4',
      svgFile: '/pfp/man4.svg',
      entityKind: 'human',
      title: 'NETRUNNER // CYBER VISOR',
      background: 'deep_space',
      body: 'trench_coat',
      chest: 'reactor_core',
      eyes: 'hud_visor',
      headwear: 'fedora',
      accessoryBadge: 'ai_spark',
      palette: ALL_PALETTES[0]
    },
    man6: {
      presetId: 'man6',
      svgFile: '/pfp/man6.svg',
      entityKind: 'human',
      title: 'STAFF SRE // INFRA FORGE',
      background: 'solid_mesh',
      body: 'plaid_shirt',
      chest: 'pocket',
      eyes: 'focused',
      headwear: 'man_bun',
      accessoryBadge: 'devops_gear',
      palette: ALL_PALETTES[14]
    },
    man7: {
      presetId: 'man7',
      svgFile: '/pfp/man7.svg',
      entityKind: 'human',
      title: 'AUDIO / ML ENGINEER',
      background: 'pastel_dots',
      body: 'hoodie',
      chest: 'neck_headphones',
      eyes: 'sunglasses',
      headwear: 'beanie',
      accessoryBadge: 'ai_spark',
      palette: ALL_PALETTES[17]
    },
    woman1: {
      presetId: 'woman1',
      svgFile: '/pfp/woman1.svg',
      entityKind: 'human',
      title: 'LEAD FRONTEND // DESIGN SYS',
      background: 'mesh_gradient',
      body: 'lab_coat',
      chest: 'laptop',
      eyes: 'happy',
      headwear: 'ponytail',
      accessoryBadge: 'code_brackets',
      palette: ALL_PALETTES[12]
    },
    woman5: {
      presetId: 'woman5',
      svgFile: '/pfp/woman5.svg',
      entityKind: 'human',
      title: 'GROWTH DIRECTOR // DEMAND',
      background: 'pastel_dots',
      body: 'suit',
      chest: 'rocket_badge',
      eyes: 'wink',
      headwear: 'ponytail',
      accessoryBadge: 'marketing_megaphone',
      palette: ALL_PALETTES[16]
    },
    woman6: {
      presetId: 'woman6',
      svgFile: '/pfp/woman6.svg',
      entityKind: 'human',
      title: 'PRINCIPAL RESEARCHER // AI',
      background: 'deep_space',
      body: 'lab_coat',
      chest: 'pocket',
      eyes: 'glasses',
      headwear: 'braid_flower',
      accessoryBadge: 'ai_spark',
      palette: ALL_PALETTES[14]
    },
    sales2: {
      presetId: 'sales2',
      svgFile: '/pfp/sales2.svg',
      entityKind: 'human',
      title: 'VP REVENUE // CLOSER',
      background: 'geometric',
      body: 'suit',
      chest: 'vault_coin',
      eyes: 'sunglasses',
      headwear: 'afro',
      accessoryBadge: 'crm_shield',
      palette: ALL_PALETTES[15]
    },
    kitsune_mascot: {
      presetId: 'kitsune_mascot',
      entityKind: 'creature',
      species: 'fox',
      title: 'KITSUNE-09 // CYBER FOX',
      background: 'deep_space',
      body: 'lab_coat',
      chest: 'mesh_emblem',
      eyes: 'cyber_optic',
      headwear: 'halo',
      accessoryBadge: 'ai_spark',
      palette: ALL_PALETTES[6]
    },
    drake_mascot: {
      presetId: 'drake_mascot',
      entityKind: 'creature',
      species: 'dragon',
      title: 'DRAKE-01 // WYRM DRAGON',
      background: 'geometric',
      body: 'cyber_armor',
      chest: 'reactor_core',
      eyes: 'laser',
      headwear: 'crown',
      accessoryBadge: 'security_lock',
      palette: ALL_PALETTES[4]
    },
    fenrir_wolf: {
      presetId: 'fenrir_wolf',
      entityKind: 'creature',
      species: 'wolf',
      title: 'FENRIR-7 // DIRE WOLF',
      background: 'cyber_grid',
      body: 'robot_chassis',
      chest: 'harness',
      eyes: 'focused',
      headwear: 'none',
      accessoryBadge: 'devops_gear',
      palette: ALL_PALETTES[2]
    },
    kodiak_bear: {
      presetId: 'kodiak_bear',
      entityKind: 'creature',
      species: 'bear',
      title: 'KODIAK-88 // IRON GRIZZLY',
      background: 'solid_mesh',
      body: 'hoodie',
      chest: 'mesh_emblem',
      eyes: 'happy',
      headwear: 'cap',
      accessoryBadge: 'crm_shield',
      palette: ALL_PALETTES[15]
    },
    chronos_owl: {
      presetId: 'chronos_owl',
      entityKind: 'creature',
      species: 'owl',
      title: 'ATHENA-12 // NIGHT OWL',
      background: 'pastel_dots',
      body: 'suit',
      chest: 'tie',
      eyes: 'glasses',
      headwear: 'beret',
      accessoryBadge: 'code_brackets',
      palette: ALL_PALETTES[3]
    },
    kraken_octo: {
      presetId: 'kraken_octo',
      entityKind: 'creature',
      species: 'kraken',
      title: 'KRAKEN-99 // DEEP CTHULHU',
      background: 'matrix_rain',
      body: 'turtleneck',
      chest: 'necklace',
      eyes: 'terminal_glow',
      headwear: 'none',
      accessoryBadge: 'nango_sync_badge',
      palette: ALL_PALETTES[5]
    },
    minotaur_bull: {
      presetId: 'minotaur_bull',
      entityKind: 'creature',
      species: 'bull',
      title: 'TAURUS-04 // BULL BREAKER',
      background: 'mesh_gradient',
      body: 'casual_tee',
      chest: 'reactor_core',
      eyes: 'focused',
      headwear: 'none',
      accessoryBadge: 'marketing_megaphone',
      palette: ALL_PALETTES[10]
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
      species: spec.species || undefined,
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

  var CREATURE_PREFIXES = [
    'Kitsune', 'Fenrir', 'Neko', 'Draco', 'Tanuki', 'Raptor',
    'Kodiak', 'Gryphon', 'Baku', 'Raiju', 'Sphinx', 'Lynx',
    'Vulpix', 'Chimera', 'Cerberus', 'Manta'
  ];

  var CREATURE_CORES = [
    'Cyber Fox', 'Void Wolf', 'Shadow Cat', 'Wyrm Guard', 'Spark Badger', 'Neon Hawk',
    'Iron Bear', 'Storm Tiger', 'Pulse Hound', 'Prism Lynx', 'Venom Drake', 'Night Owl'
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
    } else if (kind === 'creature') {
      var cPrefix = pick(rng, CREATURE_PREFIXES);
      var cCore = pick(rng, CREATURE_CORES);
      var cNum = String(Math.floor(rng() * 90) + 10);
      displayName = cPrefix + '-' + cNum + ' // ' + cCore;
      callsign = cPrefix + '-' + cNum;
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

    var parts = [
      'pfp1',
      kindCode,
      'c' + bgIdx,
      'b' + bodyIdx,
      'ch' + chestIdx,
      'e' + eyesIdx,
      'h' + headIdx,
      'a' + accIdx,
      palToken
    ];

    if (s.entityKind === 'creature' && s.species) {
      var spIdx = Math.max(0, CREATURE_SPECIES_VALUES.indexOf(s.species));
      parts.push('s' + spIdx);
    }

    var baseId = parts.join('-');

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

    var allPresets = getAllPresets();
    if (allPresets[raw]) {
      var preset = allPresets[raw];
      return {
        avatarId: preset.presetId,
        seed: preset.presetId,
        presetId: preset.presetId,
        entityKind: preset.entityKind,
        species: preset.species || undefined,
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
    var palToken = tokens[8] || 'p0';
    var speciesToken = tokens[9] || '';

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

    var species = undefined;
    if (entityKind === 'creature') {
      if (speciesToken && speciesToken.indexOf('s') === 0) {
        var sIdx = parseInt(speciesToken.slice(1), 10) || 0;
        species = CREATURE_SPECIES_VALUES[sIdx % CREATURE_SPECIES_VALUES.length];
      } else if (/^cr[0-6]$/.test(tokens[1])) {
        var cIdx = parseInt(tokens[1].slice(2), 10) || 0;
        species = CREATURE_SPECIES_VALUES[cIdx % CREATURE_SPECIES_VALUES.length];
      } else {
        species = CREATURE_SPECIES_VALUES[fnv1aHash(raw) % CREATURE_SPECIES_VALUES.length];
      }
    }

    var spec = {
      avatarId: raw,
      seed: raw,
      compactId: raw,
      entityKind: entityKind,
      species: species,
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

    var kind = entityKind === 'human' || entityKind === 'creature' ? entityKind : (entityKind === 'expert' ? 'creature' : 'agent');
    var seedStr = String(idOrSeed || 'jimesh-entity').trim() || 'jimesh-entity';
    var hash = fnv1aHash(kind + '::' + seedStr);
    var rng = createMulberry32(hash);

    var palettePool = PALETTES[kind] || PALETTES.agent;
    var basePalette = palettePool[Math.floor(rng() * palettePool.length) % palettePool.length];

    var bodyPool = kind === 'human'
      ? ['hoodie', 'suit', 'casual_tee', 'lab_coat', 'turtleneck', 'trench_coat', 'plaid_shirt']
      : ['cyber_armor', 'robot_chassis', 'suit', 'hoodie', 'lab_coat', 'turtleneck', 'casual_tee', 'trench_coat'];

    var eyePool = kind === 'human'
      ? ['normal', 'focused', 'happy', 'glasses', 'sunglasses', 'wink', 'hud_visor']
      : ['cyber_optic', 'terminal_glow', 'laser', 'focused', 'sunglasses', 'glasses', 'normal', 'happy', 'wink', 'hud_visor', 'cursor_arrows'];

    var headwearPool = kind === 'human'
      ? ['none', 'cap', 'headset', 'beanie', 'fedora', 'beret', 'ponytail', 'braid_flower', 'afro', 'man_bun', 'curly_hair']
      : kind === 'creature'
        ? ['none', 'crown', 'halo', 'cyber_visor', 'cyber_helmet', 'headset', 'fedora', 'cap', 'beanie']
        : ['crown', 'halo', 'cyber_visor', 'cyber_helmet', 'headset', 'fedora', 'cap', 'beanie', 'beret', 'ninja_headband', 'cyber_horns', 'browser_header', 'none'];

    var chestPool = kind === 'human'
      ? ['none', 'tie', 'necklace', 'pocket', 'mesh_emblem', 'harness', 'laptop', 'tablet_chart', 'rocket_badge', 'shield_check', 'neck_headphones']
      : ['mesh_emblem', 'reactor_core', 'harness', 'tie', 'pocket', 'necklace', 'bow_tie', 'laptop', 'vault_coin', 'shield_check'];

    var spec = {
      avatarId: 'pfp-' + seedStr.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48),
      seed: seedStr,
      entityKind: kind,
      species: kind === 'creature' ? pick(rng, CREATURE_SPECIES_VALUES) : undefined,
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
      if (CREATURE_SPECIES_VALUES.indexOf(overrides.species) !== -1) spec.species = overrides.species;
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
  // AUTHENTIC 400x400 COMIC-BUST SVG LAYER RENDERERS
  // ---------------------------------------------------------------------------

  function renderBackgroundLayer(spec, uid, lod) {
    var p = spec.palette;
    var bg = spec.background;
    var parts = [
      '<rect width="400" height="400" fill="' + escapeXml(p.background) + '"/>',
      '<circle cx="200" cy="170" r="190" fill="url(#' + uid + '-bgGlow)"/>'
    ];

    if (lod !== 'micro') {
      if (bg === 'mesh_gradient') {
        parts.push(
          '<circle cx="320" cy="110" r="82" fill="url(#' + uid + '-dots)" opacity="0.55"/>' +
          '<circle cx="80" cy="310" r="64" fill="url(#' + uid + '-dots)" opacity="0.45"/>'
        );
      } else if (bg === 'cyber_grid') {
        parts.push(
          '<g stroke="' + escapeXml(p.secondary) + '" stroke-opacity="0.22" stroke-width="2">' +
            '<line x1="0" y1="80" x2="400" y2="80"/><line x1="0" y1="160" x2="400" y2="160"/>' +
            '<line x1="0" y1="240" x2="400" y2="240"/><line x1="0" y1="320" x2="400" y2="320"/>' +
            '<line x1="80" y1="0" x2="80" y2="400"/><line x1="160" y1="0" x2="160" y2="400"/>' +
            '<line x1="240" y1="0" x2="240" y2="400"/><line x1="320" y1="0" x2="320" y2="400"/>' +
          '</g>' +
          '<circle cx="200" cy="200" r="172" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-opacity="0.42" stroke-width="3" stroke-dasharray="14 10"/>'
        );
      } else if (bg === 'matrix_rain') {
        parts.push(
          '<g fill="' + escapeXml(p.secondary) + '" fill-opacity="0.32" font-family="monospace" font-size="22" font-weight="900">' +
            '<text x="42" y="75">01</text><text x="42" y="105">10</text><text x="42" y="135">11</text>' +
            '<text x="95" y="60">1</text><text x="95" y="90">0</text><text x="95" y="120">1</text>' +
            '<text x="295" y="75">10</text><text x="295" y="105">01</text><text x="295" y="135">11</text>' +
            '<text x="335" y="65">0</text><text x="335" y="95">1</text>' +
          '</g>'
        );
      } else if (bg === 'deep_space') {
        parts.push(
          '<circle cx="70" cy="86" r="4" fill="#ffffff" opacity="0.85"/>' +
          '<circle cx="330" cy="74" r="5.5" fill="' + escapeXml(p.accent) + '" opacity="0.9"/>' +
          '<circle cx="345" cy="160" r="3.5" fill="#ffffff" opacity="0.75"/>' +
          '<circle cx="55" cy="220" r="4" fill="' + escapeXml(p.secondary) + '" opacity="0.8"/>' +
          '<ellipse cx="200" cy="200" rx="168" ry="68" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-opacity="0.32" stroke-width="3" transform="rotate(-22 200 200)"/>'
        );
      } else if (bg === 'geometric') {
        parts.push(
          '<polygon points="200,22 366,118 366,282 200,378 34,282 34,118" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-opacity="0.38" stroke-width="4"/>' +
          '<polygon points="200,46 340,300 60,300" fill="' + escapeXml(p.secondary) + '" fill-opacity="0.1"/>'
        );
      } else if (bg === 'pastel_dots') {
        parts.push(
          '<circle cx="310" cy="115" r="95" fill="url(#' + uid + '-dots)" opacity="0.75"/>' +
          '<circle cx="88" cy="295" r="78" fill="url(#' + uid + '-dots)" opacity="0.65"/>'
        );
      } else if (bg === 'solid_mesh') {
        parts.push(
          '<g fill="none" stroke="' + escapeXml(p.accent) + '" stroke-linecap="round" opacity="0.38">' +
            '<path d="M 64,130 A 150,150 0 0,1 336,130" stroke-width="4" stroke-dasharray="10 12"/>' +
            '<path d="M 44,104 A 180,180 0 0,1 356,104" stroke-width="3" stroke-dasharray="6 14"/>' +
          '</g>'
        );
      }
    }
    return parts.join('');
  }

  function renderBodyOutfitLayer(spec, uid, lod) {
    var p = spec.palette;
    var b = spec.body;
    var parts = ['<ellipse cx="200" cy="374" rx="105" ry="16" fill="#000000" opacity="0.45"/>'];

    // Optional Katana behind right shoulder for ninja_headband or ninja_agent
    if (lod !== 'micro' && (spec.headwear === 'ninja_headband' || spec.presetId === 'ninja_agent')) {
      parts.push(
        '<g transform="rotate(26, 255, 220)">' +
          '<rect x="250" y="96" width="16" height="72" rx="4" fill="#0f172a" stroke="#000000" stroke-width="7"/>' +
          '<path d="M 252,112 L 264,120 M 252,130 L 264,138 M 252,148 L 264,156" stroke="' + escapeXml(p.accent) + '" stroke-width="3"/>' +
          '<rect x="240" y="164" width="36" height="9" rx="3" fill="#eab308" stroke="#000000" stroke-width="5"/>' +
        '</g>'
      );
    }

    if (b === 'cyber_armor') {
      parts.push(
        '<path d="M 84,395 C 92,295 132,256 200,256 C 268,256 308,295 316,395 Z" fill="url(#' + uid + '-bodyGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<path d="M 68,385 L 104,274 L 154,292 L 132,395 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M 332,385 L 296,274 L 246,292 L 268,395 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M 140,262 L 200,312 L 260,262" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    } else if (b === 'robot_chassis') {
      parts.push(
        '<path d="M 112,262 C 92,304 106,368 200,392 C 294,368 308,304 288,262 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<path d="M 108,278 C 86,292 80,322 92,338 C 106,352 118,330 118,312" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M 292,278 C 314,292 320,322 308,338 C 294,352 282,330 282,312" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linecap="round"/>' +
        '<line x1="232" y1="305" x2="268" y2="305" stroke="#081b2e" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="226" y1="322" x2="268" y2="322" stroke="#081b2e" stroke-width="5" stroke-linecap="round"/>'
      );
    } else if (b === 'suit') {
      parts.push(
        '<path d="M 92,395 C 102,298 138,262 172,254 L 228,254 C 262,262 298,298 308,395 Z" fill="#131c2e" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<polygon points="172,254 200,324 228,254" fill="#f8fafc" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M 168,254 L 194,322 L 166,348 L 138,284 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M 232,254 L 206,322 L 234,348 L 262,284 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>'
      );
    } else if (b === 'lab_coat') {
      parts.push(
        '<path d="M 92,395 C 102,298 138,262 172,254 L 228,254 C 262,262 298,298 308,395 Z" fill="#e2e8f0" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<polygon points="168,254 200,368 232,254" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="6"/>' +
        '<path d="M 164,254 L 188,332 L 146,332 Z" fill="#ffffff" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M 236,254 L 212,332 L 254,332 Z" fill="#ffffff" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>'
      );
    } else if (b === 'hoodie') {
      parts.push(
        '<path d="M 90,395 C 100,296 138,260 172,254 L 228,254 C 262,260 300,296 310,395 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<path d="M 156,254 C 172,284 228,284 244,254 Z" fill="#1e293b" stroke="#000000" stroke-width="7"/>' +
        '<line x1="184" y1="274" x2="184" y2="328" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="216" y1="274" x2="216" y2="328" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="184" cy="332" r="5" fill="' + escapeXml(p.accent) + '"/>' +
        '<circle cx="216" cy="332" r="5" fill="' + escapeXml(p.accent) + '"/>'
      );
    } else if (b === 'turtleneck') {
      parts.push(
        '<path d="M 94,395 C 104,298 140,262 174,254 L 226,254 C 260,262 296,298 306,395 Z" fill="#151b2e" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<rect x="166" y="238" width="68" height="28" rx="10" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="7"/>'
      );
    } else if (b === 'trench_coat') {
      parts.push(
        '<path d="M 86,395 C 96,292 134,254 168,248 L 232,248 C 266,254 304,292 314,395 Z" fill="#0f172a" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<polygon points="170,250 200,350 230,250" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="6"/>' +
        '<path d="M 152,236 L 188,332 L 132,338 L 128,266 Z" fill="#1e293b" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M 248,236 L 212,332 L 268,338 L 272,266 Z" fill="#1e293b" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>' +
        '<line x1="142" y1="274" x2="174" y2="322" stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="258" y1="274" x2="226" y2="322" stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-linecap="round"/>'
      );
    } else if (b === 'plaid_shirt') {
      parts.push(
        '<path d="M 92,395 C 102,298 138,262 172,254 L 228,254 C 262,262 298,298 308,395 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<g stroke="' + escapeXml(p.secondary) + '" stroke-width="4" opacity="0.45">' +
          '<line x1="140" y1="270" x2="140" y2="390"/><line x1="175" y1="260" x2="175" y2="390"/>' +
          '<line x1="225" y1="260" x2="225" y2="390"/><line x1="260" y1="270" x2="260" y2="390"/>' +
          '<line x1="105" y1="305" x2="295" y2="305"/><line x1="98" y1="345" x2="302" y2="345"/>' +
        '</g>' +
        '<polygon points="164,250 194,284 152,290" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
        '<polygon points="236,250 206,284 248,290" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>'
      );
    } else {
      parts.push(
        '<path d="M 94,395 C 104,298 140,262 174,254 L 226,254 C 260,262 296,298 306,395 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<path d="M 168,254 Q 200,284 232,254" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>'
      );
    }
    return parts.join('');
  }

  function renderChestEmblem(spec) {
    var p = spec.palette;
    var ch = spec.chest;
    if (!ch || ch === 'none') return '';

    if (ch === 'mesh_emblem') {
      return (
        '<g transform="translate(200, 332) scale(0.24)">' +
          '<polygon points="0,-140 122,-70 122,70 0,140 -122,70 -122,-70" fill="#000000" transform="scale(1.22) translate(0, 6)"/>' +
          '<polygon points="0,-140 122,-70 0,0 -122,-70" fill="' + escapeXml(p.secondary) + '"/>' +
          '<polygon points="-122,-70 0,0 0,140 -122,70" fill="' + escapeXml(p.accent) + '"/>' +
          '<polygon points="0,0 122,-70 122,70 0,140" fill="' + escapeXml(p.primary) + '"/>' +
          '<polygon points="0,-140 122,-70 122,70 0,140 -122,70 -122,-70" fill="none" stroke="#000000" stroke-width="16" stroke-linejoin="round"/>' +
        '</g>'
      );
    }
    if (ch === 'reactor_core') {
      return (
        '<circle cx="200" cy="332" r="28" fill="#090d16" stroke="#000000" stroke-width="7"/>' +
        '<circle cx="200" cy="332" r="20" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4" stroke-dasharray="8 5"/>' +
        '<circle cx="200" cy="332" r="12" fill="' + escapeXml(p.secondary) + '"/>' +
        '<circle cx="200" cy="332" r="5" fill="#ffffff"/>'
      );
    }
    if (ch === 'tie') {
      return '<polygon points="192,272 208,272 214,358 200,374 186,358" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>';
    }
    if (ch === 'bow_tie') {
      return (
        '<g transform="translate(200, 278)">' +
          '<polygon points="-26,-12 0,0 -26,12" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>' +
          '<polygon points="26,-12 0,0 26,12" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>' +
          '<circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#000000" stroke-width="4"/>' +
        '</g>'
      );
    }
    if (ch === 'harness') {
      return (
        '<line x1="132" y1="268" x2="262" y2="386" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
        '<line x1="132" y1="268" x2="262" y2="386" stroke="' + escapeXml(p.accent) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<line x1="268" y1="268" x2="138" y2="386" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
        '<line x1="268" y1="268" x2="138" y2="386" stroke="' + escapeXml(p.accent) + '" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="180" y="316" width="40" height="30" rx="6" fill="#0f172a" stroke="#000000" stroke-width="6"/>'
      );
    }
    if (ch === 'pocket') {
      return (
        '<rect x="222" y="312" width="40" height="42" rx="6" fill="#0f172a" stroke="#000000" stroke-width="6"/>' +
        '<line x1="234" y1="302" x2="234" y2="320" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="246" y1="302" x2="246" y2="320" stroke="' + escapeXml(p.secondary) + '" stroke-width="6" stroke-linecap="round"/>'
      );
    }
    if (ch === 'necklace') {
      return (
        '<path d="M 158,266 Q 200,328 242,266" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="7" stroke-dasharray="8 6" stroke-linecap="round"/>' +
        '<circle cx="200" cy="310" r="10" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>'
      );
    }
    if (ch === 'laptop') {
      return (
        '<g>' +
          '<rect x="136" y="302" width="128" height="76" rx="10" fill="#1e293b" stroke="#000000" stroke-width="7"/>' +
          '<rect x="122" y="372" width="156" height="12" rx="5" fill="#475569" stroke="#000000" stroke-width="6"/>' +
          '<polygon points="200,322 218,332 218,350 200,360 182,350 182,332" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4" stroke-linejoin="round"/>' +
        '</g>'
      );
    }
    if (ch === 'tablet_chart') {
      return (
        '<g>' +
          '<rect x="148" y="298" width="104" height="74" rx="10" fill="#090d16" stroke="#000000" stroke-width="7"/>' +
          '<rect x="164" y="338" width="12" height="20" rx="2" fill="' + escapeXml(p.primary) + '"/>' +
          '<rect x="184" y="324" width="12" height="34" rx="2" fill="' + escapeXml(p.secondary) + '"/>' +
          '<rect x="204" y="314" width="12" height="44" rx="2" fill="' + escapeXml(p.accent) + '"/>' +
          '<polyline points="164,330 190,316 212,324 234,308" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>'
      );
    }
    if (ch === 'vault_coin') {
      return (
        '<g transform="translate(200, 332)">' +
          '<circle cx="0" cy="0" r="28" fill="#fbbf24" stroke="#000000" stroke-width="7"/>' +
          '<circle cx="0" cy="0" r="20" fill="none" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>' +
          '<text x="0" y="9" fill="#000000" font-family="monospace" font-size="26" font-weight="900" text-anchor="middle">$</text>' +
        '</g>'
      );
    }
    if (ch === 'rocket_badge') {
      return (
        '<g transform="translate(200, 332)">' +
          '<circle cx="0" cy="0" r="26" fill="#090d16" stroke="#000000" stroke-width="6"/>' +
          '<path d="M 0,-18 C 10,-8 10,8 0,16 C -10,8 -10,-8 0,-18 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>' +
          '<polygon points="-8,8 -16,16 -6,14" fill="' + escapeXml(p.primary) + '"/>' +
          '<polygon points="8,8 16,16 6,14" fill="' + escapeXml(p.primary) + '"/>' +
          '<circle cx="0" cy="-3" r="4" fill="#ffffff"/>' +
        '</g>'
      );
    }
    if (ch === 'shield_check') {
      return (
        '<g transform="translate(200, 332)">' +
          '<path d="M 0,-26 L 24,-16 V 4 C 24,18 12,26 0,32 C -12,26 -24,18 -24,4 V -16 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
          '<polyline points="-9,2 -2,10 11,-6" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>'
      );
    }
    if (ch === 'neck_headphones') {
      return (
        '<g>' +
          '<path d="M 156,260 C 156,304 244,304 244,260" fill="none" stroke="#000000" stroke-width="11" stroke-linecap="round"/>' +
          '<ellipse cx="164" cy="278" rx="16" ry="20" transform="rotate(-18 164 278)" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6"/>' +
          '<ellipse cx="236" cy="278" rx="16" ry="20" transform="rotate(18 236 278)" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6"/>' +
        '</g>'
      );
    }
    return '';
  }

  function renderCreatureBackdrop(spec, uid, lod) {
    if (lod === 'micro' || spec.entityKind !== 'creature') return '';
    var p = spec.palette;
    var sp = spec.species || 'fox';
    if (sp === 'dragon') {
      return (
        '<g stroke="#000000" stroke-width="8" stroke-linejoin="round">' +
          '<path d="M 155,260 L 42,188 L 68,242 L 48,284 L 92,288 L 148,312 Z" fill="' + escapeXml(p.secondary) + '"/>' +
          '<path d="M 150,266 L 66,210 L 86,250 L 70,276 L 146,302 Z" fill="' + escapeXml(p.accent) + '" opacity="0.75"/>' +
          '<path d="M 245,260 L 358,188 L 332,242 L 352,284 L 308,288 L 252,312 Z" fill="' + escapeXml(p.secondary) + '"/>' +
          '<path d="M 250,266 L 334,210 L 314,250 L 330,276 L 254,302 Z" fill="' + escapeXml(p.accent) + '" opacity="0.75"/>' +
        '</g>'
      );
    }
    if (sp === 'owl') {
      return (
        '<g stroke="#000000" stroke-width="8" stroke-linejoin="round">' +
          '<path d="M 150,264 C 68,244 48,300 92,344 C 112,328 128,332 148,324 Z" fill="url(#' + uid + '-chassisGrad)"/>' +
          '<path d="M 250,264 C 332,244 352,300 308,344 C 288,328 272,332 252,324 Z" fill="url(#' + uid + '-chassisGrad)"/>' +
        '</g>'
      );
    }
    if (sp === 'kraken') {
      return (
        '<g stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none">' +
          '<path d="M 148,306 C 76,316 52,252 92,216 C 112,200 126,226 108,246" stroke="' + escapeXml(p.primary) + '" stroke-width="16"/>' +
          '<path d="M 148,306 C 76,316 52,252 92,216" stroke="#000000" stroke-width="7"/>' +
          '<path d="M 252,306 C 324,316 348,252 308,216 C 288,200 274,226 292,246" stroke="' + escapeXml(p.primary) + '" stroke-width="16"/>' +
          '<path d="M 252,306 C 324,316 348,252 308,216" stroke="#000000" stroke-width="7"/>' +
        '</g>'
      );
    }
    if (sp === 'fox' || sp === 'wolf') {
      return (
        '<g>' +
          '<path d="M 238,348 C 318,348 356,272 326,206 C 312,176 278,204 284,248 C 288,282 264,314 234,324 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="9" stroke-linejoin="round"/>' +
          '<path d="M 326,206 C 314,182 286,202 288,232 C 302,226 316,222 326,206 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>' +
        '</g>'
      );
    }
    return '';
  }

  function renderHeadLayer(spec, uid) {
    var p = spec.palette;
    var kind = spec.entityKind;

    if (kind === 'human') {
      var skin = p.skinOrChassis || '#f1c27d';
      var hairBase = (
        '<path d="M 132,148 C 128,74 272,74 268,148 C 254,116 226,108 200,108 C 174,108 146,116 132,148 Z" fill="#2b2140" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>'
      );
      if (spec.headwear === 'afro') {
        hairBase = '<circle cx="200" cy="116" r="76" fill="#1e1b2e" stroke="#000000" stroke-width="9"/>';
      } else if (spec.headwear === 'ponytail') {
        hairBase =
          '<path d="M 254,116 C 308,104 328,154 298,196 C 282,178 276,148 252,138 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
          '<circle cx="262" cy="126" r="9" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>' +
          hairBase;
      } else if (spec.headwear === 'braid_flower') {
        hairBase =
          '<path d="M 248,162 C 272,192 268,248 248,274 C 234,254 236,204 242,172 Z" fill="#2b2140" stroke="#000000" stroke-width="7"/>' +
          hairBase +
          '<circle cx="146" cy="122" r="10" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>';
      } else if (spec.headwear === 'man_bun') {
        hairBase =
          '<circle cx="200" cy="68" r="22" fill="#2b2140" stroke="#000000" stroke-width="8"/>' +
          hairBase;
      } else if (spec.headwear === 'curly_hair') {
        hairBase =
          '<g fill="#2b2140" stroke="#000000" stroke-width="7">' +
            '<circle cx="152" cy="102" r="22"/><circle cx="182" cy="90" r="24"/>' +
            '<circle cx="218" cy="90" r="24"/><circle cx="248" cy="102" r="22"/>' +
          '</g>';
      }

      var beardOverlay = spec.headwear === 'man_bun'
        ? '<path d="M 140,186 C 144,234 256,234 260,186 C 248,214 226,222 200,222 C 174,222 152,214 140,186 Z" fill="#2b2140" stroke="#000000" stroke-width="6"/>'
        : '';

      return (
        '<rect x="178" y="216" width="44" height="52" rx="12" fill="' + escapeXml(skin) + '" stroke="#000000" stroke-width="8"/>' +
        '<circle cx="128" cy="176" r="16" fill="' + escapeXml(skin) + '" stroke="#000000" stroke-width="8"/>' +
        '<circle cx="272" cy="176" r="16" fill="' + escapeXml(skin) + '" stroke="#000000" stroke-width="8"/>' +
        '<rect x="132" y="96" width="136" height="142" rx="46" fill="' + escapeXml(skin) + '" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
        '<ellipse cx="158" cy="186" rx="10" ry="5" fill="#f43f5e" opacity="0.26"/>' +
        '<ellipse cx="242" cy="186" rx="10" ry="5" fill="#f43f5e" opacity="0.26"/>' +
        beardOverlay +
        '<path d="M 186,204 Q 200,216 214,204" fill="none" stroke="#000000" stroke-width="6" stroke-linecap="round"/>' +
        hairBase
      );
    }

    if (kind === 'creature') {
      var sp = spec.species || 'fox';
      var cParts = [];
      if (sp === 'bear') {
        cParts.push(
          '<circle cx="132" cy="96" r="28" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>' +
          '<circle cx="132" cy="96" r="14" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<circle cx="268" cy="96" r="28" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>' +
          '<circle cx="268" cy="96" r="14" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<rect x="112" y="94" width="176" height="136" rx="56" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>'
        );
      } else if (sp === 'bull') {
        cParts.push(
          '<path d="M 134,116 C 68,108 52,48 96,22 C 92,58 112,86 146,96 Z" fill="#fef08a" stroke="#000000" stroke-width="9" stroke-linejoin="round"/>' +
          '<path d="M 266,116 C 332,108 348,48 304,22 C 308,58 288,86 254,96 Z" fill="#fef08a" stroke="#000000" stroke-width="9" stroke-linejoin="round"/>' +
          '<rect x="118" y="94" width="164" height="136" rx="44" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>'
        );
      } else if (sp === 'dragon') {
        cParts.push(
          '<path d="M 158,96 C 134,44 92,24 80,12 C 110,56 124,84 138,108 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
          '<path d="M 242,96 C 266,44 308,24 320,12 C 290,56 276,84 262,108 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
          '<polygon points="200,66 186,96 214,96" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="6"/>' +
          '<path d="M 122,96 L 200,82 L 278,96 L 286,204 L 200,234 L 114,204 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>'
        );
      } else if (sp === 'owl') {
        cParts.push(
          '<ellipse cx="200" cy="162" rx="86" ry="68" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>' +
          '<polygon points="150,112 96,56 130,122 176,104" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
          '<polygon points="250,112 304,56 270,122 224,104" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>'
        );
      } else if (sp === 'kraken') {
        cParts.push(
          '<path d="M 120,174 C 96,82 146,44 200,44 C 254,44 304,82 280,174 C 272,208 250,222 200,222 C 150,222 128,208 120,174 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10"/>' +
          '<path d="M 156,204 C 144,238 126,250 140,268" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M 156,204 C 144,238 126,250 140,268" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
          '<path d="M 184,210 C 178,246 168,262 182,276" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M 184,210 C 178,246 168,262 182,276" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="6" stroke-linecap="round"/>' +
          '<path d="M 216,210 C 222,246 232,262 218,276" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M 216,210 C 222,246 232,262 218,276" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="6" stroke-linecap="round"/>' +
          '<path d="M 244,204 C 256,238 274,250 260,268" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M 244,204 C 256,238 274,250 260,268" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
          '<path d="M 244,204 C 256,238 274,250 260,268" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>'
        );
      } else if (sp === 'wolf') {
        cParts.push(
          '<polygon points="130,118 112,24 176,94" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
          '<polygon points="136,110 122,48 166,96" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<polygon points="270,118 288,24 224,94" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
          '<polygon points="264,110 278,48 234,96" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<path d="M 122,146 L 86,156 L 114,178 L 84,196 L 132,216 L 200,228 L 268,216 L 316,196 L 286,178 L 314,156 L 278,146 L 264,94 L 136,94 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>'
        );
      } else {
        cParts.push(
          '<polygon points="124,122 96,26 178,94" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
          '<polygon points="132,112 110,48 164,96" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<polygon points="276,122 304,26 222,94" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>' +
          '<polygon points="268,112 290,48 236,96" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>' +
          '<path d="M 118,154 L 88,148 L 108,172 L 86,188 L 126,210 L 274,210 L 314,188 L 292,172 L 312,148 L 282,154 C 278,104 248,90 200,90 C 152,90 122,104 118,154 Z" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>'
        );
      }

      // Visor screen on creature
      cParts.push(
        '<rect x="132" y="132" width="136" height="58" rx="18" fill="#081b2e" stroke="#000000" stroke-width="8"/>' +
        '<rect x="138" y="138" width="124" height="46" rx="13" fill="#051220" stroke="' + escapeXml(p.secondary) + '" stroke-width="3"/>'
      );

      // Species snout/beak/muzzle below visor (around y=200)
      if (sp === 'owl') {
        cParts.push('<polygon points="182,184 218,184 200,218" fill="#fbbf24" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>');
      } else if (sp === 'bull') {
        cParts.push(
          '<circle cx="200" cy="218" r="14" fill="none" stroke="#fbbf24" stroke-width="7"/>' +
          '<rect x="164" y="186" width="72" height="28" rx="12" fill="#0b1528" stroke="#000000" stroke-width="6"/>' +
          '<circle cx="182" cy="200" r="5" fill="' + escapeXml(p.accent) + '"/><circle cx="218" cy="200" r="5" fill="' + escapeXml(p.accent) + '"/>'
        );
      } else if (sp === 'bear') {
        cParts.push(
          '<ellipse cx="200" cy="202" rx="32" ry="18" fill="#e2e8f0" stroke="#000000" stroke-width="6"/>' +
          '<ellipse cx="200" cy="196" rx="12" ry="8" fill="#0f172a"/>'
        );
      } else if (sp === 'dragon' || sp === 'wolf') {
        cParts.push(
          '<polygon points="170,186 230,186 220,214 180,214" fill="#0b1528" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
          '<polygon points="182,210 188,222 194,210" fill="#ffffff" stroke="#000000" stroke-width="2"/>' +
          '<polygon points="206,210 212,222 218,210" fill="#ffffff" stroke="#000000" stroke-width="2"/>'
        );
      } else if (sp !== 'kraken') {
        cParts.push(
          '<ellipse cx="200" cy="200" rx="24" ry="13" fill="#0b1528" stroke="#000000" stroke-width="5"/>' +
          '<polygon points="192,193 208,193 200,201" fill="' + escapeXml(p.accent) + '"/>'
        );
      }
      return cParts.join('');
    }

    // Autonomous Agent Mecha Head Chassis (400x400 coordinates from 8041)
    return (
      '<line x1="200" y1="96" x2="200" y2="52" stroke="#000000" stroke-width="11" stroke-linecap="round"/>' +
      '<circle cx="200" cy="42" r="16" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8"/>' +
      '<circle cx="195" cy="37" r="4.5" fill="#ffffff" opacity="0.9"/>' +
      '<rect x="92" y="138" width="24" height="44" rx="10" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8.5"/>' +
      '<rect x="284" y="138" width="24" height="44" rx="10" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="8.5"/>' +
      '<rect x="108" y="94" width="184" height="136" rx="28" fill="url(#' + uid + '-chassisGrad)" stroke="#000000" stroke-width="11" stroke-linejoin="round"/>' +
      '<path d="M 164,94 L 236,94 L 236,130 L 164,130 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>' +
      '<rect x="128" y="132" width="144" height="70" rx="20" fill="#081b2e" stroke="#000000" stroke-width="8.5"/>' +
      '<rect x="135" y="139" width="130" height="56" rx="14" fill="#051220" stroke="' + escapeXml(p.secondary) + '" stroke-width="3.5"/>'
    );
  }

  function renderEyesLayer(spec) {
    var p = spec.palette;
    var eyes = spec.eyes;

    if (eyes === 'cyber_optic') {
      return (
        '<circle cx="168" cy="167" r="13" fill="' + escapeXml(p.secondary) + '"/>' +
        '<circle cx="164" cy="163" r="4.5" fill="#ffffff"/>' +
        '<circle cx="232" cy="167" r="16" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4.5"/>' +
        '<circle cx="232" cy="167" r="7" fill="' + escapeXml(p.accent) + '"/>' +
        '<line x1="210" y1="167" x2="254" y2="167" stroke="' + escapeXml(p.accent) + '" stroke-width="2.5"/>' +
        '<line x1="232" y1="145" x2="232" y2="189" stroke="' + escapeXml(p.accent) + '" stroke-width="2.5"/>'
      );
    }
    if (eyes === 'terminal_glow') {
      return (
        '<text x="166" y="178" fill="' + escapeXml(p.secondary) + '" font-family="monospace" font-size="34" font-weight="900" text-anchor="middle">&lt;</text>' +
        '<text x="234" y="178" fill="' + escapeXml(p.secondary) + '" font-family="monospace" font-size="34" font-weight="900" text-anchor="middle">&gt;</text>'
      );
    }
    if (eyes === 'laser') {
      return (
        '<ellipse cx="168" cy="167" rx="18" ry="9" fill="#ef4444"/>' +
        '<ellipse cx="232" cy="167" rx="18" ry="9" fill="#ef4444"/>' +
        '<ellipse cx="168" cy="167" rx="10" ry="4.5" fill="#fef08a"/>' +
        '<ellipse cx="232" cy="167" rx="10" ry="4.5" fill="#fef08a"/>' +
        '<line x1="70" y1="162" x2="168" y2="167" stroke="#ef4444" stroke-width="6" stroke-opacity="0.85" stroke-linecap="round"/>' +
        '<line x1="232" y1="167" x2="330" y2="162" stroke="#ef4444" stroke-width="6" stroke-opacity="0.85" stroke-linecap="round"/>'
      );
    }
    if (eyes === 'sunglasses') {
      return (
        '<polygon points="134,152 194,152 188,184 142,184" fill="#020617" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<polygon points="206,152 266,152 258,184 212,184" fill="#020617" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<line x1="194" y1="158" x2="206" y2="158" stroke="' + escapeXml(p.accent) + '" stroke-width="5"/>' +
        '<line x1="148" y1="160" x2="162" y2="176" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="220" y1="160" x2="234" y2="176" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>'
      );
    }
    if (eyes === 'glasses') {
      return (
        '<circle cx="168" cy="167" r="19" fill="#0a0d17" fill-opacity="0.4" stroke="' + escapeXml(p.secondary) + '" stroke-width="5"/>' +
        '<circle cx="232" cy="167" r="19" fill="#0a0d17" fill-opacity="0.4" stroke="' + escapeXml(p.secondary) + '" stroke-width="5"/>' +
        '<line x1="187" y1="167" x2="213" y2="167" stroke="' + escapeXml(p.secondary) + '" stroke-width="5"/>' +
        '<circle cx="168" cy="167" r="8" fill="#ffffff"/>' +
        '<circle cx="232" cy="167" r="8" fill="#ffffff"/>'
      );
    }
    if (eyes === 'hud_visor') {
      return (
        '<rect x="136" y="148" width="128" height="34" rx="10" fill="' + escapeXml(p.secondary) + '" fill-opacity="0.35" stroke="' + escapeXml(p.accent) + '" stroke-width="4"/>' +
        '<line x1="148" y1="165" x2="252" y2="165" stroke="#ffffff" stroke-width="3" stroke-dasharray="10 6"/>'
      );
    }
    if (eyes === 'evil_slits') {
      return (
        '<polygon points="146,154 186,166 178,176 144,166" fill="#ef4444"/>' +
        '<polygon points="254,154 214,166 222,176 256,166" fill="#ef4444"/>' +
        '<circle cx="168" cy="166" r="3.5" fill="#fef08a"/><circle cx="232" cy="166" r="3.5" fill="#fef08a"/>'
      );
    }
    if (eyes === 'cursor_arrows') {
      return (
        '<polygon points="156,152 180,164 168,168 174,180 166,184 160,172 152,178" fill="' + escapeXml(p.accent) + '"/>' +
        '<polygon points="220,152 244,164 232,168 238,180 230,184 224,172 216,178" fill="' + escapeXml(p.accent) + '"/>'
      );
    }
    if (eyes === 'happy') {
      return (
        '<path d="M 152,172 Q 168,150 184,172" fill="none" stroke="' + escapeXml(p.secondary) + '" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M 216,172 Q 232,150 248,172" fill="none" stroke="' + escapeXml(p.secondary) + '" stroke-width="7" stroke-linecap="round"/>'
      );
    }
    if (eyes === 'wink') {
      return (
        '<path d="M 152,167 L 184,167" stroke="' + escapeXml(p.secondary) + '" stroke-width="7" stroke-linecap="round"/>' +
        '<circle cx="232" cy="167" r="12" fill="' + escapeXml(p.secondary) + '"/>' +
        '<circle cx="228" cy="163" r="4" fill="#ffffff"/>'
      );
    }
    if (eyes === 'focused') {
      return (
        '<line x1="148" y1="150" x2="186" y2="158" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="252" y1="150" x2="214" y2="158" stroke="' + escapeXml(p.accent) + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="168" cy="170" r="11" fill="' + escapeXml(p.secondary) + '"/>' +
        '<circle cx="232" cy="170" r="11" fill="' + escapeXml(p.secondary) + '"/>' +
        '<circle cx="165" cy="167" r="3.5" fill="#ffffff"/>' +
        '<circle cx="229" cy="167" r="3.5" fill="#ffffff"/>'
      );
    }
    return (
      '<circle cx="168" cy="167" r="12" fill="' + escapeXml(p.secondary) + '"/>' +
      '<circle cx="232" cy="167" r="12" fill="' + escapeXml(p.secondary) + '"/>' +
      '<circle cx="164" cy="163" r="4" fill="#ffffff"/>' +
      '<circle cx="228" cy="163" r="4" fill="#ffffff"/>'
    );
  }

  function renderHeadwearLayer(spec) {
    var p = spec.palette;
    var hw = spec.headwear;
    if (!hw || hw === 'none') return '';

    if (hw === 'crown') {
      return (
        '<polygon points="122,98 134,42 168,74 200,30 232,74 266,42 278,98" fill="#fbbf24" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<circle cx="200" cy="66" r="8" fill="#ef4444" stroke="#000000" stroke-width="3"/>' +
        '<circle cx="154" cy="76" r="6" fill="#38bdf8" stroke="#000000" stroke-width="3"/>' +
        '<circle cx="246" cy="76" r="6" fill="#38bdf8" stroke="#000000" stroke-width="3"/>'
      );
    }
    if (hw === 'halo') {
      return (
        '<ellipse cx="200" cy="48" rx="78" ry="16" fill="none" stroke="#000000" stroke-width="13"/>' +
        '<ellipse cx="200" cy="48" rx="78" ry="16" fill="none" stroke="#38bdf8" stroke-width="7"/>' +
        '<ellipse cx="200" cy="48" rx="78" ry="16" fill="none" stroke="#e0f2fe" stroke-width="2.5"/>'
      );
    }
    if (hw === 'cyber_visor') {
      return (
        '<path d="M 102,142 Q 200,122 298,142 L 290,186 Q 200,168 110,186 Z" fill="' + escapeXml(p.secondary) + '" fill-opacity="0.45" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>' +
        '<line x1="126" y1="156" x2="274" y2="156" stroke="#ffffff" stroke-opacity="0.85" stroke-width="4" stroke-linecap="round"/>'
      );
    }
    if (hw === 'cyber_helmet') {
      return (
        '<path d="M 106,122 C 106,48 294,48 294,122 L 278,96 L 200,80 L 122,96 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<polygon points="188,36 212,36 206,92 194,92" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="5"/>'
      );
    }
    if (hw === 'ninja_headband') {
      return (
        '<path d="M 284,96 C 324,80 356,104 378,84 C 360,118 326,112 288,114 Z" fill="#7c3aed" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M 106,102 Q 200,88 294,102 L 294,122 Q 200,108 106,122 Z" fill="#6d28d9" stroke="#000000" stroke-width="7"/>' +
        '<rect x="170" y="96" width="60" height="20" rx="5" fill="#cbd5e1" stroke="#000000" stroke-width="5"/>' +
        '<line x1="184" y1="106" x2="216" y2="106" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>'
      );
    }
    if (hw === 'cyber_horns') {
      return (
        '<path d="M 142,96 C 118,52 96,38 86,24 C 108,58 118,78 126,102 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M 258,96 C 282,52 304,38 314,24 C 292,58 282,78 274,102 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>'
      );
    }
    if (hw === 'browser_header') {
      return (
        '<rect x="108" y="72" width="184" height="30" rx="10" fill="#1e293b" stroke="#000000" stroke-width="7"/>' +
        '<circle cx="128" cy="87" r="5" fill="#ef4444"/><circle cx="144" cy="87" r="5" fill="#f59e0b"/><circle cx="160" cy="87" r="5" fill="#10b981"/>' +
        '<rect x="176" y="81" width="98" height="12" rx="6" fill="#090d16"/>'
      );
    }
    if (hw === 'headset') {
      return (
        '<path d="M 104,160 C 104,56 296,56 296,160" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round"/>' +
        '<path d="M 104,160 C 104,56 296,56 296,160" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="84" y="136" width="26" height="54" rx="12" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="7"/>' +
        '<rect x="290" y="136" width="26" height="54" rx="12" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="7"/>' +
        '<path d="M 98,184 Q 130,222 184,214" fill="none" stroke="#000000" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M 98,184 Q 130,222 184,214" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="4.5" stroke-linecap="round"/>'
      );
    }
    if (hw === 'fedora') {
      return (
        '<ellipse cx="200" cy="94" rx="112" ry="18" fill="#1e293b" stroke="#000000" stroke-width="8"/>' +
        '<path d="M 132,94 C 140,40 260,40 268,94 Z" fill="#334155" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<rect x="136" y="78" width="128" height="12" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>'
      );
    }
    if (hw === 'cap') {
      return (
        '<path d="M 114,98 C 114,44 286,44 286,98 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M 188,84 L 324,98 L 310,112 L 182,98 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="7" stroke-linejoin="round"/>'
      );
    }
    if (hw === 'beanie') {
      return (
        '<path d="M 116,104 C 116,42 284,42 284,104 Z" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="8"/>' +
        '<rect x="110" y="84" width="180" height="24" rx="10" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="7"/>' +
        '<circle cx="200" cy="40" r="14" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="6"/>'
      );
    }
    if (hw === 'beret') {
      return (
        '<path d="M 112,98 C 104,46 254,32 298,78 C 280,98 142,98 112,98 Z" fill="' + escapeXml(p.primary) + '" stroke="#000000" stroke-width="8" stroke-linejoin="round"/>' +
        '<circle cx="164" cy="76" r="9" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>'
      );
    }
    return '';
  }

  function renderCornerBadgeAndSparkles(spec, uid, lod) {
    if (lod === 'micro') return { sparkles: '', badge: '' };
    var p = spec.palette;
    var sparkles =
      '<g opacity="0.9">' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="#ffffff" transform="translate(76,112) scale(1.1)"/>' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="' + escapeXml(p.secondary) + '" transform="translate(328,88) scale(1.35)"/>' +
        '<path d="M 0,-12 C 2.2,-4 4,-2.2 12,0 C 4,2.2 2.2,4 0,12 C -2.2,4 -4,2.2 -12,0 C -4,-2.2 -2.2,-4 0,-12 Z" fill="' + escapeXml(p.accent) + '" transform="translate(74,296) scale(0.85)"/>' +
      '</g>';

    var badge = '';
    if (spec.accessoryBadge && spec.accessoryBadge !== 'none') {
      var badgeGlyph = '<polygon points="326,294 334,316 356,324 334,332 326,354 318,332 296,324 318,316" fill="' + escapeXml(p.accent) + '"/>';
      if (spec.accessoryBadge === 'security_lock') {
        badgeGlyph =
          '<rect x="308" y="318" width="36" height="28" rx="6" fill="' + escapeXml(p.accent) + '" stroke="#000000" stroke-width="4"/>' +
          '<path d="M 314,318 V 306 A 12,12 0 0,1 338,306 V 318" fill="none" stroke="' + escapeXml(p.secondary) + '" stroke-width="6"/>';
      } else if (spec.accessoryBadge === 'code_brackets') {
        badgeGlyph = '<text x="326" y="335" fill="' + escapeXml(p.secondary) + '" font-family="monospace" font-size="32" font-weight="900" text-anchor="middle">&lt;/&gt;</text>';
      } else if (spec.accessoryBadge === 'devops_gear') {
        badgeGlyph =
          '<circle cx="326" cy="324" r="18" fill="none" stroke="' + escapeXml(p.secondary) + '" stroke-width="9" stroke-dasharray="9 6"/>' +
          '<circle cx="326" cy="324" r="8" fill="' + escapeXml(p.accent) + '"/>';
      } else if (spec.accessoryBadge === 'crm_shield') {
        badgeGlyph = '<path d="M 326,296 L 350,306 V 324 C 350,340 338,350 326,356 C 314,350 302,340 302,324 V 306 Z" fill="' + escapeXml(p.secondary) + '" stroke="#000000" stroke-width="4"/>';
      } else if (spec.accessoryBadge === 'marketing_megaphone') {
        badgeGlyph = '<polygon points="302,324 338,304 338,344" fill="' + escapeXml(p.accent) + '"/><circle cx="346" cy="324" r="6" fill="' + escapeXml(p.secondary) + '"/>';
      } else if (spec.accessoryBadge === 'nango_sync_badge' || spec.accessoryBadge === 'composio_connector') {
        badgeGlyph = '<circle cx="316" cy="324" r="12" fill="none" stroke="' + escapeXml(p.secondary) + '" stroke-width="6"/><circle cx="336" cy="324" r="12" fill="none" stroke="' + escapeXml(p.accent) + '" stroke-width="6"/>';
      }
      badge =
        '<g>' +
          '<circle cx="326" cy="324" r="44" fill="#070b14" stroke="#000000" stroke-width="8"/>' +
          '<circle cx="326" cy="324" r="40" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="4"/>' +
          badgeGlyph +
        '</g>';
    }

    return { sparkles: sparkles, badge: badge };
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
    var uid = 'pfp-' + fnv1aHash(
      spec.seed + '-' + spec.entityKind + '-' + (spec.species || '') + '-' +
      spec.background + '-' + spec.body + '-' + spec.chest + '-' +
      spec.eyes + '-' + spec.headwear + '-' + spec.accessoryBadge
    ).toString(36);
    var p = spec.palette;

    var sizeAttrs = fluid && !opts.fixedPx
      ? 'width="100%" height="100%" style="display:block;width:100%;height:100%;max-width:100%;max-height:100%;aspect-ratio:1/1;"'
      : 'width="' + (numericSize || 128) + '" height="' + (numericSize || 128) + '" style="display:block;aspect-ratio:1/1;"';

    var shape = opts.shape || 'circle';
    var clipShapeSvg = shape === 'square'
      ? '<rect x="0" y="0" width="400" height="400" rx="0"/>'
      : shape === 'rounded'
        ? '<rect x="0" y="0" width="400" height="400" rx="64"/>'
        : '<circle cx="200" cy="200" r="196"/>';

    var outerRingSvg = shape === 'square'
      ? '<rect x="5" y="5" width="390" height="390" fill="none" stroke="#000000" stroke-width="10"/><rect x="10" y="10" width="380" height="380" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="5"/>'
      : shape === 'rounded'
        ? '<rect x="5" y="5" width="390" height="390" rx="64" fill="none" stroke="#000000" stroke-width="10"/><rect x="10" y="10" width="380" height="380" rx="59" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="5"/>'
        : '<circle cx="200" cy="200" r="194" fill="none" stroke="#000000" stroke-width="10"/><circle cx="200" cy="200" r="188" fill="none" stroke="' + escapeXml(p.primary) + '" stroke-width="5"/>';

    var bgSvg = renderBackgroundLayer(spec, uid, lod);
    var creatureBackSvg = renderCreatureBackdrop(spec, uid, lod);
    var bodySvg = renderBodyOutfitLayer(spec, uid, lod);
    var chestSvg = lod !== 'micro' ? renderChestEmblem(spec) : '';
    var headSvg = renderHeadLayer(spec, uid);
    var eyesSvg = renderEyesLayer(spec);
    var headwearSvg = renderHeadwearLayer(spec);
    var extras = renderCornerBadgeAndSparkles(spec, uid, lod);

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" ' + sizeAttrs +
      ' role="img" aria-label="' + escapeXml(spec.displayName || spec.avatarId || spec.seed) + '" data-pfp-id="' + escapeXml(spec.compactId) + '" data-pfp-lod="' + lod + '">' +
        '<defs>' +
          '<clipPath id="' + uid + '-clip">' + clipShapeSvg + '</clipPath>' +
          '<radialGradient id="' + uid + '-bgGlow" cx="50%" cy="32%" r="75%">' +
            '<stop offset="0%" stop-color="' + escapeXml(p.secondary) + '" stop-opacity="0.32"/>' +
            '<stop offset="60%" stop-color="' + escapeXml(p.primary) + '" stop-opacity="0.14"/>' +
            '<stop offset="100%" stop-color="' + escapeXml(p.background) + '" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + '-chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="' + escapeXml(p.skinOrChassis || p.primary) + '"/>' +
            '<stop offset="100%" stop-color="' + escapeXml(p.primary) + '"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + uid + '-bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="' + escapeXml(p.primary) + '"/>' +
            '<stop offset="100%" stop-color="#0f172a"/>' +
          '</linearGradient>' +
          '<pattern id="' + uid + '-dots" width="14" height="14" patternUnits="userSpaceOnUse">' +
            '<circle cx="4" cy="4" r="2.2" fill="' + escapeXml(p.secondary) + '" opacity="0.4"/>' +
          '</pattern>' +
        '</defs>' +
        '<g clip-path="url(#' + uid + '-clip)">' +
          bgSvg +
          extras.sparkles +
          creatureBackSvg +
          bodySvg +
          chestSvg +
          headSvg +
          eyesSvg +
          headwearSvg +
        '</g>' +
        outerRingSvg +
        extras.badge +
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
      '<div style="background:#0f172a;border:1px solid rgba(56,189,248,0.35);border-radius:16px;max-width:620px;width:100%;max-height:92vh;overflow-y:auto;color:#f8fafc;box-shadow:0 24px 64px rgba(0,0,0,0.7);padding:clamp(14px,3vw,22px);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(148,163,184,0.15);padding-bottom:12px;margin-bottom:16px;">' +
          '<div style="min-width:0;">' +
            '<div style="font-size:16px;font-weight:700;color:#f8fafc;">⬇ Export &amp; Download Avatar (SVG / PNG)</div>' +
            '<div style="font-size:12px;color:#94a3b8;word-break:break-all;">ID: <code style="color:#38bdf8;">' + escapeXml(spec.compactId) + '</code></div>' +
          '</div>' +
          '<button type="button" id="pfp-exp-close" style="background:transparent;border:1px solid rgba(148,163,184,0.3);color:#cbd5e1;border-radius:8px;padding:4px 10px;cursor:pointer;flex-shrink:0;">✕</button>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:18px;align-items:start;">' +
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
    CREATURE_SPECIES_VALUES: CREATURE_SPECIES_VALUES,
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
    forCreature: function (idOrSeed, overrides) {
      return renderPfpSvg(resolvePfpSpec(idOrSeed, 'creature', overrides), { fluid: true });
    },
    forExpert: function (idOrSeed, overrides) {
      return renderPfpSvg(resolvePfpSpec(idOrSeed, 'creature', overrides), { fluid: true });
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
