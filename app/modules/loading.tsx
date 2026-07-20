import { SkeletonCard } from "@/components/dashboard/student-common";

export default function ModulesLoading() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] p-6" dir="rtl">
      <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
