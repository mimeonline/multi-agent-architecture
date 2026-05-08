from __future__ import annotations

from collections import OrderedDict
from collections.abc import Callable

DemoFn = Callable[[str], str]


def registry() -> dict[str, DemoFn]:
    from .ablauf import registry as ablauf_registry
    from .denken import registry as denken_registry
    from .systembetrieb import registry as systembetrieb_registry
    from .zusammenarbeit import registry as zusammenarbeit_registry

    demos: OrderedDict[str, DemoFn] = OrderedDict()

    demos.update(denken_registry())
    demos.update(ablauf_registry())
    demos.update(zusammenarbeit_registry())
    demos.update(systembetrieb_registry())

    legacy_aliases = {
        "prompt-chaining": demos["sequential-pipeline"],
        "generator-critic": demos["evaluator-optimizer"],
        "state-graph": demos["graph-based-orchestration"],
        "memory": demos["conversational-memory"],
        "deepagents": demos["magentic"],
        "sequential": demos["sequential-pipeline"],
        "reflection": demos["reflexion"],
        "graph": demos["graph-based-orchestration"],
    }
    demos.update(legacy_aliases)
    return dict(demos)
