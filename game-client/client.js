const axios = require('axios');
const { io } = require('socket.io-client');

const MANIFEST_URL = process.env.ESP_MANIFEST_URL || 'http://localhost:3000/esp';

async function main() {
  const { data: manifest } = await axios.get(MANIFEST_URL);
  console.log('manifest:', manifest);

  const socket = io(manifest.socketUrl, { path: manifest.socketPath });

  socket.on('connect', () => {
    // Register the token on the socket host so subscribe() can validate it.
    socket.emit('esp:register', { token: manifest.token, fields: manifest.fields });
  });

  socket.on('esp:registered', () => {
    socket.emit('esp:subscribe', { token: manifest.token, fields: manifest.fields });
  });

  socket.on('esp:ready', ({ fields }) => {
    console.log('ESP ready with fields:', fields);

    setInterval(() => {
      const frame = {
        t: Date.now(),
        entities: getVisibleEntities(),
      };
      socket.emit('esp:frame', frame);
    }, 1000 / manifest.fps);
  });

  socket.on('esp:error', (e) => console.error('esp error:', e));
  socket.on('connect_error', (e) => console.error('connect error:', e.message));
}

// Replace with your game's sanctioned, visibility-filtered data source.
function getVisibleEntities() {
  return [
    { id: 1, team: 'red',  pos: { x: 200, y: 300 }, health: 100 },
    { id: 2, team: 'blue', pos: { x: 500, y: 450 }, health: 80  },
  ];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
