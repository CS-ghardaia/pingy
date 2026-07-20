"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import {
  BookOpen,
  Search,
  Shield,
  Star,
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  Code2,
  Trophy,
  CheckCircle2
} from "lucide-react";

// ─── Animation Variants ───
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Components ───

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "المميزات", href: "#features" },
    { label: "كيف يعمل", href: "#how-it-works" },
    { label: "استكشف المحتوى", href: "#content-preview" },
    { label: "التوسع", href: "#expansion" },
    { label: "الأسئلة الشائعة", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/">
          <Image src={"/logo-h.svg"} width={122} height={92} alt="شعار Pingy" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            تسجيل الدخول
          </a>
          <a
            href="/auth/register"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            انضم الآن
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border bg-background px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold text-muted-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <a
                href="/auth/login"
                className="text-center text-sm font-bold text-muted-foreground"
              >
                تسجيل الدخول
              </a>
              <a
                href="/auth/register"
                className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-bold text-primary-foreground"
              >
                انضم الآن
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-22 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-right"
          >
            

            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="mb-6 text-4xl font-extrabold leading-[1.2] tracking-tight text-foreground lg:text-5xl"
            >
              تعلم، شارك، وابنِ
              <br />
              <span className="text-primary">مجتمعك الدراسي</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              className="mb-8 text-lg leading-relaxed text-muted-foreground"
            >
              Pingy هي منصة طلابية  تجمع طلاب الإعلام الآلي في الجامعات الجزائرية.
              اكتشف الدروس، حل التمارين، وشارك مواردك مع زملائك — كل ذلك في مكان
              واحد.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={3}
              className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <a
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                ابدأ رحلتك
                <ArrowLeft className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-secondary px-6 py-3 text-base font-bold text-secondary transition-all hover:bg-secondary hover:text-secondary-foreground"
              >
                تعرف على المزيد
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={4}
              className="mt-8 flex items-center justify-center gap-4 lg:justify-start"
            >
              <div className="flex -space-x-3 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-bold text-muted-foreground"
                  >
                    {i === 4 ? "+50" : ""}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                انضم <span className="font-bold text-foreground">+500 طالب</span>{" "}
                منذ الإطلاق
              </p>
            </motion.div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Image
              src={"/images/hero.png"}
              height={400}
              width={450}
              alt="طالب يقرأ كتابا"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}



