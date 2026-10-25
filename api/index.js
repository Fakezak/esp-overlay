globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  // 1. Standard Headers
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "Content-Type, Authorization");
  
  // CRITICAL: Expose headers so the game can read auth and ESP data
  res.setHeader("access-control-expose-headers", "x-user-uid, x-auth, x-ban, x-suspension, x-blacklist, x-whitelist, x-protection, x-protection-expires, x-esp-post-url, x-esp-fps");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const url = req.url || "";

  // ==========================================
  // ROUTE 1: AUTH & ESP MANIFEST (GET /auth or /esp)
  // ==========================================
  if (url.includes("/auth") || url.includes("/esp")) {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    
    const playerId = req.query.id || "unknown";
    res.setHeader("x-user-uid", playerId);
    res.setHeader("x-auth", "success");
    res.setHeader("x-ban", "false");
    res.setHeader("x-suspension", "none");
    res.setHeader("x-blacklist", "false");
    res.setHeader("x-whitelist", "true");
    
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 2);
    res.setHeader("x-protection", "active");
    res.setHeader("x-protection-expires", expiresDate.toISOString());

    // Tell the game where to send data
    res.setHeader("x-esp-post-url", "/api/frame");
    res.setHeader("x-esp-fps", "5");

    return res.status(200).send("OK");
  }

  // ==========================================
  // ROUTE 2: RECEIVE DATA (POST /frame)
  // ==========================================
  if (url.includes("/frame")) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST request" });
    }

    try {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);

      if (body && body.entities) {
        globalThis.espFrames.push(body);
        if (globalThis.espFrames.length > 10) globalThis.espFrames.shift();
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ error: "Invalid data format" });
    } catch (error) {
      return res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  // ==========================================
  // ROUTE 3: VIEWER READS DATA (GET /view)
  // ==========================================
  if (url.includes("/view")) {
    const latest = globalThis.espFrames.length > 0 
      ? globalThis.espFrames[globalThis.espFrames.length - 1] 
      : { entities: [] };
    
    return res.status(200).json(latest);
  }

  // ==========================================
  // FALLBACK
  // ==========================================
  return res.status(404).json({ error: "Route not found" });
}
