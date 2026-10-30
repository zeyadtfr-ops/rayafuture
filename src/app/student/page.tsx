"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  LogOut,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  UserPlus,
  LogIn,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────

type StudentUser = {
  id: string;
  studentCode: string;
  name: string;
  role: string;
};

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string;
  coverImage: string | null;
  status: string;
  createdAt: string;
  publishedAt: string | null;
};

// ─── Session helpers (localStorage for students) ────────────────────────

const STUDENT_KEY = "raya_student_session";

function getStudentSession(): StudentUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStudentSession(user: StudentUser, token: string) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify({ user, token }));
}

function getStudentToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw).token || null;
  } catch {
    return null;
  }
}

function clearStudentSession() {
  localStorage.removeItem(STUDENT_KEY);
}

async function studentApi(path: string, opts: RequestInit = {}) {
  const session = getStudentSession();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (session) {
    headers["x-student-code"] = session.studentCode;
    headers["x-student-token"] = getStudentToken() || "";
  }
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth Screen (Login + Register) ─────────────────────────────────────

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [studentCode, setStudentCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        mode === "login"
          ? "/api/auth/student/login"
          : "/api/auth/student/register";

      const payload: any = { studentCode, password };
      if (mode === "register") payload.name = name;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل العملية");
      }

      // Store session
      setStudentSession(data.user, password);
      toast.success(
        mode === "login"
          ? `أهلاً ${data.user.name || data.user.studentCode}!`
          : "تم التسجيل بنجاح!"
      );
      onAuth();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#032B22] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A04A] to-[#A07B2E] mb-3">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#032B22]">
            بوابة الطلاب — راية المستقبل
          </h1>
          <p className="text-sm text-[#5A6B66] mt-1">
            {mode === "login"
              ? "سجل دخولك بكود الطالب الخاص بك"
              : "سجل حسابك الجديد بكود الطالب"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-md mb-5">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors flex items-center justify-center gap-1.5 " +
              (mode === "login"
                ? "bg-white text-[#032B22] shadow-sm"
                : "text-[#5A6B66]")
            }
          >
            <LogIn className="h-4 w-4" />
            تسجيل دخول
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors flex items-center justify-center gap-1.5 " +
              (mode === "register"
                ? "bg-white text-[#032B22] shadow-sm"
                : "text-[#5A6B66]")
            }
          >
            <UserPlus className="h-4 w-4" />
            حساب جديد
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-bold mb-1 text-[#032B22]">
                الاسم الكامل *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: محمد أحمد"
                required
                className="h-12 rounded-md"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
              كود الطالب *
            </label>
            <Input
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="مثال: RAYA-2026-001"
              required
              className="h-12 rounded-md"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
              كلمة المرور * (٦ أحرف على الأقل)
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="h-12 rounded-md"
              dir="ltr"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#032B22] hover:bg-[#063D30] text-white font-bold rounded-md"
          >
            {loading
              ? "جارٍ المعالجة..."
              : mode === "login"
              ? "دخول"
              : "تسجيل"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#DED6C5]">
          <p className="text-xs text-center text-[#5A6B66]">
            هل أنت من هيئة التحرير؟{" "}
            <a href="/admin" className="text-[#C9A04A] font-bold hover:underline">
              ادخل من هنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Article Submit Modal ───────────────────────────────────────────────

function SubmitArticleModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("مقالات تحريرية");
  const [saving, setSaving] = useState(false);

  const CATEGORIES = [
    "مقالات تحريرية",
    "أنشطة طلابية",
    "حوار",
    "رأي",
    "تربية وتعليم",
    "إنجازات الطلاب",
    "مبادرات طلابية",
  ];

  const save = async () => {
    if (title.trim().length < 3) {
      toast.error("العنوان قصير جداً");
      return;
    }
    setSaving(true);
    try {
      await studentApi("/api/student/articles", {
        method: "POST",
        body: JSON.stringify({ title, excerpt, body, category }),
      });
      toast.success("تم إرسال مقالك للمراجعة!");
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-[#032B22]">
            إرسال مقال جديد
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
              العنوان *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مقالك"
              className="h-11 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
              مقتطف قصير
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="ملخص قصير لمقالك..."
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
              نص المقال
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب مقالك هنا..."
              rows={10}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[#032B22]">
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
          <div className="bg-[#EFE9DA] rounded-md p-3 text-xs text-[#5A6B66]">
            ℹ️ مقالك سيُرسل كهيئة تحرير للمراجعة. لن يُنشر إلا بعد موافقة
            المحررين.
          </div>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2 sticky bottom-0 bg-white">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-[#C9A04A] hover:bg-[#A07B2E] text-white font-bold"
          >
            <Send className="h-4 w-4 ml-1" />
            {saving ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Student Dashboard ──────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "قيد المراجعة",
  PENDING_REVIEW: "بانتظار المراجعة",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
  PUBLISHED: "منشور",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  DRAFT: <Clock className="h-4 w-4 text-amber-600" />,
  PENDING_REVIEW: <Clock className="h-4 w-4 text-amber-600" />,
  APPROVED: <CheckCircle2 className="h-4 w-4 text-blue-600" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-600" />,
  PUBLISHED: <CheckCircle2 className="h-4 w-4 text-green-600" />,
};

export default function StudentPage() {
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [published, setPublished] = useState<Article[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [view, setView] = useState<"published" | "mine">("published");

  useEffect(() => {
    const session = getStudentSession();
    if (session) setStudent(session);
    setChecking(false);
  }, []);

  const loadData = useCallback(async () => {
    if (!getStudentSession()) return;
    setLoading(true);
    try {
      const data = await studentApi("/api/student/articles");
      setPublished(data.published || []);
      setMySubmissions(data.mySubmissions || []);
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        clearStudentSession();
        setStudent(null);
      } else {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student) loadData();
  }, [student, loadData]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#032B22]">
        <div className="text-white">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!student) {
    return <AuthScreen onAuth={() => setStudent(getStudentSession())} />;
  }

  const logout = () => {
    clearStudentSession();
    setStudent(null);
  };

  const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F6F2E9]">
      {/* Header */}
      <header className="bg-[#032B22] text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C9A04A] to-[#A07B2E] flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                بوابة الطلاب — راية المستقبل
              </h1>
              <p className="text-xs text-white/60">
                أهلاً، {student.name} ({student.studentCode})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <a href="/">
                <Eye className="h-4 w-4 ml-1" />
                الموقع
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
        {/* Welcome card */}
        <div className="bg-[#032B22] text-white rounded-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              مرحباً، {student.name}! 👋
            </h2>
            <p className="text-sm text-white/70">
              شارك مقالاتك وقصصك مع مجتمع راية المستقبل
            </p>
          </div>
          <Button
            onClick={() => setShowSubmit(true)}
            className="bg-[#C9A04A] hover:bg-[#A07B2E] text-white font-bold h-11 px-5"
          >
            <Plus className="h-4 w-4 ml-1" />
            إرسال مقال
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#DED6C5] p-4 text-center">
            <div className="text-3xl font-bold text-[#032B22]">
              {mySubmissions.length}
            </div>
            <div className="text-xs text-[#5A6B66] mt-1">مقالاتي المُرسلة</div>
          </div>
          <div className="bg-white rounded-lg border border-[#DED6C5] p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {mySubmissions.filter((a) => a.status === "PUBLISHED").length}
            </div>
            <div className="text-xs text-[#5A6B66] mt-1">منشورة</div>
          </div>
          <div className="bg-white rounded-lg border border-[#DED6C5] p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {
                mySubmissions.filter(
                  (a) => a.status === "DRAFT" || a.status === "PENDING_REVIEW"
                ).length
              }
            </div>
            <div className="text-xs text-[#5A6B66] mt-1">قيد المراجعة</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-white rounded-lg border border-[#DED6C5] mb-6 max-w-md">
          <button
            onClick={() => setView("published")}
            className={
              "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
              (view === "published"
                ? "bg-[#032B22] text-white"
                : "text-[#5A6B66] hover:bg-[#EFE9DA]")
            }
          >
            <Eye className="h-4 w-4" />
            المقالات المنشورة
          </button>
          <button
            onClick={() => setView("mine")}
            className={
              "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
              (view === "mine"
                ? "bg-[#032B22] text-white"
                : "text-[#5A6B66] hover:bg-[#EFE9DA]")
            }
          >
            <FileText className="h-4 w-4" />
            مقالاتي ({mySubmissions.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-[#5A6B66] py-12">جارٍ التحميل...</div>
        ) : view === "published" ? (
          /* Published articles grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#5A6B66]">
                لا توجد مقالات منشورة بعد
              </div>
            ) : (
              published.slice(0, 12).map((a) => (
                <article
                  key={a.id}
                  className="bg-white rounded-md overflow-hidden border border-[#DED6C5] hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden bg-[#032B22]">
                    {a.coverImage && (
                      <img
                        src={a.coverImage}
                        alt={a.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3 bg-[#C9A04A] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {a.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-[#5A6B66] mb-1.5">
                      {a.publishedAt
                        ? AR_DATE.format(new Date(a.publishedAt))
                        : AR_DATE.format(new Date(a.createdAt))}
                    </div>
                    <h3 className="text-base font-bold text-[#032B22] leading-snug mb-1.5 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-[13px] text-[#5A6B66] leading-relaxed line-clamp-2">
                      {a.excerpt || ""}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : (
          /* My submissions */
          <div className="bg-white rounded-xl border border-[#DED6C5] overflow-hidden">
            {mySubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                <p className="text-[#5A6B66] mb-4">
                  لم ترسل أي مقال بعد
                </p>
                <Button
                  onClick={() => setShowSubmit(true)}
                  className="bg-[#C9A04A] hover:bg-[#A07B2E] text-white font-bold"
                >
                  <Plus className="h-4 w-4 ml-1" />
                  أرسل أول مقال
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#EFE9DA] text-[#032B22]">
                  <tr>
                    <th className="text-right p-3 font-bold">العنوان</th>
                    <th className="text-right p-3 font-bold">القسم</th>
                    <th className="text-right p-3 font-bold">الحالة</th>
                    <th className="text-right p-3 font-bold whitespace-nowrap">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-[#DED6C5] hover:bg-[#F6F2E9]/50"
                    >
                      <td className="p-3">
                        <div className="font-bold text-[#032B22] line-clamp-1">
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
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                          {STATUS_ICONS[a.status]}
                          {STATUS_LABELS[a.status] || a.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#5A6B66] whitespace-nowrap">
                        {AR_DATE.format(new Date(a.createdAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {showSubmit && (
        <SubmitArticleModal
          onClose={() => setShowSubmit(false)}
          onDone={loadData}
        />
      )}
    </div>
  );
}