function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "سجّل حسابك",
      desc: "أنشئ حسابك باستخدام بريدك الجامعي واختر مستواك الدراسي.",
    },
    {
      num: "02",
      title: "اكتشف المحتوى",
      desc: "تصفح الدروس والملخصات والامتحانات السابقة حسب المادة أو البحث المباشر.",
    },
    {
      num: "03",
      title: "شارك معرفتك",
      desc: "ارفع مواردك الخاصة، أضف وصفاً دقيقاً، وساهم في بناء المجتمع.",
    },
    {
      num: "04",
      title: "تفاعل وتعلم",
      desc: "حل التمارين، شارك في المناقشات، واكسب النقاط لرفع سمعتك على المنصة.",
    },
  ];

  return (
    <section id="how-it-works" className=" py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-22 lg:grid-cols-2">
          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <Image src={"/images/group-students-2.png"} width={650} height={450} alt="مجموعة طلاب" />
          </motion.div>

          {/* Steps */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-foreground">
                كيف يعمل
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-foreground lg:text-4xl">
                أربع خطوات <span className="text-primary">للنجاح</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "مكتبة موارد منظمة",
      desc: "جميع الدروس والملخصات والامتحانات مرتبة حسب المستوى والفصل والمادة الدراسية.",
    },
    {
      icon: Search,
      title: "بحث ذكي وسريع",
      desc: "ابحث عن أي مورد باستخدام الكلمات المفتاحية، المرشحات، أو التصنيفات في أجزاء من الثانية.",
    },
    {
      icon: Code2,
      title: "تمارين تفاعلية",
      desc: "حل تمارين البرمجة واختبر معرفتك بشكل فوري مع تقييم آلي ونتائج فورية.",
    },
    {
      icon: Shield,
      title: "مراجعة من الطلاب",
      desc: "نظام إشرافي من الطلاب أنفسهم يضمن جودة المحتوى ودقته قبل نشره.",
    },
    {
      icon: Star,
      title: "تقييم وملاحظات",
      desc: "قيم المحتوى وشارك تعليقاتك لمساعدة زملائك في العثور على أفضل الموارد.",
    },
    {
      icon: Trophy,
      title: "نظام السمعة",
      desc: "اكسب النقاط والشارات عند مشاركتك ومساهمتك، وانضم إلى لوحة المتصدرين.",
    },
  ];

  return (
    <section id="features" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-foreground">
            المميزات
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground lg:text-4xl">
            كل ما تحتاجه في <span className="text-primary">مكان واحد</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Pingy ليست مجرد مكتبة، بل مجتمع حي يتعاون فيه الطلاب لبناء قاعدة
            معرفية مشتركة.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow: "0 8px 24px rgba(17,17,17,0.08)",
              }}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-input"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentPreview() {
  return (
    <section id="content-preview" className="bg-secondary py-20 lg:py-22">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
           {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold text-primary">
              الانطلاقة
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-secondary-foreground lg:text-4xl">
              انطلاقة من <span className="text-primary">جامعة غرداية</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              بدأت رحلتنا  من جامعة غرداية، حيث تأسست أولى بذور مجتمع Pingy. اليوم، نعمل على توسيع منصتنا لتصل إلى كل جامعات الجزائر.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "أول منصة طلابية  لطلاب الإعلام الآلي في الجنوب",
                "مجتمع نشط من طلاب جامعة غرداية",
                "خطط توسع لباقي الجامعات الجزائرية",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image src={"/images/Asset.png"} width={450} height={450} alt="خريطة الجزائر" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}


function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "ما هو Pingy ومن يستطيع استخدامه؟",
      a: "Pingy هي منصة طلابية  لطلاب علوم الحاسوب في الجامعات الجزائرية. أي طالب مسجل في التخصص يمكنه إنشاء حساب والبدء في استكشاف المحتوى أو مشاركته.",
    },
    {
      q: "كيف يتم ضمان جودة المحتوى؟",
      a: "كل مورد يتم رفعه يمر بمراجعة من طلاب مشرفين قبل نشره. كما يمكن للطلاب تقييم المحتوى والإبلاغ عن أي خطأ.",
    },
    {
      q: "هل يمكنني رفع ملفاتي الخاصة؟",
      a: "بالتأكيد! يمكنك رفع الدروس، الملخصات، حلول التمارين، أو حتى الامتحانات السابقة. فقط أضف وصفاً دقيقاً وانتظر الموافقة.",
    },
    {
      q: "هل المنصة متاحة على الهاتف؟",
      a: "نعم، Pingy متجاوبة بالكامل مع الهواتف والأجهزة اللوحية. يمكنك الوصول لكل الميزات من أي جهاز.",
    },
    {
      q: "كيف أصبح طالباً مشرفاً؟",
      a: "يتم ترقية الطلاب النشطين والموثوقين إلى دور الطالب المشرف  بناءً على مساهماتهم وسمعتهم.",
    },
  ];

  return (
    <section id="faq" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-200 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-foreground">
            الأسئلة الشائعة
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground lg:text-4xl">
            كل ما تريد <span className="text-primary">معرفته</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-right"
              >
                <span className="text-sm font-bold text-foreground">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-border px-6 py-4"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Decorative floating shapes placed behind the CTA - hidden on small screens */}
      <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block">
        <div className="relative w-full h-full">
          <Image
            src="/shapes/triangle-fill-yellow.svg"
            alt=""
            width={80}
            height={80}
            className="absolute top-12 left-6 float-slower shape-fade w-20 h-20"
          />
          <Image
            src="/shapes/triangle-outline-black.svg"
            alt=""
            width={80}
            height={80}
            className="absolute top-12 left-10 float-slower shape-fade w-22 h-22"
          />

          <Image
            src="/shapes/sequer-fill-yellow.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-16 left-20 float-slow shape-fade w-24 h-24"
          />
          <Image
            src="/shapes/sequre-outline-black.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-16 left-25 rotate-23 float-slow shape-fade w-24 h-24"
          />

          <Image
            src="/shapes/multple-cercules-3.svg"
            alt=""
            width={112}
            height={112}
            className="absolute right-10 top-36 float-rotate shape-fade w-28 h-28"
          />

          <Image
            src="/shapes/line-cercules.svg"
            alt=""
            width={64}
            height={64}
            className="absolute -bottom-2 right-230 float-slow shape-fade w-36 h-36"
          />
          <Image
            src="/shapes/multple-cercules.svg"
            alt=""
            width={64}
            height={64}
            className="absolute -bottom-2 right-80 float-slow shape-fade w-28 h-28"
          />
          <Image
            src="/shapes/cercule-fill-black.svg"
            alt=""
            width={40}
            height={40}
            className="absolute top-10 right-24 float-rotate shape-fade w-10 h-10"
          />
          <Image
            src="/shapes/cercule-outline.svg"
            alt=""
            width={40}
            height={40}
            className="absolute top-12 right-28 float-rotate shape-fade w-10 h-10"
          />
          <Image
            src="/shapes/sequer-fill-black.svg"
            alt=""
            width={40}
            height={40}
            className="absolute top-4 right-90  float-rotate shape-fade w-14 h-14"
          />
          <Image
            src="/shapes/star.svg"
            alt=""
            width={40}
            height={40}
            className="absolute top-6 right-200 animate-spin animation-duration-[40s] float-rotate shape-fade w-10 h-10"
          />
          <Image
            src="/shapes/star-black.svg"
            alt=""
            width={40}
            height={40}
            className="absolute top-20 right-300 animate-spin animation-duration-[40s] float-rotate shape-fade w-10 h-10"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-primary-foreground lg:text-4xl">
            جاهز للانضمام إلى مجتمعك الدراسي؟
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            انضم الآن إلى مئات الطلاب في جامعة غرداية وابدأ رحلتك في التعلم
            التعاوني.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3 text-base font-bold text-secondary-foreground transition-all hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              أنشئ حسابك الآن
              <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    {
      title: "المنصة",
      items: ["المميزات", "كيف يعمل", "استكشف المحتوى", "الأسئلة الشائعة"],
    },
    {
      title: "المحتوى",
      items: ["الدروس", "الامتحانات", "التمارين", "الملخصات"],
    },
    {
      title: "الدعم",
      items: [
        "مركز المساعدة",
        "سياسة الخصوصية",
        "شروط الاستخدام",
        "تواصل معنا",
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image src={"/logo-h.svg"} width={120} height={82} alt="شعار Pingy" className="mb-3" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              منصة طلابية  لطلاب علوم الحاسوب في الجامعات الجزائرية.
            </p>
          </div>

          {/* Links */}
          {links.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-bold text-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Pingy جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ContentPreview />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
