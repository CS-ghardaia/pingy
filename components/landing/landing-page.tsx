"use client";

import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  Download,
  FileArchive,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers3,
  LibraryBig,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "الرئيسية", href: "#home" },
  { label: "المسارات", href: "#courses" },
  { label: "الفئات", href: "#categories" },
  { label: "الأسئلة", href: "#faq" },
];

const stats = [
  { value: "+25", label: "سنة محتوى مؤرشف", detail: "امتحانات وملخصات" },
  { value: "560", label: "طالب في المجتمع", detail: "قابل للنمو" },
  { value: "+170", label: "مورد دراسي", detail: "دروس وتمارين" },
];

const courses = [
  {
    title: "خوارزميات وهياكل معطيات",
    tag: "تمارين",
    icon: Code2,
    meta: "12 ملف",
    accent: "#F8C413",
  },
  {
    title: "أرشيف امتحانات السنوات السابقة",
    tag: "امتحانات",
    icon: FileArchive,
    meta: "34 اختبار",
    accent: "#111111",
  },
  {
    title: "برمجة كائنية التوجه OOP",
    tag: "دروس",
    icon: Layers3,
    meta: "18 مورد",
    accent: "#F8C413",
  },
  {
    title: "قواعد البيانات و SQL",
    tag: "ملخصات",
    icon: LibraryBig,
    meta: "21 مرجع",
    accent: "#111111",
  },
  {
    title: "أنظمة التشغيل والشبكات",
    tag: "مسار",
    icon: ShieldCheck,
    meta: "16 ملف",
    accent: "#F8C413",
  },
  {
    title: "مشاريع تطبيقية مصغرة",
    tag: "تطبيق",
    icon: UploadCloud,
    meta: "9 مشاريع",
    accent: "#111111",
  },
];

const categories = [
  { title: "دروس ومحاضرات", count: "+40 مورد", icon: BookOpenCheck },
  { title: "امتحانات محلولة", count: "+28 اختبار", icon: FileCheck2 },
  { title: "تمارين برمجية", count: "+55 تمرين", icon: Code2 },
  { title: "ملخصات سريعة", count: "+35 ملخص", icon: FileText },
  { title: "مراجعات جماعية", count: "+12 جلسة", icon: Users },
  { title: "شارات وسمعة", count: "+18 إنجاز", icon: Trophy },
];

const steps = [
  {
    title: "ارفع مورداً",
    text: "شارك ملفاً، تمريناً، أو امتحاناً مع بيانات المادة والسنة.",
    icon: UploadCloud,
  },
  {
    title: "راجع المجتمع",
    text: "المشرفون والطلاب يساعدون في تحسين الجودة وترتيب المحتوى.",
    icon: MessageCircle,
  },
  {
    title: "اكسب السمعة",
    text: "كل مساهمة مفيدة ترفع حضورك داخل مجتمع طلبة الإعلام الآلي.",
    icon: Star,
  },
];

const faq = [
  "هل المنصة موجهة لجامعة غرداية فقط؟",
  "هل يمكن رفع امتحانات السنوات السابقة؟",
  "كيف تتم مراجعة المحتوى قبل نشره؟",
  "هل يوجد نظام نقاط وشارات للطلاب؟",
  "هل يمكن إضافة صور حقيقية لاحقاً؟",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function MotionBlock({
  children,
  className,
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.42, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, tone = "yellow" }: { children: React.ReactNode; tone?: "yellow" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold",
        tone === "yellow"
          ? "bg-[#F8C413] text-[#111111]"
          : "bg-[#111111] text-[#F8C413]",
      )}
    >
      <Sparkles className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}

