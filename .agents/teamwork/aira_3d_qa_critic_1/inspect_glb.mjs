import fs from 'fs';
import path from 'path';

const glbPath = path.resolve('public/assets/aira/xbot.glb');
const buf = fs.readFileSync(glbPath);

// GLB Header: 12 bytes (magic 4, version 4, length 4)
// Chunk 0 Header: 8 bytes (chunkLength 4, chunkType 4)
const chunk0Length = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonStr);

console.log('--- ANIMATIONS IN XBOT.GLB ---');
if (gltf.animations) {
  gltf.animations.forEach((anim, i) => {
    console.log(`[${i}] clip name: "${anim.name}" (channels: ${anim.channels?.length})`);
  });
} else {
  console.log('No animations found!');
}

console.log('--- SKINS & BONES ---');
if (gltf.nodes) {
  const bones = gltf.nodes.filter(n => n.name && n.name.startsWith('mixamorig:'));
  console.log('Total mixamorig bones:', bones.length);
  console.log('Bone names:', bones.map(b => b.name).slice(0, 30));
}
