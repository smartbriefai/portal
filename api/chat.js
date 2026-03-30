export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'HF_TOKEN not set in environment' });
  }
  try {
    const { messages, max_tokens = 800 } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const hfResp = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          provider: 'novita',
          max_tokens,
          stream: false,
          temperature: 0.3,
          messages
        })
      }
    );
    if (!hfResp.ok) {
      const errText = await hfResp.text().catch(() => '');
      return res.status(hfResp.status).json({
        error: `HF API error ${hfResp.status}: ${errText.slice(0, 120)}`
      });
    }
    const data = await hfResp.json();
    const content = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
