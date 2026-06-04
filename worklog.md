---
Task ID: 1
Agent: Main Agent
Task: Fix courses not loading on Netlify deployment

Work Log:
- Diagnosed the root cause: `output: "standalone"` in next.config.ts conflicted with @netlify/plugin-nextjs, causing API routes to return 500 errors
- Found that `require('@/lib/static-data')` in client components doesn't work reliably in production builds
- Found `loadCourses` undefined reference bug in HomeView.tsx
- Fixed next.config.ts: removed `output: "standalone"`
- Fixed netlify.toml: updated build command to `npm run build`
- Fixed package.json: removed standalone copy commands from build script
- Fixed HomeView.tsx: replaced require() with direct ES import from static-data.ts, fixed loadCourses bug
- Fixed CoursesView.tsx: replaced require() with direct ES import
- Fixed CourseDetailView.tsx: replaced require() with direct ES import
- Fixed LessonView.tsx: replaced require() with direct ES import
- Fixed QuizView.tsx: replaced require() with direct ES import
- Built project successfully locally
- Pushed to GitHub (commit c2a47e3)
- Verified API endpoint returns 200 with all 6 courses on Netlify
- Verified main page loads correctly

Stage Summary:
- Courses now load instantly from bundled static data (no API dependency for read operations)
- API routes work correctly on Netlify (verified /api/courses returns 200)
- All client components use proper ES imports instead of require()
- Netlify deployment at https://gentle-starburst-b296c4.netlify.app/ should now show courses correctly
