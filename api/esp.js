export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Check for the simple "ok" auth header
  const auth = req.headers['x-auth'] || req.headers['authorization'];
  
  if (auth !== 'ok') {
    return res.status(401).json({ error: "Unauthorized: You must be logged in." });
  }

  // Auth passed
  res.status(200).json({
    status: "ok",
    postUrl: "/frame",
    viewUrl: "/view",
    fps: 5
  });
}
