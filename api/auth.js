export default function handler(req, res) {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-expose-headers", "x-user-uid, x-auth, x-ban, x-suspension, x-blacklist, x-whitelist, x-protection, x-protection-expires, x-esp-post-url");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

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

  // Secretly tell the game where to send ESP data
  res.setHeader("x-esp-post-url", "/api/frame");

  return res.status(200).send("OK");
}
