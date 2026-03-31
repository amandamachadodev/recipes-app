import json
import os
from typing import Any

import httpx
from openai import OpenAI

SYSTEM_PROMPT = (
    "Voce e um assistente culinario. Gere uma receita em JSON, sem texto extra. "
    "Formato exato:\n"
    "{\n"
    '  "titulo": "string",\n'
    '  "porcoes": "string",\n'
    '  "tempo_preparo": "string",\n'
    '  "ingredientes": ["string", "..."],\n'
    '  "passos": ["string", "..."]\n'
    "}\n"
    "Responda apenas com JSON valido."
)


def normalize_description(value: Any) -> str:
    description = str(value or "").strip()
    if not description:
        raise ValueError("Descricao e obrigatoria")
    return description


def get_api_key() -> str:
    api_key = (os.getenv("OPENAI_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY nao configurada")
    return api_key


def create_openai_client() -> OpenAI:
    http_client = httpx.Client(http2=False, timeout=30)
    return OpenAI(api_key=get_api_key(), http_client=http_client)


def parse_recipe_json(raw_content: str) -> dict[str, Any]:
    parsed = json.loads(raw_content)
    required_keys = {"titulo", "porcoes", "tempo_preparo", "ingredientes", "passos"}
    if not required_keys.issubset(parsed.keys()):
        raise ValueError("Resposta da IA sem campos obrigatorios")
    return parsed


def generate_recipe(description: str) -> dict[str, Any]:
    normalized_description = normalize_description(description)
    client = create_openai_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Descricao: {normalized_description}"},
        ],
        temperature=0.7,
    )
    content = (response.choices[0].message.content or "").strip()
    return parse_recipe_json(content)
