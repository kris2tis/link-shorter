"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link2, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, registerSchema } from "@/lib/validations";
import Link from "next/link";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [tab, setTab] = useState<"login" | "register">(defaultTab as "login" | "register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.push(redirectTo);
  }, [status, router, redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [e.target.name]: "" }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errors[e.path[0] as string] = e.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError("ایمیل یا رمز عبور اشتباه است");
    } else {
      router.push(redirectTo);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errors[e.path[0] as string] = e.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess("ثبت‌نام موفق! در حال ورود...");
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push(redirectTo);
    } catch {
      setError("خطای سرور. لطفاً دوباره امتحان کنید.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 text-sky-600 font-bold text-xl mb-8">
          <Link2 className="w-6 h-6" />
          لینک‌کوتاه
        </Link>

        <div className="card p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setFieldErrors({}); setSuccess(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? "ورود" : "ثبت‌نام"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="نام شما"
                  className={`input-field ${fieldErrors.name ? "border-red-400 focus:ring-red-400/30 focus:border-red-400" : ""}`}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ایمیل</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                dir="ltr"
                className={`input-field ${fieldErrors.email ? "border-red-400 focus:ring-red-400/30 focus:border-red-400" : ""}`}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">رمز عبور</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={tab === "register" ? "حداقل ۸ کاراکتر، یک حرف بزرگ و یک عدد" : "رمز عبور"}
                  dir="ltr"
                  className={`input-field pl-10 ${fieldErrors.password ? "border-red-400 focus:ring-red-400/30 focus:border-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {tab === "login" ? "ورود به حساب" : "ساخت حساب کاربری"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {tab === "login" ? (
              <>حساب ندارید؟ <button onClick={() => setTab("register")} className="text-sky-600 font-medium hover:underline">ثبت‌نام کنید</button></>
            ) : (
              <>قبلاً ثبت‌نام کرده‌اید؟ <button onClick={() => setTab("login")} className="text-sky-600 font-medium hover:underline">وارد شوید</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
