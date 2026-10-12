# Ansh Rudra — Hyper-Interactive 3D Portfolio

Official high-craft portfolio website for **Ansh Rudra** — Automation Engineer & Behavioral Marketing Strategist.

---

## ⚡ Tech Stack & Architecture

- **Core Framework:** React 18 + Vite + TypeScript
- **3D Spatial Graphics:** Three.js (WebGL Particle Cloud & Conduit Pipelines)
- **Styling & Design System:** Tailwind CSS (Obsidian dark aesthetic, 3D perspective tilt cards, noise overlays)
- **Typography:** Syne (Display), Instrument Serif (Editorial Italics), Plus Jakarta Sans (Body), JetBrains Mono (Telemetry/Code)
- **Audio & Speech Engine:** Web Speech Synthesis + Web Speech Recognition (Mascot Voice Assistant)
- **Tooling:** Lucide Icons, DOMParser for client-side scraping, Playwright script generator

---

## 🚀 Quick Start (Development & Production)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
# Server will start at http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
# Outputs optimized static bundle to dist/
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Instant Hosting & Deployment

- **Vercel:** Ready out of the box (`vercel.json` included). Push to GitHub and import into Vercel.
- **Netlify:** Pre-configured with `netlify.toml`.
- **Cloudflare Pages / GitHub Pages:** Point build output to `dist/` with build command `npm run build`.

---

## 🤖 Mascot: Aira

Aira is an autonomous traveling AI mascot companion that:
- Smoothly travels and bobs across sections with walking animations on scroll.
- Swaps poses contextually:
  - **Standing Pose:** Default state & Hybrid matrix.
  - **Laptop Pose:** Workbench & Live terminal interaction.
  - **Coffee Pose:** Strategy & Mind mode.
  - **Pointing Pose:** ROI and call to actions.
  - **Smiling Pose:** Contact and lead initiation.
- Reacts when cursor leaves the window.
- Greets visitors and executes voice navigation commands via Web Speech API.
