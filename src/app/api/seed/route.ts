import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Check if data already exists
    const existingCourses = await db.course.count()
    if (existingCourses > 0) {
      return NextResponse.json({
        message: 'البيانات موجودة بالفعل',
        coursesCount: existingCourses,
        seeded: false
      })
    }

    const courses = [
      {
        title: 'أساسيات تطوير الويب باستخدام HTML و CSS',
        description: 'تعلم أساسيات تصميم وتطوير صفحات الويب من الصفر. ستتعلم في هذه الدورة كيفية بناء صفحات ويب احترافية باستخدام HTML5 و CSS3، بما في ذلك التصميم المتجاوب والرسوم المتحركة وتقنيات CSS الحديثة.',
        category: 'برمجة',
        instructor: 'أحمد محمد الخالدي',
        duration: '24 ساعة',
        rating: 4.8,
        studentsCount: 1250,
        price: 199,
        level: 'مبتدئ',
        thumbnailUrl: '/thumbnails/web-dev.png',
        lessons: [
          { title: 'مقدمة في تطوير الويب', description: 'نظرة عامة على عالم تطوير الويب وأدواته الأساسية', duration: '45 دقيقة', order: 1, isFree: true },
          { title: 'أساسيات HTML5', description: 'تعلم بنية صفحات HTML والعناصر الأساسية مثل العناوين والفقرات والروابط والصور', duration: '3 ساعات', order: 2, isFree: true },
          { title: 'تنسيق النصوص والقوائم', description: 'كيفية تنسيق النصوص وإنشاء القوائم المرتبة وغير المرتبة', duration: '2 ساعة', order: 3, isFree: false },
          { title: 'أساسيات CSS3', description: 'تعلم كيفية إضافة الأنماط والألوان والخطوط لصفحاتك', duration: '3 ساعات', order: 4, isFree: false },
          { title: 'تخطيط الصفحات باستخدام Flexbox', description: 'إتقان نظام Flexbox لإنشاء تخطيطات مرنة واحترافية', duration: '3 ساعات', order: 5, isFree: false },
          { title: 'التصميم المتجاوب', description: 'جعل مواقعك تعمل بشكل مثالي على جميع أحجام الشاشات', duration: '4 ساعات', order: 6, isFree: false },
        ],
        quiz: {
          title: 'اختبار أساسيات تطوير الويب',
          timeLimit: 15,
          passingScore: 60,
          questions: [
            { question: 'ما هو العنصر المستخدم لإنشاء عنوان رئيسي في HTML؟', options: '["<heading>","<h1>","<title>","<header>"]', correctAnswer: 1, explanation: 'يُستخدم عنصر <h1> لإنشاء العنوان الرئيسي في صفحة HTML، وهو أهم عناصر العناوين.' },
            { question: 'أي خاصية CSS تُستخدم لتغيير لون النص؟', options: '["background-color","font-color","color","text-color"]', correctAnswer: 2, explanation: 'تُستخدم خاصية color لتغيير لون النص في CSS.' },
            { question: 'ما هو اختصار CSS؟', options: '["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"]', correctAnswer: 1, explanation: 'CSS يرمز إلى Cascading Style Sheets أي أوراق الأنماط المتتالية.' },
            { question: 'كيف تجعل عنصر HTML ارتباطًا تشعبيًا؟', options: '["<link>","<href>","<a>","<url>"]', correctAnswer: 2, explanation: 'يُستخدم عنصر <a> مع خاصية href لإنشاء الروابط التشعبية.' },
            { question: 'أي وحدة قياس في CSS هي نسبية لحجم الخط؟', options: '["px","cm","em","pt"]', correctAnswer: 2, explanation: 'وحدة em هي وحدة نسبية تعتمد على حجم خط العنصر الأب.' },
          ]
        }
      },
      {
        title: 'تطوير تطبيقات React الاحترافية',
        description: 'دورة شاملة لتعلم مكتبة React من البداية حتى الاحتراف. ستتعلم المكونات والـ Hooks وإدارة الحالة والتنقل وبناء تطبيقات كاملة.',
        category: 'برمجة',
        instructor: 'سارة عبدالله المنصوري',
        duration: '36 ساعة',
        rating: 4.9,
        studentsCount: 2100,
        price: 299,
        level: 'متوسط',
        thumbnailUrl: '/thumbnails/react.png',
        lessons: [
          { title: 'مقدمة في React', description: 'فهم مفهوم المكتبة ومميزاتها ولماذا هي الأكثر شعبية', duration: '1 ساعة', order: 1, isFree: true },
          { title: 'JSX والمكونات', description: 'تعلم كتابة JSX وإنشاء المكونات القابلة لإعادة الاستخدام', duration: '3 ساعات', order: 2, isFree: true },
          { title: 'الـ Props والحالة', description: 'فهم تدفق البيانات عبر Props وإدارة حالة المكون', duration: '4 ساعات', order: 3, isFree: false },
          { title: 'React Hooks المتقدمة', description: 'استخدام useEffect وuseRef وuseMemo وuseCallback وcustom hooks', duration: '5 ساعات', order: 4, isFree: false },
          { title: 'إدارة الحالة العالمية', description: 'استخدام Context API وZustand لإدارة حالة التطبيق', duration: '4 ساعات', order: 5, isFree: false },
        ],
        quiz: {
          title: 'اختبار React الاحترافي',
          timeLimit: 20,
          passingScore: 70,
          questions: [
            { question: 'ما هو الـ Hook المستخدم لإدارة الحالة في المكونات الوظيفية؟', options: '["useEffect","useState","useRef","useContext"]', correctAnswer: 1, explanation: 'يُستخدم useState لإدارة الحالة المحلية في المكونات الوظيفية.' },
            { question: 'ما الفرق بين Props و State؟', options: '["لا فرق بينهما","Props قابلة للتعديل و State غير قابلة","Props تُمرر من الأب و State محلية للمكون","State تُمرر من الأب و Props محلية"]', correctAnswer: 2, explanation: 'Props تُمرر من المكون الأب وهي للقراءة فقط، بينما State محلية للمكون ويمكن تعديلها.' },
            { question: 'متى يُنفذ useEffect بدون مصفوفة تبعيات؟', options: '["مرة واحدة فقط","عند كل عملية render","عند تغير الحالة فقط","لا يُنفذ أبداً"]', correctAnswer: 1, explanation: 'بدون مصفوفة تبعيات، يُنفذ useEffect بعد كل عملية render.' },
            { question: 'ما هو Virtual DOM؟', options: '["نسخة افتراضية من قاعدة البيانات","تمثيل خفيف لشجرة العناصر في الذاكرة","متصفح افتراضي للاختبار","أداة لبناء الواجهات"]', correctAnswer: 1, explanation: 'Virtual DOM هو تمثيل خفيف لشجرة عناصر HTML في الذاكرة يُستخدم لتحسين الأداء.' },
          ]
        }
      },
      {
        title: 'تصميم واجهات المستخدم باستخدام Figma',
        description: 'تعلم تصميم واجهات مستخدم احترافية وجذابة باستخدام أداة Figma. من المبادئ الأساسية للتصميم وحتى إنشاء أنظمة تصميم متكاملة.',
        category: 'تصميم',
        instructor: 'نورة حسن الشمري',
        duration: '20 ساعة',
        rating: 4.7,
        studentsCount: 890,
        price: 179,
        level: 'مبتدئ',
        thumbnailUrl: '/thumbnails/figma.png',
        lessons: [
          { title: 'مقدمة في تصميم الواجهات', description: 'فهم مبادئ UX/UI وأهمية التصميم الجيد', duration: '1 ساعة', order: 1, isFree: true },
          { title: 'التعرف على Figma', description: 'جولة شاملة في واجهة Figma وأدواتها', duration: '2 ساعة', order: 2, isFree: true },
          { title: 'التصميم بالمكونات', description: 'إنشاء مكونات قابلة لإعادة الاستخدام وأنظمة Auto Layout', duration: '4 ساعات', order: 3, isFree: false },
          { title: 'أنظمة الألوان والخطوط', description: 'اختيار لوحات ألوان متناسقة وتطبيق نظرية الألوان', duration: '3 ساعات', order: 4, isFree: false },
          { title: 'النماذج التفاعلية', description: 'إنشاء prototypes تفاعلية مع انتقالات وحركات', duration: '4 ساعات', order: 5, isFree: false },
        ],
        quiz: {
          title: 'اختبار تصميم الواجهات',
          timeLimit: 12,
          passingScore: 60,
          questions: [
            { question: 'ما الفرق بين UX و UI؟', options: '["هما نفس الشيء","UX تجربة المستخدم و UI واجهة المستخدم","UI تجربة المستخدم و UX واجهة المستخدم","UX للتصميم و UI للبرمجة"]', correctAnswer: 1, explanation: 'UX يرمز لتجربة المستخدم (كيف يعمل) و UI يرمز لواجهة المستخدم (كيف يبدو).' },
            { question: 'ما هو Auto Layout في Figma؟', options: '["تخطيط تلقائي للصفحة","نظام لتنظيم العناصر تلقائياً ضمن إطار","أداة لتصدير التصميم","خاصية لتغيير الألوان"]', correctAnswer: 1, explanation: 'Auto Layout يسمح بتنظيم العناصر تلقائياً ويتكيف مع تغير المحتوى.' },
            { question: 'ما هو النموذج التفاعلي (Prototype)؟', options: '["النسخة النهائية من التطبيق","محاكاة تفاعلية للتصميم تظهر التنقل","كود المصدر للتطبيق","قاعدة بيانات التصميم"]', correctAnswer: 1, explanation: 'النموذج التفاعلي يحاكي تجربة المستخدم الحقيقية قبل البرمجة.' },
            { question: 'أي من التالي يُعتبر من مبادئ التصميم الجيد؟', options: '["استخدام ألوان كثيرة","الاتساق والتكرار","تعقيد الواجهة","استخدام خطوط متعددة"]', correctAnswer: 1, explanation: 'الاتساق والتكرار من أهم مبادئ التصميم لخلق تجربة متجانسة.' },
          ]
        }
      },
      {
        title: 'إدارة المشاريع الرشيقة - Agile',
        description: 'تعلم منهجيات إدارة المشاريع الرشيقة بما في ذلك Scrum و Kanban. دورة مثالية لمديري المشاريع وفرق التطوير.',
        category: 'أعمال',
        instructor: 'خالد سعيد العمري',
        duration: '18 ساعة',
        rating: 4.6,
        studentsCount: 670,
        price: 249,
        level: 'متوسط',
        thumbnailUrl: '/thumbnails/agile.png',
        lessons: [
          { title: 'مقدمة في منهجية Agile', description: 'فهم البيان الرشيق والمبادئ الأساسية', duration: '2 ساعة', order: 1, isFree: true },
          { title: 'إطار عمل Scrum', description: 'الأدوار والفعاليات والمخرجات في Scrum', duration: '4 ساعات', order: 2, isFree: true },
          { title: 'لوحات Kanban', description: 'إدارة تدفق العمل باستخدام Kanban', duration: '3 ساعات', order: 3, isFree: false },
          { title: 'تخطيط Sprint', description: 'كيفية تخطيط وتنفيذ Sprint فعال', duration: '4 ساعات', order: 4, isFree: false },
          { title: 'قياس الأداء والتحسين', description: 'مؤشرات الأداء الرئيسية وتحسين العمليات', duration: '3 ساعات', order: 5, isFree: false },
        ],
        quiz: {
          title: 'اختبار إدارة المشاريع الرشيق',
          timeLimit: 15,
          passingScore: 60,
          questions: [
            { question: 'ما مدة Sprint النموذجية في Scrum؟', options: '["يوم واحد","أسبوعان إلى 4 أسابيع","3 أشهر","6 أشهر"]', correctAnswer: 1, explanation: 'تتراوح مدة Sprint عادة من أسبوعين إلى 4 أسابيع.' },
            { question: 'من هو المسؤول عن إزالة العوائق في Scrum؟', options: '["مطورو المنتج","Scrum Master","مالك المنتج","مدير المشروع"]', correctAnswer: 1, explanation: 'Scrum Master مسؤول عن إزالة العوائق وحماية الفريق.' },
            { question: 'ما هو Product Backlog؟', options: '["قائمة المهام المنجزة","قائمة مرتبة بأولويات للميزات المطلوبة","جدول زمني للمشروع","تقرير الأداء"]', correctAnswer: 1, explanation: 'Product Backlog قائمة مرتبة حسب الأولوية لجميع الميزات والمتطلبات المطلوبة.' },
            { question: 'ما الفرق الرئيسي بين Scrum و Kanban؟', options: '["لا فرق بينهما","Scrum يعمل بإيقاعات ثابتة و Kanban تدفق مستمر","Kanban أسرع من Scrum","Scrum للفرق الكبيرة فقط"]', correctAnswer: 1, explanation: 'Scrum يعمل بـ Sprints زمنية ثابتة بينما Kanban يعمل بتدفق مستمر.' },
          ]
        }
      },
      {
        title: 'تعلم اللغة الإنجليزية للمحترفين',
        description: 'دورة شاملة لتحسين مهارات اللغة الإنجليزية في بيئة العمل. تعلم المصطلحات المهنية وكتابة الإيميلات وإجراء المقابلات بالإنجليزية.',
        category: 'لغات',
        instructor: 'فاطمة علي الحربي',
        duration: '30 ساعة',
        rating: 4.5,
        studentsCount: 1580,
        price: 149,
        level: 'مبتدئ',
        thumbnailUrl: '/thumbnails/english.png',
        lessons: [
          { title: 'أساسيات القواعد الإنجليزية', description: 'مراجعة شاملة لأهم قواعد اللغة الإنجليزية', duration: '4 ساعات', order: 1, isFree: true },
          { title: 'المصطلحات المهنية', description: 'تعلم أكثر 500 مصطلح مستخدم في بيئة العمل', duration: '5 ساعات', order: 2, isFree: true },
          { title: 'كتابة الإيميلات الاحترافية', description: 'كيفية كتابة إيميلات عمل احترافية ومؤثرة', duration: '4 ساعات', order: 3, isFree: false },
          { title: 'مهارات العرض والتقديم', description: 'إجراء عروض تقديمية بالإنجليزية بثقة', duration: '5 ساعات', order: 4, isFree: false },
          { title: 'الاستعداد للمقابلات', description: 'نصائح وتمارين للنجاح في المقابلات بالإنجليزية', duration: '4 ساعات', order: 5, isFree: false },
          { title: 'ممارسة المحادثة', description: 'جلسات محادثة تطبيقية في سيناريوهات عمل متنوعة', duration: '6 ساعات', order: 6, isFree: false },
        ],
        quiz: {
          title: 'اختبار اللغة الإنجليزية المهنية',
          timeLimit: 20,
          passingScore: 60,
          questions: [
            { question: 'ما الترجمة الصحيحة لعبارة "موعد نهائي"؟', options: '["deadline","timeline","schedule","appointment"]', correctAnswer: 0, explanation: 'deadline هي الترجمة الصحيحة لـ "موعد نهائي".' },
            { question: 'أي جملة صحيحة في الإيميل الرسمي؟', options: '["Hey, whats up?","Dear Mr. Smith, I am writing to...","Hi bro, need help","Yo, check this out"]', correctAnswer: 1, explanation: 'الجملة الثانية هي الأنسب للإيميل الرسمي.' },
            { question: 'ما معنى كلمة "collaborate"؟', options: '["يتنافس","يتعاون","يتجاهل","يُخطط"]', correctAnswer: 1, explanation: 'collaborate تعني يتعاون أو يعمل معاً.' },
            { question: 'كيف تطلب اجتماعاً بلباقة بالإنجليزية؟', options: '["We need to meet NOW!","Would you be available for a meeting?","Meet me or else","I demand a meeting"]', correctAnswer: 1, explanation: 'الجملة الثانية مهذبة ومناسبة لطلب اجتماع.' },
            { question: 'ما المرادف الأقرب لكلمة "innovative"؟', options: '["تقليدي","مبتكر","معقد","بسيط"]', correctAnswer: 1, explanation: 'innovative تعني مبتكر أو مبدع.' },
          ]
        }
      },
      {
        title: 'تحليل البيانات باستخدام Python',
        description: 'تعلم تحليل البيانات والتصور البياني باستخدام Python و Pandas و Matplotlib. من جمع البيانات حتى استخلاص الرؤى واتخاذ القرارات.',
        category: 'علوم بيانات',
        instructor: 'عبدالرحمن فهد القحطاني',
        duration: '28 ساعة',
        rating: 4.8,
        studentsCount: 980,
        price: 259,
        level: 'متوسط',
        thumbnailUrl: '/thumbnails/data-science.png',
        lessons: [
          { title: 'مقدمة في تحليل البيانات', description: 'فهم دور محلل البيانات وأدواته', duration: '2 ساعة', order: 1, isFree: true },
          { title: 'أساسيات Python للبيانات', description: 'مراجعة أساسيات Python اللازمة لتحليل البيانات', duration: '4 ساعات', order: 2, isFree: true },
          { title: 'التعامل مع Pandas', description: 'تحميل وتنظيف ومعالجة البيانات باستخدام Pandas', duration: '6 ساعات', order: 3, isFree: false },
          { title: 'التصور البياني', description: 'إنشاء رسوم بيانية احترافية باستخدام Matplotlib و Seaborn', duration: '5 ساعات', order: 4, isFree: false },
          { title: 'الإحصاء الوصفي', description: 'تطبيق الأساليب الإحصائية لفهم البيانات', duration: '5 ساعات', order: 5, isFree: false },
        ],
        quiz: {
          title: 'اختبار تحليل البيانات',
          timeLimit: 18,
          passingScore: 65,
          questions: [
            { question: 'ما هي المكتبة الأساسية لتحليل البيانات في Python؟', options: '["NumPy","Pandas","Django","Flask"]', correctAnswer: 1, explanation: 'Pandas هي المكتبة الأساسية والأكثر استخداماً لتحليل البيانات في Python.' },
            { question: 'ما هو DataFrame في Pandas؟', options: '["نوع من الرسوم البيانية","جدول بيانات ثنائي الأبعاد","وظيفة رياضية","قاعدة بيانات"]', correctAnswer: 1, explanation: 'DataFrame هي بنية بيانات ثنائية الأبعاد تشبه جدول البيانات.' },
            { question: 'ما المقصود بالبيانات المفقودة (Missing Data)؟', options: '["بيانات مشفرة","قيم فارغة أو غير موجودة في مجموعة البيانات","بيانات مكررة","بيانات قديمة"]', correctAnswer: 1, explanation: 'البيانات المفقودة هي القيم الفارغة أو غير الموجودة التي تحتاج معالجة.' },
            { question: 'أي دالة تُستخدم لحساب المتوسط في Pandas؟', options: '["mean()","average()","median()","sum()"]', correctAnswer: 0, explanation: 'دالة mean() تُستخدم لحساب المتوسط الحسابي في Pandas.' },
          ]
        }
      }
    ]

    const createdCourses = []

    for (const courseData of courses) {
      const { lessons, quiz, ...courseFields } = courseData

      const course = await db.course.create({
        data: {
          ...courseFields,
          lessons: {
            create: lessons
          },
          quizzes: {
            create: {
              title: quiz.title,
              timeLimit: quiz.timeLimit,
              passingScore: quiz.passingScore,
              questions: {
                create: quiz.questions
              }
            }
          }
        },
        include: {
          lessons: true,
          quizzes: {
            include: {
              questions: true
            }
          }
        }
      })

      createdCourses.push(course)
    }

    return NextResponse.json({
      message: 'تمت عملية البذر بنجاح',
      coursesCount: createdCourses.length,
      courses: createdCourses.map(c => ({
        id: c.id,
        title: c.title,
        lessonsCount: c.lessons.length,
        quizzesCount: c.quizzes.length,
        questionsCount: c.quizzes.reduce((acc, q) => acc + q.questions.length, 0)
      }))
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء عملية البذر' }, { status: 500 })
  }
}
