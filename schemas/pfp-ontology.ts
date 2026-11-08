/**
 * @jimesh/schemas — pfp-ontology.ts
 *
 * Single Source of Truth (SSOT) for:
 * 1. Procedural and AI-generated PFP Avatar Profiles (Human Users & Autonomous Agents).
 * 2. Agent Ontology, Taxonomy & Connector Schemas (aligned with OASF, Composio, and Nango).
 * 3. NVIDIA NIM v1 API lightweight model batch inference contracts.
 * 4. Bidirectional Correlation Maps (Connectors, Agents, Skills, Permissions, Topics) for SurrealDB & OpenSearch.
 *
 * Rules:
 * - Strict typing (no any, strict union enums)
 * - Every wire envelope carries ts (ISO-8601 UTC) and traceId (X-JiMesh-Trace-Id)
 * - Unicode-safe NFC normalization
 */

// ---------------------------------------------------------------------------
// 1. PFP AVATAR GENERATION SCHEMAS (HUMAN & AGENT)
// ---------------------------------------------------------------------------

export type PfpEntityKind = 'human' | 'agent';

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
  | 'beret';

export type PfpEyes =
  | 'normal'
  | 'focused'
  | 'cyber_optic'
  | 'happy'
  | 'glasses'
  | 'sunglasses'
  | 'laser'
  | 'wink'
  | 'terminal_glow';

export type PfpBody =
  | 'hoodie'
  | 'suit'
  | 'robot_chassis'
  | 'casual_tee'
  | 'cyber_armor'
  | 'lab_coat'
  | 'turtleneck';

export type PfpChest =
  | 'none'
  | 'tie'
  | 'reactor_core'
  | 'necklace'
  | 'pocket'
  | 'harness'
  | 'mesh_emblem';

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

export interface PfpPalette {
  primary: string;    // HEX color, e.g. '#2563eb'
  secondary: string;  // HEX color, e.g. '#38bdf8'
  accent: string;     // HEX color, e.g. '#f59e0b'
  background: string; // HEX color, e.g. '#0f172a'
  skinOrChassis: string; // HEX color, e.g. '#fcd34d' or '#94a3b8'
}

export interface BasePfpProps {
  avatarId: string;
  seed: string;
  headwear: PfpHeadwear;
  eyes: PfpEyes;
  body: PfpBody;
  chest: PfpChest;
  background: PfpBackground;
  palette: PfpPalette;
  accessoryBadge: PfpAccessoryBadge;
  scale?: number;
  borderRadius?: number;
}

export interface HumanPfpProps extends BasePfpProps {
  entityKind: 'human';
  username: string;
  email: string;
  department: string;
  roleTitle: string;
  isOnline: boolean;
  avatarSeedName: string;
}

export interface AgentPfpProps extends BasePfpProps {
  entityKind: 'agent';
  agentId: string;
  name: string;
  description: string;
  topics: AgentTopic[];
  systemRole: string;
  modelIdentifier: string;
  allowedConnectors: string[];
  executionEngine: 'workerd' | 'python_harness' | 'go_worker';
}

export type PfpAvatarProps = HumanPfpProps | AgentPfpProps;

export interface PfpPartMetadata {
  id: string;
  layer: 'background' | 'body' | 'chest' | 'headwear' | 'eyes' | 'accessory';
  name: string;
  svgContent: string;
  isAgentSpecific: boolean;
  isHumanSpecific: boolean;
  tags: string[];
}

export interface PfpGenerationOptions {
  entityKind: PfpEntityKind;
  seed?: string;
  idOrName?: string;
  topics?: AgentTopic[];
  forcedPalette?: Partial<PfpPalette>;
  includeAccessoryBadge?: boolean;
}

// ---------------------------------------------------------------------------
// 2. AGENT ONTOLOGY & CONNECTOR SCHEMAS (OASF / COMPOSIO / NANGO)
// ---------------------------------------------------------------------------

export type AgentTopic =
  | 'crm'
  | 'devops'
  | 'marketing'
  | 'content_pipeline'
  | 'security'
  | 'sales'
  | 'support'
  | 'finance'
  | 'code_generation'
  | 'research'
  | 'workflow_automation';

export interface AgentTopicDefinition {
  topic: AgentTopic;
  title: string;
  description: string;
  category: 'business' | 'engineering' | 'growth' | 'operations';
  recommendedConnectors: string[];
  defaultSkills: string[];
  iconKey: string;
}

export type ConnectorType = 'mcp_server' | 'saas_oauth' | 'internal_api' | 'nango_sync';

export type ConnectorProvider =
  | 'hubspot'
  | 'salesforce'
  | 'github'
  | 'slack'
  | 'mailchimp'
  | 'notion'
  | 'jira'
  | 'nango'
  | 'composio'
  | 'linear'
  | 'google_drive'
  | 'postgres'
  | 'filesystem';

