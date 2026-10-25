const crypto = require('crypto');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  const token = crypto.randomUUID();

  res.status(200).json({
    token,
    socketUrl: process.env.SOCKET_URL || 'http://localhost:3000',
    socketPath: '/socket.io',
    fields: ['id', 'team', 'pos', 'health'],
    fps: 10,
  });
};
