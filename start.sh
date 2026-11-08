#!/usr/bin/env bash
# @jimesh/pfp-generator — One-Click Server & Browser Launcher (Linux / macOS / Git Bash)
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4180}"
URL="http://127.0.0.1:${PORT}"

if ! curl -s "${URL}/api/v1/pfp" >/dev/null 2>&1; then
  echo "[PFP-Generator] Starting backend server on ${URL} ..."
  nohup node "${SCRIPT_DIR}/backend/server.js" >/tmp/pfp-generator-server.log 2>&1 &
  SERVER_PID=$!
  echo "[PFP-Generator] Server PID: ${SERVER_PID} (logs: /tmp/pfp-generator-server.log)"
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if curl -s "${URL}/api/v1/pfp" >/dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done
else
  echo "[PFP-Generator] Backend server is already running on ${URL}"
fi

echo "[PFP-Generator] Opening ${URL} in browser..."
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${URL}" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "${URL}"
elif command -v cmd.exe >/dev/null 2>&1; then
  cmd.exe /c start "${URL}"
else
  echo "Open ${URL} in your browser."
fi
