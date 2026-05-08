"""Audit Trail: Alle Entscheidungen und Tool-Aufrufe landen unveränderlich im append-only Log.

Der Lernpunkt: Jeder Tool-Call hängt einen Record mit `run_id`, `step`, `action`, `args` und
`result` an — niemals überschrieben. Das Log lässt sich vollständig replizieren, um jeden
Agentenschritt zu rekonstruieren.
"""

from __future__ import annotations

import uuid
from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "audit-trail"


class AuditEntry(TypedDict):
    run_id: str
    step: int
    action: str
    args: dict[str, object]
    result: str


class AuditState(TypedDict):
    run_id: str
    audit_log: list[AuditEntry]
    replay_summary: str


class AuditedToolRunner:
    def __init__(self, run_id: str) -> None:
        self.run_id = run_id
        self.log: list[AuditEntry] = []
        self._step = 0

    def call(self, action: str, fn: Callable[..., str], args: dict[str, object]) -> str:
        self._step += 1
        result = fn(**args)
        self.log.append(
            AuditEntry(
                run_id=self.run_id,
                step=self._step,
                action=action,
                args=args,
                result=result,
            )
        )
        return result


# --- Tool implementations ---

def search_knowledge_base(query: str) -> str:
    return f"found 3 articles matching '{query[:30]}'"


def fetch_user_profile(user_id: str) -> str:
    return f"profile for {user_id}: name=Alice, plan=pro"


def generate_summary(content: str) -> str:
    return f"summary: {content[:50]}..."


def send_report(recipient: str, summary: str) -> str:
    return f"report sent to {recipient}"


def replay_audit_log(log: list[AuditEntry]) -> str:
    lines = [f"Step {e['step']}: {e['action']}({e['args']}) -> {e['result']}" for e in log]
    return "\n".join(lines)


def run_plain_python(prompt: str) -> tuple[str, AuditState]:
    run_id = str(uuid.uuid4())[:8]
    runner = AuditedToolRunner(run_id)

    runner.call("search_knowledge_base", search_knowledge_base, {"query": prompt})
    runner.call("fetch_user_profile", fetch_user_profile, {"user_id": "u-42"})
    runner.call(
        "generate_summary",
        generate_summary,
        {"content": f"knowledge base results for '{prompt[:30]}'"},
    )
    runner.call("send_report", send_report, {"recipient": "ops-team@example.com", "summary": "see log"})

    replay = replay_audit_log(runner.log)

    state: AuditState = {
        "run_id": run_id,
        "audit_log": runner.log,
        "replay_summary": replay,
    }
    return "plain Python AuditedToolRunner", state


def render_result(runtime: str, state: AuditState) -> str:
    lines = [
        "Pattern: Audit Trail",
        f"Runtime: {runtime}",
        "Mechanic: every tool call appends an immutable AuditEntry; log is replayable",
        "",
        f"Run ID: {state['run_id']}",
        "",
        "Audit log:",
        *[
            f"  [{e['step']}] {e['action']}({e['args']}) -> {e['result']}"
            for e in state["audit_log"]
        ],
        "",
        "Replay / inspect:",
        *[f"  {line}" for line in state["replay_summary"].splitlines()],
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, AuditState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["AuditedToolRunner", "replay_audit_log", "run_plain_python", "render_result", "run"]
