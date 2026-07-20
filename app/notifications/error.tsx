"use client";

export default function NotificationsError({
  reset,
}: {
  readonly reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6 text-foreground" dir="rtl">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center">
        <div className="w-full rounded-2xl border border-border bg-background p-8 text-center shadow-[0_18px_60px_rgba(17,17,17,0.04)]">
          <h1 className="text-2xl font-extrabold">حدث خطأ غير متوقع</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            لم نتمكن من تحميل هذه الصفحة الآن. حاول مرة أخرى بعد لحظات.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-11 rounded-xl bg-primary px-5 font-bold text-primary-foreground"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </div>
  );
}
