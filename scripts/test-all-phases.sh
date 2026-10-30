#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
#  Raya Future — Comprehensive Test Suite (Phases 1 + 2 + 3)
# ═══════════════════════════════════════════════════════════════════════
BASE="http://localhost:3000"
PW="raya-admin-2026"
PASS=0
FAIL=0
RESULTS=()

t() {
  local name="$1" expected="$2" actual="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    PASS=$((PASS+1)); RESULTS+=("✅ $name")
  else
    FAIL=$((FAIL+1)); RESULTS+=("❌ $name (expected: $expected, got: ${actual:0:80})")
  fi
}

echo "═════════════════════════════════════════════════════"
echo "  تيست شامل — المراحل ١ + ٢ + ٣"
echo "═════════════════════════════════════════════════════"

# ═══════════ PHASE 1: Pages ═══════════
echo ""
echo "─── المرحلة ١: الصفحات العامة ───"
t "الرئيسية" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/)"
t "عن المعهد" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/about)"
t "اتصل بنا" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/contact)"
t "الفعاليات" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/events)"
t "حياة الطالب" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/student-life)"
t "بوابة الطلاب" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/student)"
t "لوحة الإدارة" "200" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/admin)"

# ═══════════ PHASE 1: Contact API ═══════════
echo ""
echo "─── المرحلة ١: فورم التواصل ───"
t "Contact submit" '"ok":true' "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"test","email":"t@t.com","subject":"test sub","message":"this is a test message long enough"}')"
t "Contact missing name" "الاسم" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"","email":"t@t.com","subject":"t","message":"test message long"}')"
t "Contact bad email" "غير صالح" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"t","email":"bad","subject":"t","message":"test message long"}')"
t "Contact short msg" "قصيرة" "$(curl -s -X POST $BASE/api/contact -H 'Content-Type: application/json' -d '{"name":"t","email":"t@t.com","subject":"t","message":"short"}')"

# ═══════════ PHASE 1: Articles API ═══════════
echo ""
echo "─── المرحلة ١: المقالات API ───"
RESP=$(curl -s "$BASE/api/articles?limit=5")
t "GET articles" "items" "$RESP"
t "Public PUBLISHED only" "PUBLISHED" "$RESP"
DRAFT_CHK=$(echo "$RESP" | grep -c '"status":"DRAFT"' || echo "0")
t "Public hides DRAFT" "0" "$DRAFT_CHK"

# ═══════════ PHASE 1: Auth ═══════════
echo ""
echo "─── المرحلة ١: المصادقة ───"
t "Login صحيح" '"ok":true' "$(curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' -d "{\"password\":\"$PW\"}")"
t "Login خاطئ" "Invalid" "$(curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' -d '{"password":"wrong"}')"
t "POST no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/articles -H 'Content-Type: application/json' -d '{"title":"t"}')"
t "DELETE no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X DELETE $BASE/api/articles/fakeid)"
t "Import no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -d '[]')"

# ═══════════ PHASE 1: CRUD ═══════════
echo ""
echo "─── المرحلة ١: CRUD عمليات ───"
CR=$(curl -s -X POST $BASE/api/articles -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"title":"تيست شامل — مقال","excerpt":"t","body":"b","category":"أخبار"}')
t "Create article" "تيست شامل" "$CR"
NID=$(echo "$CR" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
t "GET single" "تيست شامل" "$(curl -s $BASE/api/articles/$NID -H "x-admin-password: $PW")"
t "Update article" "محدّث" "$(curl -s -X PUT $BASE/api/articles/$NID -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"title":"تيست شامل — محدّث"}')"
t "Delete article" '"ok":true' "$(curl -s -X DELETE $BASE/api/articles/$NID -H "x-admin-password: $PW")"
t "Deleted → 404" "404" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/articles/$NID -H "x-admin-password: $PW")"

