from __future__ import annotations

from collections.abc import Callable

DemoFn = Callable[[str], str]


def registry() -> dict[str, DemoFn]:
    from .deepagents_demo import run as deepagents
    from .memory import run as memory
    from .react_tool_calling import run as react
    from .reflection import run as reflection
    from .routing import run as routing
    from .sequential import run as sequential
    from .state_graph import run as graph

    return {
        "react": react,
        "sequential": sequential,
        "routing": routing,
        "graph": graph,
        "reflection": reflection,
        "memory": memory,
        "deepagents": deepagents,
    }
