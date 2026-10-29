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
  CheckSquare,
  Square,
  BarChart3,
  Layers,
  Zap,
  Users,
  UserPlus,
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
const ADMIN_EMAIL_KEY = "raya_admin_email";
const ADMIN_TOKEN_KEY = "raya_admin_token";
const ADMIN_USER_KEY = "raya_admin_user";

type SessionInfo = {
  mode: "master" | "member";
  user?: { id: string; email: string; name: string | null; role: string };
};

function getStoredSession(): SessionInfo | null {
  if (typeof window === "undefined") return null;
  const pw = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
  if (pw) return { mode: "master" };
  const email = sessionStorage.getItem(ADMIN_EMAIL_KEY);
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  const userJson = sessionStorage.getItem(ADMIN_USER_KEY);
  if (email && token && userJson) {
    try {
      const user = JSON.parse(userJson);
      return { mode: "member", user };
    } catch {
      return null;
    }
  }
  return null;
}

function setMasterSession(pw: string) {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, pw);
}

function setMemberSession(email: string, token: string, user: any) {
  sessionStorage.setItem(ADMIN_EMAIL_KEY, email);
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

function hasSession(): boolean {
  return getStoredSession() !== null;
}

async function api(path: string, opts: RequestInit = {}) {
  const session = getStoredSession();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (session?.mode === "master") {
    headers["x-admin-password"] = sessionStorage.getItem(ADMIN_PASSWORD_KEY) || "";
  } else if (session?.mode === "member" && session.user) {
    headers["x-admin-email"] = session.user.email;
    headers["x-admin-token"] = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
    headers["x-current-user-id"] = session.user.id;
  }
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Login Screen ──────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"master" | "member">("master");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload =
        mode === "master"
          ? { password: pw }
          : { email, password: memberPw };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid credentials");
      }
      const data = await res.json();
      if (data.mode === "member" && data.user) {
        setMemberSession(email, memberPw, data.user);
      } else {
        setMasterSession(pw);
      }
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
            {mode === "master"
              ? "ادخل بكلمة مرور المشرف العام"
              : "ادخل ببريدك الإلكتروني وكلمة المرور"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-md mb-5">
          <button
            type="button"
            onClick={() => setMode("master")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors " +
              (mode === "master"
                ? "bg-white text-[#0A382F] shadow-sm"
                : "text-[#5A6B66]")
            }
          >
            المشرف العام
          </button>
          <button
            type="button"
            onClick={() => setMode("member")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors " +
              (mode === "member"
                ? "bg-white text-[#0A382F] shadow-sm"
                : "text-[#5A6B66]")
            }
          >
            عضو هيئة التحرير
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "master" ? (
            <Input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="كلمة مرور المشرف العام"
              required
              className="h-12 rounded-md"
              autoFocus
            />
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
                className="h-12 rounded-md"
                autoFocus
                dir="ltr"
              />
              <Input
                type="password"
                value={memberPw}
                onChange={(e) => setMemberPw(e.target.value)}
                placeholder="كلمة المرور"
                required
                className="h-12 rounded-md"
              />
            </>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0A382F] hover:bg-[#115B46] text-white font-bold rounded-md"
          >
            {loading ? "جارٍ التحقق..." : "دخول"}
          </Button>
        </form>
        {mode === "master" && (
          <p className="text-xs text-center mt-4 text-[#5A6B66]">
            كلمة المرور الافتراضية:{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">
              raya-admin-2026
            </code>
          </p>
        )}
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

// ─── Add Member Modal ──────────────────────────────────────────────────

function AddMemberModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (name.trim().length < 2) {
      toast.error("الاسم مطلوب (حرفان على الأقل)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("بريد إلكتروني غير صالح");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون ٦ أحرف على الأقل");
      return;
    }
    setSaving(true);
    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email, password, role }),
      });
      toast.success("تم إضافة العضو بنجاح");
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="heading-display text-xl text-[#0A382F] flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#E69744]" />
            إضافة عضو جديد
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              الاسم *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد أحمد"
              className="h-11 rounded-md"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              البريد الإلكتروني *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@raya.edu"
              className="h-11 rounded-md"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              كلمة المرور * (٦ أحرف على الأقل)
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="h-11 rounded-md"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#0A382F]">
              الدور
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("editor")}
                className={
                  "flex-1 py-2 text-sm font-bold rounded-md border transition-colors " +
                  (role === "editor"
                    ? "bg-[#0A382F] text-white border-[#0A382F]"
                    : "bg-white text-[#5A6B66] border-[#D9E2DC]")
                }
              >
                محرر
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={
                  "flex-1 py-2 text-sm font-bold rounded-md border transition-colors " +
                  (role === "admin"
                    ? "bg-[#0A382F] text-white border-[#0A382F]"
                    : "bg-white text-[#5A6B66] border-[#D9E2DC]")
                }
              >
                مشرف
              </button>
            </div>
          </div>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold"
          >
            <UserPlus className="h-4 w-4 ml-1" />
            {saving ? "جارٍ الإضافة..." : "إضافة العضو"}
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "members">("articles");
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (hasSession()) {
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
        clearSession();
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

  // ─── Members management (hooks must be before any early return) ─────
  const loadMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const res = await api("/api/users");
      setMembers(res.items || []);
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        setAuthed(false);
        clearSession();
      } else {
        toast.error(e.message);
      }
    } finally {
      setMembersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && activeTab === "members") {
      loadMembers();
    }
  }, [authed, activeTab, loadMembers]);

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

  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`حذف العضو "${name}"؟`)) return;
    try {
      await api(`/api/users/${id}`, { method: "DELETE" });
      toast.success("تم حذف العضو");
      loadMembers();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const logout = () => {
    clearSession();
    setAuthed(false);
  };

  // ─── Bulk selection helpers ───────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (prev.size === articles.length) return new Set();
      return new Set(articles.map((a) => a.id));
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkAction = async (action: string) => {
    if (selected.size === 0) {
      toast.error("حدد مقالاً واحداً على الأقل");
      return;
    }
    if (
      action === "delete" &&
      !confirm(`حذف ${selected.size} مقال نهائياً؟`)
    ) {
      return;
    }
    setBulkLoading(true);
    try {
      const res = await api("/api/articles/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      toast.success(
        `تم تنفيذ العملية على ${res.affected} مقال من أصل ${res.requested}`
      );
      clearSelection();
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBulkLoading(false);
    }
  };

  // ─── Statistics ───────────────────────────────────────────────────────
  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "PUBLISHED").length,
    draft: articles.filter((a) => a.status === "DRAFT").length,
    pending: articles.filter((a) => a.status === "PENDING_REVIEW").length,
    approved: articles.filter((a) => a.status === "APPROVED").length,
    rejected: articles.filter((a) => a.status === "REJECTED").length,
  };
  const categoriesCount = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        {/* ─── Tab Switcher ─── */}
        <div className="flex gap-1 p-1 bg-white rounded-lg border border-[#D9E2DC] mb-6 max-w-md">
          <button
            onClick={() => setActiveTab("articles")}
            className={
              "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
              (activeTab === "articles"
                ? "bg-[#0A382F] text-white"
                : "text-[#5A6B66] hover:bg-[#E9F2EB]")
            }
          >
            <FileText className="h-4 w-4" />
            المقالات
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={
              "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
              (activeTab === "members"
                ? "bg-[#0A382F] text-white"
                : "text-[#5A6B66] hover:bg-[#E9F2EB]")
            }
          >
            <Users className="h-4 w-4" />
            الأعضاء
          </button>
        </div>

        {/* ═══════════════ ARTICLES TAB ═══════════════ */}
        {activeTab === "articles" && (
          <>
        {/* ─── Statistics Dashboard ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-[#0A382F]/10 flex items-center justify-center flex-shrink-0">
              <Layers className="h-5 w-5 text-[#0A382F]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0A382F]">{stats.total}</div>
              <div className="text-[11px] text-[#5A6B66]">إجمالي</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.published}</div>
              <div className="text-[11px] text-[#5A6B66]">منشورة</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-700">{stats.draft}</div>
              <div className="text-[11px] text-[#5A6B66]">مسودات</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Send className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
              <div className="text-[11px] text-[#5A6B66]">بانتظار المراجعة</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.approved}</div>
              <div className="text-[11px] text-[#5A6B66]">معتمدة</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
              <div className="text-[11px] text-[#5A6B66]">مرفوضة</div>
            </div>
          </div>
        </div>

        {/* Categories breakdown */}
        {Object.keys(categoriesCount).length > 0 && (
          <div className="bg-white rounded-lg border border-[#D9E2DC] p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-[#0A382F]" />
              <h3 className="text-sm font-bold text-[#0A382F]">توزيع المقالات حسب القسم</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoriesCount)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A382F]/5 text-[#0A382F] text-xs font-medium"
                  >
                    {cat}
                    <span className="bg-[#E69744]/20 text-[#C77B2E] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {count}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Bulk actions bar — visible when items are selected */}
        {selected.size > 0 && (
          <div className="bg-[#0A382F] text-white rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2 sticky top-[80px] z-30 shadow-lg">
            <span className="text-sm font-bold flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#E69744]" />
              {selected.size} مقال محدد
            </span>
            <span className="opacity-30">|</span>
            <button
              onClick={() => bulkAction("publish")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              نشر الكل
            </button>
            <button
              onClick={() => bulkAction("approve")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              اعتماد الكل
            </button>
            <button
              onClick={() => bulkAction("send_to_review")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              إرسال للمراجعة
            </button>
            <button
              onClick={() => bulkAction("unpublish")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileText className="h-3.5 w-3.5" />
              إلغاء النشر
            </button>
            <button
              onClick={() => bulkAction("reject")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              رفض الكل
            </button>
            <button
              onClick={() => bulkAction("delete")}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف الكل
            </button>
            <button
              onClick={clearSelection}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-bold mr-auto"
            >
              إلغاء التحديد
            </button>
          </div>
        )}

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
                    <th className="p-3 font-bold w-10">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center justify-center"
                        aria-label="تحديد الكل"
                      >
                        {selected.size === articles.length && articles.length > 0 ? (
                          <CheckSquare className="h-5 w-5 text-[#E69744]" />
                        ) : (
                          <Square className="h-5 w-5 text-[#5A6B66]" />
                        )}
                      </button>
                    </th>
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
                      className={
                        "border-t border-[#D9E2DC] hover:bg-[#FBF4ED]/50 " +
                        (selected.has(a.id) ? "bg-[#E69744]/10" : "")
                      }
                    >
                      <td className="p-3">
                        <button
                          onClick={() => toggleSelect(a.id)}
                          className="flex items-center justify-center"
                          aria-label="تحديد المقال"
                        >
                          {selected.has(a.id) ? (
                            <CheckSquare className="h-5 w-5 text-[#E69744]" />
                          ) : (
                            <Square className="h-5 w-5 text-[#5A6B66]/60" />
                          )}
                        </button>
                      </td>
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
          </>
        )}

        {/* ═══════════════ MEMBERS TAB ═══════════════ */}
        {activeTab === "members" && (
          <>
            {/* Members header + add button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0A382F]">
                  إدارة الأعضاء
                </h2>
                <p className="text-sm text-[#5A6B66] mt-1">
                  أضف وحذف أعضاء هيئة التحرير — لكل عضو بريد إلكتروني وكلمة مرور خاصة
                </p>
              </div>
              <Button
                onClick={() => setShowAddMember(true)}
                className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold h-10"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة عضو
              </Button>
            </div>

            {/* Members list */}
            <div className="bg-white rounded-xl shadow-sm border border-[#D9E2DC] overflow-hidden">
              {membersLoading ? (
                <div className="p-12 text-center text-[#5A6B66]">جارٍ التحميل...</div>
              ) : members.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                  <p className="text-[#5A6B66] mb-4">لا يوجد أعضاء مسجلون بعد</p>
                  <p className="text-xs text-[#5A6B66]/60 mb-4">
                    أضف أعضاء هيئة التحرير ليتمكنوا من تسجيل الدخول ببريدهم وكلمة مرورهم
                  </p>
                  <Button
                    onClick={() => setShowAddMember(true)}
                    className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold"
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة أول عضو
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#E9F2EB] text-[#0A382F]">
                      <tr>
                        <th className="text-right p-3 font-bold">الاسم</th>
                        <th className="text-right p-3 font-bold">البريد الإلكتروني</th>
                        <th className="text-right p-3 font-bold">الدور</th>
                        <th className="text-right p-3 font-bold whitespace-nowrap">تاريخ الإضافة</th>
                        <th className="text-center p-3 font-bold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => {
                        const session = getStoredSession();
                        const isSelf = session?.mode === "member" && session.user?.id === m.id;
                        return (
                          <tr
                            key={m.id}
                            className="border-t border-[#D9E2DC] hover:bg-[#FBF4ED]/50"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#0A382F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {m.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <div className="font-bold text-[#0A382F]">
                                    {m.name || "—"}
                                    {isSelf && (
                                      <span className="ml-2 text-[10px] bg-[#E69744]/20 text-[#C77B2E] px-1.5 py-0.5 rounded font-normal">
                                        أنت
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[#5A6B66] text-xs" dir="ltr">
                              {m.email}
                            </td>
                            <td className="p-3">
                              <span
                                className={
                                  "inline-block px-2 py-0.5 rounded-full text-xs font-bold " +
                                  (m.role === "admin"
                                    ? "bg-[#E69744]/15 text-[#C77B2E]"
                                    : "bg-blue-100 text-blue-700")
                                }
                              >
                                {m.role === "admin" ? "مشرف" : "محرر"}
                              </span>
                            </td>
                            <td className="p-3 text-xs text-[#5A6B66] whitespace-nowrap">
                              {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => deleteMember(m.id, m.name || m.email)}
                                disabled={isSelf}
                                className={
                                  "p-1.5 rounded transition-colors " +
                                  (isSelf
                                    ? "text-[#5A6B66]/30 cursor-not-allowed"
                                    : "hover:bg-red-100 text-red-700")
                                }
                                title={isSelf ? "لا يمكنك حذف حسابك" : "حذف العضو"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Info note */}
            <div className="mt-6 bg-[#E9F2EB] rounded-lg p-4 border border-[#D9E2DC]">
              <h4 className="text-sm font-bold text-[#0A382F] mb-2">
                ℹ️ كيف يعمل نظام الأعضاء؟
              </h4>
              <ul className="text-xs text-[#5A6B66] space-y-1 leading-relaxed list-disc list-inside">
                <li>كل عضو يسجل الدخول ببريده الإلكتروني وكلمة المرور الخاصة به</li>
                <li>المشرف العام يدخل بكلمة المرور الموحدة (الموجودة في متغير البيئة)</li>
                <li>كل الأعضاء لهم نفس صلاحيات إدارة المقالات</li>
                <li>لا يمكن للعضو حذف حسابه أثناء استخدامه</li>
                <li>كلمات المرور مشفّرة بـ bcrypt — لا تُخزن كنص صريح</li>
              </ul>
            </div>
          </>
        )}
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
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onDone={loadMembers}
        />
      )}
    </div>
  );
}
