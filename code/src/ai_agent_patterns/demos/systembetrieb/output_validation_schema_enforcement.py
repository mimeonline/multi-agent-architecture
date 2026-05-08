"""Output Validation / Schema Enforcement: Modellantwort wird gegen ein Schema geprüft, bevor sie weitergeht.

Der Lernpunkt: Schlägt die Pydantic-Validierung fehl, fließt der Validierungsfehler als
`correction hint` in den nächsten Prompt — bis zu `MAX_RETRIES` Mal. Downstream-Code sieht
nur valide, typisierte Objekte.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "output-validation-schema-enforcement"

MAX_RETRIES = 2

# Schema: required field name -> expected Python type
SCHEMA: dict[str, type] = {
    "title": str,
    "confidence": float,
    "tags": list,
    "source_url": str,
}


class ValidationError(TypedDict):
    field: str
    reason: str


class AttemptRecord(TypedDict):
    attempt: int
    raw_output: dict[str, object]
    errors: list[ValidationError]
    valid: bool


class ValidationState(TypedDict):
    schema: dict[str, str]
    attempts: list[AttemptRecord]
    final_output: dict[str, object] | None
    outcome: str


def validate_output(output: dict[str, object]) -> list[ValidationError]:
    errors: list[ValidationError] = []
    for field, expected_type in SCHEMA.items():
        if field not in output:
            errors.append({"field": field, "reason": "missing"})
        elif not isinstance(output[field], expected_type):
            actual = type(output[field]).__name__
            errors.append({"field": field, "reason": f"expected {expected_type.__name__}, got {actual}"})
    return errors


def simulate_agent_output(prompt: str, attempt: int) -> dict[str, object]:
    """Simulate progressively corrected agent output across retries."""
    if attempt == 1:
        # First attempt: missing 'source_url' and wrong type for 'confidence'
        return {
            "title": f"Analysis of: {prompt[:30]}",
            "confidence": "high",  # wrong type — should be float
            "tags": ["ai", "demo"],
            # source_url missing
        }
    if attempt == 2:
        # Second attempt after hint: still wrong type
        return {
            "title": f"Analysis of: {prompt[:30]}",
            "confidence": "0.87",  # still a string
            "tags": ["ai", "demo"],
            "source_url": "https://example.com/source",
        }
    # Third attempt: fully correct
    return {
        "title": f"Analysis of: {prompt[:30]}",
        "confidence": 0.87,
        "tags": ["ai", "demo"],
        "source_url": "https://example.com/source",
    }


def run_plain_python(prompt: str) -> tuple[str, ValidationState]:
    attempts: list[AttemptRecord] = []
    final_output: dict[str, object] | None = None
    outcome = "failed after max retries"

    for attempt in range(1, MAX_RETRIES + 2):  # 1, 2, 3
        raw = simulate_agent_output(prompt, attempt)
        errors = validate_output(raw)
        record = AttemptRecord(attempt=attempt, raw_output=raw, errors=errors, valid=not errors)
        attempts.append(record)

        if not errors:
            final_output = raw
            outcome = f"valid on attempt {attempt}"
            break
        # Correction hint would be appended to prompt on retry (simulated by attempt counter)

    state: ValidationState = {
        "schema": {k: v.__name__ for k, v in SCHEMA.items()},
        "attempts": attempts,
        "final_output": final_output,
        "outcome": outcome,
    }
    return "plain Python schema validator with retry", state


def render_result(runtime: str, state: ValidationState) -> str:
    lines = [
        "Pattern: Output Validation / Schema Enforcement",
        f"Runtime: {runtime}",
        "Mechanic: validate output against schema; inject correction hint and retry on failure",
        "",
        "Required schema:",
        *[f"  {field}: {typ}" for field, typ in state["schema"].items()],
        "",
        "Validation attempts:",
    ]
    for record in state["attempts"]:
        status = "VALID" if record["valid"] else "INVALID"
        lines.append(f"\n  Attempt {record['attempt']} [{status}]:")
        lines.append(f"    Output: {record['raw_output']}")
        if record["errors"]:
            for err in record["errors"]:
                lines.append(f"    Error: {err['field']} — {err['reason']}")
        if not record["valid"] and record["attempt"] <= MAX_RETRIES:
            lines.append("    -> retrying with correction hint...")
    lines.append("")
    lines.append(f"Outcome: {state['outcome']}")
    if state["final_output"]:
        lines.append(f"Final output: {state['final_output']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, ValidationState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["validate_output", "run_plain_python", "render_result", "run"]
