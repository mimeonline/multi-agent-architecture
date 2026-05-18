# Notebooks

Jupyter-Lernpfade für alle Pattern-Demos und Reference Architectures.

- `patterns/`: ein Notebook pro CLI-Demo. Jedes Notebook installiert das Python-Package in Colab und ruft die jeweilige `agent-patterns` Demo auf.
- `reference-architectures/`: ein Notebook pro Reference Architecture als Arbeitsblatt für eigene Systementwürfe.

Die ausführbare Wahrheit bleibt im Python-Package unter `code/src/ai_agent_patterns`. Die Notebooks sind didaktische Einstiege und duplizieren keine Demo-Implementierung.

## Modellzugang in Colab

GitHub oder Colab stellen keinen Model-Token automatisch bereit. Wer die Notebooks mit echten Modellantworten ausführen möchte, muss im Notebook einen eigenen Provider-Key setzen. Ohne Key laufen die Demos im erklärenden Offline-Modus.

Für Nutzer mit GitHub Account ist GitHub Models der einfachste Einstieg, weil der Endpoint OpenAI-kompatibel ist:

```python
import getpass
import os

os.environ["AGENT_PROVIDER"] = "github"
os.environ["GITHUB_TOKEN"] = getpass.getpass("GitHub Token mit Models-Zugriff: ")
os.environ["GITHUB_MODEL"] = "openai/gpt-4.1-mini"
```

Der Token braucht Zugriff auf GitHub Models, in der Regel `models:read`. Alternativ können OpenAI, Anthropic oder OpenRouter über die entsprechenden Umgebungsvariablen aus `code/.env.example` genutzt werden.
