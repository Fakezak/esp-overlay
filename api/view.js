globalThis.espFrames = globalThis.espFrames || [];

export default function handler(req, res) {
  res.setHeader("access-control-allow-origin", "*");
  
  const latest = globalThis.espFrames.length > 0 
    ? globalThis.espFrames[globalThis.espFrames.length - 1] 
    : { entities: [] };
  
  return res.status(200).json(latest);
}
