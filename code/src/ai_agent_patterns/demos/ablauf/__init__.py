from __future__ import annotations

from collections import OrderedDict

from ai_agent_patterns.demos.common import DemoFn
from .evaluator_optimizer import run as evaluator_optimizer
from .iterative_refinement import run as iterative_refinement
from .loop import run as loop
from .map_reduce import run as map_reduce
from .orchestrator_workers import run as orchestrator_workers
from .parallelization_sectioning import run as parallelization_sectioning
from .parallelization_voting import run as parallelization_voting
from .routing import run as routing
from .sequential_pipeline import run as sequential_pipeline


def registry() -> dict[str, DemoFn]:
    demos: OrderedDict[str, DemoFn] = OrderedDict()
    demos["sequential-pipeline"] = sequential_pipeline
    demos["routing"] = routing
    demos["parallelization-sectioning"] = parallelization_sectioning
    demos["parallelization-voting"] = parallelization_voting
    demos["loop"] = loop
    demos["evaluator-optimizer"] = evaluator_optimizer
    demos["iterative-refinement"] = iterative_refinement
    demos["orchestrator-workers"] = orchestrator_workers
    demos["map-reduce"] = map_reduce
    return dict(demos)


__all__ = ["registry"]
