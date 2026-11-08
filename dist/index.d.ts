import type {
  PfpEntityKind,
  PfpHeadwear,
  PfpEyes,
  PfpBody,
  PfpChest,
  PfpBackground,
  PfpAccessoryBadge,
  PfpPalette,
  BasePfpProps
} from '../schemas/pfp-ontology';

export type {
  PfpEntityKind,
  PfpHeadwear,
  PfpEyes,
  PfpBody,
  PfpChest,
  PfpBackground,
  PfpAccessoryBadge,
  PfpPalette,
  BasePfpProps
};

export type PfpLodMode = 'micro' | 'compact' | 'full';

export interface PfpSpec extends BasePfpProps {
  entityKind: 'agent' | 'expert' | 'human';
  compactId?: string;
  displayName?: string;
  presetId?: string;
}

export interface PersonaGenerationResult {
  name: string;
  callsign: string;
  roleTitle: string;
  bannerText: string;
  compactId: string;
  svgUrl: string;
  spec: PfpSpec;
}

export interface PfpRenderOptions {
  entityKind?: 'agent' | 'expert' | 'human';
  size?: number;
  lod?: PfpLodMode;
  fluid?: boolean;
  fixedPx?: boolean;
  overrides?: Partial<PfpSpec>;
}

export declare const HEADWEAR_VALUES: readonly PfpHeadwear[];
export declare const EYES_VALUES: readonly PfpEyes[];
export declare const BODY_VALUES: readonly PfpBody[];
export declare const CHEST_VALUES: readonly PfpChest[];
export declare const BACKGROUND_VALUES: readonly PfpBackground[];
export declare const ACCESSORY_VALUES: readonly PfpAccessoryBadge[];
export declare const PALETTES: Record<'agent' | 'expert' | 'human', Array<PfpPalette & { id: string; name: string }>>;
export declare const PRESET_CATALOG: Record<string, {
  presetId: string;
  svgFile: string;
  entityKind: 'agent' | 'expert' | 'human';
  title: string;
  background: PfpBackground;
  body: PfpBody;
  chest: PfpChest;
  eyes: PfpEyes;
  headwear: PfpHeadwear;
  accessoryBadge: PfpAccessoryBadge;
  palette: PfpPalette;
}>;

export declare function fnv1aHash(str: string): number;
export declare function createMulberry32(seedInt: number): () => number;
export declare function resolvePfpSpec(
  idOrSeed: string,
  entityKind?: 'agent' | 'expert' | 'human',
  overrides?: Partial<PfpSpec>
): PfpSpec;
export declare function encodePfpId(spec: PfpSpec | string, optionalNameSlug?: string): string;
export declare function decodePfpId(idString: string): PfpSpec | null;
export declare function generatePersonaName(
  seedOrSpec: string | PfpSpec,
  options?: { entityKind?: 'agent' | 'expert' | 'human'; customName?: string; overrides?: Partial<PfpSpec> }
): PersonaGenerationResult;
export declare function renderPfpSvg(specOrSeed: string | PfpSpec, options?: PfpRenderOptions): string;
export declare function toDataUri(specOrSeed: string | PfpSpec, options?: PfpRenderOptions): string;
export declare function mountResponsiveAvatar(
  container: HTMLElement,
  specOrSeed: string | PfpSpec,
  options?: PfpRenderOptions
): () => void;
export declare function exportAvatar(
  specOrSeed: string | PfpSpec,
  exportOpts?: {
    format?: 'svg' | 'png' | 'webp';
    size?: number;
    width?: number;
    height?: number;
    shape?: 'circle' | 'rounded' | 'square';
    lod?: 'auto' | PfpLodMode;
    filename?: string;
  }
): Promise<{ format: string; width: number; height: number; svg?: string; dataUrl?: string } | null>;
export declare function openExportModal(
  specOrSeed: string | PfpSpec,
  modalOptions?: {
    entityKind?: 'agent' | 'expert' | 'human';
    defaultFormat?: 'svg' | 'png' | 'webp';
    defaultSize?: number;
    defaultShape?: 'circle' | 'rounded' | 'square';
  }
): void;
export declare function openBuilderModal(config: {
  entityId: string;
  entityName?: string;
  entityKind?: 'agent' | 'expert' | 'human';
  initialSeed?: string;
  initialSpec?: Partial<PfpSpec>;
  onSave?: (spec: PfpSpec, svgMarkup: string) => void;
}): void;
export declare function forAgent(idOrSeed: string, overrides?: Partial<PfpSpec>): string;
export declare function forExpert(idOrSeed: string, overrides?: Partial<PfpSpec>): string;
export declare function forHuman(idOrSeed: string, overrides?: Partial<PfpSpec>): string;
export declare function renderSvg(
  idOrSeed: string | PfpSpec,
  kind?: 'agent' | 'expert' | 'human',
  sizeOrOptions?: number | PfpRenderOptions
): string;
export declare function pickUrl(idOrSeed: string, kind?: 'agent' | 'expert' | 'human'): string;
