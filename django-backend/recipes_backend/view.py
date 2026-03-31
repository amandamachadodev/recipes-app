import json
import logging

import httpx
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .recipe_service import generate_recipe

logger = logging.getLogger(__name__)

@csrf_exempt
def gerar_receita(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body or "{}")
        recipe = generate_recipe(data.get("descricao"))
        return JsonResponse({"receita": recipe}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"erro": "JSON inválido"}, status=400)
    except ValueError as err:
        return JsonResponse({"erro": str(err)}, status=400)
    except httpx.HTTPError:
        logger.exception("Falha de rede ao chamar OpenAI")
        return JsonResponse({"erro": "Falha de conexao com a IA"}, status=502)
    except Exception as e:
        logger.exception("Erro inesperado em gerar_receita")
        return JsonResponse({"erro": "Falha ao gerar receita", "detalhe": str(e)}, status=500)