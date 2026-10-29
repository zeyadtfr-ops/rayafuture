#!/bin/bash
# Comprehensive API test suite for the Raya Future CMS
# Run from /home/z/my-project

set -e
BASE="http://localhost:3000"
PW="raya-admin-2026"
PASS=0
FAIL=0
RESULTS=()

test() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    PASS=$((PASS+1))
    RESULTS+=("✅ $name")
  else
    FAIL=$((FAIL+1))
    RESULTS+=("❌ $name (expected: $expected, got: ${actual:0:80})")
  fi
}

echo "═══════════════════════════════════════════════════════════"
echo "  Raya Future CMS — Comprehensive API Test Suite"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ─── 1. Public endpoints ────────────────────────────────────
echo "─── 1. PUBLIC ACCESS ───"

# 1.1 Homepage loads
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
test "Homepage returns 200" "200" "$STATUS"

# 1.2 Public articles list (should be PUBLISHED only)
RESP=$(curl -s "$BASE/api/articles?limit=10")
test "Public API returns JSON" "items" "$RESP"
test "Public API returns 2 published items" '"total":2' "$RESP"

# 1.3 Public cannot see drafts
DRAFT_VISIBLE=$(echo "$RESP" | grep -c "DRAFT" || echo "0")
test "Public API hides DRAFT articles" "0" "$DRAFT_VISIBLE"

# 1.4 Admin page returns 200 (login screen)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/admin")
test "Admin page returns 200" "200" "$STATUS"

# 1.5 Image accessible
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/images/hero-campus.jpg")
test "Hero image accessible" "200" "$STATUS"

echo ""

# ─── 2. Authentication ──────────────────────────────────────
echo "─── 2. AUTHENTICATION ───"

# 2.1 Login with correct password
RESP=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"$PW\"}")
test "Login succeeds with correct password" '"ok":true' "$RESP"

# 2.2 Login with wrong password
RESP=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}')
test "Login fails with wrong password" "Invalid password" "$RESP"

# 2.3 POST article without auth → 401
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/articles" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}')
test "POST article without auth returns 401" "401" "$STATUS"

# 2.4 PUT article without auth → 401
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/articles/fakeid" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}')
test "PUT article without auth returns 401" "401" "$STATUS"

# 2.5 DELETE article without auth → 401
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/articles/fakeid")
test "DELETE article without auth returns 401" "401" "$STATUS"

# 2.6 Import without auth → 401
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/articles/import" \
  -H "Content-Type: application/json" \
  -d '[]')
test "Import without auth returns 401" "401" "$STATUS"

echo ""

# ─── 3. Admin access (with password header) ─────────────────
echo "─── 3. ADMIN ACCESS ───"

# 3.1 Admin sees ALL statuses (no filter)
RESP=$(curl -s "$BASE/api/articles?limit=100" \
  -H "x-admin-password: $PW")
test "Admin sees all 3 articles" '"total":3' "$RESP"
DRAFT_VISIBLE=$(echo "$RESP" | grep -c '"status":"DRAFT"' || echo "0")
test "Admin can see DRAFT articles" "1" "$DRAFT_VISIBLE"

# 3.2 Admin filter by status=DRAFT
RESP=$(curl -s "$BASE/api/articles?status=DRAFT" \
  -H "x-admin-password: $PW")
test "Admin DRAFT filter returns 1" '"total":1' "$RESP"

# 3.3 Admin filter by status=PUBLISHED
RESP=$(curl -s "$BASE/api/articles?status=PUBLISHED" \
  -H "x-admin-password: $PW")
test "Admin PUBLISHED filter returns 2" '"total":2' "$RESP"

# 3.4 Public filter by status=DRAFT (should be ignored, return PUBLISHED only)
RESP=$(curl -s "$BASE/api/articles?status=DRAFT")
test "Public cannot force DRAFT filter" '"total":2' "$RESP"

echo ""

# ─── 4. CRUD operations ─────────────────────────────────────
echo "─── 4. CRUD OPERATIONS ───"

# 4.1 Create new article
RESP=$(curl -s -X POST "$BASE/api/articles" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '{
    "title": "تقرير الاختبار — مقال تجريبي",
    "excerpt": "مقال تم إنشاؤه من تيست الآلي",
    "body": "نص تجريبي",
    "category": "إعلانات رسمية",
    "coverImage": "/images/news-economics.jpg"
  }')
