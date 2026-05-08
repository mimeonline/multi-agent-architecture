from __future__ import annotations

import argparse
import sys

from .demos import registry

DEFAULT_PROMPT = "Show the core idea of this agent pattern with a tiny practical example."

CANONICAL_GROUPS = {
    "denken": (
        "react",
        "plan-and-execute",
        "rewoo",
        "reflexion",
        "tree-of-thoughts",
        "self-consistency",
        "codeact",
    ),
    "ablauf": (
        "sequential-pipeline",
        "routing",
        "parallelization-sectioning",
        "parallelization-voting",
        "loop",
        "evaluator-optimizer",
        "iterative-refinement",
        "orchestrator-workers",
        "map-reduce",
    ),
    "zusammenarbeit": (
        "supervisor",
        "hierarchical-supervisor",
        "handoff",
        "swarm",
        "group-chat",
        "multi-agent-debate",
        "magentic",
        "blackboard",
        "contract-net",
        "market-based",
        "agents-as-tools",
        "graph-based-orchestration",
    ),
    "systembetrieb": (
        "conversational-memory",
        "episodic-memory",
        "semantic-memory",
        "working-memory",
        "vector-memory",
        "graph-memory",
        "compressed-context-memory",
        "function-calling",
        "tool-registry",
        "mcp",
        "adapter-pattern",
        "capability-routing",
        "permission-scoped-tools",
        "actor-model",
        "event-driven-choreography",
        "saga-compensation",
        "workflow-dag-durable-execution",
        "checkpointing-resumability",
        "pub-sub-agent-mesh",
        "human-in-the-loop-approval-gate",
        "output-validation-schema-enforcement",
        "sandbox-execution",
        "least-privilege-agent",
        "audit-trail",
        "multimodal-guardrails",
        "distributed-tracing",
        "token-cost-tracking",
        "llm-as-judge",
        "integration-tests-for-agents",
    ),
}

CANONICAL_DEMOS = tuple(name for group in CANONICAL_GROUPS.values() for name in group)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="agent-patterns",
        description="Run practical AI agent pattern demos with graceful offline fallbacks.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List available demos grouped by domain.")
    list_parser.add_argument("--plain", action="store_true", help="Print one demo slug per line.")

    run_parser = subparsers.add_parser("run", help="Run a demo by name, or all demos.")
    run_parser.add_argument("demo", help="Demo name or `all`.")
    run_parser.add_argument("prompt", nargs="?", default=DEFAULT_PROMPT)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    demos = registry()

    if args.command == "list":
        if args.plain:
            for name in CANONICAL_DEMOS:
                print(name)
            return 0

        for group, names in CANONICAL_GROUPS.items():
            print(f"[{group}]")
            for name in names:
                if name in demos:
                    print(f"  {name}")
        return 0

    if args.command == "run":
        if args.demo == "all":
            for name in CANONICAL_DEMOS:
                demo = demos[name]
                print("=" * 80)
                print(f"Demo: {name}")
                print(demo(args.prompt))
            return 0

        demo = demos.get(args.demo)
        if demo is None:
            parser.error(f"Unknown demo `{args.demo}`. Choose one of: {', '.join(demos)}")
        print(demo(args.prompt))
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
