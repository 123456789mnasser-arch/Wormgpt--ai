import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Send } from "lucide-react";

export default function GroupChat() {
  const [, navigate] = useLocation();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const newGroup = {
      id: Date.now(),
      name: groupName,
      messages: [],
    };
    setGroups([...groups, newGroup]);
    setGroupName("");
  };

  const handleSelectGroup = (group: any) => {
    setSelectedGroup(group);
    setMessages(group.messages || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toLocaleString("ar-SA"),
    };
    
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    const updatedGroups = groups.map(g => 
      g.id === selectedGroup.id ? { ...g, messages: updatedMessages } : g
    );
    setGroups(updatedGroups);
    setSelectedGroup({ ...selectedGroup, messages: updatedMessages });
    setNewMessage("");
  };

  const handleExport = (format: string) => {
    if (!selectedGroup || messages.length === 0) {
      alert("لا توجد رسائل لتصديرها");
      return;
    }

    const content = messages.map(m => `${m.timestamp}: ${m.text}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group-${selectedGroup.id}.${format === "txt" ? "txt" : "pdf"}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-red-500 hover:text-red-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-4xl font-bold text-red-500">المحادثات الجماعية</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div>
            <Card className="bg-gray-800 border-red-600">
              <div className="p-4">
                <h2 className="text-xl font-bold text-red-500 mb-4">المجموعات</h2>
                
                {/* Create Group */}
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="اسم المجموعة"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded p-2"
                  />
                  <Button
                    onClick={handleCreateGroup}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء مجموعة
                  </Button>
                </div>

                {/* Groups */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {groups.length === 0 ? (
                    <p className="text-gray-400 text-sm">لا توجد مجموعات</p>
                  ) : (
                    groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => handleSelectGroup(group)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedGroup?.id === group.id
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                      >
                        <div className="font-semibold">{group.name}</div>
                        <div className="text-xs opacity-75">{group.messages?.length || 0} رسائل</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <Card className="bg-gray-800 border-red-600 h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-red-600">
                  <h2 className="text-xl font-bold text-red-500">{selectedGroup.name}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center">لا توجد رسائل</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="bg-gray-700 p-3 rounded-lg">
                        <div className="text-gray-200">{msg.text}</div>
                        <div className="text-xs text-gray-500 mt-2">{msg.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-red-600 space-y-3">
                  <textarea
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded p-2 focus:outline-none focus:border-red-600"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendMessage}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      إرسال
                    </Button>
                  </div>
                </div>

                {/* Export */}
                <div className="p-4 border-t border-red-600">
                  <p className="text-sm text-gray-400 mb-3">تصدير المحادثة:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleExport("txt")}
                      variant="outline"
                      className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      TXT
                    </Button>
                    <Button
                      onClick={() => handleExport("pdf")}
                      variant="outline"
                      className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-red-600 h-full flex items-center justify-center">
                <p className="text-gray-400">اختر مجموعة أو أنشئ واحدة جديدة</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
