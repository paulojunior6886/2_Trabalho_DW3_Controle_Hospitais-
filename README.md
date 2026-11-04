# 2º Trabalho DW3 - Sistema ERP para controle de hospitais

## Membros
- Paulo Junior Walbueno dos Santos
- Bruno de Morais Euzébio
- Leonardo Teixeira Silva

Base didática adaptada da arquitetura que o grupo utilizou no CoopFinance. Duas tabelas relacionadas em 1:N (médicos e consultas), 5 APIs JWT para cada uma, frontend Express + Nunjucks + template Mazer, Postgres, pgAdmin, quatro serviços Docker Compose.

## Primeira execução

1. `Copy-Item .env.example .env` no PowerShell, ou `cp .env.example .env` no WSL.
2. Troque DB_PASSWORD, PGADMIN_DEFAULT_PASSWORD e JWT_SECRET no .env; nunca subir .env ao Git.
3. `npm install --package-lock-only` uma única vez para gerar package-lock.json (já vem gerado neste kit).
4. `docker compose up -d --build`
5. `docker compose ps` - confirmar 4 serviços iniciados.
6. Acesse `http://localhost:40100/login`; login didático `user1` / `1234`.
7. pgAdmin: `http://localhost:8081`. Conexão: host `postgres`, porta `5432`, database `hospitalerp`, usuário conforme `.env`.
8. No VS Code, extensão REST Client: rode `backend/test/testHospital.rest` em sequência. IDs dependem dos registros existentes.

## Fluxo de trabalho Git

Primeiro clone: `git clone https://github.com/paulojunior6886/2_Trabalho_DW3_Controle_Hospitais-.git`

Antes de começar: `git status`, `git fetch origin`, `git switch main`, `git pull --ff-only origin main`, depois `git switch -c feat/medicos` ou outra branch pessoal.

Para atualizar sua branch com o main: `git fetch origin` e `git merge origin/main`, resolvendo conflitos conscientemente.

Entrega: `git status`, `git add backend/medicos frontend/apps/medicos frontend/view/medicos.njk frontend/view/medicoForm.njk`, `git commit -m "feat: implementar medicos"`, `git push -u origin feat/medicos`, abrir PR no GitHub para main. Nunca adicionar .env, node_modules ou ZIP de backup.

## Comandos de Docker

- Iniciar: `docker compose up -d --build`
- Conferir: `docker compose ps`
- Logs: `docker compose logs -f backend`
- Pausar: `docker compose stop`
- Reativar: `docker compose start`
- Desligar sem perder dados: `docker compose down`
- **NÃO** usar `docker compose down -v` para pausar: remove volumes e perde dados.

## Arquivos importantes

- `backend/databaseConfig.sql`: criação das tabelas e usuário de teste. Rodado automaticamente somente com volume PostgreSQL novo.
- `backend/database/databaseConfig.js`: acesso ao banco pelo `pg`.
- `backend/routes/router.js`: dez APIs CRUD e login, protegidas por middleware JWT.
- `backend/medicos/{model,controller}`: SQL e regras do módulo de médicos.
- `backend/consultas/{model,controller}`: SQL, JOIN e regras do módulo de consultas.
- `frontend/app.js`: páginas Nunjucks na porta 40100.
- `frontend/apps/medicos/vwMedicos.js`: cinco funções de API de médicos, tabela e formulários.
- `frontend/apps/consultas/vwConsultas.js`: cinco funções de API de consultas, tabela e formulários.
- `frontend/public/js/auth.js`: token local e cliente de API; não substitui JWT do backend.
- `Dockerfile.backend`, `Dockerfile.frontend`, `docker-compose.yml`: contêineres do trabalho.


