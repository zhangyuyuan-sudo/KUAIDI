#!/bin/sh
set -eu

cat >/app/dist/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-https://exp-service-backend.runnto.com/api}"
}
EOF

exec serve -s dist -l "${PORT:-5173}"
