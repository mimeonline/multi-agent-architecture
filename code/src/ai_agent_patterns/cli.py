from __future__ import annotations

import argparse
import os
import sys
import warnings
from collections.abc import Mapping

try:
    from langchain_core._api.deprecation import LangChainPendingDeprecationWarning
except ImportError:  # pragma: no cover - only relevant before dependencies are installed
    LangChainPendingDeprecationWarning = Warning

warnings.filterwarnings("ignore", category=LangChainPendingDeprecationWarning)
warnings.filterwarnings("ignore", message=".*allowed_objects.*")

from .demos import registry
from .demos.common import DemoFn

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

ANSI = {
    "reset": "\033[0m",
    "bold": "\033[1m",
    "muted": "\033[2m",
    "cyan": "\033[36m",
    "green": "\033[32m",
    "yellow": "\033[33m",
    "blue": "\033[34m",
    "magenta": "\033[35m",
    "red": "\033[31m",
}

GROUP_COLORS = {
    "denken": "cyan",
    "ablauf": "green",
    "zusammenarbeit": "yellow",
    "systembetrieb": "magenta",
}

EXAMPLE_PROMPTS = {
    "react": "Find 12 * 7 and summarize the tool result.",
    "plan-and-execute": "Plan a small customer support automation in three steps.",
    "rewoo": "Find the cost drivers for a small AI workflow and summarize them.",
    "reflexion": "Write a two sentence product update.",
    "tree-of-thoughts": "Compare three solution paths for an agent onboarding flow.",
    "self-consistency": "Answer whether a lightweight router or supervisor is better for support triage.",
    "codeact": "Calculate the average of 4, 8 and 12.",
    "sequential-pipeline": "Draft a launch note for a memory feature.",
    "routing": "I need this Python traceback explained.",
    "parallelization-sectioning": "Summarize three independent sections of an agent architecture note.",
    "parallelization-voting": "Choose the best short title for an AI agent pattern guide.",
    "loop": "Improve this answer until it passes a simple quality check.",
    "evaluator-optimizer": "Generate and critique a concise feature announcement.",
    "iterative-refinement": "Refine a rough release note into a polished version.",
    "orchestrator-workers": "Break a research task into specialist worker assignments.",
    "map-reduce": "Aggregate insights from multiple short architecture notes.",
    "supervisor": "Route a task between a researcher and a builder.",
    "hierarchical-supervisor": "Coordinate two teams for building an agent demo suite.",
    "handoff": "Transfer a user request from intake to a permission-scoped specialist.",
    "swarm": "Let several peers propose next steps for exploring a broad topic.",
    "group-chat": "Have product, engineering, and safety discuss a new tool feature.",
    "multi-agent-debate": "Debate whether to use Handoff or Supervisor for customer support.",
    "magentic": "Research how agent handoffs should be documented.",
    "blackboard": "Coordinate agents through a shared investigation workspace.",
    "contract-net": "Assign a task by asking specialists to bid on it.",
    "market-based": "Allocate limited model budget across three competing tasks.",
    "agents-as-tools": "Use a research specialist and a coding specialist as callable tools.",
    "graph-based-orchestration": "Plan a tiny agent architecture.",
    "conversational-memory": "My name is Michael and I like concise demos.",
    "episodic-memory": "Reuse a previous successful debugging episode.",
    "semantic-memory": "Store a durable fact about a user's preferred response style.",
    "working-memory": "Track intermediate tool results while solving a task.",
    "vector-memory": "Retrieve relevant notes for an agent architecture question.",
    "graph-memory": "Model relationships between agents, tools, and permissions.",
    "compressed-context-memory": "Compress a long conversation into a useful running summary.",
    "function-calling": "Calculate subscription cost for 7 seats at 19.5 per seat for 6 months.",
    "tool-registry": "Register three tools with schemas and permissions.",
    "mcp": "Expose a filesystem search capability through an MCP-style tool boundary.",
    "adapter-pattern": "Wrap an external ticket API as an agent-friendly tool.",
    "capability-routing": "Choose the right tool set for a billing support request.",
    "permission-scoped-tools": "Limit a support agent to read-only account lookup tools.",
    "actor-model": "Send messages between two stateful agent actors.",
    "event-driven-choreography": "React to a new support ticket event with independent handlers.",
    "saga-compensation": "Book a multi-step workflow and compensate when a later step fails.",
    "workflow-dag-durable-execution": "Run a durable workflow with retryable graph nodes.",
    "checkpointing-resumability": "Pause and resume a long-running research task.",
    "pub-sub-agent-mesh": "Publish an event to multiple agent subscribers.",
    "human-in-the-loop-approval-gate": "Ask for approval before sending a customer-facing email.",
    "output-validation-schema-enforcement": "Validate a structured support ticket summary.",
    "sandbox-execution": "Run generated code in a restricted sandbox.",
    "least-privilege-agent": "Design an agent with only the minimum required permissions.",
    "audit-trail": "Record tool calls and approvals for later review.",
    "multimodal-guardrails": "Check a mixed text and image request before responding.",
    "distributed-tracing": "Trace a request across agent, tool, and evaluator nodes.",
    "token-cost-tracking": "Estimate and report token cost for a multi-step workflow.",
    "llm-as-judge": "Score three candidate answers with a rubric.",
    "integration-tests-for-agents": "Run an end-to-end test for an agent using mocked tools.",
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="agent-patterns",
        description="Run practical AI agent pattern demos with graceful offline fallbacks.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List available demos grouped by domain.")
    list_parser.add_argument("--plain", action="store_true", help="Print one demo slug per line.")

    subparsers.add_parser(
        "menu",
        aliases=["tui", "interactive"],
        help="Open an interactive terminal menu and run a selected pattern with an example prompt.",
    )

    run_parser = subparsers.add_parser("run", help="Run a demo by name, or all demos.")
    run_parser.add_argument("demo", help="Demo name or `all`.")
    run_parser.add_argument("prompt", nargs="?", default=DEFAULT_PROMPT)
    return parser


