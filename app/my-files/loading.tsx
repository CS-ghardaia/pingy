import { SkeletonCard } from "@/components/dashboard/student-common";

export default function MyFilesLoading() {
  return (
    <main className="min-h-screen bg-[#fbfbfb] p-6" dir="rtl">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
