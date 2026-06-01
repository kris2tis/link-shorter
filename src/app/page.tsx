import { authOptions } from "@/lib/auth";
import { ArrowLeft, Link2, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="container min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          سریع، ساده، رایگان
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          لینک‌های خود را
          <br />
          <span className="text-sky-600">کوتاه و مدیریت</span> کنید
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          آدرس‌های طولانی را به لینک‌های کوتاه و قابل به‌اشتراک‌گذاری تبدیل
          کنید.
          <br />
          با امکان تعیین تاریخ انقضا و آمار کلیک
        </p>
        <Link
          href={session ? "/dashboard" : "/auth?tab=register"}
          className="btn-primary mx-auto  text-base px-8 py-3"
        >
          {session ? "ساخت لینک جدید" : "شروع رایگان"}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
