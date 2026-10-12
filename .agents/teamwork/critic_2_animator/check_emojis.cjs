const fs = require('fs');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FAFF}]/u;

const files = [
  'src/data/airaDialogues.ts',
  'src/components/AiraCompanion.tsx',
  'src/components/Aira3DModel.tsx',
  'src/components/AiraAnimatedCanvas.tsx',
  'src/components/AiraVoiceModal.tsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      console.log(`EMOJI FOUND in ${file}:${idx + 1}: ${line.trim()}`);
    }
  });
});

console.log('Emoji scan complete.');
