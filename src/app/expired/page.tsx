import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">لینک منقضی شده</h1>
        <p className="text-slate-500 text-sm mb-8">این لینک کوتاه دیگر فعال نیست</p>
        <Link href="/" className="btn-primary">
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
