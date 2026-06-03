import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import { Loader2, Send, Copy, Check, Search, X, ThumbsUp, Heart, Smile } from "lucide-react";
import { Streamdown } from "streamdown";
import { memo, useMemo } from "react";
import VirtualMessageList from "@/components/VirtualMessageList";

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  attachments: string | null;
  createdAt: Date;
}

interface ChatBoxProps {
  conversationId: number;
  onFirstMessage?: (conversationId: number, message: string) => void;
}

const ChatBoxComponent = memo(function ChatBox({ conversationId, onFirstMessage }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{ name: string; type: string; url: string; size: number }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getConversation = trpc.chat.getConversation.useQuery(
    { conversationId },
    { enabled: !!conversationId }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const searchMutation = trpc.search.search.useMutation();

  // Load messages when conversation changes
  useEffect(() => {
    if (getConversation.data?.messages) {
      setMessages(getConversation.data.messages as Message[]);
    }
  }, [getConversation.data?.messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0 && !isLoading)
      return;

    const userMessage = inputValue;
    const files = attachedFiles;
    
    // Add user message immediately for faster UI response
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        conversationId,
        role: "user",
        content: userMessage,
        attachments: files.length > 0 ? files.map((f) => `[${f.type}] ${f.name}`).join("\n") : null,
        createdAt: new Date(),
      },
    ]);
    
    setInputValue("");
    setAttachedFiles([]);
    setIsLoading(true);
    
    // Update conversation title on first message
    if (messages.length === 0 && onFirstMessage && userMessage.trim()) {
      onFirstMessage(conversationId, userMessage);
    }

    try {
      // Prepare attachments data
      const attachmentsData = files
        .map((f) => `[${f.type}] ${f.name}`)
        .join("\n");

      const fullMessage = userMessage
        ? `${userMessage}${attachmentsData ? "\n\n" + attachmentsData : ""}`
        : attachmentsData;

      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        message: fullMessage,
      });

      // Add AI response to the list with immediate display
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          conversationId,
          role: "assistant",
          content: response.aiMessage,
          attachments: null,
          createdAt: new Date(),
        },
      ]);
      
      // Scroll to latest message immediately
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0);
    } catch (error) {
      console.error("Error sending message:", error);
      setInputValue(userMessage); // Restore input on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMutation.mutateAsync({
        query: searchQuery,
      });

      // Add search results as a message
      const searchResultsText = results
        .map((r) => `• ${r.title}\n  ${r.description}\n  ${r.url}`)
        .join("\n\n");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          conversationId,
          role: "assistant",
          content: `**نتائج البحث عن: "${searchQuery}"**\n\n${searchResultsText}`,
          attachments: null,
          createdAt: new Date(),
        },
      ]);

      setSearchQuery("");
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const matches = Array.from(content.matchAll(codeBlockRegex));
    return matches.length > 0;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a] relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {/* Welcome Message - Always Visible */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png" alt="WormGPT" className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-2xl font-bold neon-text-green mb-2">
              مرحباً بك في WormGPT
            </h2>
            <p className="text-gray-400 mb-4">
              اسأل أي سؤال عن الأمن السيبراني أو البرمجة
            </p>
            <div className="text-sm text-gray-500">
              <p>💡 أمثلة على الأسئلة:</p>
              <ul className="mt-2 space-y-1">
                <li>• كيفية إيجاد الثغرات الأمنية في التطبيقات</li>
                <li>• شرح أساسيات التشفير والحماية</li>
                <li>• كتابة أكواد آمنة بلغات برمجية مختلفة</li>
                <li>• تحليل الأكواد والملفات المرفوعة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Messages with Virtual Scrolling */}
        <VirtualMessageList
          messages={messages}
          isLoading={isLoading}
          copiedId={copiedId}
          onCopy={copyToClipboard}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2d3142] p-4 bg-[#1a1f3a] space-y-2">
        {/* File Attachments Display */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, idx) => (
              <Card
                key={idx}
                className="bg-[#2d3142] border-[#00FF41] p-2 flex items-center gap-2 text-xs"
              >
                <span className="text-[#00FF41]">✓</span>
                <span className="text-gray-300">{file.name}</span>
                <button
                  onClick={() =>
                    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))
                  }
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </Card>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center w-full">
            <Button
              onClick={handleSendMessage}
              disabled={
                isLoading || (!inputValue.trim() && attachedFiles.length === 0)
              }
              className="btn-neon flex-shrink-0"
              title="إرسال الرسالة (Enter)"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
              className="input-neon flex-1 resize-none overflow-y-auto min-h-[40px] max-h-[80px] p-2 rounded text-sm leading-relaxed w-full"
              style={{ fontFamily: 'Courier New, monospace' }}
            />
          </div>
          {/* Action Buttons Below Input */}
          <div className="flex gap-2 items-center w-full">
            <FileUpload
              conversationId={conversationId}
              onFileSelect={(file) => setAttachedFiles([...attachedFiles, file])}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatBoxComponent;
