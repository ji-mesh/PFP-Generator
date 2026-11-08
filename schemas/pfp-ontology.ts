/**
 * @jimesh/pfp-generator — schemas/pfp-ontology.ts
 *
 * Pure Single Source of Truth (SSOT) Schema for the PFP Avatar Generator:
 * 1. 6-Layer Composable SVG Traits (Background, Body, Chest, Eyes, Headwear, Accessory Badge).
 * 2. Color Palettes (Built-in & Custom User-Created Palettes).
 * 3. Compact String / ID Attribute Codec (`pfp1-...~Callsign`).
 * 4. Custom & Curated PFP Presets (`PfpPresetRecord`).
 * 5. SVG / PNG / WebP Export Options (`PfpExportOptions`).
 */

export type PfpEntityKind = 'agent' | 'creature' | 'human';

export type CreatureSpecies =
  | 'fox'
  | 'dragon'
  | 'wolf'
  | 'bear'
  | 'owl'
  | 'kraken'
  | 'bull';

export type PfpHeadwear =
  | 'none'
  | 'cap'
  | 'fedora'
  | 'headset'
  | 'beanie'
  | 'crown'
  | 'halo'
  | 'cyber_visor'
  | 'cyber_helmet'
  | 'beret'
  | 'ninja_headband'
  | 'cyber_horns'
  | 'browser_header'
  | 'ponytail'
  | 'braid_flower'
  | 'afro'
  | 'man_bun'
  | 'curly_hair';

export type PfpEyes =
  | 'normal'
  | 'focused'
  | 'cyber_optic'
  | 'happy'
  | 'glasses'
  | 'sunglasses'
  | 'laser'
  | 'wink'
  | 'terminal_glow'
  | 'hud_visor'
  | 'evil_slits'
  | 'cursor_arrows';

export type PfpBody =
  | 'hoodie'
  | 'suit'
  | 'robot_chassis'
  | 'casual_tee'
  | 'cyber_armor'
  | 'lab_coat'
  | 'turtleneck'
  | 'trench_coat'
  | 'plaid_shirt';

export type PfpChest =
  | 'none'
  | 'tie'
  | 'reactor_core'
  | 'necklace'
  | 'pocket'
  | 'harness'
  | 'mesh_emblem'
  | 'bow_tie'
  | 'laptop'
  | 'tablet_chart'
  | 'vault_coin'
  | 'rocket_badge'
  | 'shield_check'
  | 'neck_headphones';

export type PfpBackground =
  | 'mesh_gradient'
  | 'cyber_grid'
  | 'pastel_dots'
  | 'geometric'
  | 'matrix_rain'
  | 'deep_space'
  | 'solid_mesh';

export type PfpAccessoryBadge =
  | 'none'
  | 'crm_shield'
  | 'code_brackets'
  | 'marketing_megaphone'
  | 'devops_gear'
  | 'security_lock'
  | 'ai_spark'
  | 'nango_sync_badge'
  | 'composio_connector';

export type PfpCropShape = 'circle' | 'rounded' | 'square';

export type PfpLodMode = 'micro' | 'compact' | 'full';

export interface PfpPalette {
  id?: string;
  name?: string;
  primary: string;       // Primary outfit / chassis gradient top HEX, e.g. '#0ea5e9'
  secondary: string;     // Secondary outfit / chassis gradient bottom HEX, e.g. '#0369a1'
  accent: string;        // Neon glow, visor & emblem accent HEX, e.g. '#7dd3fc'
  background: string;    // Deep backdrop radial gradient HEX, e.g. '#071926'
  skinOrChassis: string; // Human skin tone or robot chassis base HEX, e.g. '#f3c6a5'
}

export interface BasePfpProps {
  avatarId: string;
  seed: string;
  compactId?: string;
  entityKind: PfpEntityKind;
  species?: CreatureSpecies;
  displayName?: string;
  description?: string;
  tags?: string[];
  headwear: PfpHeadwear;
  eyes: PfpEyes;
  body: PfpBody;
  chest: PfpChest;
  background: PfpBackground;
  palette: PfpPalette;
  accessoryBadge: PfpAccessoryBadge;
  shape?: PfpCropShape;
  scale?: number;
  borderRadius?: number;
}

export interface PfpPresetRecord {
  presetId: string;
  title: string;
  entityKind: PfpEntityKind;
  compactId: string;
  svgFile?: string;
  isCustom?: boolean;
  createdAt?: string;
  spec: BasePfpProps;
}

export interface PfpExportOptions {
  format: 'svg' | 'png' | 'webp';
  width: number;
  height: number;
  shape?: PfpCropShape;
  lod?: 'auto' | PfpLodMode;
  filename?: string;
}

export interface PfpPersonaNameResult {
  name: string;
  callsign: string;
  roleTitle: string;
  bannerText: string;
  compactId: string;
  svgUrl: string;
  spec: BasePfpProps;
}
