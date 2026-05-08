from __future__ import annotations

from collections import OrderedDict

from ai_agent_patterns.demos.common import DemoFn
from .codeact import run as codeact
from .plan_and_execute import run as plan_and_execute
from .react import run as react
from .rewoo import run as rewoo
from .reflexion import run as reflexion
from .self_consistency import run as self_consistency
from .tree_of_thoughts import run as tree_of_thoughts


def registry() -> dict[str, DemoFn]:
    demos: OrderedDict[str, DemoFn] = OrderedDict()
    demos["react"] = react
    demos["plan-and-execute"] = plan_and_execute
    demos["rewoo"] = rewoo
    demos["reflexion"] = reflexion
    demos["tree-of-thoughts"] = tree_of_thoughts
    demos["self-consistency"] = self_consistency
    demos["codeact"] = codeact
    return dict(demos)


__all__ = ["registry"]
