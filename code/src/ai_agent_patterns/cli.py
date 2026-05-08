from __future__ import annotations

import argparse
import sys

from .demos import registry

DEFAULT_PROMPT = "Show the core idea of this agent pattern with a tiny practical example."


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="agent-patterns",
        description="Run practical AI agent pattern demos with graceful offline fallbacks.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("list", help="List available demos.")

    run_parser = subparsers.add_parser("run", help="Run a demo by name, or all demos.")
    run_parser.add_argument("demo", help="Demo name or `all`.")
    run_parser.add_argument("prompt", nargs="?", default=DEFAULT_PROMPT)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    demos = registry()

    if args.command == "list":
        for name in demos:
            print(name)
        return 0

    if args.command == "run":
        if args.demo == "all":
            for name, demo in demos.items():
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
