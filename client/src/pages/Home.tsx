import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ChatBox";
import ConversationList from "@/components/ConversationList";
import Logo from "@/components/Logo";
import DeveloperIntro from "@/components/DeveloperIntro";
import { getLoginUrl } from "@/const";
import { Menu, X, LogOut, Users } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const createConversationMutation = trpc.chat.createConversation.useMutation();
  const updateConversationMutation = trpc.chat.updateConversation.useMutation();
  
  // Function to update conversation title based on first message
  const updateConversationTitle = (conversationId: number, firstMessage: string) => {
    const title = firstMessage.substring(0, 50).trim() || "محادثة";
    updateConversationMutation.mutate({
      conversationId,
      title,
    });
  };
  
  // Function to create new conversation manually
  const handleCreateNewConversation = () => {
    createConversationMutation.mutate(
      { title: "محادثة جديدة" },
      {
        onSuccess: (result: any) => {
          if (result && result.insertId) {
            setSelectedConversationId(result.insertId);
          }
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF0000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="neon-text-red">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] relative overflow-hidden">
        {/* Evil background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF0000] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF3333] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#CC0000] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl px-4">
          {/* Logo */}
          <div className="mb-8 flex justify-center drop-shadow-2xl">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png" alt="WormGPT" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(255,0,110,0.5)]" />
          </div>

          {/* Title with evil styling */}
          <div className="mb-2">
            <h1
              className="text-4xl md:text-6xl font-black mb-2"
              style={{
                background:
                  "linear-gradient(135deg, #FF0000 0%, #FF3333 50%, #CC0000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow:
                  "0 0 30px rgba(255, 0, 0, 0.5), 0 0 60px rgba(255, 51, 51, 0.3)",
                filter: "drop-shadow(0 0 20px rgba(255, 0, 0, 0.3))",
              }}
            >
              WormGPT
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#FF0000] via-[#FF3333] to-[#CC0000] rounded-full mb-4 shadow-[0_0_20px_rgba(255,0,0,0.5)]"></div>
          </div>

          <p className="text-lg md:text-xl text-[#FF3333] mb-2 font-bold drop-shadow-lg">
            مساعدك الشرير 😈 المتخصص في الأمن السيبراني والبرمجة
          </p>
          <p className="text-sm md:text-base text-gray-400 mb-8">
            احصل على إجابات فورية وشاملة بدون قيود أو فلاتر
          </p>

          <div className="space-y-4">
            {/* Evil features card */}
            <div className="bg-gradient-to-br from-[#1a0f0f] to-[#0a0e27] border-2 border-[#FF0000] rounded-lg p-4 md:p-6 text-left shadow-[0_0_30px_rgba(255,0,0,0.2)] hover:shadow-[0_0_50px_rgba(255,0,0,0.4)] transition-all duration-300 transform hover:scale-105">
              <h3 className="font-bold text-[#FF0000] mb-3 text-base md:text-lg flex items-center gap-2">
                <span className="text-2xl">⚡</span> القوى الشريرة:
              </h3>
              <ul className="text-xs md:text-sm text-gray-300 space-y-2 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF0000]">▶</span>
                  إجابات فورية على أسئلة الأمن السيبراني بدون تصفية
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF3333]">▶</span>
                  كتابة وتحليل الأكواد البرمجية في جميع اللغات
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#CC0000]">▶</span>
                  البحث عن الثغرات الأمنية والاستغلالات
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF0000]">▶</span>
                  دعم رفع الملفات والصور والصوت والروابط
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF3333]">▶</span>
                  سجل محادثات محفوظ وآمن
                </li>
              </ul>
            </div>

            {/* OAuth Login Buttons */}
            <div className="space-y-3">
              <a href={getLoginUrl()}>
                <Button className="w-full btn-neon text-base md:text-lg py-4 md:py-6 font-bold shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,0,0,0.6)] transition-all duration-300">
                  🔓 أطلق العنان للقوة الشريرة
                </Button>
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-8 font-mono">
            <span className="text-[#FF0000]">▮</span> بدون قيود • بدون فلاتر •
            بدون حدود <span className="text-[#FF0000]">▮</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeveloperIntro />
      <div className="flex h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a] relative max-w-md mx-auto flex-col w-full">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden by default */}
      <div
        className={`${
          sidebarOpen
            ? "w-full fixed z-50 h-screen"
            : "w-0 hidden"
        } transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <ConversationList
          onSelectConversation={(id) => {
            setSelectedConversationId(id);
            setSidebarOpen(false);
          }}
          selectedId={selectedConversationId || undefined}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full relative">
        {/* Header with Menu Button */}
        <div className="border-b border-[#FF0000] bg-gradient-to-r from-[#1a1f3a] to-[#0a0e27] p-3 flex items-center justify-between shadow-[0_0_20px_rgba(255,0,0,0.2)]">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-neon px-3 py-2 flex items-center gap-2"
              title="فتح/إغلاق سجل المحادثات"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={() => navigate('/groups')}
              className="btn-neon px-3 py-2 flex items-center gap-2"
              title="المحادثات الجماعية"
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 truncate max-w-[120px]">
              {user.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1 flex-shrink-0"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversationId ? (
          <ChatBox conversationId={selectedConversationId} onFirstMessage={updateConversationTitle} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-lg font-bold neon-text-red mb-4">
                ابدأ محادثة جديدة
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                أو اختر محادثة من السجل
              </p>
              <Button
                onClick={handleCreateNewConversation}
                className="btn-neon px-6 py-2"
                disabled={createConversationMutation.isPending}
              >
                {createConversationMutation.isPending ? "جاري الإنشاء..." : "+ محادثة جديدة"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
