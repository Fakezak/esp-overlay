const fs = require('fs');
const axios = require('axios');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const serverUrl = config.serverUrl; // "https://esp-overlay.vercel.app/esp"

async function start() {
  try {
    // 1. Hit the URL. The body will be "OK"
    const response = await axios.get(serverUrl);
    
    // 2. Read the headers to get the ESP settings
    const postUrl = "https://esp-overlay.vercel.app" + response.headers['x-esp-post-url'];
    const fps = parseInt(response.headers['x-esp-fps']);

    console.log("Login Bypassed. Auth:", response.headers['x-auth']);
    console.log("ESP URL:", postUrl);

    // 3. Send Frames
    setInterval(async () => {
      await axios.post(postUrl, {
        entities: [{ id: 1, pos: { x: 300, y: 400 }, health: 100 }]
      });
    }, 1000 / fps);

  } catch (e) {
    console.error("Failed:", e.message);
  }
}

start();
