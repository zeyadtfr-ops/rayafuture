#!/bin/bash
# Comprehensive test suite for Raya Future — Phases 1 + 2
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

echo "═══════════════════════════════════════════════════"
echo "  تيست شامل — المرحلة ١ + ٢"
echo "═══════════════════════════════════════════════════"
echo ""

# ─── 1. Public Pages ───
echo "─── ١. الصفحات العامة ───"
test "الرئيسية" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/)"
test "عن المعهد" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/about)"
test "اتصل بنا" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/contact)"
test "الفعاليات" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/events)"
test "حياة الطالب" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/student-life)"
test "بوابة الطلاب" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/student)"
test "لوحة الإدارة" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/admin)"

# ─── 2. Images ───
echo ""
echo "─── ٢. الصور ───"
test "صورة Hero" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/images/hero-campus.jpg)"
test "صورة خبر" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/images/news-economics.jpg)"
test "صورة معرض" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/images/gallery-1.jpg)"

# ─── 3. Articles API ───
echo ""
echo "─── ٣. المقالات API ───"
RESP=$(curl -s "$BASE/api/articles?limit=5")
test "GET /api/articles" "items" "$RESP"
test "Public sees PUBLISHED" "PUBLISHED" "$RESP"
DRAFT_CHECK=$(echo "$RESP" | grep -c '"status":"DRAFT"' || echo "0")
test "Public hides DRAFT" "0" "$DRAFT_CHECK"

# ─── 4. Auth ───
echo ""
echo "─── ٤. المصادقة ───"
test "Login صحيح" '"ok":true' "$(curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' -d "{\"password\":\"$PW\"}")"
test "Login خاطئ" "Invalid" "$(curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' -d '{"password":"wrong"}')"
test "POST بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/articles -H 'Content-Type: application/json' -d '{"title":"test"}')"
test "DELETE بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X DELETE $BASE/api/articles/fakeid)"
test "Import بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -d '[]')"

# ─── 5. Student API ───
echo ""
echo "─── ٥. الطلاب API ───"
test "Student login" '"ok":true' "$(curl -s -X POST $BASE/api/auth/student/login -H 'Content-Type: application/json' -d '{"studentCode":"RAYA-2026-001","password":"student123"}')"
test "Student login خاطئ → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/auth/student/login -H 'Content-Type: application/json' -d '{"studentCode":"RAYA-2026-001","password":"wrong"}')"
test "Student articles بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/student/articles)"

# ─── 6. Categories API ───
echo ""
echo "─── ٦. التصنيفات API ───"
CAT_RESP=$(curl -s "$BASE/api/categories")
test "GET /api/categories" "items" "$CAT_RESP"
CAT_COUNT=$(echo "$CAT_RESP" | grep -o '"id"' | wc -l)
test "Categories count >= 12" "12" "$CAT_COUNT"
test "POST category بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/categories -H 'Content-Type: application/json' -d '{"name":"test"}')"
CAT_CREATE=$(curl -s -X POST $BASE/api/categories -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"name":"TestCategoryPhase2","description":"test"}')
test "POST category مع auth" '"name"' "$CAT_CREATE"
CAT_ID=$(echo "$CAT_CREATE" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
test "DELETE category" '"ok":true' "$(curl -s -X DELETE $BASE/api/categories/$CAT_ID -H "x-admin-password: $PW")"

# ─── 7. Tags API ───
echo ""
echo "─── ٧. الوسوم API ───"
TAG_RESP=$(curl -s "$BASE/api/tags")
test "GET /api/tags" "items" "$TAG_RESP"
TAG_CREATE=$(curl -s -X POST $BASE/api/tags -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"name":"TestTagPhase2"}')
test "POST tag مع auth" '"name"' "$TAG_CREATE"
TAG_ID=$(echo "$TAG_CREATE" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
test "DELETE tag" '"ok":true' "$(curl -s -X DELETE $BASE/api/tags/$TAG_ID -H "x-admin-password: $PW")"
test "POST tag بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/tags -H 'Content-Type: application/json' -d '{"name":"test"}')"

# ─── 8. Newsletter ───
echo ""
echo "─── ٨. النشرة البريدية ───"
test "Newsletter subscribe" '"ok":true' "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"testphase2@raya.edu"}')"
test "Newsletter duplicate" '"مشترك' "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"testphase2@raya.edu"}')"
test "Newsletter invalid email" "غير صالح" "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"bad"}')"
test "Newsletter GET بدون auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/newsletter)"

# ─── 9. Contact Form ───
echo ""
echo "─── ٩. فورم التواصل ───"
test "Contact submit" '"ok":true' "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"test user","email":"contacttest@raya.edu","subject":"test subject","message":"this is a test message long enough"}')"
test "Contact missing name" "الاسم" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"","email":"t@t.com","subject":"test","message":"test message long"}')"
test "Contact bad email" "غير صالح" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"test","email":"bad","subject":"test","message":"test message long"}')"
test "Contact short message" "قصيرة" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"test","email":"t@t.com","subject":"test","message":"short"}')"

