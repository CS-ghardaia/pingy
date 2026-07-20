export default function NotificationsLoading() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] p-6" dir="rtl">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)]">
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="mt-4 h-7 w-2/3 rounded-full bg-muted" />
            <div className="mt-3 h-4 w-full rounded-full bg-muted" />
            <div className="mt-2 h-4 w-4/5 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
