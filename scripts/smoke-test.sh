#!/usr/bin/env bash
# Production smoke test for the portfolio API. Never prints tokens or passwords.
#
#   API_ORIGIN=https://<service>.onrender.com \
#   ADMIN_ID=... ADMIN_PASSWORD=... \
#   [OLD_TOKEN=...]     # the retired static token: must now return 401
#   [JWT_SECRET=...]    # enables the expired-token check (never commit it)
#   [FRONTEND_ORIGIN=https://<site>.vercel.app]   # enables the CORS checks
#   ./scripts/smoke-test.sh
#
# Writes: one "[smoke-test]" project and one feedback row; both are deleted and the
# row counts are compared before/after. Uses 1 of the 5 hourly feedback submissions.
set -u
: "${API_ORIGIN:?set API_ORIGIN}" "${ADMIN_ID:?set ADMIN_ID}" "${ADMIN_PASSWORD:?set ADMIN_PASSWORD}"
API="${API_ORIGIN%/}/api"; B="${API_ORIGIN%/}"
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); printf '  PASS  %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  FAIL  %s\n' "$1"; }
expect() { # name expected actual
  if [ "$2" = "$3" ]; then ok "$1 (-> $3)"; else bad "$1 (expected $2, got $3)"; fi
}
code() { curl -s -o /dev/null -m 90 -w '%{http_code}' "$@"; }
json() { curl -s -m 90 "$@"; }
J='Content-Type: application/json'
count() { json "$API/$1" | node -pe "JSON.parse(require('fs').readFileSync(0)).length"; }

echo "== Backend health"
expect "GET /livez" 200 "$(code "$B/livez")"
# Neon auto-suspends; the first probe after idle can report "degraded" (3 s DB timeout)
# while the database wakes. Retry before judging.
HC=000
for i in 1 2 3; do
  HC=$(code "$B/health"); [ "$HC" = 200 ] && break; sleep 4
done
expect "GET /health (db up, after up to 3 tries)" 200 "$HC"
json "$B/health" | grep -q '"db":"up"' && ok "health reports db up" || bad "health does not report db up"

echo "== Public API"
declare -A BEFORE
for r in projects achievements tech-stacks timeline; do
  expect "GET /$r" 200 "$(code "$API/$r")"
  BEFORE[$r]=$(count $r)
  json "$API/$r" | node -e "const a=JSON.parse(require('fs').readFileSync(0));process.exit(Array.isArray(a)?0:1)" && ok "/$r returns an array (${BEFORE[$r]} rows)" || bad "/$r is not an array"
done
CC=$(curl -s -D - -o /dev/null "$API/projects" | tr -d '\r' | grep -i '^cache-control' | cut -d' ' -f2-)
[ -n "$CC" ] && ok "projects Cache-Control present ($CC)" || bad "projects Cache-Control missing"
expect "invalid feedback rejected" 400 "$(code -X POST "$API/feedback" -H "$J" -d '{"rating":9}')"
expect "malformed JSON rejected" 400 "$(code -X POST "$API/feedback" -H "$J" -d '{bad')"
expect "unknown route" 404 "$(code "$API/nope")"

echo "== Authorization: every protected route rejects anonymous callers"
for spec in "POST /projects" "PUT /projects/x" "DELETE /projects/x" "POST /achievements" "PUT /achievements/x" "DELETE /achievements/x" \
            "POST /tech-stacks" "PUT /tech-stacks/x" "DELETE /tech-stacks/x" "POST /timeline" "PUT /timeline/x" "DELETE /timeline/x" \
            "GET /feedback" "DELETE /feedback/x" "GET /auth/me"; do
  set -- $spec; expect "anonymous $1 $2" 401 "$(code -X "$1" "$API$2" -H "$J" -d '{}')"
done

echo "== Authentication"
expect "wrong password" 401 "$(code -X POST "$API/auth/login" -H "$J" -d "{\"id\":\"$ADMIN_ID\",\"password\":\"definitely-wrong\"}")"
expect "wrong id" 401 "$(code -X POST "$API/auth/login" -H "$J" -d "{\"id\":\"nobody\",\"password\":\"$ADMIN_PASSWORD\"}")"
expect "malformed JWT" 401 "$(code "$API/auth/me" -H 'Authorization: Bearer not.a.jwt')"
NONE=$(node -e "const b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');console.log(b({alg:'none',typ:'JWT'})+'.'+b({role:'admin',exp:9999999999})+'.')")
expect "alg:none JWT" 401 "$(code "$API/auth/me" -H "Authorization: Bearer $NONE")"
WRONG=$(node -e "const c=require('crypto'),b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'})+'.'+b({role:'admin',exp:9999999999});console.log(h+'.'+c.createHmac('sha256','wrong-secret-wrong-secret-wrong-secret').update(h).digest('base64url'))")
expect "wrong-secret JWT" 401 "$(code "$API/auth/me" -H "Authorization: Bearer $WRONG")"
if [ -n "${JWT_SECRET:-}" ]; then
  EXP=$(JWT_SECRET="$JWT_SECRET" node -e "const c=require('crypto'),b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'})+'.'+b({role:'admin',exp:Math.floor(Date.now()/1000)-60});console.log(h+'.'+c.createHmac('sha256',process.env.JWT_SECRET).update(h).digest('base64url'))")
  expect "expired JWT (correct secret)" 401 "$(code "$API/auth/me" -H "Authorization: Bearer $EXP")"
