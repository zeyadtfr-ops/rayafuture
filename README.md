# مجلة راية المستقبل — Raya Future Magazine

منصة رقمية طلابية متكاملة لمعهد راية العالي للإدارة والتجارة الخارجية. مجلة إلكترونية تعنى بقضايا التعليم والشأن الطالبي، مع نظام إدارة محتوى كامل وسير عمل تحريري احترافي.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

---

## ✨ المميزات

### 📰 المجلة العامة
- تصميم عربي RTL كامل بخطوط Tajawal و IBM Plex Sans Arabic
- لوحة ألوان احترافية: أخضر غامق (forest) + ذهبي (gold) + كريمي (paper)
- 9 أقسام رئيسية: Hero، القصة الرئيسية، أحدث المقالات، الأكثر قراءة، فعاليات قادمة، آخر الأخبار، تصفّح حسب القسم، أنشطة طلابية، فرص تعليمية، شارك في المجلة
- تصميم متجاوب 100% (موبايل + تابلت + ديسكتوب)
- 14 صورة احترافية من Unsplash

### 🛠️ لوحة الإدارة (`/admin`)
- نظام مصادقة مزدوج:
  - **المشرف العام** — كلمة مرور موحدة من env variable
  - **أعضاء هيئة التحرير** — بريد إلكتروني + كلمة مرور (bcrypt)
- إدارة الأعضاء (إضافة/حذف)
- سير عمل تحريري كامل: `DRAFT → PENDING_REVIEW → APPROVED → PUBLISHED`
- إحصائيات شاملة (عدد المقالات حسب الحالة والقسم)
- عمليات جماعية (Bulk Operations): نشر، اعتماد، رفض، حذف جماعي
- استيراد JSON جماعي (idempotent) من Facebook exports
- بحث وفلترة متقدمة

### 🔌 API كامل
- `GET/POST /api/articles` — قائمة وإنشاء المقالات
- `GET/PUT/DELETE /api/articles/[id]` — إدارة مقال واحد
- `POST /api/articles/import` — استيراد JSON جماعي
- `POST /api/articles/bulk` — عمليات جماعية
- `GET/POST /api/users` — إدارة الأعضاء
- `DELETE /api/users/[id]` — حذف عضو
- `POST /api/auth/login` — تسجيل دخول (master أو member)

---

## 🏗️ التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 16 | Framework أساسي (App Router) |
| TypeScript | 5 | لغة البرمجة |
| Tailwind CSS | 4 | التنسيق |
| shadcn/ui | latest | مكونات UI |
| Prisma | 6 | ORM لقاعدة البيانات |
| SQLite | 3 | قاعدة البيانات |
| bcryptjs | 3 | تشفير كلمات المرور |
| sonner | 1 | تنبيهات Toast |
| lucide-react | latest | الأيقونات |

---

## 🚀 التشغيل المحلي

### المتطلبات
- Node.js 18+
- npm أو bun

### الخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/USERNAME/raya-magazine.git
cd raya-magazine

# 2. تثبيت المكتبات
npm install
# أو
bun install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# عدّل .env وضع كلمة مرور المشرف

# 4. تهيئة قاعدة البيانات
npx prisma db push

# 5. (اختياري) تحميل صور إضافية
# ضع الصور في public/images/

# 6. تشغيل السيرفر
npm run dev
# أو
bun run dev
```

افتح المتصفح على: **http://localhost:3000**

---

## 📁 هيكل المشروع

```
raya-magazine/
├── prisma/
│   └── schema.prisma              # Article + User models
├── public/
│   └── images/                    # صور المقالات (متجاهلة في git)
├── src/
│   ├── app/
│   │   ├── admin/page.tsx         # لوحة الإدارة (840+ سطر)
│   │   ├── api/
│   │   │   ├── articles/          # CRUD + import + bulk
│   │   │   ├── auth/login/        # تسجيل الدخول
│   │   │   └── users/             # إدارة الأعضاء
│   │   ├── globals.css            # نظام الألوان + الخطوط
│   │   ├── layout.tsx             # RTL + خطوط عربية
│   │   └── page.tsx               # الصفحة الرئيسية
│   ├── components/
│   │   ├── raya/                  # مكونات المجلة
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── MagazineSections.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                    # shadcn/ui components
│   └── lib/
│       ├── auth.ts                # مصادقة مزدوجة
│       ├── db.ts                  # Prisma client
│       └── utils.ts
├── docs/
│   └── ADMIN.md                   # دليل الإدارة الكامل
├── scripts/
│   ├── seed-test-articles.ts      # بيانات تجريبية
│   ├── api-tests.sh               # اختبارات API (34 اختبار)
│   ├── inspect-db.ts              # فحص قاعدة البيانات
│   └── download-more-images.py    # تحميل الصور
├── .env.example
└── package.json
```

---

## 🔐 متغيرات البيئة

انسخ `.env.example` إلى `.env` وعدّل القيم:

```env
# قاعدة البيانات (SQLite)
DATABASE_URL="file:./db/custom.db"
# كلمة مرور المشرف العام (غيّرها في الإنتاج!)
ADMIN_PASSWORD="<set-strong-password-in-Vercel-env-vars>"
# (اختياري) Facebook Graph API — للمزامنة التلقائية المستقبلية
# FB_APP_ID=""
# FB_APP_SECRET=""
# FB_PAGE_ID="RayaEdu2018"
# FB_PAGE_TOKEN=""
```

---

## 📖 دليل الاستخدام

### تسجيل دخول المشرف العام
 1. اذهب إلى `/admin`
2. أدخل كلمة المرور (الموجودة في Vercel Environment Variables)
3. اضغط "دخول"

### إضافة عضو جديد
1. سجّل دخول كمشرف عام
2. اذهب لتبويب "الأعضاء"
3. اضغط "إضافة عضو"
4. املأ: الاسم + البريد + كلمة المرور + الدور

### إنشاء مقال
1. من تبويب "المقالات"، اضغط "مقال جديد"
2. املأ العنوان + المقتطف + النص + القسم + صورة الغلاف
3. اختر "حفظ كمسودة" أو "نشر فوراً"

### الاستيراد الجماعي
1. اضغط "استيراد JSON"
2. الصق JSON array بالصيغة المذكورة في `docs/ADMIN.md`
3. اضغط "استيراد"

---

## 🧪 الاختبارات

```bash
# تشغيل اختبارات API (34 اختبار)
bash scripts/api-tests.sh

# فحص قاعدة البيانات
bun run scripts/inspect-db.ts

# Lint
bun run lint
```

---

## 🚢 النشر (Deployment)

### Vercel (الأسهل)
1. ارفع المشروع على GitHub
2. اربطه بـ [vercel.com](https://vercel.com)
3. أضف متغيرات البيئة في إعدادات Vercel
4. اضغط "Deploy"

### Netlify
1. ارفع المشروع على GitHub
2. اربطه بـ [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT — راجع ملف `LICENSE` للتفاصيل.

---

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing`)
5. افتح Pull Request

---

## 📞 التواصل

- الموقع الرسمي للمعهد: [raya.edu.eg](https://raya.edu.eg)
- فيسبوك المعهد: [RayaEdu2018](https://www.facebook.com/RayaEdu2018)

---

صُنع بـ ❤️ لمعهد راية العالي للإدارة والتجارة الخارجية
