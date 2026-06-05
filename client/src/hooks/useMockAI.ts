import { useState } from 'react';

// Simple keyword-based responses
function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Cybersecurity topics
  if (message.includes('vpn') || message.includes('في بي ان')) {
    return 'VPN (شبكة افتراضية خاصة) هي أداة تشفر اتصالك بالإنترنت وتخفي عنوان IP الخاص بك. تستخدم لـ:\n• حماية البيانات من المراقبة\n• الوصول إلى المحتوى المحظور جغرافياً\n• تأمين الاتصال على الشبكات العامة\n\nأشهر خدمات VPN: NordVPN, ExpressVPN, Surfshark';
  }

  if (message.includes('هاكر') || message.includes('해킹') || message.includes('hacker')) {
    return 'الهاكر هو شخص لديه مهارات عالية في البرمجة والأمن السيبراني. هناك نوعان:\n\n**الهاكرز الأخلاقيون (White Hat):**\n• يساعدون الشركات على إيجاد الثغرات\n• يعملون بموافقة قانونية\n• يحصلون على رواتب عالية\n\n**الهاكرز الخطيرون (Black Hat):**\n• يستخدمون مهاراتهم بشكل غير قانوني\n• يسرقون البيانات والأموال';
  }

  if (message.includes('كلمة السر') || message.includes('password')) {
    return 'نصائح لإنشاء كلمة سر قوية:\n\n✓ استخدم 12+ حرف\n✓ اخلط بين أحرف كبيرة وصغيرة\n✓ أضف أرقام ورموز خاصة\n✓ لا تستخدم معلومات شخصية\n✓ استخدم مدير كلمات سر آمن\n✓ غير كلمة السر بانتظام\n\nمثال قوي: Tr0p!cal$unSet#2024';
  }

  if (message.includes('برمجة') || message.includes('programming') || message.includes('كود')) {
    return 'البرمجة هي فن كتابة تعليمات للحاسوب. اللغات الشهيرة:\n\n**للويب:**\n• JavaScript - لغة الويب الأساسية\n• Python - سهلة وقوية\n• PHP - للخوادم\n\n**للأمن السيبراني:**\n• Python - تحليل البيانات والأتمتة\n• C/C++ - للبرامج منخفضة المستوى\n• Bash - لأتمتة النظام\n\nأنصحك بالبدء بـ Python - سهلة وقوية!';
  }

  if (message.includes('linux') || message.includes('لينكس')) {
    return 'Linux هو نظام تشغيل مفتوح المصدر وآمن جداً:\n\n**المميزات:**\n• مجاني وآمن\n• يستخدم في الخوادم\n• قوي في الأمن السيبراني\n• يدعم البرمجة\n\n**التوزيعات الشهيرة:**\n• Ubuntu - للمبتدئين\n• Kali Linux - للأمن السيبراني\n• CentOS - للخوادم\n\nأنصحك بتثبيت Ubuntu أولاً!';
  }

  if (message.includes('sql') || message.includes('قاعدة بيانات')) {
    return 'SQL هي لغة للتعامل مع قواعد البيانات:\n\n**الأوامر الأساسية:**\n```sql\nSELECT * FROM users; -- اختيار البيانات\nINSERT INTO users VALUES (...); -- إدراج\nUPDATE users SET ... WHERE ...; -- تحديث\nDELETE FROM users WHERE ...; -- حذف\n```\n\n**قواعد البيانات الشهيرة:**\n• MySQL - الأكثر استخداماً\n• PostgreSQL - قوية وآمنة\n• MongoDB - NoSQL\n\nتعلم SQL ضروري لأي مبرمج!';
  }

  if (message.includes('ويب') || message.includes('web') || message.includes('موقع')) {
    return 'تطوير الويب ينقسم إلى:\n\n**Frontend (الواجهة الأمامية):**\n• HTML - هيكل الصفحة\n• CSS - التصميم والألوان\n• JavaScript - التفاعل\n\n**Backend (الخادم):**\n• Node.js/Express - JavaScript\n• Python/Django - Python\n• PHP/Laravel - PHP\n\n**قاعدة البيانات:**\n• MySQL, PostgreSQL, MongoDB\n\nابدأ بـ HTML + CSS + JavaScript!';
  }

  if (message.includes('api') || message.includes('اي بي اي')) {
    return 'API (واجهة برمجية) هي طريقة لتطبيقات مختلفة للتواصل:\n\n**أنواع API:**\n• REST API - الأكثر استخداماً\n• GraphQL - أكثر مرونة\n• SOAP - قديمة لكن آمنة\n\n**مثال REST API:**\n```\nGET /api/users - جلب المستخدمين\nPOST /api/users - إضافة مستخدم\nPUT /api/users/1 - تحديث\nDELETE /api/users/1 - حذف\n```\n\nAPI مهمة جداً في التطوير الحديث!';
  }

  if (message.includes('مرحبا') || message.includes('hello') || message.includes('السلام')) {
    return 'مرحباً بك! 👋 أنا WormGPT، مساعدك في الأمن السيبراني والبرمجة.\n\nيمكنك أن تسألني عن:\n• الأمن السيبراني والقرصنة الأخلاقية\n• البرمجة وتطوير الويب\n• Linux والأنظمة\n• قواعد البيانات\n• وأي موضوع تقني آخر\n\nماذا تريد أن تتعلم اليوم؟';
  }

  if (message.includes('شكرا') || message.includes('شكراً') || message.includes('thanks')) {
    return 'العفو! 😊 أنا هنا لمساعدتك دائماً.\n\nإذا كان لديك أي أسئلة أخرى، فقط اسأل!';
  }

  // Default response
  return `شكراً على سؤالك! 🤔\n\nأنا حالياً أستخدم نسخة تجريبية. يمكنك أن تسأل عن:\n\n• الأمن السيبراني (VPN, Hacking, Passwords)\n• البرمجة (Python, JavaScript, Web Development)\n• Linux والأنظمة\n• قواعد البيانات (SQL, MongoDB)\n• APIs والتطبيقات\n\nجرب أحد هذه المواضيع! 💻`;
}

export function useMockAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

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
