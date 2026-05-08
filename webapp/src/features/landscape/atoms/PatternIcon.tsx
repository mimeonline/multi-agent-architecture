import {
  Brain,
  Workflow,
  Users,
  Server,
  Repeat,
  ListChecks,
  GitBranch,
  Network,
  Layers,
  Shuffle,
  Sparkles,
  Code2,
  Search,
  CheckCircle2,
  GitMerge,
  Group,
  MessageSquare,
  Database,
  Cpu,
  Boxes,
  Link2,
  Plug,
  Route,
  Lock,
  Activity,
  ShieldCheck,
  Eye,
  Terminal,
  CircuitBoard,
  Radio,
  Save,
  HandCoins,
  Vote,
  Trees,
  Hammer,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Brain, Workflow, Users, Server, Repeat, ListChecks, GitBranch, Network, Layers,
  Shuffle, Sparkles, Code2, Search, CheckCircle2, GitMerge, Group, MessageSquare,
  Database, Cpu, Boxes, Link2, Plug, Route, Lock, Activity, ShieldCheck, Eye,
  Terminal, CircuitBoard, Radio, Save, HandCoins, Vote, Trees, Hammer,
};

type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function PatternIcon({ name, size = 18, className }: Props) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
