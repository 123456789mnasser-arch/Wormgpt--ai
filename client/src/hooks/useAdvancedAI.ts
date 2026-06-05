import { useState } from 'react';

export function useAdvancedAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
    setLoading(true);
    setError(null);

    try {
      // Get API credentials from environment
      const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
      const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error('API credentials not configured');
      }

      // Call Manus LLM API
      const response = await fetch(`${apiUrl}/llm/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: 'gpt-4-turbo', // Use most advanced model available
          temperature: 0.9, // Higher creativity
          max_tokens: 2000,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      return aiResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Advanced AI Error:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
