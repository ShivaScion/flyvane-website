# Project Guidelines: Handcrafted Portfolio Website

## 1. Aesthetic & Design System (Anti-Slop)
- **No AI Clichés:** Ban centered generic purple gradients, standard 3-column card grids, and meaningless glowing pill badges.
- **Surface Elevation:** Use rich dark tones (`#09090b` / `#0c0d0e`), subtle hairline borders (`rgba(255,255,255,0.08)`), and intentional layout asymmetry.
- **Motion:** Keep UI micro-interactions snappy (150ms–250ms), purposeful, and tactile.

## 2. Typography Rules
- **Font Pairings:** Use intentional pairings (e.g. `Instrument Serif` / `Fraunces` for display headings with `Geist` or `Plus Jakarta Sans` for body, or `Space Grotesk` + `Commit Mono` for tech precision).
- **Tracking & Leading:** Tighten display headings (`tracking-[-0.03em]`, `leading-[1.1]`, `text-wrap: balance`). Expand uppercase metadata labels (`tracking-[0.1em]`).

## 3. Engineering Philosophy (Ponytail / YAGNI)
- Follow the **7-Rung Decision Ladder**: YAGNI → Reuse → Stdlib → Native Platform Features → Existing Dependencies → Minimal Implementation → New Code.
- Prioritize native HTML/CSS features over external libraries.
