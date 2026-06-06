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
      const endpoint = `${apiUrl}/v1/chat/completions`;
      console.log('Calling API endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
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
          model: 'gpt-4-turbo',
          temperature: 0.9,
          max_tokens: 2000,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          // Could not parse error response
        }
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
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
