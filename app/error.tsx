"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-primary-white px-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-primary-black">
          حدث خطأ غير متوقع
        </h1>
        <p className="max-w-sm text-neutral-300">
          لم نستطع عرض هذه الصفحة الآن. حاول مرة أخرى، وإن استمرت المشكلة
          تواصل معنا.
        </p>
      </div>
      <Button variant="link" onClick={reset}>
        إعادة المحاولة
      </Button>
    </div>
  );
}
