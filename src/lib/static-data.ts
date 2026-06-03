// Static data for portfolio demo - works on Netlify without database

export interface StaticLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  courseId: string
  isFree: boolean
}

export interface StaticQuizQuestion {
  id: string
  quizId: string
  question: string
  options: string
  correctAnswer: number
  explanation: string
}

export interface StaticQuiz {
  id: string
  title: string
  courseId: string
  lessonId: string | null
  timeLimit: number
  passingScore: number
  questions: StaticQuizQuestion[]
  attempts: any[]
}

export interface StaticCourse {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  instructor: string
  duration: string
  rating: number
  studentsCount: number
  price: number
  level: string
  createdAt: string
  lessons: StaticLesson[]
  quizzes: StaticQuiz[]
  enrollments: any[]
  _count: { enrollments: number }
}

const courses: StaticCourse[] = [
  {
    id: 'course-web-dev',
    title: 'أساسيات تطوير الويب باستخدام HTML و CSS',
    description: 'تعلم أساسيات تصميم وتطوير صفحات الويب من الصفر. ستتعلم في هذه الدورة كيفية بناء صفحات ويب احترافية باستخدام HTML5 و CSS3، بما في ذلك التصميم المتجاوب والرسوم المتحركة وتقنيات CSS الحديثة.',
    category: 'برمجة',
    thumbnailUrl: '/thumbnails/web-dev.png',
    instructor: 'أحمد محمد الخالدي',
    duration: '24 ساعة',
    rating: 4.8,
    studentsCount: 1250,
    price: 199,
    level: 'مبتدئ',
    createdAt: '2024-01-15T00:00:00.000Z',
    lessons: [
      { id: 'l-wd-1', title: 'مقدمة في تطوير الويب', description: 'نظرة عامة على عالم تطوير الويب وأدواته الأساسية', videoUrl: '', duration: '45 دقيقة', order: 1, courseId: 'course-web-dev', isFree: true },
      { id: 'l-wd-2', title: 'أساسيات HTML5', description: 'تعلم بنية صفحات HTML والعناصر الأساسية مثل العناوين والفقرات والروابط والصور', videoUrl: '', duration: '3 ساعات', order: 2, courseId: 'course-web-dev', isFree: true },
      { id: 'l-wd-3', title: 'تنسيق النصوص والقوائم', description: 'كيفية تنسيق النصوص وإنشاء القوائم المرتبة وغير المرتبة', videoUrl: '', duration: '2 ساعة', order: 3, courseId: 'course-web-dev', isFree: false },
      { id: 'l-wd-4', title: 'أساسيات CSS3', description: 'تعلم كيفية إضافة الأنماط والألوان والخطوط لصفحاتك', videoUrl: '', duration: '3 ساعات', order: 4, courseId: 'course-web-dev', isFree: false },
      { id: 'l-wd-5', title: 'تخطيط الصفحات باستخدام Flexbox', description: 'إتقان نظام Flexbox لإنشاء تخطيطات مرنة واحترافية', videoUrl: '', duration: '3 ساعات', order: 5, courseId: 'course-web-dev', isFree: false },
      { id: 'l-wd-6', title: 'التصميم المتجاوب', description: 'جعل مواقعك تعمل بشكل مثالي على جميع أحجام الشاشات', videoUrl: '', duration: '4 ساعات', order: 6, courseId: 'course-web-dev', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-wd',
      title: 'اختبار أساسيات تطوير الويب',
      courseId: 'course-web-dev',
      lessonId: null,
      timeLimit: 15,
      passingScore: 60,
      attempts: [],
      questions: [
        { id: 'q-wd-1', quizId: 'quiz-wd', question: 'ما هو العنصر المستخدم لإنشاء عنوان رئيسي في HTML؟', options: '["<heading>","<h1>","<title>","<header>"]', correctAnswer: 1, explanation: 'يُستخدم عنصر <h1> لإنشاء العنوان الرئيسي في صفحة HTML، وهو أهم عناصر العناوين.' },
        { id: 'q-wd-2', quizId: 'quiz-wd', question: 'أي خاصية CSS تُستخدم لتغيير لون النص؟', options: '["background-color","font-color","color","text-color"]', correctAnswer: 2, explanation: 'تُستخدم خاصية color لتغيير لون النص في CSS.' },
        { id: 'q-wd-3', quizId: 'quiz-wd', question: 'ما هو اختصار CSS؟', options: '["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"]', correctAnswer: 1, explanation: 'CSS يرمز إلى Cascading Style Sheets أي أوراق الأنماط المتتالية.' },
        { id: 'q-wd-4', quizId: 'quiz-wd', question: 'كيف تجعل عنصر HTML ارتباطًا تشعبيًا؟', options: '["<link>","<href>","<a>","<url>"]', correctAnswer: 2, explanation: 'يُستخدم عنصر <a> مع خاصية href لإنشاء الروابط التشعبية.' },
        { id: 'q-wd-5', quizId: 'quiz-wd', question: 'أي وحدة قياس في CSS هي نسبية لحجم الخط؟', options: '["px","cm","em","pt"]', correctAnswer: 2, explanation: 'وحدة em هي وحدة نسبية تعتمد على حجم خط العنصر الأب.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 1250 }
  },
  {
    id: 'course-react',
    title: 'تطوير تطبيقات React الاحترافية',
    description: 'دورة شاملة لتعلم مكتبة React من البداية حتى الاحتراف. ستتعلم المكونات والـ Hooks وإدارة الحالة والتنقل وبناء تطبيقات كاملة.',
    category: 'برمجة',
    thumbnailUrl: '/thumbnails/react.png',
    instructor: 'سارة عبدالله المنصوري',
    duration: '36 ساعة',
    rating: 4.9,
    studentsCount: 2100,
    price: 299,
    level: 'متوسط',
    createdAt: '2024-02-20T00:00:00.000Z',
    lessons: [
      { id: 'l-r-1', title: 'مقدمة في React', description: 'فهم مفهوم المكتبة ومميزاتها ولماذا هي الأكثر شعبية', videoUrl: '', duration: '1 ساعة', order: 1, courseId: 'course-react', isFree: true },
      { id: 'l-r-2', title: 'JSX والمكونات', description: 'تعلم كتابة JSX وإنشاء المكونات القابلة لإعادة الاستخدام', videoUrl: '', duration: '3 ساعات', order: 2, courseId: 'course-react', isFree: true },
      { id: 'l-r-3', title: 'الـ Props والحالة', description: 'فهم تدفق البيانات عبر Props وإدارة حالة المكون', videoUrl: '', duration: '4 ساعات', order: 3, courseId: 'course-react', isFree: false },
      { id: 'l-r-4', title: 'React Hooks المتقدمة', description: 'استخدام useEffect وuseRef وuseMemo وuseCallback وcustom hooks', videoUrl: '', duration: '5 ساعات', order: 4, courseId: 'course-react', isFree: false },
      { id: 'l-r-5', title: 'إدارة الحالة العالمية', description: 'استخدام Context API وZustand لإدارة حالة التطبيق', videoUrl: '', duration: '4 ساعات', order: 5, courseId: 'course-react', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-react',
      title: 'اختبار React الاحترافي',
      courseId: 'course-react',
      lessonId: null,
      timeLimit: 20,
      passingScore: 70,
      attempts: [],
      questions: [
        { id: 'q-r-1', quizId: 'quiz-react', question: 'ما هو الـ Hook المستخدم لإدارة الحالة في المكونات الوظيفية؟', options: '["useEffect","useState","useRef","useContext"]', correctAnswer: 1, explanation: 'يُستخدم useState لإدارة الحالة المحلية في المكونات الوظيفية.' },
        { id: 'q-r-2', quizId: 'quiz-react', question: 'ما الفرق بين Props و State؟', options: '["لا فرق بينهما","Props قابلة للتعديل و State غير قابلة","Props تُمرر من الأب و State محلية للمكون","State تُمرر من الأب و Props محلية"]', correctAnswer: 2, explanation: 'Props تُمرر من المكون الأب وهي للقراءة فقط، بينما State محلية للمكون ويمكن تعديلها.' },
        { id: 'q-r-3', quizId: 'quiz-react', question: 'متى يُنفذ useEffect بدون مصفوفة تبعيات؟', options: '["مرة واحدة فقط","عند كل عملية render","عند تغير الحالة فقط","لا يُنفذ أبداً"]', correctAnswer: 1, explanation: 'بدون مصفوفة تبعيات، يُنفذ useEffect بعد كل عملية render.' },
        { id: 'q-r-4', quizId: 'quiz-react', question: 'ما هو Virtual DOM؟', options: '["نسخة افتراضية من قاعدة البيانات","تمثيل خفيف لشجرة العناصر في الذاكرة","متصفح افتراضي للاختبار","أداة لبناء الواجهات"]', correctAnswer: 1, explanation: 'Virtual DOM هو تمثيل خفيف لشجرة عناصر HTML في الذاكرة يُستخدم لتحسين الأداء.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 2100 }
  },
  {
    id: 'course-figma',
    title: 'تصميم واجهات المستخدم باستخدام Figma',
    description: 'تعلم تصميم واجهات مستخدم احترافية وجذابة باستخدام أداة Figma. من المبادئ الأساسية للتصميم وحتى إنشاء أنظمة تصميم متكاملة.',
    category: 'تصميم',
    thumbnailUrl: '/thumbnails/figma.png',
    instructor: 'نورة حسن الشمري',
    duration: '20 ساعة',
    rating: 4.7,
    studentsCount: 890,
    price: 179,
    level: 'مبتدئ',
    createdAt: '2024-03-10T00:00:00.000Z',
    lessons: [
      { id: 'l-f-1', title: 'مقدمة في تصميم الواجهات', description: 'فهم مبادئ UX/UI وأهمية التصميم الجيد', videoUrl: '', duration: '1 ساعة', order: 1, courseId: 'course-figma', isFree: true },
      { id: 'l-f-2', title: 'التعرف على Figma', description: 'جولة شاملة في واجهة Figma وأدواتها', videoUrl: '', duration: '2 ساعة', order: 2, courseId: 'course-figma', isFree: true },
      { id: 'l-f-3', title: 'التصميم بالمكونات', description: 'إنشاء مكونات قابلة لإعادة الاستخدام وأنظمة Auto Layout', videoUrl: '', duration: '4 ساعات', order: 3, courseId: 'course-figma', isFree: false },
      { id: 'l-f-4', title: 'أنظمة الألوان والخطوط', description: 'اختيار لوحات ألوان متناسقة وتطبيق نظرية الألوان', videoUrl: '', duration: '3 ساعات', order: 4, courseId: 'course-figma', isFree: false },
      { id: 'l-f-5', title: 'النماذج التفاعلية', description: 'إنشاء prototypes تفاعلية مع انتقالات وحركات', videoUrl: '', duration: '4 ساعات', order: 5, courseId: 'course-figma', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-figma',
      title: 'اختبار تصميم الواجهات',
      courseId: 'course-figma',
      lessonId: null,
      timeLimit: 12,
      passingScore: 60,
      attempts: [],
      questions: [
        { id: 'q-f-1', quizId: 'quiz-figma', question: 'ما الفرق بين UX و UI؟', options: '["هما نفس الشيء","UX تجربة المستخدم و UI واجهة المستخدم","UI تجربة المستخدم و UX واجهة المستخدم","UX للتصميم و UI للبرمجة"]', correctAnswer: 1, explanation: 'UX يرمز لتجربة المستخدم (كيف يعمل) و UI يرمز لواجهة المستخدم (كيف يبدو).' },
        { id: 'q-f-2', quizId: 'quiz-figma', question: 'ما هو Auto Layout في Figma؟', options: '["تخطيط تلقائي للصفحة","نظام لتنظيم العناصر تلقائياً ضمن إطار","أداة لتصدير التصميم","خاصية لتغيير الألوان"]', correctAnswer: 1, explanation: 'Auto Layout يسمح بتنظيم العناصر تلقائياً ويتكيف مع تغير المحتوى.' },
        { id: 'q-f-3', quizId: 'quiz-figma', question: 'ما هو النموذج التفاعلي (Prototype)؟', options: '["النسخة النهائية من التطبيق","محاكاة تفاعلية للتصميم تظهر التنقل","كود المصدر للتطبيق","قاعدة بيانات التصميم"]', correctAnswer: 1, explanation: 'النموذج التفاعلي يحاكي تجربة المستخدم الحقيقية قبل البرمجة.' },
        { id: 'q-f-4', quizId: 'quiz-figma', question: 'أي من التالي يُعتبر من مبادئ التصميم الجيد؟', options: '["استخدام ألوان كثيرة","الاتساق والتكرار","تعقيد الواجهة","استخدام خطوط متعددة"]', correctAnswer: 1, explanation: 'الاتساق والتكرار من أهم مبادئ التصميم لخلق تجربة متجانسة.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 890 }
  },
  {
    id: 'course-agile',
    title: 'إدارة المشاريع الرشيقة - Agile',
    description: 'تعلم منهجيات إدارة المشاريع الرشيقة بما في ذلك Scrum و Kanban. دورة مثالية لمديري المشاريع وفرق التطوير.',
    category: 'أعمال',
    thumbnailUrl: '/thumbnails/agile.png',
    instructor: 'خالد سعيد العمري',
    duration: '18 ساعة',
    rating: 4.6,
    studentsCount: 670,
    price: 249,
    level: 'متوسط',
    createdAt: '2024-04-05T00:00:00.000Z',
    lessons: [
      { id: 'l-a-1', title: 'مقدمة في منهجية Agile', description: 'فهم البيان الرشيق والمبادئ الأساسية', videoUrl: '', duration: '2 ساعة', order: 1, courseId: 'course-agile', isFree: true },
      { id: 'l-a-2', title: 'إطار عمل Scrum', description: 'الأدوار والفعاليات والمخرجات في Scrum', videoUrl: '', duration: '4 ساعات', order: 2, courseId: 'course-agile', isFree: true },
      { id: 'l-a-3', title: 'لوحات Kanban', description: 'إدارة تدفق العمل باستخدام Kanban', videoUrl: '', duration: '3 ساعات', order: 3, courseId: 'course-agile', isFree: false },
      { id: 'l-a-4', title: 'تخطيط Sprint', description: 'كيفية تخطيط وتنفيذ Sprint فعال', videoUrl: '', duration: '4 ساعات', order: 4, courseId: 'course-agile', isFree: false },
      { id: 'l-a-5', title: 'قياس الأداء والتحسين', description: 'مؤشرات الأداء الرئيسية وتحسين العمليات', videoUrl: '', duration: '3 ساعات', order: 5, courseId: 'course-agile', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-agile',
      title: 'اختبار إدارة المشاريع الرشيق',
      courseId: 'course-agile',
      lessonId: null,
      timeLimit: 15,
      passingScore: 60,
      attempts: [],
      questions: [
        { id: 'q-a-1', quizId: 'quiz-agile', question: 'ما مدة Sprint النموذجية في Scrum؟', options: '["يوم واحد","أسبوعان إلى 4 أسابيع","3 أشهر","6 أشهر"]', correctAnswer: 1, explanation: 'تتراوح مدة Sprint عادة من أسبوعين إلى 4 أسابيع.' },
        { id: 'q-a-2', quizId: 'quiz-agile', question: 'من هو المسؤول عن إزالة العوائق في Scrum؟', options: '["مطورو المنتج","Scrum Master","مالك المنتج","مدير المشروع"]', correctAnswer: 1, explanation: 'Scrum Master مسؤول عن إزالة العوائق وحماية الفريق.' },
        { id: 'q-a-3', quizId: 'quiz-agile', question: 'ما هو Product Backlog؟', options: '["قائمة المهام المنجزة","قائمة مرتبة بأولويات للميزات المطلوبة","جدول زمني للمشروع","تقرير الأداء"]', correctAnswer: 1, explanation: 'Product Backlog قائمة مرتبة حسب الأولوية لجميع الميزات والمتطلبات المطلوبة.' },
        { id: 'q-a-4', quizId: 'quiz-agile', question: 'ما الفرق الرئيسي بين Scrum و Kanban؟', options: '["لا فرق بينهما","Scrum يعمل بإيقاعات ثابتة و Kanban تدفق مستمر","Kanban أسرع من Scrum","Scrum للفرق الكبيرة فقط"]', correctAnswer: 1, explanation: 'Scrum يعمل بـ Sprints زمنية ثابتة بينما Kanban يعمل بتدفق مستمر.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 670 }
  },
  {
    id: 'course-english',
    title: 'تعلم اللغة الإنجليزية للمحترفين',
    description: 'دورة شاملة لتحسين مهارات اللغة الإنجليزية في بيئة العمل. تعلم المصطلحات المهنية وكتابة الإيميلات وإجراء المقابلات بالإنجليزية.',
    category: 'لغات',
    thumbnailUrl: '/thumbnails/english.png',
    instructor: 'فاطمة علي الحربي',
    duration: '30 ساعة',
    rating: 4.5,
    studentsCount: 1580,
    price: 149,
    level: 'مبتدئ',
    createdAt: '2024-05-12T00:00:00.000Z',
    lessons: [
      { id: 'l-e-1', title: 'أساسيات القواعد الإنجليزية', description: 'مراجعة شاملة لأهم قواعد اللغة الإنجليزية', videoUrl: '', duration: '4 ساعات', order: 1, courseId: 'course-english', isFree: true },
      { id: 'l-e-2', title: 'المصطلحات المهنية', description: 'تعلم أكثر 500 مصطلح مستخدم في بيئة العمل', videoUrl: '', duration: '5 ساعات', order: 2, courseId: 'course-english', isFree: true },
      { id: 'l-e-3', title: 'كتابة الإيميلات الاحترافية', description: 'كيفية كتابة إيميلات عمل احترافية ومؤثرة', videoUrl: '', duration: '4 ساعات', order: 3, courseId: 'course-english', isFree: false },
      { id: 'l-e-4', title: 'مهارات العرض والتقديم', description: 'إجراء عروض تقديمية بالإنجليزية بثقة', videoUrl: '', duration: '5 ساعات', order: 4, courseId: 'course-english', isFree: false },
      { id: 'l-e-5', title: 'الاستعداد للمقابلات', description: 'نصائح وتمارين للنجاح في المقابلات بالإنجليزية', videoUrl: '', duration: '4 ساعات', order: 5, courseId: 'course-english', isFree: false },
      { id: 'l-e-6', title: 'ممارسة المحادثة', description: 'جلسات محادثة تطبيقية في سيناريوهات عمل متنوعة', videoUrl: '', duration: '6 ساعات', order: 6, courseId: 'course-english', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-english',
      title: 'اختبار اللغة الإنجليزية المهنية',
      courseId: 'course-english',
      lessonId: null,
      timeLimit: 20,
      passingScore: 60,
      attempts: [],
      questions: [
        { id: 'q-e-1', quizId: 'quiz-english', question: 'ما الترجمة الصحيحة لعبارة "موعد نهائي"؟', options: '["deadline","timeline","schedule","appointment"]', correctAnswer: 0, explanation: 'deadline هي الترجمة الصحيحة لـ "موعد نهائي".' },
        { id: 'q-e-2', quizId: 'quiz-english', question: 'أي جملة صحيحة في الإيميل الرسمي؟', options: '["Hey, whats up?","Dear Mr. Smith, I am writing to...","Hi bro, need help","Yo, check this out"]', correctAnswer: 1, explanation: 'الجملة الثانية هي الأنسب للإيميل الرسمي.' },
        { id: 'q-e-3', quizId: 'quiz-english', question: 'ما معنى كلمة "collaborate"؟', options: '["يتنافس","يتعاون","يتجاهل","يُخطط"]', correctAnswer: 1, explanation: 'collaborate تعني يتعاون أو يعمل معاً.' },
        { id: 'q-e-4', quizId: 'quiz-english', question: 'كيف تطلب اجتماعاً بلباقة بالإنجليزية؟', options: '["We need to meet NOW!","Would you be available for a meeting?","Meet me or else","I demand a meeting"]', correctAnswer: 1, explanation: 'الجملة الثانية مهذبة ومناسبة لطلب اجتماع.' },
        { id: 'q-e-5', quizId: 'quiz-english', question: 'ما المرادف الأقرب لكلمة "innovative"؟', options: '["تقليدي","مبتكر","معقد","بسيط"]', correctAnswer: 1, explanation: 'innovative تعني مبتكر أو مبدع.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 1580 }
  },
  {
    id: 'course-data',
    title: 'تحليل البيانات باستخدام Python',
    description: 'تعلم تحليل البيانات والتصور البياني باستخدام Python و Pandas و Matplotlib. من جمع البيانات حتى استخلاص الرؤى واتخاذ القرارات.',
    category: 'علوم بيانات',
    thumbnailUrl: '/thumbnails/data-science.png',
    instructor: 'عبدالرحمن فهد القحطاني',
    duration: '28 ساعة',
    rating: 4.8,
    studentsCount: 980,
    price: 259,
    level: 'متوسط',
    createdAt: '2024-06-01T00:00:00.000Z',
    lessons: [
      { id: 'l-d-1', title: 'مقدمة في تحليل البيانات', description: 'فهم دور محلل البيانات وأدواته', videoUrl: '', duration: '2 ساعة', order: 1, courseId: 'course-data', isFree: true },
      { id: 'l-d-2', title: 'أساسيات Python للبيانات', description: 'مراجعة أساسيات Python اللازمة لتحليل البيانات', videoUrl: '', duration: '4 ساعات', order: 2, courseId: 'course-data', isFree: true },
      { id: 'l-d-3', title: 'التعامل مع Pandas', description: 'تحميل وتنظيف ومعالجة البيانات باستخدام Pandas', videoUrl: '', duration: '6 ساعات', order: 3, courseId: 'course-data', isFree: false },
      { id: 'l-d-4', title: 'التصور البياني', description: 'إنشاء رسوم بيانية احترافية باستخدام Matplotlib و Seaborn', videoUrl: '', duration: '5 ساعات', order: 4, courseId: 'course-data', isFree: false },
      { id: 'l-d-5', title: 'الإحصاء الوصفي', description: 'تطبيق الأساليب الإحصائية لفهم البيانات', videoUrl: '', duration: '5 ساعات', order: 5, courseId: 'course-data', isFree: false },
    ],
    quizzes: [{
      id: 'quiz-data',
      title: 'اختبار تحليل البيانات',
      courseId: 'course-data',
      lessonId: null,
      timeLimit: 18,
      passingScore: 65,
      attempts: [],
      questions: [
        { id: 'q-d-1', quizId: 'quiz-data', question: 'ما هي المكتبة الأساسية لتحليل البيانات في Python؟', options: '["NumPy","Pandas","Django","Flask"]', correctAnswer: 1, explanation: 'Pandas هي المكتبة الأساسية والأكثر استخداماً لتحليل البيانات في Python.' },
        { id: 'q-d-2', quizId: 'quiz-data', question: 'ما هو DataFrame في Pandas؟', options: '["نوع من الرسوم البيانية","جدول بيانات ثنائي الأبعاد","وظيفة رياضية","قاعدة بيانات"]', correctAnswer: 1, explanation: 'DataFrame هي بنية بيانات ثنائية الأبعاد تشبه جدول البيانات.' },
        { id: 'q-d-3', quizId: 'quiz-data', question: 'ما المقصود بالبيانات المفقودة (Missing Data)؟', options: '["بيانات مشفرة","قيم فارغة أو غير موجودة في مجموعة البيانات","بيانات مكررة","بيانات قديمة"]', correctAnswer: 1, explanation: 'البيانات المفقودة هي القيم الفارغة أو غير الموجودة التي تحتاج معالجة.' },
        { id: 'q-d-4', quizId: 'quiz-data', question: 'أي دالة تُستخدم لحساب المتوسط في Pandas؟', options: '["mean()","average()","median()","sum()"]', correctAnswer: 0, explanation: 'دالة mean() تُستخدم لحساب المتوسط الحسابي في Pandas.' },
      ]
    }],
    enrollments: [],
    _count: { enrollments: 980 }
  }
]

// In-memory storage for runtime writes (portfolio demo)
let enrollments: any[] = []
let quizAttempts: any[] = []
let certificates: any[] = []

export function getCourses(category?: string, search?: string): StaticCourse[] {
  let filtered = courses
  if (category && category !== 'الكل') {
    filtered = filtered.filter(c => c.category === category)
  }
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.instructor.toLowerCase().includes(s)
    )
  }
  return filtered
}

export function getCourseById(id: string): StaticCourse | undefined {
  return courses.find(c => c.id === id)
}

export function getEnrollments(email: string) {
  return enrollments.filter(e => e.studentEmail === email).map(e => {
    const course = courses.find(c => c.id === e.courseId)
    return {
      ...e,
      course: course || null,
      quizAttempts: quizAttempts.filter(qa => qa.enrollmentId === e.id),
      certificate: certificates.find(cert => cert.enrollmentId === e.id) || null
    }
  })
}

export function createEnrollment(data: { studentName: string; studentEmail: string; courseId: string }) {
  const existing = enrollments.find(e => e.studentEmail === data.studentEmail && e.courseId === data.courseId)
  if (existing) return { error: 'أنت مسجل بالفعل في هذه الدورة', enrollment: existing }

  const course = courses.find(c => c.id === data.courseId)
  if (!course) return { error: 'الدورة غير موجودة' }

  const enrollment = {
    id: `enr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    courseId: data.courseId,
    progress: 0,
    enrolledAt: new Date().toISOString(),
    completedAt: null,
  }
  enrollments.push(enrollment)

  // Update students count
  const c = courses.find(c => c.id === data.courseId)
  if (c) c.studentsCount += 1

  return { enrollment: { ...enrollment, course } }
}

export function updateEnrollmentProgress(id: string, progress: number) {
  const enrollment = enrollments.find(e => e.id === id)
  if (!enrollment) return null
  enrollment.progress = progress
  if (progress >= 100) enrollment.completedAt = new Date().toISOString()
  return enrollment
}

export function createQuizAttempt(data: { enrollmentId: string; quizId: string; answers: any[]; score: number; passed: boolean }) {
  const attempt = {
    id: `qa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    enrollmentId: data.enrollmentId,
    quizId: data.quizId,
    score: data.score,
    passed: data.passed,
    answers: JSON.stringify(data.answers),
    completedAt: new Date().toISOString(),
  }
  quizAttempts.push(attempt)
  return attempt
}

export function getCertificates(email: string) {
  return certificates.filter(cert => {
    const enrollment = enrollments.find(e => e.id === cert.enrollmentId)
    return enrollment?.studentEmail === email
  })
}

export function getCertificateByCertificateId(certificateId: string) {
  return certificates.find(cert => cert.certificateId === certificateId) || null
}

export function generateCertificate(enrollmentId: string) {
  const enrollment = enrollments.find(e => e.id === enrollmentId)
  if (!enrollment) return { error: 'التسجيل غير موجود' }

  const existingCert = certificates.find(cert => cert.enrollmentId === enrollmentId)
  if (existingCert) return { certificate: existingCert }

  const course = courses.find(c => c.id === enrollment.courseId)
  enrollment.progress = 100
  enrollment.completedAt = new Date().toISOString()

  const cert = {
    id: `cert-${Date.now()}`,
    enrollmentId,
    studentName: enrollment.studentName,
    courseTitle: course?.title || '',
    instructor: course?.instructor || '',
    completedAt: new Date().toISOString(),
    certificateId: `CERT-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
  }
  certificates.push(cert)
  return { certificate: cert }
}

export function seedData() {
  return {
    message: 'البيانات التجريبية جاهزة',
    coursesCount: courses.length,
    seeded: true
  }
}
