import type { Metadata } from "next";

import { ExploreClient } from "@/components/dashboard/explore-client";
import { PageHeader } from "@/components/dashboard/student-common";
import { StudentShell } from "@/components/dashboard/student-shell";
import {
  getApprovedResources,
  getDashboardContext,
  getModules,
} from "@/lib/home-data";
import { demoResources } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "استكشف | Pingy",
};

export default async function ExplorePage() {
  const { user, preferences } = await getDashboardContext();
  const [modules, resources] = await Promise.all([
    getModules(),
    getApprovedResources(),
  ]);
  const liveResources = resources.map((resource, index) => ({
    ...resource,
    downloads: 120 - index * 5,
    views: 420 - index * 11,
  }));
  const explorerResources =
    liveResources.length >= 8
      ? liveResources
      : [...liveResources, ...demoResources].slice(0, 25);

  return (
    <StudentShell
      user={user}
      preferences={preferences}
      modules={modules}
      activeHref="/explore"
    >
      <PageHeader
        eyebrow="استكشف"
        title="مكتبة موارد جاهزة للبحث والتصفية"
        description="ابحث حسب المستوى والسداسي والنوع والمقرر، ورتب النتائج بالطريقة التي تناسب مراجعتك."
      />
      <ExploreClient
        resources={explorerResources}
        modules={modules.length > 0 ? modules : demoResources.map((item) => ({
          id: item.moduleId,
          name: item.moduleName,
          description: item.description,
          level: item.moduleLevel,
          semester: item.moduleSemester,
        })).filter((item, index, array) => array.findIndex((other) => other.id === item.id) === index)}
      />
    </StudentShell>
  );
}
