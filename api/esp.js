export default function handler(req, res) {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 1. Get User ID from the game
  const playerId = req.query.id || "unknown_user";

  // 2. Send Clearance Headers
  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-auth", "success");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-whitelist", "true");
  
  // 3. Protection notice
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresDate.toISOString());

  // 4. Since the game expects the manifest, we send it as JSON instead of just "OK"
  // This gives the game the postUrl and fps it needs for the ESP.
  return res.status(200).json({
    status: "ok",
    postUrl: "/frame",
    fps: 5
  });
}
