import fs from 'fs';
import path from 'path';

const glbPath = path.resolve('public/assets/aira/xbot.glb');
const buf = fs.readFileSync(glbPath);
const chunk0Length = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonStr);

gltf.animations.forEach((anim) => {
  const nodeTargets = new Set();
  anim.channels.forEach((ch) => {
    const nodeIndex = ch.target.node;
    const nodeName = gltf.nodes[nodeIndex]?.name;
    if (nodeName) nodeTargets.add(nodeName);
  });
  console.log(`\nClip "${anim.name}" duration:`, anim.samplers?.[0]?.input !== undefined ? 'has samplers' : 'unknown');
  console.log(`Targets head: ${nodeTargets.has('mixamorig:Head')}, Targets rightArm: ${nodeTargets.has('mixamorig:RightArm')}, Targets rightForeArm: ${nodeTargets.has('mixamorig:RightForeArm')}, Targets Spine: ${nodeTargets.has('mixamorig:Spine')}`);
});
