import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeveloperIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a0f0f] to-[#0a0e27] border-2 border-[#FF0000] rounded-lg p-8 max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(255,0,0,0.3)] animate-in fade-in zoom-in duration-500">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#FF0000] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Developer Info */}
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png" alt="WormGPT" className="w-20 h-20 drop-shadow-[0_0_30px_rgba(255,0,110,0.4)]" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-black neon-text-green mb-2">
              WormGPT
            </h2>
            <p className="text-sm text-[#FF3333] font-semibold">
              🐛 من تطوير محمد ناصر
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 text-sm text-gray-300">
            <p className="font-mono">
              <span className="text-[#FF0000]">▮</span> متخصص في الأمن السيبراني
            </p>
            <p className="font-mono">
              <span className="text-[#FF3333]">▮</span> مطور تطبيقات متقدم
            </p>
            <p className="font-mono">
              <span className="text-[#CC0000]">▮</span> مبتكر الحلول الشريرة 😈
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent"></div>

          {/* Message */}
          <p className="text-xs text-gray-400 italic">
            "أطلق العنان للقوة الشريرة مع WormGPT"
          </p>

          {/* Close Button */}
          <Button
            onClick={() => setIsVisible(false)}
            className="w-full btn-neon text-sm py-2"
          >
            دخول 🔓
          </Button>
        </div>

        {/* Auto-close hint */}
        <p className="text-xs text-gray-500 text-center mt-4">
          سيغلق تلقائياً بعد قليل...
        </p>
      </div>
    </div>
  );
}