export type PermissionRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ConnectorPermission {
  code: string; // e.g. "crm:write"
  name: string;
  description: string;
  riskLevel: PermissionRiskLevel;
  requiresVaultReauth: boolean;
}

export interface ConnectorDefinition {
  connectorId: string; // e.g. "conn_hubspot"
  name: string;
  provider: ConnectorProvider;
  type: ConnectorType;
  version: string;
  description: string;
  apiDocsRef: string;
  requiredPermissions: string[];
  topics: AgentTopic[];
  oasfContractRef?: string;
  authMethod: 'vault_agent' | 'oauth2_nango' | 'mcp_stdio' | 'api_key';
}

export interface AgentSkillDefinition {
  skillId: string; // e.g. "skill_lead_qualification"
  name: string;
  description: string;
  connectorId: string;
  requiredPermissions: string[];
  topics: AgentTopic[];
  inputSchemaJson: string;
  outputSchemaJson: string;
  relatedDocsRef?: string;
}

export interface AgentOntologyManifest {
  agentId: string;
  name: string;
  team: string;
  description: string;
  topics: AgentTopic[];
  skills: string[];
  allowedConnectors: string[];
  requiredPermissions: string[];
  pfpSpec: AgentPfpProps;
  ts: string;
  traceId: string;
}

// ---------------------------------------------------------------------------
// 3. NVIDIA NIM V1 API BATCH INFERENCE SCHEMAS
// ---------------------------------------------------------------------------

export type NimSupportedLightweightModel =
  | 'meta/llama-3.2-1b-instruct'
  | 'meta/llama-3.2-3b-instruct'
  | 'mistralai/mistral-7b-instruct-v0.3'
  | 'google/gemma-2-2b-it'
  | 'qwen/qwen2.5-1.5b-instruct';

export interface NimChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface NimBatchItemRequest {
  customId: string;
  messages: NimChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  seed?: number;
}

export interface NimBatchRequest {
  batchId: string;
  model: NimSupportedLightweightModel;
  requests: NimBatchItemRequest[];
  apiKeySecretVaultPath?: string;
  traceId: string;
  ts: string;
}

export interface NimBatchItemResult {
  customId: string;
  status: 'succeeded' | 'failed';
  outputContent?: string;
  errorMessage?: string;
  promptTokens: number;
  completionTokens: number;
  finishReason?: string;
}

export interface NimBatchResponse {
  batchId: string;
  model: NimSupportedLightweightModel;
  totalRequests: number;
  completedRequests: number;
  results: NimBatchItemResult[];
  status: 'processing' | 'completed' | 'failed';
  traceId: string;
  ts: string;
}

// ---------------------------------------------------------------------------
// 4. CORRELATION MAP & GRAPH ENGINE CONTRACTS
// ---------------------------------------------------------------------------

export interface MasterCorrelationMaps {
  connector_to_agents: Record<string, string[]>;
  agent_to_connectors: Record<string, string[]>;
  connector_to_permissions: Record<string, string[]>;
  permission_to_connectors: Record<string, string[]>;
  agent_to_skills: Record<string, string[]>;
  skill_to_agents: Record<string, string[]>;
  topic_to_agents: Record<string, string[]>;
  agent_to_topics: Record<string, string[]>;
  topic_to_connectors: Record<string, string[]>;
  connector_to_topics: Record<string, string[]>;
}

export interface SurrealDbRelateEdge {
  fromNode: string; // e.g. "agent:agent_sales_lead"
  edgeType: 'USES' | 'REQUIRES_PERMISSION' | 'PROVIDES_SKILL' | 'COVERS_TOPIC';
  toNode: string;   // e.g. "connector:conn_hubspot"
  ts: string;
  traceId: string;
}

export interface OpenSearchAgentDocument {
  docId: string;
  entityType: 'agent' | 'connector' | 'skill';
  title: string;
  summary: string;
  contentMarkdown: string;
  topics: AgentTopic[];
  tags: string[];
  embeddingVector?: number[];
  ts: string;
}

export interface CorrelationMatrixCell {
  rowId: string;
  columnId: string;
  rowType: 'agent' | 'connector' | 'skill' | 'permission' | 'topic';
  colType: 'agent' | 'connector' | 'skill' | 'permission' | 'topic';
  correlated: boolean;
  score: number; // 0 to 1
  metadata?: Record<string, unknown>;
}

export interface CorrelationMatrixData {
  rows: Array<{ id: string; label: string; type: string }>;
  columns: Array<{ id: string; label: string; type: string }>;
  matrix: CorrelationMatrixCell[][];
  totalRelations: number;
  ts: string;
  traceId: string;
}
