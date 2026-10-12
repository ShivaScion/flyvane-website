import fs from 'fs';
import path from 'path';

const glbPath = path.resolve('public/assets/aira/xbot.glb');
const buf = fs.readFileSync(glbPath);
const chunk0Length = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonStr);

// Sampler inputs are accessors
gltf.animations.forEach((anim) => {
  let maxTime = 0;
  anim.samplers.forEach((s) => {
    const acc = gltf.accessors[s.input];
    if (acc && acc.max && acc.max[0] > maxTime) {
      maxTime = acc.max[0];
    }
  });
  console.log(`Clip "${anim.name}": duration = ${maxTime.toFixed(3)}s`);
});
