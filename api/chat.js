export default async function handler(req, res) {
  // CORS — allow requests from GitHub Pages domain
  res.setHeader('Access-Control-Allow-Origin', 'https://smartbriefai.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'AI service not configured' });
  }
  try {
    const { messages, max_tokens = 800 } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages required' });
    }
    const hfResponse = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`,
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          provider: 'novita',
          max_tokens,
          stream: false,
          temperature: 0.3,
          messages,
        }),
      }
    );
    if (!hfResponse.ok) {
      const errText = await hfResponse.text().catch(() => '');
      console.error('HF API error:', hfResponse.status, errText);
      return res.status(hfResponse.status).json({
        error: `AI service error: ${hfResponse.status}`,
      });
    }
    const data = await hfResponse.json();
    const content = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
}
