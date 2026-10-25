globalThis.espFrames = globalThis.espFrames || [];

module.exports = async (req, res) => {
  // 1. Set CORS headers immediately
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "Content-Type, Authorization");

  // 2. Handle Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 3. Reject GET (This stops the crash when you view it in the browser)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST request" });
  }

  // 4. Safely parse the body
  try {
    // Vercel sometimes gives the body as a string, sometimes as an object.
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    if (!body || !body.entities) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // 5. Store the frame in memory
    globalThis.espFrames.push(body);
    if (globalThis.espFrames.length > 10) {
      globalThis.espFrames.shift(); // Keep only the last 10 frames
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};
