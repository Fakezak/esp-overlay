globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  // Check for the simple "ok" auth header
  const auth = req.headers['x-auth'] || req.headers['authorization'];
  
  if (auth !== 'ok') {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Accept Data
  try {
    const body = req.body;
    if (body && body.entities) {
      globalThis.espFrames.push(body);
      if (globalThis.espFrames.length > 10) globalThis.espFrames.shift();
      return res.status(200).json({ success: true });
    }
    res.status(400).json({ error: 'Invalid data' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
