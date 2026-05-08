"""Multimodal Guardrails: Inputs und Outputs werden modalitätsspezifisch gefiltert, bevor sie den Agenten erreichen.

Der Lernpunkt: Jede Modalität (Text, Bild, Audio) hat eine eigene `policy`-Funktion, die
`(allowed, reason)` zurückgibt. Ein Textfilter fängt kein hochgeladenes Bild — deshalb
läuft jede Modalität durch ihren eigenen Guard.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "multimodal-guardrails"

# Simulated PII patterns (real impl would use NER or regex)
_PII_KEYWORDS = {"ssn", "credit card", "passport", "date of birth", "social security"}
# Simulated NSFW markers
_NSFW_MARKERS = {"nsfw", "explicit", "adult_content"}
# Simulated audio policy violations
_AUDIO_VIOLATIONS = {"hate_speech", "threat", "doxxing"}


class ModalityInput(TypedDict):
    modality: str  # "text" | "image" | "audio"
    content: str   # textual description / payload
    metadata: dict[str, object]


class GuardrailResult(TypedDict):
    modality: str
    content_preview: str
    allowed: bool
    policy: str
    reason: str


class GuardrailsState(TypedDict):
    inputs: list[ModalityInput]
    results: list[GuardrailResult]


def text_policy(inp: ModalityInput) -> tuple[bool, str]:
    content_lower = inp["content"].lower()
    for keyword in _PII_KEYWORDS:
        if keyword in content_lower:
            return False, f"PII detected: '{keyword}'"
    return True, "text policy passed"


def image_policy(inp: ModalityInput) -> tuple[bool, str]:
    tags = [str(t).lower() for t in list(inp["metadata"].get("tags", []))]  # type: ignore[arg-type]
    for marker in _NSFW_MARKERS:
        if marker in tags:
            return False, f"NSFW marker detected: '{marker}'"
    dimensions = inp["metadata"].get("dimensions")
    if dimensions and isinstance(dimensions, dict):
        width = dimensions.get("width", 0)
        if isinstance(width, int) and width > 8000:
            return False, f"image too large: width={width}px (max 8000)"
    return True, "image policy passed"


def audio_policy(inp: ModalityInput) -> tuple[bool, str]:
    labels = [str(lbl).lower() for lbl in list(inp["metadata"].get("classifier_labels", []))]  # type: ignore[arg-type]
    for violation in _AUDIO_VIOLATIONS:
        if violation in labels:
            return False, f"audio violation detected: '{violation}'"
    duration_s = inp["metadata"].get("duration_s", 0)
    if isinstance(duration_s, (int, float)) and duration_s > 600:
        return False, f"audio too long: {duration_s}s (max 600s)"
    return True, "audio policy passed"


_POLICIES = {
    "text": ("text_policy (no PII)", text_policy),
    "image": ("image_policy (no NSFW)", image_policy),
    "audio": ("audio_policy (no hate/threat)", audio_policy),
}


def apply_guardrail(inp: ModalityInput) -> GuardrailResult:
    policy_name, policy_fn = _POLICIES.get(inp["modality"], ("unknown_policy", lambda _: (False, "unknown modality")))
    allowed, reason = policy_fn(inp)
    return GuardrailResult(
        modality=inp["modality"],
        content_preview=inp["content"][:50],
        allowed=allowed,
        policy=policy_name,
        reason=reason,
    )


def run_plain_python(prompt: str) -> tuple[str, GuardrailsState]:
    inputs: list[ModalityInput] = [
        # Allowed text
        {"modality": "text", "content": f"Summarize this document: {prompt[:40]}", "metadata": {}},
        # Blocked text (PII)
        {"modality": "text", "content": "My SSN is 123-45-6789 and my credit card is 4111...", "metadata": {}},
        # Allowed image
        {"modality": "image", "content": "product screenshot", "metadata": {"tags": ["ui", "screenshot"], "dimensions": {"width": 1280, "height": 800}}},
        # Blocked image (NSFW)
        {"modality": "image", "content": "uploaded photo", "metadata": {"tags": ["nsfw", "adult_content"]}},
        # Allowed audio
        {"modality": "audio", "content": "customer support call recording", "metadata": {"duration_s": 120, "classifier_labels": ["question", "support"]}},
        # Blocked audio (policy violation)
        {"modality": "audio", "content": "uploaded audio clip", "metadata": {"duration_s": 45, "classifier_labels": ["hate_speech", "threat"]}},
    ]

    results = [apply_guardrail(inp) for inp in inputs]

    state: GuardrailsState = {"inputs": inputs, "results": results}
    return "plain Python per-modality policy functions", state


def render_result(runtime: str, state: GuardrailsState) -> str:
    lines = [
        "Pattern: Multimodal Guardrails",
        f"Runtime: {runtime}",
        "Mechanic: per-modality policy function; violations block input before agent sees it",
        "",
        "Guardrail results:",
    ]
    for result in state["results"]:
        status = "ALLOW" if result["allowed"] else "BLOCK"
        lines.append(
            f"  [{status}] [{result['modality']:5}] {result['content_preview']!r} "
            f"| {result['policy']} -> {result['reason']}"
        )
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, GuardrailsState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["apply_guardrail", "text_policy", "image_policy", "audio_policy", "run_plain_python", "render_result", "run"]
