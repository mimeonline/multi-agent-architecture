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

export type ReferenceArchitecture = {
  title: string;
  scenario: string;
  components: string[];
  keyDecisions: string[];
  governanceConcerns: string[];
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
