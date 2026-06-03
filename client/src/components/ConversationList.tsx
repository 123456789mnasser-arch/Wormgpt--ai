import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
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

interface Conversation {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationListProps {
  onSelectConversation: (id: number) => void;
  selectedId?: number;
}

export default function ConversationList({
  onSelectConversation,
  selectedId,
}: ConversationListProps) {
  const { user } = useAuth();
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const getConversations = trpc.chat.getConversations.useQuery();
  const createConversationMutation = trpc.chat.createConversation.useMutation();
  const deleteConversationMutation = trpc.chat.deleteConversation.useMutation();
  const deleteAllConversationsMutation = trpc.chat.deleteAllConversations.useMutation();

  const handleCreateConversation = async () => {
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const result = await createConversationMutation.mutateAsync({
        title: newTitle,
      });
      setNewTitle("");
      // Refetch conversations
      getConversations.refetch();
      // Select the new conversation
      if (result[0]?.insertId) {
        onSelectConversation(result[0].insertId);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await deleteConversationMutation.mutateAsync({ conversationId: id });
      getConversations.refetch();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const conversations = (getConversations.data || []) as Conversation[];

  return (
    <div className="w-full h-full flex flex-col bg-[#1a1f3a] border-r border-[#2d3142]">
      {/* Header */}
      <div className="p-4 border-b border-[#2d3142]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold neon-text-green">المحادثات</h2>
          {conversations.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  title="حذف جميع المحادثات"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1a1f3a] border-[#2d3142]">
                <AlertDialogTitle className="text-[#FF0000]">حذف جميع المحادثات</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  هل أنت متأكد من حذف جميع المحادثات؟ هذا الإجراء لا يمكن التراجع عنه ولن تتمكن من استرجاع أي بيانات!
                </AlertDialogDescription>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel className="bg-[#2d3142] text-gray-400 hover:bg-[#3d4252]">
                    إلغاء
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      try {
                        await deleteAllConversationsMutation.mutateAsync();
                        getConversations.refetch();
                      } catch (error) {
                        console.error("Error deleting all conversations:", error);
                      }
                    }}
                  >
                    حذف الجميع
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>


        {/* Create New Conversation */}
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateConversation();
              }
            }}
            placeholder="عنوان المحادثة..."
            className="input-neon text-sm"
            disabled={isCreating}
          />
          <Button
            onClick={handleCreateConversation}
            disabled={isCreating || !newTitle.trim()}
            className="btn-neon px-3"
            size="sm"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {getConversations.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin neon-text-cyan" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>لا توجد محادثات بعد</p>
            <p className="text-sm mt-2">ابدأ محادثة جديدة الآن</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-all duration-300 ${
                  selectedId === conversation.id
                    ? "neon-border bg-[#0a0e27]"
                    : "cyber-card hover:border-[#00FF41]"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-[#00FF41] truncate">
                      {conversation.title}
                    </h3>
                    {conversation.description && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {conversation.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.updatedAt).toLocaleDateString(
                        "ar-SA"
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1a1f3a] border-[#2d3142]">
                        <AlertDialogTitle className="text-[#00FF41]">
                          حذف المحادثة
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن
                          هذا الإجراء.
                        </AlertDialogDescription>
                        <div className="flex gap-2 justify-end">
                          <AlertDialogCancel className="bg-[#2d3142] text-gray-400 hover:bg-[#3d4252]">
                            إلغاء
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              handleDeleteConversation(conversation.id)
                            }
                          >
                            حذف
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
