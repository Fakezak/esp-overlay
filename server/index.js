require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' },
});

const sessions = new Map();

io.on('connection', (socket) => {
  socket.on('esp:subscribe', ({ token, fields } = {}) => {
    const s = sessions.get(token);
    if (!s) {
      socket.emit('esp:error', { message: 'bad token' });
      return;
    }
    const accepted = (fields || []).filter((f) => s.allowed.includes(f));
    socket.data.esp = { token, fields: accepted };
    socket.emit('esp:ready', { fields: accepted });
  });

  socket.on('esp:frame', (frame = {}) => {
    const sub = socket.data.esp;
    if (!sub) return;

    const clean = {
      t: frame.t || Date.now(),
      entities: (frame.entities || []).map((e) => {
        const out = {};
        for (const k of sub.fields) {
          if (k in e) out[k] = e[k];
        }
        return out;
      }),
    };

    io.emit('esp:view', clean);
  });

  socket.on('esp:register', ({ token, fields } = {}) => {
    sessions.set(token, { allowed: fields || [] });
    socket.emit('esp:registered', { token });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ESP socket server listening on :${PORT}`);
});
