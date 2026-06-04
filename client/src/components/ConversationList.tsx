import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useConversations } from "@/hooks/useConversations";

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedId?: string;
}

export default function ConversationList({
  onSelectConversation,
  selectedId,
}: ConversationListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { conversations, createConversation, deleteConversation } = useConversations();

  const handleCreateConversation = async () => {
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const newConv = createConversation(newTitle);
      onSelectConversation(newConv.id);
      setNewTitle("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (selectedId === id) {
      onSelectConversation(conversations[0]?.id || "");
    }
  };

  const handleDeleteAll = () => {
    conversations.forEach(conv => deleteConversation(conv.id));
    setNewTitle("");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      {/* Create New Conversation */}
      <div className="p-4 border-b border-[#FF0000] border-opacity-20">
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateConversation();
              }
            }}
            placeholder="عنوان جديد..."
            className="bg-[#1a1f3a] border-[#FF0000] border-opacity-30 text-white placeholder-[#666]"
            disabled={isCreating}
          />
          <Button
            onClick={handleCreateConversation}
            disabled={!newTitle.trim() || isCreating}
            className="bg-[#FF0000] hover:bg-[#CC0000] text-white"
          >
            {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#FF3333] text-sm">لا توجد محادثات</p>
            <p className="text-[#666] text-xs mt-1">ابدأ محادثة جديدة من الأعلى</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`p-3 cursor-pointer transition-all ${
                selectedId === conversation.id
                  ? "bg-[#FF0000] bg-opacity-20 border-[#FF0000]"
                  : "bg-[#1a1f3a] border-[#FF0000] border-opacity-10 hover:border-opacity-30"
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-sm">
                    {conversation.title}
                  </p>
                  <p className="text-[#999] text-xs mt-1">
                    {conversation.messages.length} رسائل
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation.id);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-[#FF0000] hover:bg-opacity-20 rounded text-[#FF3333]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete All Button */}
      {conversations.length > 0 && (
        <div className="p-4 border-t border-[#FF0000] border-opacity-20">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-[#CC0000] hover:bg-[#990000] text-white"
              >
                حذف الكل
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1f3a] border-[#FF0000]">
              <AlertDialogTitle className="text-[#FF3333]">حذف جميع المحادثات</AlertDialogTitle>
              <AlertDialogDescription className="text-[#999]">
                هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel className="bg-[#333] text-white hover:bg-[#444]">
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-[#FF0000] hover:bg-[#CC0000] text-white"
                >
                  حذف
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
