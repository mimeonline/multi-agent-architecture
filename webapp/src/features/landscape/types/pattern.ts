export type Domain = "Denken" | "Ablauf" | "Zusammenarbeit" | "Systembetrieb";

export type Subdomain =
  | "Memory Architecture"
  | "Tool Integration"
  | "Runtime Architecture"
  | "Governance & Safety"
  | "Observability & Evaluation";

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
};

export type DecisionStep = {
  question: string;
  yes: string;
  no: string;
  recommendation: string[];
};

