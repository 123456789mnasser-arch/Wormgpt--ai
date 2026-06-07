import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from dist/public
app.use(express.static('dist/public'));

// API proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://forge.manus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 6RyEjbdjCNKQfTvFcLfiFD',
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4-turbo',
        temperature: 0.9,
        max_tokens: 2000,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile('dist/public/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
