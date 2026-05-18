import type { LucideIcon } from "lucide-react";

export type AtlasItemType =
  | "Foundation"
  | "Architecture"
  | "Governance"
  | "Decision Guide"
  | "Reference Architecture";

export type AtlasItem = {
  title: string;
  type: AtlasItemType;
  summary: string;
  explanation?: string;
  projectQuestion?: string;
  example?: string;
  whyItMatters: string;
  tradeoffs: string;
  failureModes: string[];
  related: string[];
  tag: string;
};

export type AtlasDomain = {
  title: string;
  description: string;
  role: string;
  href: string;
  icon: LucideIcon;
};

export type ReferenceComponent = {
  name: string;
  role: string;
};

export type ReferenceDecision = {
  question: string;
  choice: string;
  rationale: string;
};

export type ReferenceGovernance = {
  concern: string;
  mitigation: string;
};

export type ReferenceVariant = {
  name: string;
  summary: string;
};

export type ReferenceDiagramStep = {
  label: string;
  detail?: string;
};

export type ReferenceComplexity = "Einsteiger" | "Fortgeschritten" | "Production";
export type ReferenceAutonomy = "Workflow" | "Single Agent" | "Multi-Agent";

export type ReferenceArchitecture = {
  slug: string;
  title: string;
  tagline: string;
  scenario: string;
  complexity: ReferenceComplexity;
  autonomy: ReferenceAutonomy;
  domain: string;
  whenToUse: string[];
  whenNotToUse: string[];
  patternComposition: string[];
  components: ReferenceComponent[];
  diagram: ReferenceDiagramStep[];
  keyDecisions: ReferenceDecision[];
  governance: ReferenceGovernance[];
  failureModes: string[];
  variants: ReferenceVariant[];
};

export type ImplementationLabGroup = {
  title: string;
  description: string;
  path: string;
  examples: string[];
  architectureValue: string;
};

export type ToolingCompatibilityLevel = "Native" | "Composable" | "Custom" | "Supporting";

export type ToolingCompatibility = {
  tool: string;
  level: ToolingCompatibilityLevel;
  bestFor: string;
  watchOut: string;
  related: string[];
};
