#!/bin/sh
set -eu

BUILD_VERSION="${APP_BUILD_VERSION:-$(date -u +%Y%m%d%H%M%S)}"
API_BASE_URL="${VITE_API_BASE_URL:-https://exp-service-backend.runnto.com/api}"

sed -i "s/__APP_BUILD_VERSION__/${BUILD_VERSION}/g" /app/dist/index.html

cat >/app/dist/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  APP_BUILD_VERSION: "${BUILD_VERSION}",
  VITE_API_BASE_URL: "${API_BASE_URL}"
}
EOF

echo "Frontend runtime config: APP_BUILD_VERSION=${BUILD_VERSION}, VITE_API_BASE_URL=${API_BASE_URL}"

exec serve -s dist -l "${PORT:-5173}"
