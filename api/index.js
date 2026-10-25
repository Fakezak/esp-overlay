globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  // 1. Standard Headers
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "Content-Type, Authorization");
  res.setHeader("access-control-expose-headers", "x-user-uid, x-auth, x-ban, x-suspension, x-blacklist, x-whitelist, x-protection, x-protection-expires, x-esp-post-url, x-esp-fps");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Check BOTH the URL path and the query parameters to be 100% safe
  const url = req.url || "";
  const route = req.query.route || "";

  // ==========================================
  // ROUTE 1: AUTH (GET /api?route=auth)
  // ==========================================
  if (url.includes("auth") || route === "auth") {
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

    res.setHeader("x-esp-post-url", "/api?route=frame");
    res.setHeader("x-esp-fps", "5");

    return res.status(200).send("OK");
  }

  // ==========================================
  // ROUTE 2: RECEIVE DATA (POST /api?route=frame)
  // ==========================================
  if (url.includes("frame") || route === "frame") {
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
  // ROUTE 3: VIEWER READS DATA (GET /api?route=view)
  // ==========================================
  if (url.includes("view") || route === "view") {
    const latest = globalThis.espFrames.length > 0 
      ? globalThis.espFrames[globalThis.espFrames.length - 1] 
      : { entities: [] };
    
    return res.status(200).json(latest);
  }

  // ==========================================
  // FALLBACK
  // ==========================================
  return res.status(404).json({ error: "Route not found", debug_url: url, debug_route: route });
}
