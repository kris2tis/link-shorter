import AuthFrom from "@/components/auth/auth-form";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFrom />
    </Suspense>
  );
}
