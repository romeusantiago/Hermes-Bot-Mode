# Validação — STARK Bots Pilot

Data: 2026-08-15

## Resultado

O build `2026.08-pilot.6` está instalado e carregado no Windows `desktop`.

Os 13 avatares humanos de mitologia raiz estão ativos no Gateway.

Jarvis permanece com nome, perfil e identidade visual próprios.

## Build atual

- Build: `2026.08-pilot.6`.
- SHA-256: `d36793e693ecc8da4ce7364424b48e19426d932bd29182d1464f299e5a56b9b7`.
- Tamanho: 109.317 bytes.
- Modo: `visual-only`.
- Testes: 13 passaram e 0 falharam.
- Sintaxe: `node --check plugin.js` passou.

## Coleção visual

- Conjunto: `STARK Mythic Root Human Agents v4`.
- Especialistas: 13.
- Formato ativo: PNG.
- Dimensão: 768 × 768.
- Menor arquivo: 357.145 bytes.
- Maior arquivo: 634.195 bytes.
- Total ativo: 6.271.272 bytes.
- Jarvis alterado: não.
- Manifesto: `/root/.hermes/persona-system/avatars-manifest.json`.
- Rollback: `/root/.hermes/backups/avatar-mythic-root-20260815T050752Z`.

Cada `avatar_revision` usa os 16 primeiros caracteres do SHA-256 do PNG.

## Proveniência

- Geração base: Pollinations, alias `flux`.
- Modelo mapeado: `black-forest-labs/FLUX.1-schnell`.
- Licença declarada do modelo: `Apache-2.0`.
- Pós-processamento: molduras e sigilos autorais em Pillow.
- Registro: `docs/personas/avatars-mythic-root-v4/PROVENANCE.md`.

Os outputs permanecem sujeitos aos termos do serviço e à legislação aplicável.

## Windows `desktop`

- Plugin: `C:\Users\romeu\AppData\Local\Hermes\desktop-plugins\hermes-bots\plugin.js`.
- Hash instalado: `d36793e693ecc8da4ce7364424b48e19426d932bd29182d1464f299e5a56b9b7`.
- Hash anterior: `3b4022f3a0b3b4cedcf642da5856d1af5fed39dbfde8e10f8071c89c15c6e3e5`.
- Rollback do plugin: cópia com o hash anterior no nome.
- Processos Hermes após restart: 5.
- Marcador `pilot.6` no storage: encontrado.
- Revisões novas no cache: 13 de 13.
- Tarefa temporária após validação: ausente.
- Scripts temporários após validação: 0.

O restart ocorreu pela sessão interativa `ROMEU-PC\romeu`.

## Runtime VPS

- `hermes-gateway.service`: ativo.
- Perfis totais: 14.
- Especialistas com avatar: 13 de 13.
- Cópias verificadas por avatar: ativo, backup e pacote privado.
- Cópias idênticas: 39 de 39.

## Instalador macOS

O instalador foi executado duas vezes em `HERMES_HOME` temporário.

As duas execuções terminaram com exit code 0.

O hash instalado coincidiu com o `pilot.6`.

Não houve validação em um Mac real.

## Segurança do piloto

Superfícies bloqueadas:

- criação e duplicação de perfis;
- edição avançada de perfil;
- rotinas e `cronjobs`;
- middleware de `@mentions`;
- orquestração lateral;
- `prompt.submit` ao selecionar um bot.

Superfícies preservadas:

- roster visual;
- navegação entre perfis;
- chat persistente;
- títulos e avatares;
- identidade visual dos 14 perfis.

## Testes

- `node --check plugin.js`: passou.
- `node --test tests/*.test.mjs`: 13 passaram.
- Testes falhos: 0.
- Teste de cache: revisão alterada força download.
- Seleção passiva: rascunho, histórico, pin válido e pin obsoleto.
- Clique que envia prompt: 0 nos cenários testados.

## Limitação

O Windows OpenSSH não acessa a sessão gráfica para screenshot.

A porta CDP `9222` permanece fechada.

A prova visual final usa a prancha aprovada por Romeu.

As 13 revisões persistem somente após cada download terminar com sucesso.

## Próxima validação

Validar o build em um Mac real quando o equipamento ficar disponível.

Reexecutar os gates antes de qualquer mudança futura no piloto.
