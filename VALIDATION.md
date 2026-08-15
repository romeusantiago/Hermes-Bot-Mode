# Validação — STARK Bots `2026.08-pilot.7`

Data operacional: 2026-08-15.

## Resultado

O build `2026.08-pilot.7` está instalado e carregado no Windows `desktop`.

Jarvis usa o avatar futurista v1. Os 13 especialistas mantêm a coleção humana de mitologia raiz v4.

O plugin permanece estritamente `visual-only`.

## Build atual

- Build: `2026.08-pilot.7`.
- SHA-256: `e0807985e1e30fd2d247b263a6d4579edc181389431d7ce901253ca07db28b35`.
- Tamanho: 109.317 bytes.
- Modo: `visual-only`.
- Sintaxe: `node --check plugin.js` passou.
- Testes: 13 passaram e 0 falharam.

## Sistema visual

### Jarvis

- Perfil técnico: `default`.
- Nome: `Jarvis`.
- Papel: único orquestrador principal.
- Estilo: humano, fotorrealista, futurista e não mitológico.
- Asset: `/root/.hermes/assets/avatar.png`.
- Dimensão: 768 × 768.
- SHA-256: `36432d902e4b2eac478b6281212c5bd8e361b7edf88d01eeb4f7ac8730ef0055`.
- Revisão: `36432d902e4b2eac`.
- Backup anterior: `/root/.hermes/backups/avatar-jarvis-futuristic-20260815T074044Z`.

### Especialistas

- Conjunto: `STARK Mythic Root Human Agents v4`.
- Perfis: 13.
- IDs técnicos: preservados.
- Formato ativo: PNG.
- Dimensão: 768 × 768.

## Segurança comportamental

Os testes cobrem:

1. perfil sem histórico;
2. perfil com histórico;
3. pin válido;
4. pin obsoleto;
5. bloqueio de `prompt.submit`;
6. registro somente do painel visual;
7. roster com Jarvis e 13 especialistas;
8. invalidação de cache por `avatar_revision`;
9. seleção direta limitada.

O clique não cria trabalho, não envia prompt e não atualiza metadados de perfil.

## Windows `desktop`

- Plugin: `C:\Users\romeu\AppData\Local\Hermes\desktop-plugins\hermes-bots\plugin.js`.
- Hash instalado: `e0807985e1e30fd2d247b263a6d4579edc181389431d7ce901253ca07db28b35`.
- Hash anterior: `d36793e693ecc8da4ce7364424b48e19426d932bd29182d1464f299e5a56b9b7`.
- Rollback: cópia com o hash anterior no nome.
- Processos Hermes após restart: 5.
- Marcador `pilot.7`: encontrado no storage Chromium.
- Revisão `36432d902e4b2eac`: encontrada no storage Chromium.
- Arquivos de storage examinados: 17.
- Tarefa temporária após validação: ausente.
- Scripts temporários após validação: 0.

## Gateway

- `hermes-gateway.service`: ativo.
- `hermes profile list`: exit code 0.
- Especialistas listados: 13 de 13.
- O Desktop recebeu a nova revisão sem reinício do Gateway.

## Instalador macOS

O instalador foi executado 2 vezes em `HERMES_HOME=/tmp/hermes-macos-pilot7-test`.

As 2 execuções terminaram com exit code 0.

O hash instalado coincidiu com o `pilot.7`.

Não houve validação em um Mac real.

## Rollback

- Avatar anterior do Jarvis: backup pré-instalação com checksums.
- Plugin anterior: `plugin.js.rollback-d36793e693ecc8da4ce7364424b48e19426d932bd29182d1464f299e5a56b9b7`.
- Especialistas v4: permaneceram inalterados.
