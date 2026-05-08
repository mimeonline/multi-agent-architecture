"""Distributed Tracing: Jeder Lauf wird als Baum verschachtelter Spans mit Latenz und Kontext aufgezeichnet.

Der Lernpunkt: `child spans carry parent context` — ein Context-Manager öffnet einen benannten
Span, jeder Kindspan erbt die Parent-ID. Einrückungstiefe im Ausdruck spiegelt die Nesting-Tiefe
direkt wider.
"""

from __future__ import annotations

import time
from contextlib import contextmanager
from collections.abc import Generator
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "distributed-tracing"


class SpanRecord(TypedDict):
    name: str
    depth: int
    duration_ms: float
    children: list["SpanRecord"]


class TracingState(TypedDict):
    root_span: SpanRecord
    flat_log: list[str]


class Span:
    def __init__(self, name: str, depth: int) -> None:
        self.name = name
        self.depth = depth
        self.start = time.perf_counter()
        self.children: list[SpanRecord] = []

    def finish(self) -> SpanRecord:
        duration_ms = (time.perf_counter() - self.start) * 1000
        return SpanRecord(name=self.name, depth=self.depth, duration_ms=round(duration_ms, 2), children=self.children)


class Tracer:
    def __init__(self) -> None:
        self._stack: list[Span] = []
        self.root: SpanRecord | None = None

    @contextmanager
    def span(self, name: str) -> Generator[None, None, None]:
        depth = len(self._stack)
        s = Span(name, depth)
        self._stack.append(s)
        try:
            yield
        finally:
            record = s.finish()
            self._stack.pop()
            if self._stack:
                self._stack[-1].children.append(record)
            else:
                self.root = record


def _mock_sleep(ms: float) -> None:
    """Simulate work without actually sleeping (fast demo)."""
    # We do a tight loop to burn a tiny bit of real time so durations differ
    end = time.perf_counter() + ms / 1000
    while time.perf_counter() < end:
        pass


def _flatten(span: SpanRecord, lines: list[str]) -> None:
    indent = "  " * span["depth"]
    lines.append(f"{indent}[{span['name']}] {span['duration_ms']:.2f}ms")
    for child in span["children"]:
        _flatten(child, lines)


def run_plain_python(prompt: str) -> tuple[str, TracingState]:
    tracer = Tracer()

    with tracer.span("agent.run"):
        _mock_sleep(2)
        with tracer.span("tool.search"):
            _mock_sleep(1)
            with tracer.span("db.query"):
                _mock_sleep(0.5)
            with tracer.span("db.fetch_rows"):
                _mock_sleep(0.5)
        with tracer.span("tool.summarize"):
            _mock_sleep(1)
            with tracer.span("llm.tokenize"):
                _mock_sleep(0.2)
            with tracer.span("llm.infer"):
                _mock_sleep(0.5)
        with tracer.span("response.format"):
            _mock_sleep(0.3)

    assert tracer.root is not None
    flat: list[str] = []
    _flatten(tracer.root, flat)

    state: TracingState = {
        "root_span": tracer.root,
        "flat_log": flat,
    }
    return "plain Python Tracer (contextmanager spans)", state


def render_result(runtime: str, state: TracingState) -> str:
    root = state["root_span"]
    lines = [
        "Pattern: Distributed Tracing",
        f"Runtime: {runtime}",
        "Mechanic: nested span() context managers record name, depth, latency; tree shows call hierarchy",
        "",
        f"Trace tree (root: {root['name']}, total: {root['duration_ms']:.2f}ms):",
        *[f"  {line}" for line in state["flat_log"]],
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, TracingState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["Tracer", "run_plain_python", "render_result", "run"]