# ═══════════ PHASE 1: Idempotent Import ═══════════
echo ""
echo "─── المرحلة ١: الاستيراد المتكرر ───"
I1=$(curl -s -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '[{"title":"[تيست] idem all","sourcePlatform":"test","sourceId":"idem_all_001"}]')
t "First import: 1 created" '"created":1' "$I1"
I2=$(curl -s -X POST $BASE/api/articles/import -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '[{"title":"[تيست] idem all","sourcePlatform":"test","sourceId":"idem_all_001"}]')
t "Re-import: 0 created" '"created":0' "$I2"
t "Re-import: 1 skipped" '"skipped":1' "$I2"

# ═══════════ PHASE 1: Admin Access ═══════════
echo ""
echo "─── المرحلة ١: صلاحيات الإدارة ───"
AR=$(curl -s "$BASE/api/articles?limit=100" -H "x-admin-password: $PW")
AD=$(echo "$AR" | grep -c '"status":"DRAFT"' || echo "0")
t "Admin sees DRAFT" "1" "$AD"
t "Admin total > 0" "total" "$AR"
t "Admin DRAFT filter" "total" "$(curl -s "$BASE/api/articles?status=DRAFT" -H "x-admin-password: $PW")"
t "Admin PUBLISHED filter" "total" "$(curl -s "$BASE/api/articles?status=PUBLISHED" -H "x-admin-password: $PW")"
t "Public can't force DRAFT" "PUBLISHED" "$(curl -s "$BASE/api/articles?status=DRAFT")"

