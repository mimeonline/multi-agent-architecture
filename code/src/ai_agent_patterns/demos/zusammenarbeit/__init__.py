from __future__ import annotations

from collections import OrderedDict

from ai_agent_patterns.demos.common import DemoFn
from .agents_as_tools import run as agents_as_tools
from .blackboard import run as blackboard
from .contract_net import run as contract_net
from .graph_based_orchestration import run as graph_based_orchestration
from .group_chat import run as group_chat
from .handoff import run as handoff
from .hierarchical_supervisor import run as hierarchical_supervisor
from .magentic import run as magentic
from .market_based import run as market_based
from .multi_agent_debate import run as multi_agent_debate
from .supervisor import run as supervisor
from .swarm import run as swarm


def registry() -> dict[str, DemoFn]:
    demos: OrderedDict[str, DemoFn] = OrderedDict()
    demos["supervisor"] = supervisor
    demos["hierarchical-supervisor"] = hierarchical_supervisor
    demos["handoff"] = handoff
    demos["swarm"] = swarm
    demos["group-chat"] = group_chat
    demos["multi-agent-debate"] = multi_agent_debate
    demos["magentic"] = magentic
    demos["blackboard"] = blackboard
    demos["contract-net"] = contract_net
    demos["market-based"] = market_based
    demos["agents-as-tools"] = agents_as_tools
    demos["graph-based-orchestration"] = graph_based_orchestration
    return dict(demos)


__all__ = ["registry"]
