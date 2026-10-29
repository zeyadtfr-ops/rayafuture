# لوحة تحكم راية المستقبل — دليل الإدارة

دليل تشغيل لوحة الإدارة لنظام إدارة محتوى مجلة "راية المستقبل".

## 📋 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [الوصول للوحة التحكم](#الوصول-للوحة-التحكم)
3. [دورة حياة المقال](#دورة-حياة-المقال)
4. [إنشاء مقال جديد](#إنشاء-مقال-جديد)
5. [الاستيراد الجماعي من JSON](#الاستيراد-الجماعي-من-json)
6. [تكامل Facebook Graph API (اختياري)](#تكامل-facebook-graph-api-اختياري)
7. [الأمان](#الأمان)
8. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## نظرة عامة

النظام ده بيتكون من:

- **قاعدة بيانات SQLite** فيها جدول `Article` بـ metadata كاملة.
- **API endpoints** تحت `/api/articles/*` للقراءة والكتابة.
- **لوحة تحكم** على `/admin` لإدارة المقالات وسير العمل التحريري.
- **عرض عام** على `/` بياخد المقالات المنشورة فقط من قاعدة البيانات.

كل المقالات المستوردة تبدأ كمسودة (DRAFT) ولا تظهر للعموم إلا بعد اعتماد المحرر ونشرها.

---

## الوصول للوحة التحكم

1. افتح الرابط: `https://your-domain/admin`
2. أدخل كلمة مرور المحرر (الافتراضية: `raya-admin-2026`)
3. اضغط "دخول"

> ⚠️ **مهم:** غيّر كلمة المرور الافتراضية في الإنتاج عبر متغير البيئة `ADMIN_PASSWORD`.

---

## دورة حياة المقال

```
DRAFT  →  PENDING_REVIEW  →  APPROVED  →  PUBLISHED
                                       ↘
                                         REJECTED (تبقى محفوظة للمراجعة)
```

| الحالة | المعنى | تظهر للعموم؟ |
|--------|--------|--------------|
| DRAFT | مسودة أولية | ❌ |
| PENDING_REVIEW | بانتظار مراجعة المحرر | ❌ |
| APPROVED | اعتمدت وجاهزة للنشر | ❌ |
| REJECTED | رُفضت (تبقى للمراجعة) | ❌ |
| PUBLISHED | منشورة للعموم | ✅ |

### الإجراءات المتاحة من لوحة التحكم:
- ✏️ تعديل
- 📤 إرسال للمراجعة (DRAFT → PENDING_REVIEW)
- ✅ اعتماد (→ APPROVED)
- ❌ رفض (→ REJECTED)
- 📨 نشر (→ PUBLISHED)
- 🗑️ حذف

---

## إنشاء مقال جديد

1. من لوحة التحكم، اضغط **"مقال جديد"**.
2. املأ الحقول:
   - **العنوان** (إلزامي — ٣ أحرف على الأقل)
   - **المقتطف** (excerpt — يظهر في بطاقة المقال)
   - **النص الكامل** (body)
   - **القسم** (اختر من القائمة)
   - **الوسوم** (مفصولة بفواصل)
   - **رابط صورة الغلاف** (URL — مثلاً `/images/news-1.jpg`)
   - **رابط المصدر** (اختياري — مثلاً رابط البوست على فيسبوك)
3. اختر:
   - **"حفظ كمسودة"** → ينشأ كمقال DRAFT
   - **"نشر فوراً"** → ينشأ ويُنشر مباشرة

---

## الاستيراد الجماعي من JSON

### متى تستخدمه؟
- عند تصدير بوستات من Facebook (Facebook Data Export)
- عند تجهيز محتوى في ملف JSON من Google Drive
- عند نقل محتوى من مصدر خارجي

### الصيغة المطلوبة:

```json
[
  {
    "title": "عنوان المقال",
    "excerpt": "مقتطف قصير",
    "body": "نص المقال الكامل",
    "category": "أخبار المؤسسة",
    "coverImage": "/images/news-1.jpg",
    "tags": "تعليم, طلاب",
    "sourcePlatform": "facebook",
    "sourceId": "fb_post_12345",
    "sourceUrl": "https://www.facebook.com/RayaEdu2018/posts/12345",
    "originalPubAt": "2024-07-12T10:00:00Z",
    "originalText": "النص الأصلي للبوست"
  }
]
```

### الحقول المطلوبة:
- `title` (إلزامي)

### الحقول الاختيارية:
- `excerpt`, `body`, `category`, `coverImage`, `tags`
- `sourcePlatform`, `sourceId`, `sourceUrl`, `originalPubAt`, `originalText`

### سلوك الاستيراد:
- ✅ **Idempotent**: إعادة استيراد نفس المقال (بنفس `sourcePlatform` + `sourceId`) لا تكرره.
- ✅ كل المقالات المستوردة تبدأ كـ DRAFT — يجب اعتمادها يدوياً قبل النشر.
- ✅ تقرير النتيجة: عدد المنشأة + المكررة + الفاشلة + الأخطاء.

### خطوات الاستيراد:
1. من لوحة التحكم، اضغط **"استيراد JSON"**.
2. الصق JSON array في الخانة.
3. اضغط **"استيراد"**.
4. ستظهر رسالة بالنتيجة.
5. راجع المقالات المستوردة في القائمة، اعتمدها وانشرها.

---

## تكامل Facebook Graph API (اختياري)

### الوضع الحالي:
- ❌ التحميل التلقائي من Facebook غير مفعّل.
- ✅ الاستيراد اليدوي عبر JSON يعمل بشكل كامل.

### لماذا؟
Facebook يمنع الوصول المباشر للبوستات بدون:
1. Meta Developer Account
2. Facebook App مسجّلة
3. Page Access Token من أدمن الصفحة
4. App Review من Meta لصلاحية `pages_read_engagement` (تستغرق أسابيع)

### خطوات التفعيل (للمستقبل):
1. أنشئ Meta Developer Account على [developers.facebook.com](https://developers.facebook.com)
2. أنشئ Facebook App جديد
3. أضف منتج "Facebook Login" و"Pages"
4. اطلب صلاحية `pages_read_engagement` (App Review)
5. احصل على Page Access Token من أدمن صفحة [RayaEdu2018](https://www.facebook.com/RayaEdu2018)
6. أضف المتغيرات في `.env`:
   ```
   FB_APP_ID="..."
   FB_APP_SECRET="..."
   FB_PAGE_ID="RayaEdu2018"
   FB_PAGE_TOKEN="..."
   ```
7. اتمسح نقطة الـ extension في `/api/articles/sync-facebook` (محتاجة تطوير بعد الحصول على الـ token)

### البديل العملي الآن:
1. افتح [صفحة فيسبوك المعهد](https://www.facebook.com/RayaEdu2018)
2. استخدم **"Download Your Information"** من إعدادات فيسبوك للحصول على export
3. حوّل الـ export إلى JSON بالصيغة المذكورة فوق
4. ارفعها عبر زر **"استيراد JSON"** في لوحة التحكم

---

## الأمان

### ما هو مفعّل:
- ✅ كلمة مرور المحرر تُقرأ من `ADMIN_PASSWORD` (env variable).
- ✅ كلمة المرور تُخزّن في `sessionStorage` (مش localStorage — تتسحب لما القفل).
- ✅ كل عمليات الكتابة (POST/PUT/DELETE) تتطلب header `x-admin-password`.
- ✅ المقالات غير المنشورة لا تظهر للعموم (الفحص على مستوى الـ API).
- ✅ الـ API يرفع أخطاء واضحة بدون تسريب معلومات حساسة.

### يجب الانتباه له في الإنتاج:
- 🔴 **غيّر كلمة المرور الافتراضية** عبر `ADMIN_PASSWORD` في `.env`.
- 🔴 استخدم HTTPS فقط.
- 🔴 فكّر في استبدال نظام الباسورد البسيط بـ NextAuth.js (مثبت بالفعل) متى ما احتجت multi-user.
- 🔴 اعمل نسخ احتياطي دوري لملف `db/custom.db`.

---

## استكشاف الأخطاء

### "Unauthorized" عند محاولة حفظ مقال
- تأكد إنك سجّلت دخول من `/admin`.
- امسح `sessionStorage` (في DevTools: Application → Session Storage) وسجّل دخول تاني.

### المقالات المنشورة لا تظهر على الموقع
- افتح `/api/articles?limit=8` في المتصفح وتأكد إن فيه مقالات بـ `status: "PUBLISHED"`.
- لو فاضي، استخدم زر **"استيراد JSON"** أو أنشئ مقالات جديدة.

### خطأ "Database is locked"
- السيرفر شغال بشكلين في نفس الوقت. أوقف واحد فيهم.
- أو احذف `db/custom.db` وأعد `bun run db:push` ثم `bun run scripts/seed-test-articles.ts`.

### نسيت كلمة المرور
- افتح `.env` وغيّر `ADMIN_PASSWORD`.
- أعد تشغيل السيرفر.

---

## الملفات المنشأة/المعدّلة

### جديدة:
- `prisma/schema.prisma` — توسيع بـ Article model + ArticleStatus enum
- `src/lib/auth.ts` — helpers للمصادقة
- `src/app/api/articles/route.ts` — GET/POST للمقالات
- `src/app/api/articles/[id]/route.ts` — GET/PUT/DELETE لمقال واحد
- `src/app/api/articles/import/route.ts` — bulk JSON import (idempotent)
- `src/app/api/auth/login/route.ts` — login endpoint
- `src/app/admin/page.tsx` — لوحة التحكم الكاملة
- `scripts/seed-test-articles.ts` — seeding بيانات تجريبية
- `.env.example` — توثيق متغيرات البيئة
- `docs/ADMIN.md` — هذا الملف

### معدّلة:
- `src/components/raya/NewsSection.tsx` — قراءة من `/api/articles` مع fallback

---

## تشغيل الاختبارات اليدوية

1. **افتح الموقع العام:** `/`
   - ✅ المقالات التجريبية الـ ٢ المنشورة تظهر في قسم الأخبار.
2. **افتح لوحة التحكم:** `/admin`
   - ✅ تسجيل دخول بكلمة المرور `raya-admin-2026`.
3. **أنشئ مقال جديد:**
   - ✅ يظهر في القائمة كـ DRAFT.
4. **اعتمده ثم انشره:**
   - ✅ يظهر على الموقع العام.
5. **استورد JSON:**
   - ✅ المقالات تظهر كمسودات.
6. **أعد استيراد نفس JSON:**
   - ✅ النتيجة: 0 created, N skipped (idempotent).

---

## الخلاصة

| الميزة | الحالة |
|--------|--------|
| قاعدة بيانات + schema | ✅ مفعّل (SQLite + Prisma) |
| API CRUD كامل | ✅ مفعّل |
| لوحة تحكم إدارية | ✅ مفعّلة على `/admin` |
| سير عمل تحريري كامل | ✅ Draft → Review → Approve → Publish |
| استيراد JSON جماعي | ✅ مفعّل + idempotent |
| تكامل Facebook API | ⏳ يحتاج credentials منك |
| مزامنة مجدولة | ⏳ تحتاج استضافة production |
| مصادقة multi-user | ⏳ NextAuth مثبت وجاهز للتوسعة |
