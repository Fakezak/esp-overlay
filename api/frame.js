globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

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
