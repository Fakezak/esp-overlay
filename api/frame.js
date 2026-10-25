globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST request" });

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    if (!body || !body.entities) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    globalThis.espFrames.push(body);
    if (globalThis.espFrames.length > 10) globalThis.espFrames.shift();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