function ImageSlot({
  label,
  className,
  compact = false,
}: {
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#D8D7D7] bg-[#FFFFFF] text-center shadow-[0_2px_8px_rgba(17,17,17,0.06)]",
        compact ? "min-h-36 p-4" : "min-h-64 p-6",
        className,
      )}
    >
      <div className="absolute inset-4 rounded-[18px] border border-[#E8E8E8]" aria-hidden="true" />
      <div className="relative flex max-w-52 flex-col items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#FEEFD0] text-[#111111]">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <strong className="text-sm font-extrabold text-[#111111]">{label}</strong>
        <span className="text-xs leading-5 text-[#6C6C6B]">مساحة فارغة للصورة، بدون توليد أو تحميل صور.</span>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  index,
}: {
  course: (typeof courses)[number];
  index: number;
}) {
  return (
    <MotionBlock delay={index * 0.04}>
      <article className="group h-full overflow-hidden rounded-[18px] border border-[#E8E8E8] bg-white p-3 shadow-[0_2px_8px_rgba(17,17,17,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(17,17,17,0.08)]">
        <ImageSlot
          label="مكان صورة الكورس"
          compact
          className="min-h-44 rounded-[14px] bg-[#FAFAFA] shadow-none"
        />
        <div className="p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6C6C6B]">
              <Star className="size-3.5 fill-[#F8C413] text-[#F8C413]" aria-hidden="true" />
              4.8
            </span>
            <span className="rounded-full bg-[#FEEFD0] px-3 py-1 text-xs font-bold text-[#111111]">
              {course.tag}
            </span>
          </div>
          <h3 className="min-h-12 text-base font-extrabold leading-6 text-[#111111]">{course.title}</h3>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E8E8E8] pt-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#444443]">
              <course.icon className="size-4" style={{ color: course.accent }} aria-hidden="true" />
              {course.meta}
            </span>
            <span className="text-xs font-extrabold text-[#F57C00]">مجاني</span>
          </div>
        </div>
      </article>
    </MotionBlock>
  );
}