# ═══════════ PHASE 2: Categories ═══════════
echo ""
echo "─── المرحلة ٢: التصنيفات ───"
CR=$(curl -s "$BASE/api/categories")
t "GET categories" "items" "$CR"
CC=$(echo "$CR" | grep -o '"id"' | wc -l)
t "Categories >= 12" "12" "$CC"
t "POST cat no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/categories -H 'Content-Type: application/json' -d '{"name":"t"}')"
CC2=$(curl -s -X POST $BASE/api/categories -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"name":"TestCatAll","description":"d"}')
t "POST cat with auth" '"name"' "$CC2"
CID=$(echo "$CC2" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
t "DELETE cat" '"ok":true' "$(curl -s -X DELETE $BASE/api/categories/$CID -H "x-admin-password: $PW")"

# ═══════════ PHASE 2: Tags ═══════════
echo ""
echo "─── المرحلة ٢: الوسوم ───"
t "GET tags" "items" "$(curl -s "$BASE/api/tags")"
TC=$(curl -s -X POST $BASE/api/tags -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"name":"TestTagAll"}')
t "POST tag with auth" '"name"' "$TC"
TID=$(echo "$TC" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
t "DELETE tag" '"ok":true' "$(curl -s -X DELETE $BASE/api/tags/$TID -H "x-admin-password: $PW")"
t "POST tag no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/tags -H 'Content-Type: application/json' -d '{"name":"t"}')"

# ═══════════ PHASE 2: Newsletter ═══════════
echo ""
echo "─── المرحلة ٢: النشرة البريدية ───"
t "Subscribe" '"ok":true' "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"phase3test@raya.edu"}')"
t "Duplicate sub" '"ok":true' "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"phase3test@raya.edu"}')"
t "Invalid email" "غير صالح" "$(curl -s -X POST $BASE/api/newsletter -H 'Content-Type: application/json' -d '{"email":"bad"}')"
t "GET no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/newsletter)"

# ═══════════ PHASE 3: Student Auth ═══════════
echo ""
echo "─── المرحلة ٣: مصادقة الطلاب ───"
t "Student login" '"ok":true' "$(curl -s -X POST $BASE/api/auth/student/login -H 'Content-Type: application/json' -d '{"studentCode":"RAYA-2026-001","password":"student123"}')"
t "Student wrong pw → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE/api/auth/student/login -H 'Content-Type: application/json' -d '{"studentCode":"RAYA-2026-001","password":"wrong"}')"
t "Student articles no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/student/articles)"

# ═══════════ PHASE 3: Saved Articles ═══════════
echo ""
echo "─── المرحلة ٣: المقالات المحفوظة ───"
FIRST=$(curl -s "$BASE/api/articles?limit=1" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
t "Save article" '"ok":true' "$(curl -s -X POST $BASE/api/student/saved -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d "{\"articleId\":\"$FIRST\"}")"
t "List saved" "items" "$(curl -s $BASE/api/student/saved -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123')"
t "Unsave article" '"ok":true' "$(curl -s -X DELETE $BASE/api/student/saved -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d "{\"articleId\":\"$FIRST\"}")"
t "Saved no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/student/saved)"

# ═══════════ PHASE 3: Notifications ═══════════
echo ""
echo "─── المرحلة ٣: الإشعارات ───"
t "Get notifications" "items" "$(curl -s $BASE/api/student/notifications -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123')"
t "Notifs no auth → 401" "401" "$(curl -s -o /dev/null -w '%{http_code}' $BASE/api/student/notifications)"
t "Mark all read" '"ok":true' "$(curl -s -X POST $BASE/api/student/notifications -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d '{"markAllRead":true}')"

# ═══════════ PHASE 3: Auto-Notification ═══════════
echo ""
echo "─── المرحلة ٣: الإشعارات التلقائية ───"
SA=$(curl -s -X POST $BASE/api/student/articles -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d '{"title":"تيست إشعار شامل","excerpt":"t","body":"b","category":"مقالات تحريرية"}')
t "Student submit article" '"ok":true' "$SA"
SID=$(echo "$SA" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
# Admin publishes it
curl -s -X PUT "$BASE/api/articles/$SID" -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"status":"PUBLISHED"}' > /dev/null
NR=$(curl -s "$BASE/api/student/notifications" -H "x-student-code: RAYA-2026-001" -H "x-student-token: student123")
t "Auto-notif on publish" "تم نشر مقالك" "$NR"
# Admin rejects another
SA2=$(curl -s -X POST $BASE/api/student/articles -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d '{"title":"تيست رفض","excerpt":"t","body":"b","category":"مقالات تحريرية"}')
SID2=$(echo "$SA2" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
curl -s -X PUT "$BASE/api/articles/$SID2" -H 'Content-Type: application/json' -H "x-admin-password: $PW" -d '{"status":"REJECTED"}' > /dev/null
NR2=$(curl -s "$BASE/api/student/notifications" -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123')
t "Auto-notif on reject" "تم رفض مقالك" "$NR2"
# Cleanup
curl -s -X DELETE "$BASE/api/articles/$SID" -H "x-admin-password: $PW" > /dev/null
curl -s -X DELETE "$BASE/api/articles/$SID2" -H "x-admin-password: $PW" > /dev/null

# ═══════════ PHASE 3: Student Submit Article ═══════════
echo ""
echo "─── المرحلة ٣: إرسال مقال طالب ───"
SA3=$(curl -s -X POST $BASE/api/student/articles -H 'Content-Type: application/json' -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123' -d '{"title":"تيست إرسال شامل","excerpt":"t","body":"b","category":"مقالات تحريرية"}')
t "Student submit" '"ok":true' "$SA3"
t "Submit creates DRAFT" "DRAFT" "$SA3"
SID3=$(echo "$SA3" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
t "Student sees own submission" "items" "$(curl -s $BASE/api/student/articles -H 'x-student-code: RAYA-2026-001' -H 'x-student-token: student123')"
curl -s -X DELETE "$BASE/api/articles/$SID3" -H "x-admin-password: $PW" > /dev/null

# ═══════════ Lint ═══════════
echo ""
echo "─── Lint ───"
LO=$(bun run lint 2>&1)
if echo "$LO" | grep -q "error"; then
  t "Lint" "no errors" "errors found"
else
  t "Lint clean" "" "$LO"
fi

# ═══════════ Summary ═══════════
echo ""
echo "═════════════════════════════════════════════════════"
echo "  ملخص النتائج النهائية"
echo "═════════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do echo "  $r"; done
echo ""
echo "  الإجمالي: $((PASS+FAIL))  |  نجح: $PASS  |  فشل: $FAIL"
echo "═════════════════════════════════════════════════════"
