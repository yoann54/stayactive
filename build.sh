#!/usr/bin/env bash
# Build the Chrome Web Store package: stayactive-<version>.zip
set -euo pipefail
cd "$(dirname "$0")"

version=$(python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
out="stayactive-${version}.zip"

rm -f "$out"
zip -qrX "$out" manifest.json background.js content.js inject.js \
  popup.html popup.css popup.js _locales icons LICENSE
echo "$out"
