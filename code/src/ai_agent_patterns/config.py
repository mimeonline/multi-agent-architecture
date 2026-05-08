from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

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
        package_env = Path(__file__).resolve().parents[2] / ".env"
        load_dotenv(package_env, override=False)


def normalize_provider(provider: str) -> str:
    aliases = {
        "gh": "github",
        "github-models": "github",
        "github_models": "github",
    }
    return aliases.get(provider, provider)


def pick_model_config() -> ModelConfig:
    load_environment()
    provider = normalize_provider(os.getenv("AGENT_PROVIDER", "auto").strip().lower())
    temperature = float(os.getenv("AGENT_TEMPERATURE", "0") or "0")

    candidates = [
        ("openai", "OPENAI_API_KEY", "AGENT_MODEL_OPENAI", "openai:gpt-4.1-mini"),
        ("anthropic", "ANTHROPIC_API_KEY", "AGENT_MODEL_ANTHROPIC", "anthropic:claude-3-5-haiku-latest"),
        ("openrouter", "OPENROUTER_API_KEY", "AGENT_MODEL_OPENROUTER", "openrouter:openai/gpt-4o-mini"),
        ("github", "GITHUB_TOKEN", "GITHUB_MODEL", "openai/gpt-4.1-mini"),
        ("ollama", "OLLAMA_BASE_URL", "AGENT_MODEL_OLLAMA", "ollama:llama3.1"),
    ]

    if provider == "offline":
        return ModelConfig("offline", None, False, "AGENT_PROVIDER=offline", temperature)

    for name, required_env, model_env, default_model in candidates:
        if provider not in ("auto", name):
            continue
        if os.getenv(required_env):
            model = os.getenv(model_env) or default_model
            if name == "github":
                model = os.getenv("GITHUB_MODEL") or os.getenv("AGENT_MODEL_GITHUB") or default_model
            return ModelConfig(
                provider=name,
                model=model,
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

    required_env_by_provider = {name: required_env for name, required_env, _, _ in candidates}
    if provider in required_env_by_provider:
        return ModelConfig(
            provider="offline",
            model=None,
            online=False,
            reason=f"AGENT_PROVIDER={provider} requires {required_env_by_provider[provider]}",
            temperature=temperature,
        )

    return ModelConfig(
        provider="offline",
        model=None,
        online=False,
        reason="no provider API key or Ollama provider selected",
        temperature=temperature,
    )
