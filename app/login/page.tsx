import Link from "next/link";

import { AuthForm } from "@/components/student/auth-form";
import { loginAction } from "@/lib/student/actions";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--surface-container-low)] p-4">
      <div className="w-full max-w-lg">
        <AuthForm mode="login" action={loginAction} />
        <p className="mt-5 text-center text-sm font-bold text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="text-foreground underline decoration-primary decoration-2 underline-offset-4">
            أنشئ حساباً
          </Link>
        </p>
      </div>
    </main>
  );
}
