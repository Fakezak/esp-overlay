module.exports = function handler(req, res) {
  // 1. Force CORS to allow the game to read the headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // CRITICAL: Expose the custom headers so the game can actually read them
  res.setHeader("Access-Control-Expose-Headers", "x-user-uid, x-auth, x-ban, x-suspension, x-blacklist, x-whitelist, x-protection, x-protection-expires, x-esp-post-url, x-esp-fps");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get User ID
  const playerId = req.query.id || "1001";

  // 3. Send Clearance Headers
  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-auth", "success");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-whitelist", "true");
  
  // 4. Protection notice
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresDate.toISOString());

  // 5. ESP info
  res.setHeader("x-esp-post-url", "https://esp-overlay.vercel.app/frame");
  res.setHeader("x-esp-fps", "5");

  // 6. Send "OK"
  return res.status(200).send("OK");
};
