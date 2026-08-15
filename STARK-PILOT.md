# Hermes Bot Mode — Piloto STARK

## Escopo

Esta variante transforma os perfis Hermes em um roster visual no Desktop.
Ela preserva navegação, chat persistente, títulos e avatares.
Selecionar um bot apenas abre uma sessão existente ou um rascunho vazio.
O clique nunca envia prompt, mensagem ou ação ao perfil.

O build `2026.08-pilot.7` apresenta Jarvis futurista e 13 especialistas mitológicos humanizados.

Os codinomes pertencem às tradições grega, egípcia e nórdica.

Cada nome reflete a personalidade e a função técnica do perfil.

Os 13 especialistas usam retratos humanos fotorrealistas no asset store dos perfis.

Uma revisão de avatar força o Desktop a substituir caches visuais antigos.

## Bloqueios ativos

- criação de agentes;
- duplicação de perfis;
- edição de descrição, modelo, skills, toolsets e `SOUL.md`;
- painel e criação de `cronjobs`;
- middleware de `@mentions`;
- mensagens laterais entre especialistas.

Jarvis/default permanece como único orquestrador principal.

## Proveniência

- Upstream: `https://github.com/NousResearch/Hermes-Bot-Mode`
- Fork STARK: `https://github.com/romeusantiago/Hermes-Bot-Mode`
- Snapshot: `ea9e559380549883ae6f53a0cf102f59a39712de`
- Fix de shell quoting: `bb50741ff0e860671ad37106ab064dbd558f96c2`
- Remoção do teste obsoleto: `c19ad7b065ff64753ba8806dbbd9eef58922238c`

## Instalação

O arquivo `plugin.js` pertence ao computador que executa o Hermes Desktop:

`C:\Users\romeu\AppData\Local\Hermes\desktop-plugins\hermes-bots\plugin.js`

O plugin não deve ser instalado como plugin de backend no VPS.

### macOS

O Hermes Desktop usa este caminho local:

`~/.hermes/desktop-plugins/hermes-bots/plugin.js`

No diretório do pacote validado, execute:

```bash
bash install-macos.sh
```

O instalador verifica o SHA-256, preserva qualquer plugin anterior e permite hot-reload.

## Validação

```text
node --check plugin.js
node --test tests/*.test.mjs
```

O teste de sistema exige somente o registro `pane`.
Dois testes de regressão exigem zero envio para perfis com e sem histórico.

## Rollback

Desative `Bots` em `Settings → Plugins`.
Não remova arquivos sem confirmação do Senhor Stark.
