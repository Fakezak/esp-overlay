globalThis.espFrames = globalThis.espFrames || [];

export default async function handler(req, res) {
  // Standard CORS Headers
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "Content-Type, Authorization");
  res.setHeader("access-control-expose-headers", "x-user-uid, x-auth, x-ban, x-suspension, x-blacklist, x-whitelist, x-protection, x-esp-post-url");

  if (req.method === "OPTIONS") return res.status(204).end();

  const url = req.url || "";

  // 1. AUTH ROUTE (This must perfectly mimic what the game expects)
  if (url.includes("auth") || url.includes("login")) {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    
    // Fake User Info
    res.setHeader("x-user-uid", req.query.id || "1");
    res.setHeader("x-auth", "success");
    res.setHeader("x-ban", "false");
    res.setHeader("x-suspension", "none");
    res.setHeader("x-blacklist", "false");
    res.setHeader("x-whitelist", "true");
    res.setHeader("x-protection", "active");
    
    // ESP Hook
    res.setHeader("x-esp-post-url", "/api/frame");

    // Return exactly "OK" as plain text
    return res.status(200).send("OK");
  }

  // 2. ESP FRAME ROUTE
  if (url.includes("frame")) {
    if (req.method !== "POST") return res.status(200).send("Frame endpoint active. Use POST.");
    try {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);
      if (body && body.entities) {
        globalThis.espFrames.push(body);
        if (globalThis.espFrames.length > 10) globalThis.espFrames.shift();
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(200).json({ success: false });
    }
  }

  // 3. VIEWER ROUTE
  if (url.includes("view")) {
    const latest = globalThis.espFrames.length > 0 ? globalThis.espFrames[globalThis.espFrames.length - 1] : { entities: [] };
    return res.status(200).json(latest);
  }

  // Fallback (Treat everything else as auth so the game never crashes)
  return res.status(200).send("OK");
}
