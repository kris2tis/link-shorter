import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {  Link2 } from "lucide-react";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
    console.log(Boolean(session));

  return (
    <nav className=" border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container  px-6 h-16 flex items-center justify-between">
        <Link href={"/"}>
        <div className="flex items-center gap-2 font-bold text-sky-600 text-lg cursor-pointer">
          <Link2 className="w-5 h-5" />
          <span>لینک شورتر</span>
        </div>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard" className="btn-primary">
              <span>حساب کاربری</span>
            </Link>
          ) : (
            <>
              <Link href="/auth" className="btn-secondary text-sm"> 
                ورود
              </Link>
              <Link href="/auth?tab=register" className="btn-primary text-sm">
                ثبت‌نام رایگان
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
