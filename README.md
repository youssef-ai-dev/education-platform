<div align="center">

# علم — 3ilm

### منصة تعليمية إلكترونية متكاملة باللغة العربية

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## المميزات

### نظام مصادقة متكامل (Clerk)
- **تسجيل الدخول** — عبر البريد الإلكتروني أو Google أو GitHub
- **إنشاء حساب** — مع التحقق من البريد الإلكتروني
- **حماية المسارات** — middleware يحمي الصفحات الخاصة (Dashboard, الدورات المسجلة)
- **إدارة الملف الشخصي** — عبر Clerk UserButton في شريط التنقل
- **تصميم صفحات مخصصة** — صفحات signin/signup بتصميم split-screen احترافي
- **مصادقة API** — كل API routes الحساسة محمية بـ Clerk auth على السيرفر

### تجربة تعليمية متكاملة
- **دورات فيديو تفاعلية** — مشغل فيديو مدمج مع دعم YouTube وتشغيل محاكى
- **اختبارات تفاعلية** — نظام اختبارات شامل مع مؤقت تنازلي وشرح للإجابات
- **تتبع التقدم** — متابعة تقدم الطالب في كل دورة بنسبة مئوية
- **شهادات إتمام** — إنشاء شهادات تلقائياً عند اجتياز الاختبار مع إمكانية الطباعة

### واجهة مستخدم احترافية
- **تصميم RTL كامل** — واجهة عربية بالكامل مع دعم اتجاه الكتابة من اليمين لليسار
- **انتقالات سلسة** — حركات انتقالية بين الصفحات باستخدام Framer Motion
- **تصميم متجاوب** — يعمل بشكل ممتاز على جميع أحجام الشاشات
- **تصميم بألوان زمردية** — هوية بصرية متميزة بلون أخضر زمردي

### لوحة تحكم متقدمة
- **رسوم بيانية تفاعلية** — باستخدام Recharts (BarChart, PieChart, AreaChart)
- **إحصائيات شاملة** — عدد الدورات، الشهادات، ساعات التعلم
- **تتبع النشاط الأسبوعي** — عرض نشاط التعلم خلال الأسبوع

### بنية تقنية قوية
- **إدارة حالة مركزية** — باستخدام Zustand
- **قاعدة بيانات علائقية** — Prisma ORM مع SQLite (تطوير) / Turso (إنتاج)
- **API Routes مؤمّنة** — مصادقة، تحقق من المدخلات، وrate limiting
- **مكونات UI قابلة لإعادة الاستخدام** — باستخدام shadcn/ui
- **اختبارات شاملة** — Vitest + React Testing Library مع 40+ اختبار

---

## التقنيات المستخدمة

| الفئة | التقنية |
|-------|---------|
| **إطار العمل** | Next.js 16 (App Router) |
| **اللغة** | TypeScript 5 |
| **المصادقة** | Clerk (@clerk/nextjs) |
| **التصميم** | Tailwind CSS 4 + shadcn/ui |
| **قاعدة البيانات** | Prisma ORM + SQLite / Turso |
| **التحقق من المدخلات** | Zod 4 |
| **إدارة الحالة** | Zustand |
| **الحركات** | Framer Motion |
| **الرسوم البيانية** | Recharts |
| **الأيقونات** | Lucide React |
| **الإشعارات** | Sonner |
| **الاختبارات** | Vitest + React Testing Library |
| **تأثيرات الاحتفال** | Canvas Confetti |

---

## البدء السريع

### المتطلبات الأساسية

