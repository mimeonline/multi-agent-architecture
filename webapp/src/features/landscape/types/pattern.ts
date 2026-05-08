export type Domain = "Denken" | "Ablauf" | "Zusammenarbeit" | "Systembetrieb";

export type Subdomain =
  | "Memory Architecture"
  | "Tool Integration"
  | "Runtime Architecture"
  | "Governance & Safety"
  | "Observability & Evaluation";

export type Complexity = "Einsteiger" | "Fortgeschritten" | "Production";

export type DiagramType =
  | "loop"
  | "linear"
  | "branch"
  | "fanout"
  | "supervisor"
  | "handoff"
  | "gen-critic"
  | "mesh"
  | "gate"
  | "agent-store"
  | "tree";

export type Diagram = {
  type: DiagramType;
  nodes: string[];
  caption?: string;
};

export type CodeSnippet = {
  framework: string;
  language?: "python" | "typescript" | "pseudo";
  snippet: string;
};

export type RelatedKind = "similar" | "combines" | "contrasts";

export type Related = {
  name: string;
  kind: RelatedKind;
  note: string;
};

export type ExampleStep = {
  step: string;
  detail: string;
};

export type Pattern = {
  name: string;
  domain: Domain;
  subdomain?: Subdomain;
  aliases: string[];
  idea: string;
  useWhen: string[];
  avoidWhen: string[];
  tradeoff: string;
  frameworks: string[];

  icon: string;
  complexity: Complexity;
  traits: string[];
  scenario: string;
  diagram: Diagram;
  code: CodeSnippet;
  related: Related[];
  example?: ExampleStep[];
};

export type DecisionStep = {
  question: string;
  yes: string;
  no: string;
  recommendation: string[];
};

export type GlossaryEntry = {
  term: string;
  full?: string;
  definition: string;
};
