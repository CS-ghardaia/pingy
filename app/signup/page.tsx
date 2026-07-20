import Link from "next/link";

import { AuthForm } from "@/components/student/auth-form";
import { signupAction } from "@/lib/student/actions";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--surface-container-low)] p-4">
      <div className="w-full max-w-lg">
        <AuthForm mode="signup" action={signupAction} />
        <p className="mt-5 text-center text-sm font-bold text-muted-foreground">
          لديك حساب؟{" "}
          <Link href="/login" className="text-foreground underline decoration-primary decoration-2 underline-offset-4">
            سجل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}
