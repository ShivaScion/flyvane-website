const fs = require('fs');
const buf = fs.readFileSync('public/assets/aira/xbot.glb');

// Look for animations in GLTF JSON chunk
const jsonLength = buf.readUInt32LE(12);
const jsonChunk = buf.subarray(20, 20 + jsonLength).toString('utf8');
const gltf = JSON.parse(jsonChunk);

console.log('Nodes count:', gltf.nodes ? gltf.nodes.length : 0);
if (gltf.animations) {
  console.log('Animations found:', gltf.animations.map(a => a.name));
} else {
  console.log('No animations found in gltf');
}
if (gltf.meshes) {
  console.log('Meshes:', gltf.meshes.map(m => m.name));
}
