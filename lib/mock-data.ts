import type {
  AcademicLevel,
  ResourceStatus,
  ResourceSummary,
  ResourceType,
  SemesterType,
} from "@/lib/home-types";

export type DemoModule = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly level: AcademicLevel;
  readonly semester: SemesterType;
  readonly resources: number;
  readonly lastUpdated: string;
  readonly teacher: string;
  readonly progress: number;
};

export type DemoResource = ResourceSummary & {
  readonly downloads: number;
  readonly views: number;
};

export type DemoNotification = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: "system" | "resources" | "community";
  readonly unread: boolean;
  readonly time: string;
};

export type DemoActivity = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
};

export const demoModules: readonly DemoModule[] = [
  {
    id: "algo-s1",
    name: "الخوارزميات وهياكل البيانات",
    description: "أساسيات التحليل، القوائم، الأشجار، والبحث بكفاءة.",
    level: "L2",
    semester: "S1",
    resources: 18,
    lastUpdated: "2026-07-12",
    teacher: "د. عبد القادر بن صالح",
    progress: 72,
  },
  {
    id: "math-s1",
    name: "الرياضيات المتقطعة",
    description: "المنطق، المجموعات، العلاقات، والبرهان الرياضي لطلبة الإعلام الآلي.",
    level: "L1",
    semester: "S1",
    resources: 14,
    lastUpdated: "2026-07-09",
    teacher: "أ. مريم حمدي",
    progress: 64,
  },
  {
    id: "arch-s1",
    name: "معمارية الحاسوب",
    description: "تمثيل البيانات، المعالج، الذاكرة، ومبادئ التجميع.",
    level: "L2",
    semester: "S1",
    resources: 11,
    lastUpdated: "2026-07-05",
    teacher: "د. يوسف بوعلام",
    progress: 51,
  },
  {
    id: "prog-s1",
    name: "مدخل إلى البرمجة",
    description: "حل المشكلات باستخدام C مع تمارين تطبيقية موجهة.",
    level: "L1",
    semester: "S1",
    resources: 22,
    lastUpdated: "2026-07-16",
    teacher: "أ. نوال قارة",
    progress: 88,
  },
  {
    id: "db-s2",
    name: "قواعد البيانات",
    description: "النمذجة العلائقية، SQL، المفاتيح، والتطبيع.",
    level: "L2",
    semester: "S2",
    resources: 20,
    lastUpdated: "2026-07-15",
    teacher: "د. سمير قرادي",
    progress: 79,
  },
  {
    id: "os-s2",
    name: "أنظمة التشغيل",
    description: "العمليات، الجدولة، الذاكرة، وأنظمة الملفات.",
    level: "L3",
    semester: "S2",
    resources: 16,
    lastUpdated: "2026-07-03",
    teacher: "أ. فاطمة الزهراء براهيمي",
    progress: 58,
  },
  {
    id: "net-s2",
    name: "شبكات الحاسوب",
    description: "نماذج الشبكات، TCP/IP، التوجيه، وأساسيات الأمن.",
    level: "L3",
    semester: "S2",
    resources: 13,
    lastUpdated: "2026-06-28",
    teacher: "د. مهدي حمودة",
    progress: 46,
  },
  {
    id: "ai-s2",
    name: "الذكاء الاصطناعي",
    description: "البحث، الاستدلال، التعلم الآلي، ومشاريع مصغرة.",
    level: "M1",
    semester: "S2",
    resources: 17,
    lastUpdated: "2026-07-11",
    teacher: "د. أمين داودي",
    progress: 67,
  },
];

const resourceTypes: readonly ResourceType[] = [
  "course",
  "td",
  "tp",
  "exam",
  "summary",
  "solution",
  "project",
  "other",
];

const statuses: readonly ResourceStatus[] = [
  "approved",
  "approved",
  "approved",
  "pending",
  "rejected",
];

export const demoResources: readonly DemoResource[] = Array.from(
  { length: 25 },
  (_, index) => {
    const demoModule = demoModules[index % demoModules.length];
    const type = resourceTypes[index % resourceTypes.length];
    const status = statuses[index % statuses.length];

    return {
      id: `demo-resource-${index + 1}`,
      title: `${resourceTypeTitle(type)} ${demoModule.name} ${index + 1}`,
      description: "مورد منظم للمراجعة السريعة قبل الأعمال الموجهة والامتحانات.",
      moduleId: demoModule.id,
      moduleName: demoModule.name,
      moduleLevel: demoModule.level,
      moduleSemester: demoModule.semester,
      resourceType: type,
      driveUrl: "https://drive.google.com/",
      status,
      createdAt: `2026-07-${String(17 - (index % 15)).padStart(2, "0")}T09:00:00.000Z`,
      authorName: ["أحمد بن عمر", "سارة خليفي", "محمد غربي", "ليندة شارف"][index % 4],
      downloads: 240 - index * 6,
      views: 920 - index * 18,
    };
  },
);

export const demoNotifications: readonly DemoNotification[] = Array.from(
  { length: 20 },
  (_, index) => {
    const templates = [
      ["تم قبول ملفك.", "ملخص قواعد البيانات أصبح متاحا للطلاب.", "resources"],
      ["تم إضافة مقرر جديد.", "مقرر شبكات الحاسوب أضيف إلى السنة الثالثة.", "system"],
      [
        "قام أحمد بتحميل ملخص جديد.",
        "مساهمة جديدة في مجتمع جامعة غرداية.",
        "community",
      ],
      [
        "تم تحديث مقرر هياكل البيانات.",
        "أضيفت موارد TD وحلول جديدة للمقرر.",
        "resources",
      ],
      [
        "امتحان TP الأسبوع القادم.",
        "تذكير ودي بمراجعة الملفات التطبيقية.",
        "system",
      ],
      ["شكرا لمساهمتك.", "ملفاتك تساعد زملاءك على التعلم أسرع.", "community"],
    ] as const;
    const template = templates[index % templates.length];

    return {
      id: `notification-${index + 1}`,
      title: template[0],
      body: template[1],
      category: template[2],
      unread: index < 7,
      time: `منذ ${index + 1} ساعة`,
    };
  },
);

export const demoActivities: readonly DemoActivity[] = [
  {
    id: "activity-1",
    title: "تم إرسال مورد جديد للمراجعة",
    detail: "ملخص الخوارزميات - السنة الثانية",
    time: "اليوم",
  },
  {
    id: "activity-2",
    title: "تم قبول ملف",
    detail: "حلول TD قواعد البيانات",
    time: "أمس",
  },
  {
    id: "activity-3",
    title: "نشاط مجتمعي",
    detail: "5 طلاب استفادوا من ملفاتك هذا الأسبوع",
    time: "هذا الأسبوع",
  },
];

export const demoAchievements = [
  "أول مساهمة",
  "مساعد الزملاء",
  "منظم الملفات",
  "مراجع نشط",
] as const;

function resourceTypeTitle(type: ResourceType) {
  const labels: Record<ResourceType, string> = {
    course: "محاضرة",
    td: "سلسلة TD",
    tp: "عمل تطبيقي",
    exam: "امتحان",
    summary: "ملخص",
    solution: "حلول",
    project: "مشروع",
    other: "ملف",
  };

  return labels[type];
}
