"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LinksList } from "@/components/links/LinksList";
      import { CreateLinkForm } from "@/components/links/CreateLinkForm";

interface Props {
  user: { name?: string | null; email?: string | null; id?: string };
}

export function DashboardClient({ user }: Props) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  return (
    <div className="container min-h-screen bg-slate-50 pb-5">
      <button className="btn-danger"   onClick={() => signOut()}>خروج از حساب</button>
      <CreateLinkForm />
      <LinksList refreshTrigger={refreshTrigger} />
    </div>
  );
}
