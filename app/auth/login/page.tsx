import type { Metadata } from "next";

import { login } from "@/app/auth/actions";
import { AuthForm } from "@/app/auth/AuthForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Pingy",
};

export default function LoginPage() {
  return <AuthForm mode="login" action={login} />;
}