- Node.js 18+ أو Bun
- حساب [Clerk](https://clerk.com/) للحصول على مفاتيح API

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/youssef-ai-dev/education-platform.git

# الدخول لمجلد المشروع
cd education-platform

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# ثم عدّل ملف .env وأضف مفاتيح Clerk
```

### متغيرات البيئة المطلوبة

أنشئ ملف `.env` في جذر المشروع:

```env
# Clerk - المصادقة
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

# قاعدة البيانات (اختياري - للتطوير يُستخدم SQLite محلي)
DATABASE_URL=file:./dev.db

# Turso - قاعدة بيانات سحابية (اختياري - للإنتاج)
# TURSO_DATABASE_URL=libsql://...
# TURSO_AUTH_TOKEN=...
```

### تشغيل المشروع

```bash
# إعداد قاعدة البيانات
npx prisma generate
npx prisma db push

# زرع البيانات التجريبية
npm run db:seed

# تشغيل الخادم المحلي
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

> **ملاحظة:** endpoint الـ seed (`/api/seed`) محمي ولا يعمل في بيئة الإنتاج. استخدم `npm run db:seed` بدلاً من ذلك.

---

## هيكل المشروع

```
src/
├── app/
│   ├── api/                       # واجهات برمجة التطبيقات
│   │   ├── courses/               # مسارات الدورات (GET) — عام
│   │   ├── enrollments/           # مسارات التسجيل (GET, POST, PATCH) — محمي
│   │   ├── quiz-attempts/         # مسارات اختبارات (POST) — محمي + حساب score سيرفر-سايد
│   │   ├── certificates/          # مسارات الشهادات (GET) — محمي
│   │   ├── generate-certificate/  # إنشاء شهادة (POST) — محمي + تحقق إتمام
│   │   └── seed/                  # بيانات تجريبية (POST) — تطوير فقط
│   ├── signin/                    # صفحة تسجيل الدخول (Clerk)
│   ├── signup/                    # صفحة إنشاء حساب (Clerk)
│   ├── globals.css                # الأنماط العامة
│   ├── layout.tsx                 # التخطيط الرئيسي (RTL + AuthProvider)
│   └── page.tsx                   # الصفحة الرئيسية
│
├── components/
│   ├── AuthProvider.tsx           # مزود المصادقة (Clerk Error Boundary)
│   ├── PageTransition.tsx         # مكون الانتقالات
│   ├── ThemeProvider.tsx          # مزود السمة
│   ├── layout/
│   │   ├── Header.tsx             # شريط التنقل (مع Clerk UserButton)
│   │   └── Footer.tsx             # التذييل
│   ├── views/
│   │   ├── home/                  # الصفحة الرئيسية (HeroSection, StatsBar, FeaturedCourses, ...)
│   │   ├── courses/               # صفحة الدورات (CoursesHeader, FilterBar, CourseGrid)
│   │   ├── course-detail/         # تفاصيل الدورة (CourseHeader, EnrollDialog, OverviewTab, ...)
│   │   ├── lesson/                # مشاهدة الدرس (VideoPlayer, LessonContent, LessonSidebar)
│   │   ├── dashboard/             # لوحة التحكم (StatsCards, ChartsSection, EnrolledCourses, ...)
│   │   ├── QuizView.tsx           # الاختبار التفاعلي
│   │   ├── QuizResultView.tsx     # نتيجة الاختبار
│   │   └── CertificateView.tsx    # الشهادة
│   └── ui/                        # مكونات shadcn/ui
│
├── store/
│   └── useAppStore.ts             # إدارة الحالة (Zustand)
│
├── lib/
│   ├── auth.ts                    # مساعد المصادقة والتحقق من الملكية
│   ├── db.ts                      # اتصال قاعدة البيانات (Prisma)
│   ├── rate-limit.ts              # نظام تحديد معدل الطلبات
│   ├── static-data.ts             # طبقة بيانات (Prisma wrapper)
│   ├── validators.ts              # Zod schemas للتحقق من المدخلات
│   └── utils.ts                   # أدوات مساعدة
│
├── __tests__/                     # الاختبارات
│   ├── api/                       # اختبارات API (أمن + وظائف)
│   │   ├── courses.test.ts
│   │   └── security.test.ts       # 21 اختبار أمني
│   ├── components/                # اختبارات المكونات
│   │   └── home/hero-section.test.tsx
│   ├── lib/                       # اختبارات المكتبات
│   │   └── static-data.test.ts
│   └── setup.ts                   # إعداد بيئة الاختبار
│
├── middleware.ts                   # حماية المسارات
│
└── prisma/
    ├── schema.prisma              # مخطط قاعدة البيانات
    └── seed.ts                    # بيانات تجريبية (6 دورات، 32 درس، 6 اختبارات)
```

---

## واجهة برمجة التطبيقات (API)

### المسارات العامة (لا تحتاج مصادقة)

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/courses` | `GET` | جلب جميع الدورات مع فلترة (`?category=`, `?search=`) |
| `/api/courses/[id]` | `GET` | جلب تفاصيل دورة محددة |

### المسارات المحمية (تتطلب مصادقة)

| المسار | الطريقة | الوصف | حماية إضافية |
|--------|---------|-------|-------------|
| `/api/enrollments` | `GET` | جلب تسجيلات الطالب المصادق | يستخدم userId من الجلسة |
| `/api/enrollments` | `POST` | التسجيل في دورة جديدة | يستخدم userId من الجلسة |
| `/api/enrollments/[id]` | `PATCH` | تحديث تقدم التسجيل | التحقق من الملكية |
| `/api/quiz-attempts` | `POST` | حفظ نتيجة اختبار | حساب score سيرفر-سايد + التحقق من الملكية |
| `/api/certificates` | `GET` | جلب شهادات الطالب | يستخدم userId من الجلسة |
| `/api/certificates/[certificateId]` | `GET` | جلب شهادة محددة | التحقق من الملكية |
| `/api/generate-certificate` | `POST` | إنشاء شهادة إتمام | التحقق من الملكية + إتمام الكورس (progress = 100%) |

### مسارات التطوير فقط

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/seed` | `POST` | إنشاء بيانات تجريبية — **محظور في الإنتاج (403)** |

---

## الامن

### مصادقة API
كل المسارات الحساسة تستخدم `auth()` من Clerk للتأكد إن المستخدم مسجل دخول. الـ `userId` بيجي من الجلسة مش من الـ client، فمستحيل حد ينتحل شخصية تانية.

```typescript
// مثال: حماية مسار
const { userId } = await auth()
if (!userId) {
  return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
}
```

### تحقق من الملكية (Ownership Verification)
قبل أي عملية على تسجيل أو شهادة، بنتحقق إن المستخدم المصادق هو صاحب التسجيل:

```typescript
// lib/auth.ts — verifyEnrollmentOwnership
const enrollment = await db.enrollment.findUnique({ where: { id: enrollmentId } })
if (enrollment.userId !== userId) {
  return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 })
}
```

### حساب النتائج على السيرفر
الـ client بيبعت `answers` بس (مش `score` ولا `passed`). السيرفر بيجيب الأسئلة الصح ويحسب النتيجة:

```typescript
// quiz-attempts/route.ts — حساب score على السيرفر
let correctCount = 0
for (let i = 0; i < totalQuestions; i++) {
  const question = quiz.questions[i]
  if (answers[i] === question.correctAnswer) correctCount++
}
const score = Math.round((correctCount / totalQuestions) * 100)
const passed = score >= quiz.passingScore
```

### تحقق من المدخلات (Zod)
كل endpoint عنده Zod schema للتحقق من أنواع البيانات وقيمها:

```typescript
// lib/validators.ts
export const createEnrollmentSchema = z.object({
  studentName: z.string().min(1).max(200),
  studentEmail: z.string().email(),
  courseId: z.string().min(1),
})

export const createQuizAttemptSchema = z.object({
  enrollmentId: z.string().min(1),
  quizId: z.string().min(1),
  answers: z.array(z.number().min(0).max(3)).min(1),
  // ملحوظة: score و passed مش موجودين — بيتحسبوا على السيرفر
})
```

### تحديد معدل الطلبات (Rate Limiting)
كل API route عنده rate limiter يمنع الـ spam:

| نوع العملية | الحد | النافذة الزمنية |
|-------------|------|----------------|
| جلب الدورات | 60 طلب | 60 ثانية |
| جلب الشهادات | 30 طلب | 60 ثانية |
| التسجيل في دورة | 10 طلبات | 60 ثانية |
| اختبارات | 5 طلبات | 60 ثانية |
| إنشاء شهادة | 3 طلبات | 60 ثانية |
| بذر البيانات | 2 طلب | 5 دقائق |

> **ملاحظة:** الـ rate limiter الحالي in-memory. للإنتاج، يُنصح باستخدام Redis.

---

## حماية المسارات

المشروع يستخدم middleware لحماية المسارات:

- **مسارات عامة** (لا تحتاج تسجيل دخول): `/`، `/courses`، `/signin`، `/signup`
- **مسارات محمية** (تحتاج تسجيل دخول): `/dashboard`، `/courses/[id]/learn`، وغيرها

---

## مخطط قاعدة البيانات

```
Course ──┬── Lesson ────── Quiz ── QuizQuestion
         │                      │
         ├── Enrollment ─┬── QuizAttempt
         │               │
         │               └── Certificate
         │
         └── (thumbnailUrl, rating, price, level)
```

---

## الاختبارات

```bash
# تشغيل كل الاختبارات
npm test

# تشغيل اختبارات محددة
npx vitest run src/__tests__/api/security.test.ts
```

### تغطية الاختبارات

| الملف | عدد الاختبارات | النوع |
|-------|---------------|-------|
| `api/security.test.ts` | 21 | أمني (مصادقة، ملكية، validation، rate limiting) |
| `api/courses.test.ts` | 4 | وظائف API |
| `lib/static-data.test.ts` | 9 | بيانات ومنطق |
| `components/home/hero-section.test.tsx` | 6 | مكونات UI |
| **المجموع** | **40** | |

---

## تدفق التطبيق

```
الرئيسية → تصفح الدورات → تفاصيل الدورة → التسجيل (يتطلب تسجيل دخول)
                                            ↓
                                   مشاهدة الدروس → إكمال الدرس
                                            ↓
                                   الاختبار التفاعلي → النتيجة (تُحسب سيرفر-سايد)
                                            ↓
                               (نجاح) → إنشاء شهادة → عرض/طباعة الشهادة
                               (رسوب) → إعادة المحاولة
```

---

## الرخصة

هذا المشروع مرخص تحت رخصة MIT — راجع ملف [LICENSE](./LICENSE) للتفاصيل.

---

<div align="center">

**صنع بـ ❤️ بواسطة [Youssef](https://github.com/youssef-ai-dev)**

[![GitHub](https://img.shields.io/badge/GitHub-youssef--ai--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/youssef-ai-dev)

</div>
