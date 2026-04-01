# Recipes App

Aplicação full‑stack para gerar receitas a partir de uma descrição do usuário.
Frontend em Angular, backend em Django, integração com OpenAI. Foco em boas práticas,
arquitetura em camadas e UX com fluxo completo de preparo de receita.


## Demo (screens)

- Geração e visualização de receita (detalhe de ingredientes e modo de preparo)
- Iniciar receita → tela de preparo com checklist e progresso
- Listas de “Em preparo” e “Concluídas”

<img src="https://github.com/amandamachadodev/recipes-app/issues/1#issue-4183364743"
       width="720"
       ></img>

## Principais features

- Geração de receita via OpenAI e retorno estruturado em JSON
- Tela de preparo com:
  - checklist de passos (risca quando marcado)
  - cálculo de progresso em tempo real
  - botão “Concluir receita”
- Navegação por seções: Início, Iniciadas, Concluídas
- Persistência local de receitas e estados (LocalStorage)
- Tratamento de erros/timeout de chamada à API
- Formatação de código padronizada (Prettier no frontend; Black/isort no backend)


## Arquitetura (visão geral)

### Frontend (`recipes-frontend`)
- Angular (standalone components, router)
- `HomeComponent`: gera e exibe a última receita gerada; ação “Iniciar receita”
- `RecipeInProgressComponent`: preparo com checklist e barra de progresso
- `StartedRecipesComponent`: cards de receitas em preparo
- `FinishedRecipesComponent`: cards de receitas concluídas (com “iniciar novamente”)
- `SendDescriptionRecipeService`: comunicação HTTP com backend
- `RecipeStorageService`: estado/persistência local de receitas

### Backend (`django-backend`)
- `view.py`: endpoint HTTP; validação e mapeamento de resposta
- `recipe_service.py`: regras de negócio + chamada à OpenAI (chat.completions)


## Requisitos

- Node.js 18+
- Python 3.11+
- Variável `OPENAI_API_KEY`


## Como rodar localmente

### 1) Backend

```bash
cd django-backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install django python-dotenv openai httpx django-cors-headers
```

Crie `.env` em `django-backend`:

```env
OPENAI_API_KEY=coloque_sua_chave_aqui
```

Inicie:

```bash
python manage.py runserver
```

### 2) Frontend

```bash
cd recipes-frontend
npm install
npm start
```

Acesse `http://localhost:4200`.


## API (contrato atual)

### `POST /api/recipes/generate/`

Request:

```json
{
  "description": "strogonoff de frango com arroz"
}
```

Response:

```json
{
  "recipe": {
    "title": "Strogonoff de frango",
    "portions": "4 porções",
    "preparationTime": "40 minutos",
    "ingredients": ["..."],
    "steps": ["..."]
  }
}
```


## Decisões técnicas

- Conversão e validação do retorno da OpenAI garantem JSON com chaves previsíveis
- Estado de receita: `new` | `in_progress` | `completed`
- Progresso baseado em `stepsCompleted.length / steps.length`
- UI com componentes pequenos, rotas claras e estilos consistentes


## Qualidade & DX

- Formatação: Prettier (frontend), Black/isort (backend)
- Arquivo `.editorconfig` para padronizar indentação e EOLs
- Tratamento de erros e mensagens amigáveis no frontend

Scripts úteis (frontend):

```bash
npm run format        # formata tudo em src/
npm run format:check  # checagem sem alterar código
```


## Roadmap

- Testes unitários (services e componentes críticos)
- Mock de backend para desenvolvimento offline
- Docker Compose para subir frontend+backend com um comando
- Acessibilidade e dark mode
