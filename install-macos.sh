#!/usr/bin/env bash
set -euo pipefail

EXPECTED_SHA256="d36793e693ecc8da4ce7364424b48e19426d932bd29182d1464f299e5a56b9b7"
BUNDLE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
SOURCE_PLUGIN="$BUNDLE_DIR/plugin.js"

if [[ -n "${HERMES_HOME:-}" ]]; then
  HERMES_ROOT="$HERMES_HOME"
elif command -v hermes >/dev/null 2>&1; then
  CONFIG_PATH="$(hermes config path 2>/dev/null || true)"
  HERMES_ROOT="${CONFIG_PATH%/config.yaml}"
  [[ -n "$HERMES_ROOT" && "$HERMES_ROOT" != "$CONFIG_PATH" ]] || HERMES_ROOT="$HOME/.hermes"
else
  HERMES_ROOT="$HOME/.hermes"
fi

SOURCE_SHA256="$(shasum -a 256 "$SOURCE_PLUGIN" | awk '{print $1}')"
if [[ "$SOURCE_SHA256" != "$EXPECTED_SHA256" ]]; then
  printf 'ERRO: hash do plugin no pacote não confere.\n' >&2
  exit 1
fi

TARGET_DIR="$HERMES_ROOT/desktop-plugins/hermes-bots"
BACKUP_ROOT="$HERMES_ROOT/stark-pilots/backups"

if [[ -e "$TARGET_DIR/plugin.js" ]]; then
  STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
  BACKUP_DIR="$BACKUP_ROOT/hermes-bots-$STAMP"
  mkdir -p "$BACKUP_DIR"
  cp -p "$TARGET_DIR/plugin.js" "$BACKUP_DIR/plugin.js"
  for file in stark-pilot.json STARK-PILOT.md VALIDATION.md; do
    [[ -f "$TARGET_DIR/$file" ]] && cp -p "$TARGET_DIR/$file" "$BACKUP_DIR/$file"
  done
  printf 'backup=%s\n' "$BACKUP_DIR"
fi

mkdir -p "$TARGET_DIR"
install -m 0644 "$SOURCE_PLUGIN" "$TARGET_DIR/plugin.js"
for file in stark-pilot.json STARK-PILOT.md VALIDATION.md; do
  install -m 0644 "$BUNDLE_DIR/$file" "$TARGET_DIR/$file"
done

INSTALLED_SHA256="$(shasum -a 256 "$TARGET_DIR/plugin.js" | awk '{print $1}')"
if [[ "$INSTALLED_SHA256" != "$EXPECTED_SHA256" ]]; then
  printf 'ERRO: hash instalado não confere.\n' >&2
  exit 1
fi

printf 'status=installed\n'
printf 'build=2026.08-pilot.6\n'
printf 'hermes_home=%s\n' "$HERMES_ROOT"
printf 'plugin=%s\n' "$TARGET_DIR/plugin.js"
printf 'sha256=%s\n' "$INSTALLED_SHA256"
if pgrep -x Hermes >/dev/null 2>&1; then
  printf 'desktop=running-hot-reload-expected\n'
else
  printf 'desktop=not-running-open-hermes-desktop\n'
fi