export function LandingPage() {
  return (
    <main id="home" className="min-h-screen bg-[#DDE8F6] px-3 py-8 text-[#111111] sm:px-6" dir="rtl">
      <div className="mx-auto max-w-[1120px] overflow-hidden rounded-none border-8 border-white bg-[#F7F9FC] shadow-[0_24px_80px_rgba(17,17,17,0.12)]">
        <header className="relative z-20 mx-auto flex h-20 max-w-[980px] items-center justify-between px-5 sm:px-8 lg:px-0">
          <a href="#home" className="flex items-center gap-3" aria-label="Pinggly">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#F8C413] text-base font-black text-[#111111]">
              P
            </span>
            <span className="text-xl font-black tracking-normal">PINGGLY</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="التنقل الرئيسي">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-extrabold text-[#444443] transition-colors hover:text-[#F8C413]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="h-10 rounded-full bg-[#111111] px-5 text-xs font-extrabold text-white hover:bg-[#444443]"
            >
              <a href="#join">انضم الآن</a>
            </Button>
          </div>
        </header>

        <section className="relative px-5 pb-12 pt-4 sm:px-8 lg:px-0">
          <div className="absolute inset-x-0 top-0 h-[520px] bg-[#FDF0E9]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[980px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <MotionBlock className="pt-8">
              <Eyebrow>تعلم جماعي منظم</Eyebrow>
              <h1 className="mt-6 max-w-[520px] text-4xl font-black leading-[1.08] tracking-normal text-[#111111] sm:text-5xl lg:text-[58px]">
                تعلّم أعمق، مواد أوضح، ومجتمع يساعدك.
              </h1>
              <p className="mt-5 max-w-[460px] text-base font-medium leading-8 text-[#444443]">
                Pingy تجمع دروس الإعلام الآلي، الامتحانات السابقة، التمارين، والمساهمات
                الطلابية في منصة عربية واحدة مصممة لطلاب الجامعات الجزائرية.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-[#F8C413] px-6 text-sm font-extrabold text-[#111111] shadow-[0_10px_24px_rgba(248,196,19,0.28)] hover:bg-[#E5B312]"
                >
                  <a href="#courses">
                    استكشف المسارات
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 rounded-full px-5 text-sm font-extrabold text-[#111111] hover:bg-white"
                >
                  <a href="#how">
                    كيف تعمل؟
                    <Zap className="size-4 text-[#F8C413]" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </MotionBlock>

            <MotionBlock delay={0.08} className="relative min-h-[470px]">
              <div className="absolute left-8 top-8 hidden size-11 rotate-12 items-center justify-center rounded-xl bg-white text-[#F8C413] shadow-[0_8px_24px_rgba(17,17,17,0.08)] sm:flex">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <div className="absolute right-3 top-16 hidden size-3 rounded-full bg-[#F8C413] sm:block" aria-hidden="true" />
              <div className="absolute left-20 top-28 hidden size-4 rounded-full bg-[#111111] sm:block" aria-hidden="true" />
              <div className="absolute bottom-16 left-10 hidden h-56 w-40 -rotate-[28deg] rounded-[28px] bg-[#F8C413] sm:block" aria-hidden="true" />
              <div className="absolute bottom-8 left-28 hidden h-64 w-48 rotate-[52deg] rounded-[32px] bg-[#111111] sm:block" aria-hidden="true" />
              <ImageSlot
                label="ضع هنا صورة الطالب أو Mockup الواجهة"
                className="relative z-10 mx-auto min-h-[470px] max-w-[420px] rounded-[34px] bg-white/92"
              />
            </MotionBlock>
          </div>
        </section>

        <section className="relative px-5 py-12 sm:px-8 lg:px-0">
          <MotionBlock className="mx-auto max-w-[760px] text-center">
            <Eyebrow tone="dark">عن Pinggly</Eyebrow>
            <p className="mt-6 text-xl font-extrabold leading-9 text-[#444443] sm:text-2xl">
              نحن نبني مساحة تساعد الطلاب على الوصول إلى محتوى عالي الجودة، منظم، قابل
              للبحث، ويكبر بمساهمات المجتمع.
            </p>
          </MotionBlock>
          <div className="mx-auto mt-10 grid max-w-[760px] gap-5 border-b border-t border-[#E8E8E8] py-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <MotionBlock key={stat.label} delay={index * 0.05}>
                <div className="text-center">
                  <strong className="block text-4xl font-black text-[#111111]">{stat.value}</strong>
                  <span className="mt-2 block text-sm font-extrabold text-[#444443]">{stat.label}</span>
                  <span className="mt-1 block text-xs text-[#6C6C6B]">{stat.detail}</span>
                </div>
              </MotionBlock>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-0" id="courses">
          <div className="mx-auto max-w-[980px]">
            <MotionBlock className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>المسارات</Eyebrow>
                <h2 className="mt-4 text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
                  استكشف محتوى المنصة
                </h2>
              </div>
              <div className="flex h-12 w-full items-center gap-3 rounded-full bg-white px-4 shadow-[0_2px_8px_rgba(17,17,17,0.06)] md:w-[360px]">
                <Search className="size-4 text-[#6C6C6B]" aria-hidden="true" />
                <span className="flex-1 text-sm font-bold text-[#6C6C6B]">ابحث عن مادة أو امتحان</span>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#111111]">
                  كل الفئات
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </MotionBlock>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={course.title} course={course} index={index} />
              ))}
            </div>

            <div className="mt-9 flex justify-center">
              <Button className="h-11 rounded-full bg-[#F8C413] px-7 text-sm font-extrabold text-[#111111] hover:bg-[#E5B312]">
                كل الموارد
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#FDF0E9] px-5 py-16 sm:px-8 lg:px-0" id="categories">
          <div className="mx-auto max-w-[980px]">
            <MotionBlock className="mx-auto max-w-[560px] text-center">
              <Eyebrow>الفئات</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
                اختر ما تحتاجه قبل الامتحان أو أثناء الدراسة
              </h2>
            </MotionBlock>

            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <MotionBlock key={category.title} delay={index * 0.04}>
                  <article className="relative overflow-hidden rounded-[18px] bg-white p-6 shadow-[0_2px_8px_rgba(17,17,17,0.06)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-[#111111]">{category.title}</h3>
                        <p className="mt-2 text-sm font-bold text-[#6C6C6B]">{category.count}</p>
                      </div>
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#FEEFD0] text-[#111111]">
                        <category.icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                    <span className="absolute -bottom-4 left-5 text-6xl font-black text-[#F5F5F5]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </article>
                </MotionBlock>
              ))}
            </div>

            <div className="mt-9 flex justify-center">
              <Button className="h-11 rounded-full bg-[#111111] px-7 text-sm font-extrabold text-white hover:bg-[#444443]">
                كل الفئات
              </Button>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-0" id="how">
          <div className="mx-auto grid max-w-[980px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <MotionBlock className="relative">
              <div className="absolute -right-5 top-8 hidden size-24 rounded-full bg-[#F8C413]/25 sm:block" aria-hidden="true" />
              <ImageSlot
                label="مكان صورة مجتمع الطلاب أو واجهة رفع الملفات"
                className="relative min-h-[430px] rounded-[34px]"
              />
              <div className="absolute bottom-8 right-0 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,0.08)]">
                <span className="text-xs font-bold text-[#6C6C6B]">عدد الموارد المرفوعة</span>
                <strong className="mt-1 block text-2xl font-black text-[#111111]">13.5k+</strong>
              </div>
            </MotionBlock>

            <MotionBlock delay={0.08}>
              <Eyebrow>من مشاركة إلى أثر</Eyebrow>
              <h2 className="mt-5 max-w-[560px] text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
                ساعد زملاءك، وابنِ أرشيفاً دراسياً لا يضيع في المحادثات.
              </h2>
              <p className="mt-5 max-w-[520px] text-base font-medium leading-8 text-[#444443]">
                المنصة مصممة حول نموذج طالب إلى طالب: كل ملف مفيد، كل حل تمرين، وكل
                تعليق واضح يضيف قيمة للدفعات القادمة.
              </p>
              <div className="mt-7 grid gap-4">
                {steps.map((step) => (
                  <div key={step.title} className="flex gap-4 rounded-[18px] bg-white p-4 shadow-[0_2px_8px_rgba(17,17,17,0.06)]">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8C413] text-[#111111]">
                      <step.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-black text-[#111111]">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#444443]">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </MotionBlock>
          </div>
        </section>

        <section className="bg-[#EEF4FB] px-5 py-16 sm:px-8 lg:px-0">
          <div className="mx-auto max-w-[980px]">
            <MotionBlock className="mx-auto max-w-[640px] text-center">
              <Eyebrow>رأي المجتمع</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
                منصة تجعل التعلم الجماعي قابلاً للتنظيم
              </h2>
            </MotionBlock>
            <MotionBlock delay={0.06} className="mx-auto mt-9 max-w-[820px] rounded-[26px] bg-white p-8 text-center shadow-[0_8px_24px_rgba(17,17,17,0.08)]">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[#111111] text-[#F8C413]">
                <GraduationCap className="size-6" aria-hidden="true" />
              </div>
              <p className="mx-auto max-w-[620px] text-lg font-extrabold leading-9 text-[#444443]">
                بدل البحث في عشرات الروابط والمجموعات، نحتاج مكاناً واحداً يجمع الموارد
                حسب المادة والسنة ويعطي التقدير للطلاب الذين يساهمون.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#FEEFD0] text-sm font-black text-[#111111]">
                  P
                </span>
                <div className="text-right">
                  <strong className="block text-sm font-black">طالب إعلام آلي</strong>
                  <span className="text-xs text-[#6C6C6B]">مجتمع Pinggly</span>
                </div>
              </div>
            </MotionBlock>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-0" id="faq">
          <div className="mx-auto grid max-w-[980px] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <MotionBlock>
              <Eyebrow>أسئلة شائعة</Eyebrow>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#111111]">
                قبل أن تبدأ، هذه أهم النقاط.
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-[#444443]">
                يمكنك لاحقاً ربط هذه الأسئلة بمحتوى حقيقي أو Accordion تفاعلي من shadcn.
              </p>
            </MotionBlock>
            <div className="grid gap-3">
              {faq.map((question, index) => (
                <MotionBlock key={question} delay={index * 0.04}>
                  <button className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[16px] border border-[#E8E8E8] bg-white px-5 text-right text-sm font-extrabold text-[#111111] shadow-[0_2px_8px_rgba(17,17,17,0.04)]">
                    <span>{question}</span>
                    <Plus className="size-4 shrink-0 text-[#6C6C6B]" aria-hidden="true" />
                  </button>
                </MotionBlock>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-8 lg:px-0" id="join">
          <MotionBlock className="mx-auto max-w-[760px] text-center">
            <h2 className="text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
              ما الذي تبحث عنه؟
            </h2>
            <p className="mt-3 text-sm font-medium text-[#6C6C6B]">
              اختر المسار الأقرب لك، وسنربطه لاحقاً بتجربة التسجيل أو لوحة المستخدم.
            </p>
          </MotionBlock>
          <div className="mx-auto mt-9 grid max-w-[760px] gap-5 md:grid-cols-2">
            <MotionBlock>
              <article className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(17,17,17,0.08)]">
                <CircleHelp className="size-9 text-[#F8C413]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black text-[#111111]">أريد أن أدرّس أو أشارك</h3>
                <p className="mt-3 text-sm leading-7 text-[#444443]">
                  ارفع ملفاتك، حلولك، أو ملخصاتك ليستفيد منها الطلاب.
                </p>
                <Button className="mt-5 h-10 rounded-full bg-[#111111] px-5 text-xs font-extrabold text-white hover:bg-[#444443]">
                  ابدأ المشاركة
                </Button>
              </article>
            </MotionBlock>
            <MotionBlock delay={0.05}>
              <article className="rounded-[20px] bg-[#F8C413] p-6 shadow-[0_8px_24px_rgba(248,196,19,0.28)]">
                <Download className="size-9 text-[#111111]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black text-[#111111]">أريد أن أتعلم هنا</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-[#444443]">
                  ابحث عن الدروس، التمارين، والامتحانات في مكان واحد.
                </p>
                <Button className="mt-5 h-10 rounded-full bg-white px-5 text-xs font-extrabold text-[#111111] hover:bg-[#FEEFD0]">
                  استكشف الآن
                </Button>
              </article>
            </MotionBlock>
          </div>
        </section>

        <footer className="bg-[#FDF0E9] px-5 py-12 sm:px-8 lg:px-0">
          <div className="mx-auto grid max-w-[980px] gap-9 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#F8C413] font-black text-[#111111]">
                  P
                </span>
                <strong className="text-lg font-black">PINGGLY</strong>
              </div>
              <p className="mt-4 max-w-64 text-sm leading-7 text-[#444443]">
                منصة تعاون أكاديمي لطلاب علوم الحاسوب، مبنية حول المشاركة والتنظيم والسمعة.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#111111]">المنصة</h4>
              <ul className="mt-4 space-y-3 text-sm font-bold text-[#6C6C6B]">
                <li>عن Pinggly</li>
                <li>المسارات</li>
                <li>المجتمع</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#111111]">الفئات</h4>
              <ul className="mt-4 space-y-3 text-sm font-bold text-[#6C6C6B]">
                <li>امتحانات</li>
                <li>تمارين</li>
                <li>ملخصات</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#111111]">جاهز للإطلاق</h4>
              <p className="mt-4 text-sm leading-7 text-[#444443]">
                أضف الصور الحقيقية وروابط التسجيل لاحقاً، والهيكل جاهز للتوسيع.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-[980px] border-t border-[#E8E8E8] pt-6 text-center text-xs font-bold text-[#6C6C6B]">
            © 2026 Pinggly. جميع الحقوق محفوظة.
          </div>
        </footer>
      </div>
    </main>
  );
}
