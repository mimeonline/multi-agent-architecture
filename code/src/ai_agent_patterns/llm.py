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


def bullet_list(items: Iterable[str]) -> str:
    return "\n".join(f"- {item}" for item in items)
