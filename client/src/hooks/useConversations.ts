import { useState, useEffect } from 'react';

export interface Conversation {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  createdAt: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wormgpt_conversations');
    if (saved) {
      try {
        setConversations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse conversations:', e);
      }
    } else {
      // Create first conversation with welcome message
      const firstConversation: Conversation = {
        id: Date.now().toString(),
        title: 'محادثة جديدة',
        messages: [
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: '[WELCOME_CARD]',
            timestamp: Date.now(),
          },
        ],
        createdAt: Date.now(),
      };
      setConversations([firstConversation]);
      localStorage.setItem('wormgpt_conversations', JSON.stringify([firstConversation]));
    }
    setLoading(false);
  }, []);

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    setConversations(convs);
    localStorage.setItem('wormgpt_conversations', JSON.stringify(convs));
  };

  const createConversation = (title: string = 'محادثة جديدة'): Conversation => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: Date.now(),
    };
    saveConversations([newConversation, ...conversations]);
    return newConversation;
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    const updated = conversations.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    saveConversations(updated);
  };

  const deleteConversation = (id: string) => {
    saveConversations(conversations.filter(c => c.id !== id));
  };

  const addMessage = (conversationId: string, role: 'user' | 'assistant', content: string) => {
    const updated = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: Date.now().toString(),
              role,
              content,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return c;
    });
    saveConversations(updated);
  };

  return {
    conversations,
    loading,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
  };
}
