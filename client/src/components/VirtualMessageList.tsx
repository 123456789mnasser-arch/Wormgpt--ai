import React, { useEffect, useRef, useState, useCallback } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  attachments: string | null;
  createdAt: Date;
}

interface VirtualMessageListProps {
  messages: Message[];
  isLoading: boolean;
  copiedId: string | null;
  onCopy: (content: string, id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ITEM_HEIGHT = 100;
const VISIBLE_ITEMS = 10;

export default function VirtualMessageList({
  messages,
  isLoading,
  copiedId,
  onCopy,
  messagesEndRef,
}: VirtualMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    const newStartIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 2);
    setStartIndex(newStartIndex);
  }, []);

  const endIndex = Math.min(startIndex + VISIBLE_ITEMS + 4, messages.length);
  const visibleMessages = messages.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  const extractCodeBlocks = (content: string) => {
    return /```[\s\S]*?```/.test(content);
  };

  const highlightCode = (code: string, language: string = "javascript") => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch (e) {
      return code;
    }
  };

  const renderContentWithHighlight = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let blockIndex = 0;

    content.replace(codeBlockRegex, (match, language, code, offset) => {
      // Add text before code block
      if (offset > lastIndex) {
        parts.push(
          <Streamdown key={`text-${blockIndex}`}>
            {content.substring(lastIndex, offset)}
          </Streamdown>
        );
      }

      // Add highlighted code block
      const highlightedCode = highlightCode(code.trim(), language || "javascript");
      parts.push(
        <div key={`code-${blockIndex}`} className="my-3">
          <div className="bg-[#1e1e1e] border border-[#FF0000] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2">
              <span className="text-xs font-mono text-[#FF0000]">
                {language || "code"}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white text-xs"
                onClick={() => onCopy(code.trim(), `code-${blockIndex}`)}
              >
                {copiedId === `code-${blockIndex}` ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    تم
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    نسخ
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                className="font-mono text-[#e0e0e0]"
              />
            </pre>
          </div>
        </div>
      );

      lastIndex = offset + match.length;
      blockIndex++;
      return match;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <Streamdown key={`text-${blockIndex}`}>
          {content.substring(lastIndex)}
        </Streamdown>
      );
    }

    return parts.length > 0 ? parts : <Streamdown>{content}</Streamdown>;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]"
      onScroll={handleScroll}
    >
      <div style={{ transform: `translateY(${offsetY}px)` }}>
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`${
                message.role === "user"
                  ? "max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg message-user"
                  : "w-full max-w-full message-assistant"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="space-y-2 w-full">
                  <div className="w-full overflow-x-auto">
                    {renderContentWithHighlight(message.content)}
                  </div>
                  {!extractCodeBlocks(message.content) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white"
                      onClick={() => onCopy(message.content, `msg-${message.id}`)}
                    >
                      {copiedId === `msg-${message.id}` ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          نسخ الرسالة
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-[#FF0000] border-2 border-[#FF0000] rounded-lg p-4 shadow-[0_0_20px_rgba(255,0,0,0.6)] transform scale-105">
                  <p className="text-xs md:text-sm text-white font-black mb-3 uppercase tracking-wider">
                    📤 رسالتك:
                  </p>
                  <p className="text-sm md:text-base text-white font-bold leading-relaxed">
                    {message.content}
                  </p>
                  {message.attachments && (
                    <p className="text-xs text-white mt-3 font-mono bg-white/20 p-2 rounded">
                      {message.attachments}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="message-assistant">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الرد...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
