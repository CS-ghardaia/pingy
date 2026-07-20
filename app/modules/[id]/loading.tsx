import { SkeletonCard } from "@/components/dashboard/student-common";

export default function ModuleDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] p-6" dir="rtl">
      <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
