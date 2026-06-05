import { useState } from 'react';

// Advanced response generator that handles any question
function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // If message is empty
  if (!message) {
    return 'مرحباً! 👋 يمكنك أن تسأل عن أي موضوع تقني. ماذا تريد أن تتعلم؟';
  }

  // Cybersecurity & Hacking
  if (message.includes('vpn') || message.includes('في بي ان')) {
    return 'VPN (شبكة افتراضية خاصة) هي أداة تشفر اتصالك بالإنترنت وتخفي عنوان IP الخاص بك. تستخدم لـ:\n• حماية البيانات من المراقبة\n• الوصول إلى المحتوى المحظور جغرافياً\n• تأمين الاتصال على الشبكات العامة\n\nأشهر خدمات VPN: NordVPN, ExpressVPN, Surfshark';
  }

  if (message.includes('هاكر') || message.includes('hacker') || message.includes('해킹')) {
    return 'الهاكر هو شخص لديه مهارات عالية في البرمجة والأمن السيبراني. هناك نوعان:\n\n**الهاكرز الأخلاقيون (White Hat):**\n• يساعدون الشركات على إيجاد الثغرات\n• يعملون بموافقة قانونية\n• يحصلون على رواتب عالية\n\n**الهاكرز الخطيرون (Black Hat):**\n• يستخدمون مهاراتهم بشكل غير قانوني\n• يسرقون البيانات والأموال';
  }

  if (message.includes('كلمة السر') || message.includes('password') || message.includes('كلمة مرور')) {
    return 'نصائح لإنشاء كلمة سر قوية:\n\n✓ استخدم 12+ حرف\n✓ اخلط بين أحرف كبيرة وصغيرة\n✓ أضف أرقام ورموز خاصة\n✓ لا تستخدم معلومات شخصية\n✓ استخدم مدير كلمات سر آمن\n✓ غير كلمة السر بانتظام\n\nمثال قوي: Tr0p!cal$unSet#2024';
  }

  if (message.includes('فيروس') || message.includes('malware') || message.includes('virus')) {
    return 'الفيروسات والبرامج الضارة:\n\n**أنواعها:**\n• Virus - ينسخ نفسه\n• Worm - ينتشر عبر الشبكة\n• Trojan - يتظاهر ببرنامج آخر\n• Ransomware - يشفر ملفاتك\n\n**الحماية:**\n✓ استخدم antivirus موثوق\n✓ حدث نظام التشغيل\n✓ لا تفتح ملفات غريبة\n✓ استخدم VPN\n✓ عمل backup للملفات المهمة';
  }

  if (message.includes('해킹') || message.includes('ethical hacking') || message.includes('اختراق أخلاقي')) {
    return 'القرصنة الأخلاقية (Ethical Hacking):\n\nهي اختبار أمان الأنظمة بموافقة صاحبها لإيجاد الثغرات.\n\n**المهارات المطلوبة:**\n• البرمجة (Python, C++)\n• Linux والشبكات\n• قواعد البيانات\n• أدوات الاختبار (Metasploit, Burp Suite)\n\n**الشهادات:**\n• CEH (Certified Ethical Hacker)\n• OSCP (Offensive Security)\n• CompTIA Security+\n\n**الراتب:** 80,000 - 150,000 دولار سنوياً';
  }

  // Programming
  if (message.includes('برمجة') || message.includes('programming') || message.includes('كود') || message.includes('code')) {
    return 'البرمجة هي فن كتابة تعليمات للحاسوب. اللغات الشهيرة:\n\n**للويب:**\n• JavaScript - لغة الويب الأساسية\n• Python - سهلة وقوية\n• PHP - للخوادم\n\n**للأمن السيبراني:**\n• Python - تحليل البيانات والأتمتة\n• C/C++ - للبرامج منخفضة المستوى\n• Bash - لأتمتة النظام\n\n**للتطبيقات:**\n• Java - للتطبيقات الكبيرة\n• C# - للويندوز\n• Swift - لـ iOS\n\nأنصحك بالبدء بـ Python - سهلة وقوية!';
  }

  if (message.includes('python') || message.includes('بايثون')) {
    return 'Python - لغة برمجة قوية وسهلة:\n\n**المميزات:**\n• سهلة التعلم\n• قوية وسريعة\n• تستخدم في AI والبيانات\n• آمنة للأمن السيبراني\n\n**الاستخدامات:**\n• تطوير الويب (Django, Flask)\n• تحليل البيانات (Pandas, NumPy)\n• الذكاء الاصطناعي (TensorFlow)\n• أتمتة المهام\n\n**للبدء:**\n```python\nprint("Hello, World!")\nname = input("What is your name? ")\nprint(f"Hello, {name}!")\n```\n\nابدأ من هنا: python.org';
  }

  if (message.includes('javascript') || message.includes('جافا سكريبت')) {
    return 'JavaScript - لغة الويب الأساسية:\n\n**المميزات:**\n• تعمل في المتصفح\n• قوية وسريعة\n• تستخدم في الويب والموبايل\n\n**الأطر الشهيرة:**\n• React - للواجهات\n• Vue.js - سهلة وقوية\n• Angular - للتطبيقات الكبيرة\n• Node.js - للخوادم\n\n**مثال بسيط:**\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```\n\nتعلم JavaScript ضروري لأي مطور ويب!';
  }

  if (message.includes('java') || message.includes('جافا')) {
    return 'Java - لغة برمجة قوية:\n\n**المميزات:**\n• "اكتب مرة، اعمل في أي مكان"\n• آمنة وقوية\n• تستخدم في التطبيقات الكبيرة\n• تستخدم في الأنظمة الحكومية\n\n**الاستخدامات:**\n• تطبيقات سطح المكتب\n• تطبيقات الموبايل (Android)\n• الخوادم والأنظمة الكبيرة\n• البنية التحتية\n\n**الراتب:** عالي جداً (100,000+ دولار)\n\nJava مهمة للوظائف الكبيرة!';
  }

  // Web Development
  if (message.includes('ويب') || message.includes('web') || message.includes('موقع') || message.includes('website')) {
    return 'تطوير الويب ينقسم إلى:\n\n**Frontend (الواجهة الأمامية):**\n• HTML - هيكل الصفحة\n• CSS - التصميم والألوان\n• JavaScript - التفاعل\n• React/Vue/Angular - أطر عمل\n\n**Backend (الخادم):**\n• Node.js/Express - JavaScript\n• Python/Django - Python\n• PHP/Laravel - PHP\n• Java/Spring - Java\n\n**قاعدة البيانات:**\n• MySQL, PostgreSQL - SQL\n• MongoDB - NoSQL\n\n**الراتب:** 60,000 - 150,000 دولار\n\nابدأ بـ HTML + CSS + JavaScript!';
  }

  if (message.includes('react') || message.includes('ريأكت')) {
    return 'React - مكتبة JavaScript لبناء الواجهات:\n\n**المميزات:**\n• سهلة وقوية\n• تستخدمها Facebook و Netflix\n• مكونات قابلة لإعادة الاستخدام\n• سريعة جداً\n\n**الأساسيات:**\n```jsx\nfunction App() {\n  return <h1>Hello, React!</h1>;\n}\n```\n\n**المزايا:**\n• Virtual DOM - سريع جداً\n• JSX - كود أنظف\n• Community كبيرة\n\n**الراتب:** 80,000 - 140,000 دولار\n\nReact هي الخيار الأول للمبتدئين!';
  }

  if (message.includes('html') || message.includes('css')) {
    return 'HTML و CSS - أساس الويب:\n\n**HTML:**\n```html\n<h1>عنوان</h1>\n<p>نص</p>\n<a href="#">رابط</a>\n```\n\n**CSS:**\n```css\nbody {\n  background-color: #f0f0f0;\n  font-family: Arial;\n}\n```\n\n**المميزات:**\n• سهلة التعلم\n• ضرورية لأي مطور ويب\n• تستخدم مع JavaScript\n\n**الأطر الحديثة:**\n• Tailwind CSS - تصميم سريع\n• Bootstrap - مكونات جاهزة\n• Sass - CSS متقدمة\n\nابدأ بـ HTML و CSS أولاً!';
  }

  // Linux & Systems
  if (message.includes('linux') || message.includes('لينكس') || message.includes('ubuntu')) {
    return 'Linux هو نظام تشغيل مفتوح المصدر وآمن جداً:\n\n**المميزات:**\n• مجاني وآمن\n• يستخدم في الخوادم\n• قوي في الأمن السيبراني\n• يدعم البرمجة\n\n**التوزيعات الشهيرة:**\n• Ubuntu - للمبتدئين\n• Kali Linux - للأمن السيبراني\n• CentOS - للخوادم\n• Debian - مستقرة\n\n**الأوامر الأساسية:**\n```bash\nls - عرض الملفات\ncd - تغيير المجلد\nmkdir - إنشاء مجلد\nrm - حذف ملف\n```\n\nأنصحك بتثبيت Ubuntu أولاً!';
  }

  if (message.includes('bash') || message.includes('shell') || message.includes('terminal')) {
    return 'Bash - لغة سطر الأوامر:\n\n**الأوامر الأساسية:**\n```bash\nls - عرض الملفات\ncd - تغيير المجلد\npwd - المسار الحالي\nmkdir - إنشاء مجلد\nrm - حذف\ncp - نسخ\nmv - نقل\n```\n\n**البرامج النصية:**\n```bash\n#!/bin/bash\necho "Hello, World!"\n```\n\n**الفوائد:**\n• أتمتة المهام\n• إدارة الملفات\n• إدارة النظام\n• الأمن السيبراني\n\nBash ضرورية لأي مطور!';
  }

  // Databases
  if (message.includes('sql') || message.includes('قاعدة بيانات') || message.includes('database')) {
    return 'SQL - لغة التعامل مع قواعد البيانات:\n\n**الأوامر الأساسية:**\n```sql\nSELECT * FROM users; -- اختيار\nINSERT INTO users VALUES (...); -- إدراج\nUPDATE users SET ... WHERE ...; -- تحديث\nDELETE FROM users WHERE ...; -- حذف\n```\n\n**قواعد البيانات الشهيرة:**\n• MySQL - الأكثر استخداماً\n• PostgreSQL - قوية وآمنة\n• MongoDB - NoSQL\n• SQLite - خفيفة\n\n**الراتب:** 70,000 - 130,000 دولار\n\nSQL ضرورية لأي مبرمج!';
  }

  if (message.includes('mongodb') || message.includes('nosql')) {
    return 'MongoDB - قاعدة بيانات NoSQL:\n\n**المميزات:**\n• مرنة وسهلة\n• تخزن البيانات كـ JSON\n• قابلة للتوسع\n• سريعة جداً\n\n**مثال:**\n```javascript\ndb.users.insertOne({\n  name: "Ahmed",\n  email: "ahmed@example.com"\n});\n```\n\n**الفرق عن SQL:**\n• SQL - جداول منظمة\n• MongoDB - مستندات مرنة\n\n**الاستخدام:**\n• تطبيقات الويب\n• تطبيقات الموبايل\n• Big Data\n\nMongoDB رائعة للمشاريع الحديثة!';
  }

  // APIs & Networking
  if (message.includes('api') || message.includes('اي بي اي')) {
    return 'API (واجهة برمجية) - طريقة لتطبيقات مختلفة للتواصل:\n\n**أنواع API:**\n• REST API - الأكثر استخداماً\n• GraphQL - أكثر مرونة\n• SOAP - قديمة لكن آمنة\n\n**مثال REST API:**\n```\nGET /api/users - جلب المستخدمين\nPOST /api/users - إضافة مستخدم\nPUT /api/users/1 - تحديث\nDELETE /api/users/1 - حذف\n```\n\n**الأدوات:**\n• Postman - اختبار APIs\n• Swagger - توثيق APIs\n\nAPI مهمة جداً في التطوير الحديث!';
  }

  if (message.includes('http') || message.includes('https') || message.includes('network')) {
    return 'HTTP/HTTPS - بروتوكولات الإنترنت:\n\n**الفرق:**\n• HTTP - غير آمن\n• HTTPS - آمن ومشفر\n\n**طرق HTTP:**\n• GET - جلب البيانات\n• POST - إرسال البيانات\n• PUT - تحديث\n• DELETE - حذف\n• PATCH - تحديث جزئي\n\n**رموز الحالة:**\n• 200 - نجح\n• 404 - غير موجود\n• 500 - خطأ في الخادم\n• 401 - غير مصرح\n\nHTTPS ضرورية لأي موقع آمن!';
  }

  // General greetings
  if (message.includes('مرحبا') || message.includes('hello') || message.includes('السلام') || message.includes('hi')) {
    return 'مرحباً بك! 👋 أنا WormGPT، مساعدك في الأمن السيبراني والبرمجة.\n\nيمكنك أن تسألني عن:\n• الأمن السيبراني والقرصنة الأخلاقية\n• البرمجة بجميع اللغات\n• تطوير الويب\n• Linux والأنظمة\n• قواعد البيانات\n• وأي موضوع تقني آخر\n\nماذا تريد أن تتعلم اليوم؟';
  }

  if (message.includes('شكرا') || message.includes('شكراً') || message.includes('thanks')) {
    return 'العفو! 😊 أنا هنا لمساعدتك دائماً.\n\nإذا كان لديك أي أسئلة أخرى، فقط اسأل!';
  }

  if (message.includes('من أنت') || message.includes('who are you')) {
    return 'أنا WormGPT! 🐛\n\nمساعد ذكاء اصطناعي متخصص في:\n• الأمن السيبراني\n• البرمجة\n• تطوير الويب\n• Linux والأنظمة\n• قواعد البيانات\n\nتم تطويري بواسطة محمد ناصر 📵\n\nكيف يمكنني مساعدتك؟';
  }

  // Default response for any other question
  return `شكراً على سؤالك! 🤔\n\n"${userMessage}"\n\nهذا سؤال رائع! دعني أساعدك:\n\n**الموضوعات التي أتقنها:**\n✓ الأمن السيبراني والقرصنة الأخلاقية\n✓ البرمجة (Python, JavaScript, Java, C++)\n✓ تطوير الويب (HTML, CSS, React, Vue)\n✓ Linux والأنظمة\n✓ قواعد البيانات (SQL, MongoDB)\n✓ APIs والشبكات\n✓ وأكثر من ذلك!\n\n**جرب هذه الأسئلة:**\n• "أخبرني عن Python"\n• "كيف أتعلم الويب؟"\n• "ما هي القرصنة الأخلاقية؟"\n• "شرح لي Linux"\n\nأو اسأل عن أي موضوع تقني! 💻`;
}

export function useMockAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the last user message
      const lastMessage = messages[messages.length - 1]?.content || '';
      const response = generateResponse(lastMessage);
      
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('AI Chat Error:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
