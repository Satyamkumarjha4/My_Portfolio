#!/usr/bin/env bash
# Measures Render cold vs warm latency. Run it ONLY after the API has been idle for
# 20+ minutes (and with the keep-warm workflow disabled, or it will never be cold).
#   API_ORIGIN=https://<service>.onrender.com ./scripts/cold-warm.sh
set -u
: "${API_ORIGIN:?set API_ORIGIN}"
fmt='ttfb=%{time_starttransfer}s total=%{time_total}s status=%{http_code}'
echo "started $(date -u +%T) UTC"
echo "COLD  /api/projects : $(curl -s -o /dev/null -m 180 -w "$fmt" "${API_ORIGIN%/}/api/projects")"
for i in 1 2 3 4 5; do echo "warm$i /api/projects : $(curl -s -o /dev/null -m 60 -w "$fmt" "${API_ORIGIN%/}/api/projects")"; done
for i in 1 2 3; do echo "warm$i /livez        : $(curl -s -o /dev/null -m 60 -w "$fmt" "${API_ORIGIN%/}/livez")"; done
