import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-primary-white px-6 text-center">
      <span className="font-latin text-7xl font-extrabold text-primary-yellow">
        404
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-primary-black">
          هذه الصفحة غير موجودة
        </h1>
        <p className="max-w-sm text-neutral-300">
          الرابط الذي اتبعته غير صحيح، أو أن الصفحة نُقلت إلى مكان آخر.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded bg-primary-yellow px-6 py-3 text-base font-bold text-primary-black transition-colors duration-150 hover:bg-[#E5B312] active:bg-[#D4A010]"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