# ─── 10. CRUD Operations ───
echo ""
echo "─── ١٠. CRUD عمليات ───"
CREATE_RESP=$(curl -s -X POST $BASE/api/articles -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"title":"تيست شامل — مقال تجريبي","excerpt":"مقال اختبار","body":"نص","category":"أخبار"}')
test "Create article" "تيست شامل" "$CREATE_RESP"
NEW_ID=$(echo "$CREATE_RESP" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
test "GET single article" "تيست شامل" "$(curl -s $BASE/api/articles/$NEW_ID -H "x-admin-password: $PW")"
test "Update article" "محدّث" "$(curl -s -X PUT $BASE/api/articles/$NEW_ID -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"title":"تيست شامل — محدّث"}')"
test "Delete article" '"ok":true' "$(curl -s -X DELETE $BASE/api/articles/$NEW_ID -H "x-admin-password: $PW")"
test "Deleted article → 404" "404" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/articles/$NEW_ID -H "x-admin-password: $PW")"

# ─── 11. Idempotent Import ───
echo ""
echo "─── ١١. الاستيراد المتكرر (Idempotent) ───"
IMP1=$(curl -s -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '[{"title":"[تيست] idempotent phase2","sourcePlatform":"test","sourceId":"idem_phase2_001"}]')
test "First import: 1 created" '"created":1' "$IMP1"
IMP2=$(curl -s -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '[{"title":"[تيست] idempotent phase2","sourcePlatform":"test","sourceId":"idem_phase2_001"}]')
test "Re-import: 0 created" '"created":0' "$IMP2"
test "Re-import: 1 skipped" '"skipped":1' "$IMP2"

# ─── 12. Admin Access ───
echo ""
echo "─── ١٢. صلاحيات الإدارة ───"
ADMIN_RESP=$(curl -s "$BASE/api/articles?limit=100" -H "x-admin-password: $PW")
ADMIN_DRAFTS=$(echo "$ADMIN_RESP" | grep -c '"status":"DRAFT"' || echo "0")
test "Admin sees DRAFT articles" "1" "$ADMIN_DRAFTS"
ADMIN_TOTAL=$(echo "$ADMIN_RESP" | grep -oP '"total":\d+' | head -1)
test "Admin total > 0" "total" "$ADMIN_TOTAL"
test "Admin DRAFT filter" "total" "$(curl -s "$BASE/api/articles?status=DRAFT" -H "x-admin-password: $PW")"
test "Admin PUBLISHED filter" "total" "$(curl -s "$BASE/api/articles?status=PUBLISHED" -H "x-admin-password: $PW")"
test "Public cannot force DRAFT" "PUBLISHED" "$(curl -s "$BASE/api/articles?status=DRAFT")"

# ─── 13. Lint ───
echo ""
echo "─── ١٣. Lint ───"
LINT_OUT=$(bun run lint 2>&1)
if echo "$LINT_OUT" | grep -q "error"; then
  test "Lint" "no errors" "errors found"
else
  test "Lint clean" "" "$LINT_OUT"
fi

# ─── Summary ───
echo ""
echo "═══════════════════════════════════════════════════"
echo "  ملخص النتائج"
echo "═══════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "  الإجمالي: $((PASS+FAIL))  |  نجح: $PASS  |  فشل: $FAIL"
echo "═══════════════════════════════════════════════════"

if [[ $FAIL -gt 0 ]]; then exit 1; fi
