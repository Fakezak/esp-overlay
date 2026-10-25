export default function handler(req, res) {
  // 1. CORS & Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get User ID
  const playerId = req.query.id || "unknown";

  // 3. Force Clearance (No bans, no suspensions)
  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-auth", "success");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-whitelist", "true");

  // 🌟 4. ESP SETTINGS (Hidden in Headers for the DLL to read) 🌟
  res.setHeader("x-esp-enabled", "true");
  res.setHeader("x-esp-mode", "2d_box_and_line"); // Draws 2D boxes and lines
  res.setHeader("x-esp-draw-box", "true");
  res.setHeader("x-esp-draw-line", "true");
  res.setHeader("x-esp-line-origin", "bottom_screen"); // Draws line from bottom of screen to enemy
  res.setHeader("x-esp-color", "#FF0000"); // Red boxes
  res.setHeader("x-esp-visible-check", "false"); // Draw through walls
  res.setHeader("x-esp-local-only", "true"); // Only the user can see it

  // 5. Send "OK" so the game loads normally
  return res.status(200).send("OK");
}
