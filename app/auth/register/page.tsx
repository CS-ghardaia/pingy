import type { Metadata } from "next";

import { register } from "@/app/auth/actions";
import { AuthForm } from "@/app/auth/AuthForm";

export const metadata: Metadata = {
  title: "إنشاء حساب | Pingy",
};

export default function RegisterPage() {
  return <AuthForm mode="register" action={register} />;
}