def _menu_items(demos: Mapping[str, DemoFn]) -> list[tuple[str, str]]:
    items: list[tuple[str, str]] = []
    for group, names in CANONICAL_GROUPS.items():
        for name in names:
            if name in demos:
                items.append((group, name))
    return items


def _use_color() -> bool:
    if os.getenv("FORCE_COLOR"):
        return True
    if os.getenv("NO_COLOR"):
        return False
    return sys.stdout.isatty()


def style(text: object, *styles: str) -> str:
    value = str(text)
    if not _use_color():
        return value
    prefix = "".join(ANSI[name] for name in styles if name in ANSI)
    return f"{prefix}{value}{ANSI['reset']}" if prefix else value


def separator() -> str:
    return style("=" * 80, "muted")


def run_menu(demos: Mapping[str, DemoFn]) -> int:
    items = _menu_items(demos)

    while True:
        print(style("AI Agent Pattern Demos", "bold", "cyan"))
        print("Nummer eingeben, um ein Pattern mit Beispielprompt zu starten.")
        print(f"{style('q / quit / exit', 'yellow')} oder {style('Ctrl-D', 'yellow')} beendet.\n")

        index = 1
        for group, names in CANONICAL_GROUPS.items():
            group_color = GROUP_COLORS.get(group, "bold")
            print(style(f"[{group}]", "bold", group_color))
            for name in names:
                if name not in demos:
                    continue
                print(f"  {style(f'{index:2d}.', 'muted')} {name}")
                index += 1
            print()

        try:
            choice = input("Pattern auswählen: ").strip().lower()
        except EOFError:
            print("\nBeendet.")
            return 0
        if choice in {"q", "quit", "exit"}:
            print("Beendet.")
            return 0
        if choice == "":
            print()
            continue

        try:
            selected_index = int(choice) - 1
            _, selected_name = items[selected_index]
        except (ValueError, IndexError):
            print(style(f"Ungültige Auswahl: {choice}\n", "red"))
            continue

        default_prompt = EXAMPLE_PROMPTS.get(selected_name, DEFAULT_PROMPT)
        try:
            custom_prompt = input(f"Prompt [{default_prompt}]: ").strip()
        except EOFError:
            print("\nBeendet.")
            return 0
        prompt = custom_prompt or default_prompt

        print()
        print(style(f"$ agent-patterns run {selected_name} {prompt!r}", "green"))
        print(separator())
        demo = demos[selected_name]
        print(demo(prompt))
        print(separator())
        try:
            next_action = input("Return: zurück zum Menü, `q`: beenden: ").strip().lower()
        except EOFError:
            print("\nBeendet.")
            return 0
        if next_action in {"q", "quit", "exit"}:
            print("Beendet.")
            return 0
        print()


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

    if args.command in {"menu", "tui", "interactive"}:
        return run_menu(demos)

    return 1


if __name__ == "__main__":
    sys.exit(main())
