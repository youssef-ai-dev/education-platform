---
Task ID: 1
Agent: Main Agent
Task: تعديل تخطيط صفحات تسجيل الدخول وإنشاء الحساب - نقل الفورم من النص للشمال

Work Log:
- حللت لقطة الشاشة اللي المستخدم رفعها - فورم تسجيل الدخول كان في النص
- اكتشفت إن الـ root layout فيه `dir="rtl"` اللي بيقلب الـ flex direction
- عدّلت صفحة signin: أضفت تصميم split-screen مع الفورم على الشمال وبراندينج على اليمين
- عدّلت صفحة signup بنفس التصميم
- أضفت `dir="ltr"` على الكونتينر الخارجي لصفحات التسجيل عشان أتجنب قلب الـ RTL
- أضفت `dir="rtl"` على الأقسام الداخلية عشان النص العربي يبان صح
- أخدت سكرينشوت بالـ Playwright واتأكدت بالـ VLM إن الفورم على الشمال

Stage Summary:
- صفحة signin: `/src/app/signin/[[...sign-in]]/page.tsx` - فورم على الشمال + براندينج على اليمين
- صفحة signup: `/src/app/signup/[[...sign-up]]/page.tsx` - نفس التصميم
- البراندينج فيه: شعار علم، وصف المنصة، 3 مميزات، إحصائيات

---
Task ID: 2
Agent: Main Agent
Task: إصلاح 4 نقاط ضعف متبقية (Middleware, Tests, Sentry, CI/CD)

Work Log:
- استبدلت middleware.ts الفارغ بـ clerkMiddleware + createRouteMatcher لحماية API routes
- أضفت حماية مزدوجة: middleware (طبقة أولى) + route handler auth (طبقة ثانية)
- أنشأت middleware.test.ts (10 اختبارات) + enrollment-detail.test.ts (5 اختبارات)
- Tests ارتفعت من 39 إلى 54 اختبار
- ثبّتت @sentry/nextjs وأنشأت sentry.client/server/edge.config.ts
- أنشأت src/lib/error-reporting.ts — reportError() مركزي بدل console.error
- استبدلت كل console.error في كل route handlers بـ reportError()
- أنشأت /api/monitoring route (Sentry tunnel لتجاوز ad-blockers)
- حدّثت next.config.ts ليدعم Sentry (withSentryConfig + source maps)
- أنشأت .github/workflows/ci.yml (lint + test + build على كل push)
- حدّثت README بالكامل مع أقسام جديدة: حماية مزدوجة، Sentry، CI/CD
- حدّثت .env.example بمتغيرات Sentry
- Build يشتغل بدون أخطاء

Stage Summary:
- Middleware: src/middleware.ts — clerkMiddleware يحمي كل /api/* المحمية
- Error Monitoring: Sentry + src/lib/error-reporting.ts (reportError مركزي)
- CI/CD: .github/workflows/ci.yml — 3 jobs (lint, test, build)
- Tests: 54 passing (كانت 39) — 6 test files
- Files changed: middleware.ts, next.config.ts, all route handlers, README.md, .env.example
