"""Saga / Compensation: Jede Aktion ist mit ihrer Kompensation gepaart; Fehler lösen Rollback aus.

Der Lernpunkt: Jeder Schritt ist ein `(do, undo)`-Tupel — schlägt `do` fehl, werden alle
bereits ausgeführten `undo`-Funktionen in umgekehrter Reihenfolge aufgerufen. Fachlicher
Rollback ohne atomare Transaktion.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "saga-compensation"


class SagaStep(TypedDict):
    name: str
    do: Callable[[], str]
    undo: Callable[[], str]


class SagaState(TypedDict):
    steps_completed: list[str]
    failed_step: str | None
    compensations: list[str]
    outcome: str


# --- Simulated distributed operations ---

_reserved_inventory: list[str] = []
_charged_payment: list[str] = []


def reserve_inventory() -> str:
    _reserved_inventory.append("item-42")
    return "inventory reserved: item-42"


def unreserve_inventory() -> str:
    if _reserved_inventory:
        item = _reserved_inventory.pop()
        return f"inventory released: {item}"
    return "nothing to release"


def charge_payment() -> str:
    _charged_payment.append("charge-99.00")
    return "payment charged: $99.00"


def refund_payment() -> str:
    if _charged_payment:
        charge = _charged_payment.pop()
        return f"payment refunded: {charge}"
    return "nothing to refund"


def notify_warehouse() -> str:
    raise RuntimeError("warehouse service unavailable")  # Step 3 always fails in this demo


def cancel_warehouse_notification() -> str:
    return "warehouse notification cancelled (was never sent)"


def run_plain_python(prompt: str) -> tuple[str, SagaState]:
    # Reset side-effects for each run
    _reserved_inventory.clear()
    _charged_payment.clear()

    steps: list[SagaStep] = [
        {"name": "reserve_inventory", "do": reserve_inventory, "undo": unreserve_inventory},
        {"name": "charge_payment", "do": charge_payment, "undo": refund_payment},
        {"name": "notify_warehouse", "do": notify_warehouse, "undo": cancel_warehouse_notification},
    ]

    completed: list[tuple[str, Callable[[], str]]] = []
    state: SagaState = {
        "steps_completed": [],
        "failed_step": None,
        "compensations": [],
        "outcome": "",
    }

    for step in steps:
        try:
            result = step["do"]()
            completed.append((step["name"], step["undo"]))
            state["steps_completed"].append(f"{step['name']} -> {result}")
        except Exception as exc:
            state["failed_step"] = f"{step['name']}: {exc}"
            # Compensate in reverse order
            for name, undo_fn in reversed(completed):
                undo_result = undo_fn()
                state["compensations"].append(f"UNDO {name} -> {undo_result}")
            state["outcome"] = "saga aborted; compensation complete"
            return "plain Python Saga", state

    state["outcome"] = "saga committed"
    return "plain Python Saga", state


def render_result(runtime: str, state: SagaState) -> str:
    lines = [
        "Pattern: Saga / Compensation",
        f"Runtime: {runtime}",
        "Mechanic: (do, undo) step pairs — failure triggers reverse compensation",
        "",
        "Steps executed (forward):",
        *[f"  OK  {s}" for s in state["steps_completed"]],
    ]
    if state["failed_step"]:
        lines.append(f"  FAIL {state['failed_step']}")
        lines.append("")
        lines.append("Compensation log (reverse order):")
        lines.extend([f"  {c}" for c in state["compensations"]])
    lines.append("")
    lines.append(f"Outcome: {state['outcome']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, SagaState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run_plain_python", "render_result", "run"]