test "Create article succeeds" "تقرير الاختبار" "$RESP"
NEW_ID=$(echo "$RESP" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
test "Got new article ID" "cuid" "$NEW_ID" 2>/dev/null || test "Got new article ID" "" "${NEW_ID:0:1}"

# 4.2 GET single article
RESP=$(curl -s "$BASE/api/articles/$NEW_ID" \
  -H "x-admin-password: $PW")
test "GET single article works" "تقرير الاختبار" "$RESP"

# 4.3 Update article (change status to PUBLISHED)
RESP=$(curl -s -X PUT "$BASE/api/articles/$NEW_ID" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '{"status":"PUBLISHED","title":"تقرير الاختبار — محدّث"}')
test "Update article succeeds" "محدّث" "$RESP"
PUB_AT=$(echo "$RESP" | grep -oP '"publishedAt":"[^"]+"' | head -1)
test "Publish sets publishedAt" "publishedAt" "$PUB_AT"

# 4.4 Verify update reflected
RESP=$(curl -s "$BASE/api/articles/$NEW_ID" \
  -H "x-admin-password: $PW")
test "Update reflected in DB" "محدّث" "$RESP"

# 4.5 GET non-existent article → 404
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/nonexistent_id")
test "GET non-existent article returns 404" "404" "$STATUS"

# 4.6 Invalid POST (missing title) → 400
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/articles" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '{"excerpt":"no title"}')
test "POST without title returns 400" "400" "$STATUS"

# 4.7 Delete the test article
RESP=$(curl -s -X DELETE "$BASE/api/articles/$NEW_ID" \
  -H "x-admin-password: $PW")
test "Delete article succeeds" '"ok":true' "$RESP"

# 4.8 Verify deleted
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/articles/$NEW_ID" \
  -H "x-admin-password: $PW")
test "Deleted article returns 404" "404" "$STATUS"

echo ""

# ─── 5. Idempotent Import ───────────────────────────────────
echo "─── 5. IDEMPOTENT IMPORT ───"

# 5.1 First import — 2 new articles
RESP=$(curl -s -X POST "$BASE/api/articles/import" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '[
    {
      "title": "[تيست] بوست تجريبي رقم 1",
      "excerpt": "بوست اختبار 1",
      "body": "نص البوست 1",
      "sourcePlatform": "facebook",
      "sourceId": "test_fb_001",
      "sourceUrl": "https://facebook.com/test1"
    },
    {
      "title": "[تيست] بوست تجريبي رقم 2",
      "excerpt": "بوست اختبار 2",
      "body": "نص البوست 2",
      "sourcePlatform": "facebook",
      "sourceId": "test_fb_002",
      "sourceUrl": "https://facebook.com/test2"
    }
  ]')
test "First import: 2 created" '"created":2' "$RESP"
test "First import: 0 skipped" '"skipped":0' "$RESP"

# 5.2 Re-import same articles — should be skipped
RESP=$(curl -s -X POST "$BASE/api/articles/import" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '[
    {
      "title": "[تيست] بوست تجريبي رقم 1",
      "sourcePlatform": "facebook",
      "sourceId": "test_fb_001"
    },
    {
      "title": "[تيست] بوست تجريبي رقم 2",
      "sourcePlatform": "facebook",
      "sourceId": "test_fb_002"
    }
  ]')
test "Re-import: 0 created (idempotent)" '"created":0' "$RESP"
test "Re-import: 2 skipped" '"skipped":2' "$RESP"

# 5.3 Import with invalid record — should fail that one, succeed others
RESP=$(curl -s -X POST "$BASE/api/articles/import" \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $PW" \
  -d '[
    {"title": "valid title"},
    {"excerpt": "missing title"}
  ]')
test "Mixed import: 1 created" '"created":1' "$RESP"
test "Mixed import: 1 failed" '"failed":1' "$RESP"

# 5.4 Cleanup test articles
TEST_IDS=$(curl -s "$BASE/api/articles?limit=100" \
  -H "x-admin-password: $PW" | grep -oP '"id":"[^"]+"' | cut -d'"' -f4)
for id in $TEST_IDS; do
  TITLE=$(curl -s "$BASE/api/articles/$id" -H "x-admin-password: $PW" | grep -oP '"title":"[^"]+"' | cut -d'"' -f4)
  if [[ "$TITLE" == *"[تيست]"* ]] || [[ "$TITLE" == "valid title" ]]; then
    curl -s -X DELETE "$BASE/api/articles/$id" -H "x-admin-password: $PW" > /dev/null
  fi
done
echo "  ✓ Cleanup done"

echo ""

# ─── 6. Final state check ───────────────────────────────────
echo "─── 6. FINAL STATE ───"
RESP=$(curl -s "$BASE/api/articles?limit=100" -H "x-admin-password: $PW")
test "DB back to 3 articles after cleanup" '"total":3' "$RESP"

echo ""

# ─── Summary ────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════"
echo "  TEST SUMMARY"
echo "═══════════════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "  Total: $((PASS+FAIL))  |  Passed: $PASS  |  Failed: $FAIL"
echo "═══════════════════════════════════════════════════════════"

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