else echo "  SKIP  expired JWT (set JWT_SECRET to enable; also covered by backend unit tests)"; fi
if [ -n "${OLD_TOKEN:-}" ]; then
  for spec in "POST /projects" "PUT /projects/x" "DELETE /projects/x" "GET /feedback"; do
    set -- $spec; expect "OLD token $1 $2" 401 "$(code -X "$1" "$API$2" -H "Authorization: Bearer $OLD_TOKEN" -H "$J" -d '{}')"
  done
else echo "  SKIP  old token check (set OLD_TOKEN)"; fi

TOKEN=$(json -X POST "$API/auth/login" -H "$J" -d "{\"id\":\"$ADMIN_ID\",\"password\":\"$ADMIN_PASSWORD\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token||''" 2>/dev/null)
if [ "${#TOKEN}" -lt 50 ]; then bad "login with the NEW credentials failed (is the login rate limit active? wait 15 min)"; echo "RESULT: $PASS passed, $FAIL failed"; exit 1; fi
ok "login with new credentials issues a token"
A="Authorization: Bearer $TOKEN"
expect "/auth/me with token" 200 "$(code "$API/auth/me" -H "$A")"

echo "== Admin CRUD (temporary records)"
P='{"title":"[smoke-test] project","description":"temporary","techStack":["x"],"tags":["x"],"imageUrl":"/project_images/car_prediction.png","githubUrl":"https://github.com/Satyamkumarjha4","demoUrl":"https://github.com/Satyamkumarjha4","imageOnRight":false,"sortOrder":9999}'
expect "create validation (empty body)" 400 "$(code -X POST "$API/projects" -H "$A" -H "$J" -d '{}')"
ID=$(json -X POST "$API/projects" -H "$A" -H "$J" -d "$P" | node -pe "JSON.parse(require('fs').readFileSync(0)).id||''" 2>/dev/null)
[ -n "$ID" ] && ok "create project" || bad "create project"
json "$API/projects" -H 'Cache-Control: no-cache' | grep -q "$ID" && ok "read: new project is listed" || bad "read: new project not listed"
expect "update" 200 "$(code -X PUT "$API/projects/$ID" -H "$A" -H "$J" -d '{"title":"[smoke-test] updated"}')"
json "$API/projects" -H 'Cache-Control: no-cache' | grep -q 'smoke-test\] updated' && ok "read: update visible" || bad "read: update not visible"
expect "update missing id" 404 "$(code -X PUT "$API/projects/00000000-0000-0000-0000-000000000000" -H "$A" -H "$J" -d '{"title":"x"}')"
expect "delete" 204 "$(code -X DELETE "$API/projects/$ID" -H "$A")"
expect "delete again (missing)" 404 "$(code -X DELETE "$API/projects/$ID" -H "$A")"

echo "== Feedback write path"
FB=$(json -X POST "$API/feedback" -H "$J" -d '{"email":"smoke@example.com","name":"[smoke-test]","rating":5,"remark":"temporary"}')
FID=$(echo "$FB" | node -pe "JSON.parse(require('fs').readFileSync(0)).id||''" 2>/dev/null)
if [ -n "$FID" ]; then ok "create feedback"; expect "admin delete feedback" 204 "$(code -X DELETE "$API/feedback/$FID" -H "$A")"
else bad "create feedback (response: $(echo "$FB" | cut -c1-120))"; fi

echo "== Database returned to original state"
for r in projects achievements tech-stacks timeline; do expect "$r row count unchanged" "${BEFORE[$r]}" "$(count $r)"; done

if [ -n "${FRONTEND_ORIGIN:-}" ]; then
  echo "== CORS"
  allowed=$(curl -s -D - -o /dev/null "$API/projects" -H "Origin: ${FRONTEND_ORIGIN%/}" | tr -d '\r' | grep -i '^access-control-allow-origin' | cut -d' ' -f2)
  expect "frontend origin allowed" "${FRONTEND_ORIGIN%/}" "$allowed"
  evil=$(curl -s -D - -o /dev/null "$API/projects" -H "Origin: https://evil.example" | tr -d '\r' | grep -ic '^access-control-allow-origin')
  expect "foreign origin gets no CORS header" 0 "$evil"
fi

echo; echo "RESULT: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
