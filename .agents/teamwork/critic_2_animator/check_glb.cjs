const fs = require('fs');
const buf = fs.readFileSync('public/assets/aira/xbot.glb');
const jsonLength = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLength).toString('utf8'));

console.log('Materials in xbot.glb:', gltf.materials);
console.log('Textures count:', gltf.textures ? gltf.textures.length : 0);
console.log('Images count:', gltf.images ? gltf.images.length : 0);
