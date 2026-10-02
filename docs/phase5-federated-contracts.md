# Fase 5 — contrato federado do Bot Mode

O Bot Mode mantém o contrato Desktop próprio `hermes-bots.roster.v1`.

A projeção é read-only e allowlisted. Ela não inclui tokens, paths locais, assets brutos, prompts ou payloads operacionais.

A matriz de compatibilidade e os pins dos consumidores ficam em `Jarvis-Hermes/contracts/compatibility-matrix.json`.

Mudança incompatível exige novo major, fixture, teste produtor, teste consumidor e novo pin.
