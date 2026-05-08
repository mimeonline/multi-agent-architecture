from __future__ import annotations

from collections.abc import Iterable
from .config import ModelConfig, pick_model_config


class OfflineModel:
    """Tiny deterministic model-like helper for fallback paths."""

    def invoke_text(self, prompt: str) -> str:
        first_line = prompt.strip().splitlines()[0] if prompt.strip() else "No prompt"
        return f"[offline response] {first_line[:160]}"


def init_langchain_model(config: ModelConfig | None = None):
    config = config or pick_model_config()
    if not config.online or not config.model:
        return OfflineModel()

    if config.provider == "github":
        try:
            from langchain_openai import ChatOpenAI
        except ImportError as exc:
            raise RuntimeError(
                "langchain-openai is not installed. Run `pip install -r requirements.txt` from the code directory."
            ) from exc

        import os

        from pydantic import SecretStr

        github_token = os.getenv("GITHUB_TOKEN")
        return ChatOpenAI(
            model=config.model,
            api_key=SecretStr(github_token) if github_token else None,
            base_url=os.getenv("GITHUB_MODELS_BASE_URL", "https://models.github.ai/inference"),
            temperature=config.temperature,
        )

    try:
        from langchain.chat_models import init_chat_model
    except ImportError as exc:
        raise RuntimeError(
            "LangChain is not installed. Run `pip install -e .` from the code directory."
        ) from exc

    return init_chat_model(model=config.model, temperature=config.temperature)


def is_offline_model(model: object) -> bool:
    return isinstance(model, OfflineModel)


def last_message_text(result: object) -> str:
    if isinstance(result, dict) and result.get("messages"):
        message = result["messages"][-1]
        return getattr(message, "content", str(message))
    return str(result)


def invoke_model_text(model: object, messages: list[dict[str, str]]) -> str:
    """Invoke any LangChain chat model and normalize the text response."""
    response = model.invoke(messages)  # type: ignore[attr-defined]
    content = getattr(response, "content", response)
    if isinstance(content, list):
        return " ".join(str(part) for part in content)
    return str(content)


def provider_error(config: ModelConfig, exc: BaseException) -> str:
    return f"{config.provider}: {exc.__class__.__name__}: {exc}"


def bullet_list(items: Iterable[str]) -> str:
    return "\n".join(f"- {item}" for item in items)
