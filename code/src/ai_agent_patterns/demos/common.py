from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import TypeVar, cast

DemoFn = Callable[[str], str]
F = TypeVar("F", bound=Callable[..., object])
StateT = TypeVar("StateT")


@dataclass(frozen=True)
class PatternDemo:
    slug: str
    name: str
    domain: str
    aliases: tuple[str, ...]
    idea: str
    frameworks: tuple[str, ...]
    steps: tuple[str, ...]
    snippet: str
    caution: str = "Dieses Minimalbeispiel zeigt die Architekturidee, nicht den vollständigen Produktionsbetrieb."


def trace_demo(name: str) -> Callable[[F], F]:
    """Return a LangSmith trace decorator when LangSmith is installed.

    Die Demo-Dateien sollen die eigentliche Pattern-Logik selbst zeigen.
    Deshalb lebt hier nur das optionale Tracing-Boilerplate.
    """
    try:
        from langsmith import traceable
    except ImportError:

        def decorator(func: F) -> F:
            return func

        return decorator

    return cast(Callable[[F], F], traceable(name=name))


def typed_state(state: object, _state_type: type[StateT] | None = None, /) -> StateT:
    """Tell static type checkers that a framework result has the expected state shape."""
    _ = _state_type
    return cast(StateT, state)
