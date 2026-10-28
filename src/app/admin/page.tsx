"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  LogOut,
  Upload,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Status = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  category: string;
  tags: string | null;
  status: Status;
  sourcePlatform: string | null;
  sourceId: string | null;
  sourceUrl: string | null;
  originalPubAt: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const STATUS_LABELS: Record<Status, string> = {
  DRAFT: "مسودة",
  PENDING_REVIEW: "بانتظار المراجعة",
  APPROVED: "معتمدة",
  REJECTED: "مرفوضة",
  PUBLISHED: "منشورة",
};

const STATUS_COLORS: Record<Status, string> = {
  DRAFT: "bg-slate-200 text-slate-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-green-100 text-green-800",
};

const CATEGORIES = [
  "أخبار المؤسسة",
  "الأنشطة الطلابية",
  "الفعاليات والمؤتمرات",
  "إنجازات الطلاب",
  "المسابقات والجوائز",
  "فرص تعليمية",
  "التدريب وورش العمل",
  "مبادرات طلابية",
  "إعلانات رسمية",
  "مقالات تحريرية",
];

const ADMIN_PASSWORD_KEY = "raya_admin_password";

function getPassword(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || "";
}

function setPassword(pw: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, pw);
}

function clearPassword() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

async function api(path: string, opts: RequestInit = {}) {
  const pw = getPassword();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (pw) headers["x-admin-password"] = pw;
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Login Screen ──────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid password");
      }
      setPassword(pw);
      onLogin();
      toast.success("تم تسجيل الدخول");
    } catch (e: any) {
      toast.error(e.message || "فشل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A382F] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-[#E69744] to-[#C77B2E] mb-3">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="heading-display text-2xl text-[#0A382F]">
            لوحة تحكم راية المستقبل
          </h1>
          <p className="text-sm text-[#5A6B66] mt-1">
            أدخل كلمة مرور المحرر للمتابعة
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="كلمة المرور"
            required
            className="h-12 rounded-md"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0A382F] hover:bg-[#115B46] text-white font-bold rounded-md"
          >
            {loading ? "جارٍ التحقق..." : "دخول"}
          </Button>
        </form>
        <p className="text-xs text-center mt-4 text-[#5A6B66]">
          كلمة المرور الافتراضية: <code className="bg-slate-100 px-1.5 py-0.5 rounded">raya-admin-2026</code>
          <br />
          (يمكن تغييرها عبر متغير البيئة <code>ADMIN_PASSWORD</code>)
        </p>
      </div>
    </div>
  );
}

// ─── Editor Modal ──────────────────────────────────────────────────────

