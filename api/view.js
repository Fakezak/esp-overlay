export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const frames = globalThis.espFrames || [];
  const latest = frames.length > 0 ? frames[frames.length - 1] : { entities: [] };
  
  res.status(200).json(latest);
}
