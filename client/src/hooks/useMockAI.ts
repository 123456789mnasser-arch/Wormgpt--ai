import { useState } from 'react';

// Mock responses for testing without API key
const mockResponses = [
  "هذا رد تجريبي من WormGPT. يمكنك استخدام الموقع بشكل كامل!",
  "مرحباً! أنا هنا للإجابة على أسئلتك حول الأمن السيبراني والبرمجة.",
  "تم استقبال رسالتك بنجاح! هذا رد تجريبي من النسخة المحلية.",
  "شكراً على سؤالك! هذا موقع WormGPT المتخصص في الأمن السيبراني.",
];

export function useMockAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return random mock response
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return randomResponse;
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
