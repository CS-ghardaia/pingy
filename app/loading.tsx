export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant border-t-primary-yellow" />
      <p className="text-sm font-bold text-neutral-300">جاري التحميل…</p>
    </div>
  );
}
