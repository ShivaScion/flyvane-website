import fs from 'fs';
import path from 'path';

let envLoaded = false;

export function ensureEnvLoaded() {
  if (envLoaded && process.env.RESEND_API_KEY && process.env.SUPABASE_URL) {
    return;
  }

  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const t = line.trim();
        if (t && !t.startsWith('#') && t.includes('=')) {
          const idx = t.indexOf('=');
          const k = t.slice(0, idx).trim();
          let v = t.slice(idx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (!process.env[k] || process.env[k] === '') {
            process.env[k] = v;
          }
        }
      });
      envLoaded = true;
    } catch (e) {
      console.warn('Could not read .env file:', e);
    }
  }
}

// Auto-run on import
ensureEnvLoaded();
