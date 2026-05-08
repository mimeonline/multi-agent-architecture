"""Token / Cost Tracking: Pro Aufruf werden Tokens und Kosten aggregiert und gegen ein Budget verglichen.

Der Lernpunkt: Eine Preistabelle konvertiert Token-Counts zu Dollar; `total_cost` akkumuliert
über alle Schritte. Überschreitet der Lauf das Budget, wird abgebrochen — bevor eine fehlerhafte
Schleife das Tagesbudget frisst.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "token-cost-tracking"

# Pricing table: (provider, model) -> ($ per 1k input tokens, $ per 1k output tokens)
PRICING: dict[tuple[str, str], tuple[float, float]] = {
    ("anthropic", "claude-3-5-haiku"): (0.0008, 0.004),
    ("anthropic", "claude-sonnet-4-5"): (0.003, 0.015),
    ("openai", "gpt-4o-mini"): (0.00015, 0.0006),
    ("openai", "gpt-4o"): (0.005, 0.015),
}

BUDGET_USD = 0.10


class StepUsage(TypedDict):
    step: str
    provider: str
    model: str
    input_tokens: int
    output_tokens: int
    cost_usd: float


class CostState(TypedDict):
    steps: list[StepUsage]
    total_input_tokens: int
    total_output_tokens: int
    total_cost_usd: float
    budget_usd: float
    over_budget: bool


def compute_cost(provider: str, model: str, input_tokens: int, output_tokens: int) -> float:
    price_in, price_out = PRICING.get((provider, model), (0.0, 0.0))
    return round(input_tokens / 1000 * price_in + output_tokens / 1000 * price_out, 6)


def record_step(
    step: str,
    provider: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
) -> StepUsage:
    cost = compute_cost(provider, model, input_tokens, output_tokens)
    return StepUsage(
        step=step,
        provider=provider,
        model=model,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        cost_usd=cost,
    )


def run_plain_python(prompt: str) -> tuple[str, CostState]:
    # Simulate a multi-step agent workflow with mixed models
    steps = [
        record_step("intent_classification", "openai", "gpt-4o-mini", input_tokens=312, output_tokens=28),
        record_step("knowledge_retrieval", "anthropic", "claude-3-5-haiku", input_tokens=1800, output_tokens=420),
        record_step("answer_generation", "anthropic", "claude-sonnet-4-5", input_tokens=2400, output_tokens=860),
        record_step("quality_check", "openai", "gpt-4o-mini", input_tokens=980, output_tokens=64),
        record_step("final_formatting", "anthropic", "claude-3-5-haiku", input_tokens=540, output_tokens=210),
    ]

    total_in = sum(s["input_tokens"] for s in steps)
    total_out = sum(s["output_tokens"] for s in steps)
    total_cost = round(sum(s["cost_usd"] for s in steps), 6)

    state: CostState = {
        "steps": steps,
        "total_input_tokens": total_in,
        "total_output_tokens": total_out,
        "total_cost_usd": total_cost,
        "budget_usd": BUDGET_USD,
        "over_budget": total_cost > BUDGET_USD,
    }
    return "plain Python cost tracker (pricing table)", state


def render_result(runtime: str, state: CostState) -> str:
    lines = [
        "Pattern: Token / Cost Tracking",
        f"Runtime: {runtime}",
        "Mechanic: per-step token counts * pricing table -> cumulative cost vs budget",
        "",
        "Pricing table ($/1k tokens):",
        *[
            f"  {provider}/{model}: in=${price_in:.5f}  out=${price_out:.5f}"
            for (provider, model), (price_in, price_out) in PRICING.items()
        ],
        "",
        "Step breakdown:",
        f"  {'Step':<25} {'Model':<25} {'In':>6} {'Out':>6} {'Cost':>10}",
        f"  {'-'*25} {'-'*25} {'-'*6} {'-'*6} {'-'*10}",
    ]
    for s in state["steps"]:
        model_str = f"{s['provider']}/{s['model']}"
        lines.append(
            f"  {s['step']:<25} {model_str:<25} {s['input_tokens']:>6} {s['output_tokens']:>6} ${s['cost_usd']:>9.6f}"
        )
    lines.extend([
        f"  {'-'*75}",
        f"  {'TOTAL':<51} {state['total_input_tokens']:>6} {state['total_output_tokens']:>6} ${state['total_cost_usd']:>9.6f}",
        "",
        f"Budget: ${state['budget_usd']:.4f}  |  Over budget: {state['over_budget']}",
    ])
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, CostState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["PRICING", "compute_cost", "record_step", "run_plain_python", "render_result", "run"]
