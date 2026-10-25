export default function handler(req, res) {
  // 1. CORS & Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");

  // 2. Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 3. Get User ID (Echo it back so the game knows the user is recognized)
  const playerId = req.query.id || "unknown";

  // 4. Send Clearance Headers (The game reads these to check status)
  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-auth", "success");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-whitelist", "true");
  
  // 5. Optional: 2-Month protection notice
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresDate.toISOString());

  // 6. Send manifest info as headers (So your game client can read it)
  res.setHeader("x-esp-post-url", "/frame");
  res.setHeader("x-esp-fps", "5");

  // 7. Send exactly "OK" as the body so the game bypasses the login screen
  return res.status(200).send("OK");
}
