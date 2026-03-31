# Recipes App

Aplicacao full stack para gerar receitas a partir de uma descricao do usuario, usando Angular no frontend e Django no backend com integracao OpenAI.

## Objetivo

Este projeto foi construido para praticar arquitetura limpa, boas praticas de separacao de responsabilidades e experiencia de usuario.

Fluxo principal:
- usuario descreve o prato desejado;
- frontend envia a descricao para o backend;
- backend chama a OpenAI e retorna uma receita estruturada em JSON;
- frontend exibe checklist de ingredientes e preparo, e salva a ultima receita no localStorage.

## Arquitetura

### Frontend (`recipes-frontend`)
- Angular (standalone components)
- `HomeComponent`: UI e orquestracao de estado da tela
- `SendDescriptionRecipeService`: comunicacao HTTP com backend
- `RecipeStorageService`: persistencia local (localStorage)

### Backend (`django-backend`)
- Django
- `view.py`: camada HTTP (entrada/saida e codigos de status)
- `recipe_service.py`: regras de negocio e integracao com OpenAI

## Tecnologias

- Angular
- TypeScript
- Django
- Python
- OpenAI API

## Requisitos

- Node.js 18+
- Python 3.11+ (ou compativel com suas libs instaladas)
- Chave da OpenAI

## Como rodar localmente

### 1) Backend

```bash
cd django-backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install django python-dotenv openai httpx django-cors-headers
```

Crie um arquivo `.env` em `django-backend`:

```env
OPENAI_API_KEY=sua_chave_aqui
```

Suba o servidor:

```bash
python manage.py runserver
```

### 2) Frontend

```bash
cd recipes-frontend
npm install
npm start
```

Acesse: `http://localhost:4200`

## API

### `POST /api/receitas/gerar/`

Request:

```json
{
  "descricao": "strogonoff de frango com arroz"
}
```

Response:

```json
{
  "receita": {
    "titulo": "Strogonoff de frango",
    "porcoes": "4 porcoes",
    "tempo_preparo": "40 minutos",
    "ingredientes": ["..."],
    "passos": ["..."]
  }
}
```

## Boas praticas aplicadas

- Separacao de responsabilidades (UI, API, armazenamento local, dominio)
- Tipagem explicita no frontend
- Tratamento de erros e timeout para evitar loading infinito
- Persistencia local da ultima receita
- Estrutura preparada para evolucao (testes e novas features)

## Proximos passos sugeridos

- Adicionar testes unitarios no frontend e backend
- Adicionar logs estruturados no backend
- Criar pagina de historico de receitas
- Melhorar acessibilidade e responsividade