function ArticleEditor({
  article,
  onClose,
  onSaved,
}: {
  article: Article | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(article?.title || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [body, setBody] = useState(article?.body || "");
  const [coverImage, setCoverImage] = useState(article?.coverImage || "");
  const [category, setCategory] = useState(article?.category || CATEGORIES[0]);
  const [tags, setTags] = useState(article?.tags || "");
  const [sourceUrl, setSourceUrl] = useState(article?.sourceUrl || "");
  const [saving, setSaving] = useState(false);

  const save = async (publishNow = false) => {
    if (title.trim().length < 3) {
      toast.error("العنوان قصير جداً (٣ أحرف على الأقل)");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title: title.trim(),
        excerpt: excerpt || null,
        body: body || null,
        coverImage: coverImage || null,
        category,
        tags: tags || null,
        sourceUrl: sourceUrl || null,
        sourcePlatform: article?.sourcePlatform || "manual",
      };
      if (publishNow) payload.status = "PUBLISHED";

      if (article) {
        await api(`/api/articles/${article.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      toast.success(publishNow ? "تم نشر المقال" : "تم حفظ المقال");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="heading-display text-xl text-[#0A382F]">
            {article ? "تعديل مقال" : "مقال جديد"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              العنوان *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان المقال"
              className="h-11 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              المقتطف (excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="ملخص قصير يظهر في بطاقة المقال"
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              النص الكامل
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="نص المقال الكامل..."
              rows={8}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-[#0A382F]">
                القسم
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-[#0A382F]">
                الوسوم (مفصولة بفواصل)
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="تعليم, طلاب, فعاليات"
                className="h-11 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              رابط صورة الغلاف (URL)
            </label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/images/news-1.jpg"
              className="h-11 rounded-md"
              dir="ltr"
            />
            {coverImage && (
              <div className="mt-2 h-32 rounded-md overflow-hidden bg-slate-100">
                <img
                  src={coverImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              رابط المصدر (اختياري)
            </label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://www.facebook.com/..."
              className="h-11 rounded-md"
              dir="ltr"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex flex-wrap gap-2 justify-end rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            variant="outline"
            onClick={() => save(false)}
            disabled={saving}
            className="border-[#0A382F] text-[#0A382F]"
          >
            {saving ? "جارٍ الحفظ..." : "حفظ كمسودة"}
          </Button>
          <Button
            onClick={() => save(true)}
            disabled={saving}
            className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold"
          >
            <Send className="h-4 w-4 ml-1" />
            نشر فوراً
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Import Modal ──────────────────────────────────────────────────────

function ImportModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const sample = `[
  {
    "title": "اعتماد المعهد من الهيئة القومية لضمان جودة التعليم",
    "excerpt": "حصل المعهد على اعتماد الهيئة القومية لضمان جودة التعليم والاعتماد.",
    "body": "نص المقال الكامل...",
    "category": "إعلانات رسمية",
    "coverImage": "/images/news-accreditation.jpg",
    "sourcePlatform": "facebook",
    "sourceId": "fb_post_123",
    "sourceUrl": "https://www.facebook.com/RayaEdu2018/posts/123",
    "originalPubAt": "2024-07-12T10:00:00Z"
  }
]`;

  const doImport = async () => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e: any) {
      toast.error("JSON غير صالح: " + e.message);
      return;
    }
    setLoading(true);
    try {
      const res = await api("/api/articles/import", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      toast.success(
        `تم الاستيراد: ${res.created} جديد، ${res.skipped} مكرر، ${res.failed} فشل`
      );
      if (res.errors?.length) {
        console.warn("Import errors:", res.errors);
      }
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="heading-display text-xl text-[#0A382F]">
            استيراد مقالات من JSON
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#5A6B66]">
            الصق هنا JSON array من المقالات. المقالات المستوردة تبقى كـ
            <strong> مسودات </strong> إلى أن يعتمدها محرر. الاستيراد idempotent —
            إعادة استيراد نفس المقالات (بنفس sourceId) لن يكررها.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={sample}
            rows={12}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-xs font-mono resize-y"
            dir="ltr"
          />
          <details className="text-xs">
            <summary className="cursor-pointer text-[#E69744] font-bold">
              عرض مثال للصيغة
            </summary>
            <pre
              className="mt-2 p-3 bg-slate-50 rounded-md overflow-x-auto text-[10px]"
              dir="ltr"
            >
              {sample}
            </pre>
          </details>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={doImport}
            disabled={loading || !text.trim()}
            className="bg-[#0A382F] hover:bg-[#115B46] text-white font-bold"
          >
            <Upload className="h-4 w-4 ml-1" />
            {loading ? "جارٍ الاستيراد..." : "استيراد"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (getPassword()) {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (statusFilter) params.set("status", statusFilter);
      if (q) params.set("q", q);
      const res = await api(`/api/articles?${params}`);
      setArticles(res.items || []);
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        setAuthed(false);
        clearPassword();
      } else {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, q]);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A382F]">
        <div className="text-white">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const changeStatus = async (a: Article, status: Status) => {
    try {
      await api(`/api/articles/${a.id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success(`تم تحديث الحالة إلى: ${STATUS_LABELS[status]}`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const del = async (a: Article) => {
    if (!confirm(`حذف المقال: "${a.title}"؟`)) return;
    try {
      await api(`/api/articles/${a.id}`, { method: "DELETE" });
      toast.success("تم الحذف");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const logout = () => {
    clearPassword();
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF4ED]">
      {/* Header */}
      <header className="bg-[#0A382F] text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E69744] to-[#C77B2E] flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="heading-display text-xl">لوحة تحكم راية المستقبل</h1>
              <p className="text-xs text-white/60">إدارة محتوى المجلة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <a href="/">
                <Eye className="h-4 w-4 ml-1" />
                عرض الموقع
              </a>
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <Input
              placeholder="بحث..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs h-10 rounded-md"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">كل الحالات</option>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={load}
              disabled={loading}
              className="h-10 border-[#0A382F] text-[#0A382F]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowImport(true)}
              className="border-[#0A382F] text-[#0A382F] hover:bg-[#0A382F] hover:text-white h-10"
            >
              <Upload className="h-4 w-4 ml-1" />
              استيراد JSON
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setShowEditor(true);
              }}
              className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold h-10"
            >
              <Plus className="h-4 w-4 ml-1" />
              مقال جديد
            </Button>
          </div>
        </div>

        {/* Articles table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9E2DC] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#5A6B66]">جارٍ التحميل...</div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
              <p className="text-[#5A6B66] mb-4">لا توجد مقالات بعد</p>
              <Button
                onClick={() => {
                  setEditing(null);
                  setShowEditor(true);
                }}
                className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold"
              >
                <Plus className="h-4 w-4 ml-1" />
                أنشئ أول مقال
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#E9F2EB] text-[#0A382F]">
                  <tr>
                    <th className="text-right p-3 font-bold">العنوان</th>
                    <th className="text-right p-3 font-bold whitespace-nowrap">القسم</th>
                    <th className="text-right p-3 font-bold">الحالة</th>
                    <th className="text-right p-3 font-bold whitespace-nowrap">المصدر</th>
                    <th className="text-right p-3 font-bold whitespace-nowrap">التاريخ</th>
                    <th className="text-center p-3 font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-[#D9E2DC] hover:bg-[#FBF4ED]/50"
                    >
                      <td className="p-3">
                        <div className="font-bold text-[#0A382F] line-clamp-1">
                          {a.title}
                        </div>
                        {a.excerpt && (
                          <div className="text-xs text-[#5A6B66] line-clamp-1 mt-0.5">
                            {a.excerpt}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-xs text-[#5A6B66] whitespace-nowrap">
                        {a.category}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            STATUS_COLORS[a.status]
                          }`}
                        >
                          {STATUS_LABELS[a.status]}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#5A6B66]">
                        {a.sourcePlatform === "facebook" && "فيسبوك"}
                        {a.sourcePlatform === "website" && "الموقع"}
                        {a.sourcePlatform === "manual" && "يدوي"}
                        {a.sourcePlatform === "import" && "استيراد"}
                        {!a.sourcePlatform && "—"}
                      </td>
                      <td className="p-3 text-xs text-[#5A6B66] whitespace-nowrap">
                        {a.publishedAt
                          ? new Date(a.publishedAt).toLocaleDateString("ar-EG")
                          : a.originalPubAt
                          ? new Date(a.originalPubAt).toLocaleDateString("ar-EG")
                          : "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditing(a);
                              setShowEditor(true);
                            }}
                            className="p-1.5 rounded hover:bg-[#0A382F]/10 text-[#0A382F]"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {a.status === "DRAFT" && (
                            <button
                              onClick={() => changeStatus(a, "PENDING_REVIEW")}
                              className="p-1.5 rounded hover:bg-amber-100 text-amber-700"
                              title="إرسال للمراجعة"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          {(a.status === "PENDING_REVIEW" || a.status === "DRAFT") && (
                            <>
                              <button
                                onClick={() => changeStatus(a, "APPROVED")}
                                className="p-1.5 rounded hover:bg-blue-100 text-blue-700"
                                title="اعتماد"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => changeStatus(a, "REJECTED")}
                                className="p-1.5 rounded hover:bg-red-100 text-red-700"
                                title="رفض"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {a.status !== "PUBLISHED" && a.status !== "REJECTED" && (
                            <button
                              onClick={() => changeStatus(a, "PUBLISHED")}
                              className="p-1.5 rounded hover:bg-green-100 text-green-700"
                              title="نشر"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => del(a)}
                            className="p-1.5 rounded hover:bg-red-100 text-red-700"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Facebook API extension note */}
        <div className="mt-6 bg-[#0A382F] text-white rounded-xl p-6">
          <h3 className="heading-display text-lg mb-2 flex items-center gap-2">
            <Upload className="h-5 w-5 text-[#E69744]" />
            تكامل Facebook Graph API (يتطلب إعداد)
          </h3>
          <p className="text-sm text-white/70 leading-relaxed mb-3">
            الاستيراد التلقائي من صفحة Facebook يتطلب إنشاء Meta Developer App
            والحصول على Page Access Token. حالياً، استخدم زر
            <strong className="text-[#E69744]"> "استيراد JSON" </strong>
            لرفع بوستات تم تصديرها يدوياً من Facebook (Data Export) أو من Google
            Drive الذي تجهّزه.
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer text-[#E69744] font-bold mb-2">
              خطوات تفعيل Facebook API (اختياري - للمستقبل)
            </summary>
            <ol className="list-decimal list-inside space-y-1 text-white/70 mt-2">
              <li>إنشاء Meta Developer Account على developers.facebook.com</li>
              <li>إنشاء Facebook App جديد</li>
              <li>طلب صلاحية pages_read_engagement (تتطلب App Review)</li>
              <li>الحصول على Page Access Token من أدمن الصفحة</li>
              <li>إضافة المتغيرات في .env: FB_APP_ID, FB_APP_SECRET, FB_PAGE_TOKEN</li>
              <li>توسيع endpoint &quot;/api/articles/sync-facebook&quot; (نقطة extension جاهزة)</li>
            </ol>
          </details>
        </div>
      </main>

      {showEditor && (
        <ArticleEditor
          article={editing}
          onClose={() => setShowEditor(false)}
          onSaved={load}
        />
      )}
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onDone={load}
        />
      )}
    </div>
  );
}
