import json
import logging

import httpx
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .recipe_service import generate_recipe as generate_recipe_service

logger = logging.getLogger(__name__)


@csrf_exempt
def generate_recipe(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body or "{}")
        recipe = generate_recipe_service(data.get("description"))
        return JsonResponse({"recipe": recipe}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except ValueError as err:
        return JsonResponse({"error": str(err)}, status=400)
    except httpx.HTTPError:
        logger.exception("Falha de rede ao chamar OpenAI API")
        return JsonResponse({"error": "Falha de conexão com a OpenAI API"}, status=502)
    except Exception as err:
        logger.exception("Erro inesperado em generate_recipe")
        return JsonResponse(
            {"error": "Falha ao gerar receita", "detalhe": str(err)},
            status=500,
        )

    return JsonResponse({"error": "Erro inesperado de fluxo"}, status=500)