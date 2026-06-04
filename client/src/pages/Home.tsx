import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ChatBox";
import ConversationList from "@/components/ConversationList";
import Logo from "@/components/Logo";
import { Menu, X, LogOut, Users } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversations, createConversation } = useConversations();

  // Initialize first conversation on load
  useEffect(() => {
    if (conversations.length === 0) {
      const newConv = createConversation("محادثة جديدة");
      setSelectedConversationId(newConv.id);
    } else if (!selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, []);

  const handleCreateNewConversation = () => {
    const newConv = createConversation("محادثة جديدة");
    setSelectedConversationId(newConv.id);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a] border-r border-[#FF0000] border-opacity-20 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[#FF0000] border-opacity-20">
            <div className="flex items-center justify-center gap-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png"
                alt="WormGPT"
                className="w-8 h-8"
              />
              <h1 className="text-[#FF0000] font-bold text-lg">WormGPT</h1>
            </div>
          </div>

          {/* Conversations List */}
          <ConversationList
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setSidebarOpen(false);
            }}
            selectedId={selectedConversationId || undefined}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#0a0e27] border-b border-[#FF0000] border-opacity-20 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-[#FF0000] hover:bg-opacity-10 rounded text-[#FF0000]"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 text-center">
            <h2 className="text-white font-bold text-lg">WormGPT</h2>
            <p className="text-[#FF3333] text-xs">مساعد ذكاء اصطناعي للأمن السيبراني</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreateNewConversation}
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white text-sm"
            >
              <Users size={16} className="mr-1" />
              جديد
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {selectedConversationId ? (
            <ChatBox conversationId={selectedConversationId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png"
                  alt="WormGPT"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h1
                  className="text-4xl font-black mb-2"
                  style={{
                    background: "linear-gradient(135deg, #FF0000 0%, #FF3333 50%, #CC0000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  WormGPT
                </h1>
                <p className="text-[#FF3333] mb-4">مساعد ذكاء اصطناعي متخصص في الأمن السيبراني</p>
                <Button
                  onClick={handleCreateNewConversation}
                  className="bg-[#FF0000] hover:bg-[#CC0000] text-white"
                >
                  ابدأ محادثة جديدة
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
