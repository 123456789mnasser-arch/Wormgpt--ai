import { useState } from 'react';

export function useAIChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
      const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error('API configuration missing');
      }

      const response = await fetch(
        `${apiUrl}/llm/invoke`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No response from API');
      }
      return content;
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
