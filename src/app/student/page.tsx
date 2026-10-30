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
  Plus,
  ArrowLeft,
  UserPlus,
  LogIn,
  Calendar,
  GraduationCap,
  Bookmark,
  Bell,
  Trash2,
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

// ─── Session helpers ────────────────────────────────────────────────────

const STUDENT_KEY = "raya_student_session";

function getStudentSession(): { user: StudentUser; token: string } | null {
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
    headers["x-student-code"] = session.user.studentCode;
    headers["x-student-token"] = session.token;
  }
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ─── Auth Screen ────────────────────────────────────────────────────────

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
      if (!res.ok) throw new Error(data.error || "فشل العملية");

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
    <div className="min-h-screen flex items-center justify-center bg-forest px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-gold to-[#A07B2E] mb-3">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-forest">
            بوابة الطلاب
          </h1>
          <p className="text-sm text-[#5A6B66] mt-1">
            مجلة راية المستقبل
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 rounded-md mb-5">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors flex items-center justify-center gap-1.5 " +
              (mode === "login"
                ? "bg-white text-forest shadow-sm"
                : "text-[#5A6B66]")
            }
          >
            <LogIn className="h-4 w-4" />
            دخول
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={
              "flex-1 py-2 text-sm font-bold rounded transition-colors flex items-center justify-center gap-1.5 " +
              (mode === "register"
                ? "bg-white text-forest shadow-sm"
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
              <label className="block text-sm font-bold mb-1 text-forest">
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
            <label className="block text-sm font-bold mb-1 text-forest">
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
            <label className="block text-sm font-bold mb-1 text-forest">
              كلمة المرور *
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
            className="w-full h-12 bg-forest hover:bg-brand-green text-paper font-bold rounded-md"
          >
            {loading ? "جارٍ المعالجة..." : mode === "login" ? "دخول" : "تسجيل"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border-warm">
          <p className="text-xs text-center text-[#5A6B66]">
            هيئة التحرير؟{" "}
            <a href="/admin" className="text-gold font-bold hover:underline">
              ادخل من هنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Article Modal ───────────────────────────────────────────────

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
          <h2 className="text-xl font-bold text-forest">إرسال مقال جديد</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-forest">
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
            <label className="block text-sm font-bold mb-1 text-forest">
              مقتطف قصير
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="ملخص قصير..."
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-forest">
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
            <label className="block text-sm font-bold mb-1 text-forest">
              القسم
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="bg-paper-warm rounded-md p-3 text-xs text-[#5A6B66]">
            ℹ️ مقالك سيُرسل لهيئة التحرير للمراجعة. لن يُنشر إلا بعد الموافقة.
          </div>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2 sticky bottom-0 bg-white">
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-gold hover:bg-[#A07B2E] text-white font-bold"
          >
            <Send className="h-4 w-4 ml-1" />
            {saving ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Student Page (Magazine-style) ─────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "قيد المراجعة",
  PENDING_REVIEW: "بانتظار المراجعة",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
  PUBLISHED: "منشور",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-800",
  PENDING_REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-green-100 text-green-800",
};

export default function StudentPage() {
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [published, setPublished] = useState<Article[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [view, setView] = useState<"magazine" | "mine" | "saved">("magazine");
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const session = getStudentSession();
    if (session) setStudent(session.user);
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
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved articles
  const loadSaved = useCallback(async () => {
    if (!getStudentSession()) return;
    try {
      const data = await studentApi("/api/student/saved");
      setSavedArticles(data.items || []);
      setSavedIds(new Set((data.items || []).map((a: any) => a.id)));
    } catch { /* ignore */ }
  }, []);

  // Load notifications
  const loadNotifs = useCallback(async () => {
    if (!getStudentSession()) return;
    try {
      const data = await studentApi("/api/student/notifications");
      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (student) {
      loadData();
      loadSaved();
      loadNotifs();
    }
  }, [student, loadData, loadSaved, loadNotifs]);

  // Toggle save article
  const toggleSave = async (articleId: string) => {
    const isSaved = savedIds.has(articleId);
    try {
      if (isSaved) {
        await studentApi("/api/student/saved", { method: "DELETE", body: JSON.stringify({ articleId }) });
        setSavedIds((prev) => { const n = new Set(prev); n.delete(articleId); return n; });
        setSavedArticles((prev) => prev.filter((a) => a.id !== articleId));
        toast.success("تمت الإزالة من المحفوظات");
      } else {
        await studentApi("/api/student/saved", { method: "POST", body: JSON.stringify({ articleId }) });
        setSavedIds((prev) => new Set(prev).add(articleId));
        toast.success("تم حفظ المقال");
        loadSaved();
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      await studentApi("/api/student/notifications", { method: "POST", body: JSON.stringify({ markAllRead: true }) });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest">
        <div className="text-paper">جارٍ التحميل...</div>
      </div>
    );
  }

  if (!student) {
    return <AuthScreen onAuth={() => {
      const s = getStudentSession();
      if (s) setStudent(s.user);
    }} />;
  }

  const logout = () => {
    clearStudentSession();
    setStudent(null);
  };

  const publishedCount = mySubmissions.filter((a) => a.status === "PUBLISHED").length;
  const pendingCount = mySubmissions.filter(
    (a) => a.status === "DRAFT" || a.status === "PENDING_REVIEW"
  ).length;

  return (
    <div className="min-h-screen bg-paper">
      {/* ─── Header (matches main site) ─── */}
      <header className="bg-forest text-paper sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/student" className="flex flex-col leading-tight">
              <span className="text-lg font-bold">راية المستقبل</span>
              <span className="text-[9px] tracking-[0.2em] text-gold uppercase font-medium">
                RAYA · E-MAGAZINE
              </span>
            </a>
            <div className="flex items-center gap-2">
              <span className="hidden md:flex items-center gap-1.5 text-xs text-paper/70 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                <GraduationCap className="h-3.5 w-3.5 text-gold" />
                {student.name} ({student.studentCode})
              </span>
              <a
                href="/"
                className="hidden md:flex h-9 px-3 items-center gap-1.5 rounded-md bg-white/5 text-paper/80 hover:bg-white/10 text-sm font-medium border border-white/10"
              >
                <Eye className="h-4 w-4" />
                الموقع
              </a>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotifs((s) => !s); if (!showNotifs && unreadCount > 0) markAllRead(); }}
                  className="relative h-9 w-9 flex items-center justify-center rounded-md bg-white/5 text-paper/80 hover:bg-white/10 border border-white/10"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute left-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-border-warm z-50">
                    <div className="p-3 border-b border-border-warm flex items-center justify-between">
                      <span className="font-bold text-forest text-sm">الإشعارات</span>
                      {notifications.length > 0 && (
                        <button onClick={markAllRead} className="text-xs text-gold hover:underline">
                          تعليم الكل كمقروء
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[#5A6B66] text-sm">
                        <Bell className="h-8 w-8 text-[#5A6B66]/30 mx-auto mb-2" />
                        لا توجد إشعارات
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={"p-3 border-b border-border-warm last:border-0 " + (!n.isRead ? "bg-gold/5" : "")}
                        >
                          <div className="flex items-start gap-2">
                            <div className={
                              "flex-shrink-0 w-2 h-2 rounded-full mt-1.5 " +
                              (n.type === "article_published" ? "bg-green-500" :
                               n.type === "article_rejected" ? "bg-red-500" :
                               n.type === "success" ? "bg-blue-500" : "bg-gold")
                            } />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-forest line-clamp-1">{n.title}</p>
                              <p className="text-xs text-[#5A6B66] line-clamp-2 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-[#5A6B66]/60 mt-1">
                                {new Intl.DateTimeFormat("ar-EG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(n.createdAt))}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="h-9 px-3 flex items-center gap-1.5 rounded-md bg-gold/10 text-gold hover:bg-gold/20 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Welcome banner ─── */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="s-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#C9A04A" strokeWidth="0.6" />
              <circle cx="40" cy="40" r="14" fill="none" stroke="#F6F2E9" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s-pat)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 py-12 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">
              بوابة الطلاب
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              مرحباً، {student.name}! 👋
            </h1>
            <p className="text-lg text-paper/80 mb-6 leading-relaxed">
              تصفّح أحدث مقالات المجلة وشارك بمقالاتك وقصصك مع مجتمع راية المستقبل
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowSubmit(true)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-[#A07B2E] text-white font-bold px-5 py-2.5 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                شارك بمقال
              </button>
              <div className="flex items-center gap-4 text-sm text-paper/70">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gold" />
                  {mySubmissions.length} مقال أرسلته
                </span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {publishedCount} منشور
                </span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {pendingCount} قيد المراجعة
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* ─── Tab switcher ─── */}
      <section className="bg-paper py-6 border-b border-border-warm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 p-1 bg-white rounded-lg border border-border-warm max-w-2xl">
            <button
              onClick={() => setView("magazine")}
              className={
                "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
                (view === "magazine"
                  ? "bg-forest text-paper"
                  : "text-[#5A6B66] hover:bg-paper-warm")
              }
            >
              <Eye className="h-4 w-4" />
              تصفّح المجلة
            </button>
            <button
              onClick={() => setView("saved")}
              className={
                "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
                (view === "saved"
                  ? "bg-forest text-paper"
                  : "text-[#5A6B66] hover:bg-paper-warm")
              }
            >
              <Bookmark className="h-4 w-4" />
              محفوظات ({savedArticles.length})
            </button>
            <button
              onClick={() => setView("mine")}
              className={
                "flex-1 py-2.5 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 " +
                (view === "mine"
                  ? "bg-forest text-paper"
                  : "text-[#5A6B66] hover:bg-paper-warm")
              }
            >
              <FileText className="h-4 w-4" />
              مقالاتي ({mySubmissions.length})
            </button>
          </div>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <main className="bg-paper py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-[#5A6B66] py-12">جارٍ التحميل...</div>
          ) : view === "magazine" ? (
            /* ─── Magazine view (same as public site) ─── */
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-forest">
                  أحدث المقالات
                </h2>
                <button
                  onClick={() => setShowSubmit(true)}
                  className="text-sm text-gold hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="h-3.5 w-3.5" />
                  شارك بمقال
                </button>
              </div>
              {published.length === 0 ? (
                <div className="text-center py-12 text-[#5A6B66]">
                  لا توجد مقالات منشورة بعد
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {published.map((a) => (
                    <article
                      key={a.id}
                      className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-40 overflow-hidden bg-forest">
                        {a.coverImage && (
                          <img
                            src={a.coverImage}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-gold text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {a.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-[11px] text-[#5A6B66] mb-1.5 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {a.publishedAt
                            ? AR_DATE.format(new Date(a.publishedAt))
                            : AR_DATE.format(new Date(a.createdAt))}
                        </div>
                        <h3 className="text-base font-bold text-forest leading-snug mb-1.5 group-hover:text-gold transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="text-[13px] text-[#5A6B66] leading-relaxed line-clamp-2">
                          {a.excerpt || ""}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : view === "saved" ? (
            /* ─── Saved articles view ─── */
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-forest">المحفوظات</h2>
              </div>

              {savedArticles.length === 0 ? (
                <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
                  <Bookmark className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                  <p className="text-[#5A6B66]">لم تحفظ أي مقال بعد</p>
                  <p className="text-xs text-[#5A6B66]/60 mt-2">اضغط على أيقونة الحفظ بجانب أي مقال لضافته هنا</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedArticles.map((a) => (
                    <div
                      key={a.id}
                      className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow relative"
                    >
                      <div className="relative h-40 overflow-hidden bg-forest">
                        {a.coverImage && (
                          <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-3 right-3 bg-gold text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {a.category}
                        </div>
                        <button
                          onClick={() => toggleSave(a.id)}
                          className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                          title="إزالة من المحفوظات"
                        >
                          <Bookmark className="h-4 w-4 text-gold fill-gold" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="text-[11px] text-[#5A6B66] mb-1.5 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {a.publishedAt ? AR_DATE.format(new Date(a.publishedAt)) : AR_DATE.format(new Date(a.createdAt))}
                        </div>
                        <h3 className="text-base font-bold text-forest leading-snug mb-1.5 line-clamp-2">{a.title}</h3>
                        <p className="text-[13px] text-[#5A6B66] line-clamp-2">{a.excerpt || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ─── My submissions view ─── */
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-forest">مقالاتي</h2>
                <button
                  onClick={() => setShowSubmit(true)}
                  className="inline-flex items-center gap-1.5 bg-gold hover:bg-[#A07B2E] text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  مقال جديد
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-border-warm p-4 text-center">
                  <div className="text-3xl font-bold text-forest">
                    {mySubmissions.length}
                  </div>
                  <div className="text-xs text-[#5A6B66] mt-1">إجمالي مقالاتي</div>
                </div>
                <div className="bg-white rounded-lg border border-border-warm p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {publishedCount}
                  </div>
                  <div className="text-xs text-[#5A6B66] mt-1">منشورة</div>
                </div>
                <div className="bg-white rounded-lg border border-border-warm p-4 text-center">
                  <div className="text-3xl font-bold text-amber-600">
                    {pendingCount}
                  </div>
                  <div className="text-xs text-[#5A6B66] mt-1">قيد المراجعة</div>
                </div>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-border-warm p-12 text-center">
                  <FileText className="h-12 w-12 text-[#5A6B66]/30 mx-auto mb-3" />
                  <p className="text-[#5A6B66] mb-4">لم ترسل أي مقال بعد</p>
                  <button
                    onClick={() => setShowSubmit(true)}
                    className="inline-flex items-center gap-1.5 bg-gold hover:bg-[#A07B2E] text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    أرسل أول مقال
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border-warm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-paper-warm text-forest">
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
                          className="border-t border-border-warm hover:bg-paper/50"
                        >
                          <td className="p-3">
                            <div className="font-bold text-forest line-clamp-1">
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
                              className={
                                "inline-block px-2 py-0.5 rounded-full text-xs font-bold " +
                                (STATUS_COLORS[a.status] || "bg-slate-100 text-slate-700")
                              }
                            >
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
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-forest text-paper py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — جميع الحقوق محفوظة.
        </div>
      </footer>

      {showSubmit && (
        <SubmitArticleModal
          onClose={() => setShowSubmit(false)}
          onDone={loadData}
        />
      )}
    </div>
  );
}
