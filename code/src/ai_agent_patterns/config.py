from __future__ import annotations

import os
from dataclasses import dataclass

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - only hit before dependencies are installed
    load_dotenv = None


@dataclass(frozen=True)
class ModelConfig:
    provider: str
    model: str | None
    online: bool
    reason: str
    temperature: float = 0.0


def load_environment() -> None:
    if load_dotenv is not None:
        load_dotenv()


def pick_model_config() -> ModelConfig:
    load_environment()
    provider = os.getenv("AGENT_PROVIDER", "auto").strip().lower()
    temperature = float(os.getenv("AGENT_TEMPERATURE", "0") or "0")

    candidates = [
        ("openai", "OPENAI_API_KEY", "AGENT_MODEL_OPENAI", "openai:gpt-4.1-mini"),
        ("anthropic", "ANTHROPIC_API_KEY", "AGENT_MODEL_ANTHROPIC", "anthropic:claude-3-5-haiku-latest"),
        ("openrouter", "OPENROUTER_API_KEY", "AGENT_MODEL_OPENROUTER", "openrouter:openai/gpt-4o-mini"),
        ("ollama", "OLLAMA_BASE_URL", "AGENT_MODEL_OLLAMA", "ollama:llama3.1"),
    ]

    if provider == "offline":
        return ModelConfig("offline", None, False, "AGENT_PROVIDER=offline", temperature)

    for name, required_env, model_env, default_model in candidates:
        if provider not in ("auto", name):
            continue
        if os.getenv(required_env):
            return ModelConfig(
                provider=name,
                model=os.getenv(model_env, default_model),
                online=True,
                reason=f"using {name} because {required_env} is set",
                temperature=temperature,
            )

    if provider == "ollama":
        return ModelConfig(
            provider="ollama",
            model=os.getenv("AGENT_MODEL_OLLAMA", "ollama:llama3.1"),
            online=True,
            reason="using Ollama provider from AGENT_PROVIDER=ollama",
            temperature=temperature,
        )

    return ModelConfig(
        provider="offline",
        model=None,
        online=False,
        reason="no provider API key or Ollama provider selected",
        temperature=temperature,
    )
