# Design System Specification (Google Stitch Standard)

> System: Ansh Rudra — Portfolio & Automation Architecture
> Standard: Google Stitch AI-Native Design Tokens & Framer Motion Kinetics
> Aesthetic Class: Hyper-Craft Obsidian Minimalist (Linear / Raycast / Snellenberg Benchmark)

---

## 1. Aesthetic DNA & Philosophy (Anti-Slop Protocol)
- **Zero Generic Slop:** Strict prohibition against centered generic purple/blue radial gradients, monotonous 3-column bento grids, and meaningless glowing pill badges.
- **Surface Depth Hierarchy:**
  - Base Canvas (Void): `#040406` (deepest atmospheric black, not pure `#000000`)
  - Primary Surface: `#09090b` (subtle charcoal obsidian)
  - Elevated Card: `#0c0d12` with `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Active / Hover Surface: `#14151f` with `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 20px 40px -15px rgba(0, 0, 0, 0.7)`
- **Hairline Specular Borders:** All interactive cards feature a top-edge 1px specular light catch to emulate physical beveled glass/metal.

---

## 2. Color Palette Tokens

| Token Name | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `void` | `#040406` | Deepest root viewport background |
| `surface-base` | `#09090b` | Section background & panel backing |
| `surface-card` | `#0c0d12` | Elevated card container |
| `surface-elevated` | `#14151f` | Hover, active, and nested component containers |
| `hairline` | `rgba(255, 255, 255, 0.08)` | Standard hairline borders |
| `specular` | `rgba(255, 255, 255, 0.14)` | Top-edge inset highlight |
| `accent-cyan` | `#00f0ff` | Machine mode: Technical precision & scrapers |
| `accent-amber` | `#f59e0b` | Mind mode: Psychological behavioral copy & loss-aversion |
| `accent-emerald` | `#10b981` | Hybrid mode: Revenue arbitrage & verified ROI |

---

## 3. Typography Architecture

### Font Pairings
- **Display Headings:** `Instrument Serif` / `Fraunces` (Editorial elegance, human authority)
- **Body & Functional UI:** `Geist Sans` / `Plus Jakarta Sans` (Neutral optical clarity)
- **Code, Telemetry & Metadata:** `Commit Mono` / `Geist Mono` (Technical engineering precision)

### Optical Calibration Rules
- **Hero & Primary Headings (`text-4xl`–`text-7xl`):**
  - Tracking: `tracking-[-0.035em]`
  - Leading: `leading-[1.08]`
  - Wrap: `text-wrap: balance`
- **Metadata Labels & Small Caps (`text-xs`):**
  - Casing: `uppercase`
  - Tracking: `tracking-[0.1em]`
  - Weight: `font-mono font-semibold`
- **Body Paragraphs:**
  - Leading: `leading-relaxed` (1.65–1.75)
  - Wrap: `text-wrap: pretty`

---

## 4. Framer Motion Kinetic System

### Spring Physics Standards
```ts
export const stitchSpring = {
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  gentle: { type: 'spring', stiffness: 280, damping: 26 },
  float: { type: 'spring', stiffness: 120, damping: 14 }
};

export const stitchTransition = {
  easeOutQuart: [0.165, 0.84, 0.44, 1.0],
  snellenbergCurtain: [0.76, 0.0, 0.24, 1.0]
};
```

### Motion Roles
1. **Section Reveal:** Staggered `opacity: 0, y: 24` to `opacity: 1, y: 0` with `viewport: { once: true, margin: '-80px' }`.
2. **Card Hover Tactile Lift:** Scale `1.012` with subtle Y-axis elevation `-4px` and border glow transition.
3. **Interactive Tabs:** Framer Motion `layoutId="active-tab-indicator"` for organic fluid pill sliding.
4. **Telemetry Numbers:** Animated counting transition on view.

---

## 5. Layout & Spatial Rhythm
- **Asymmetric Grid Balance:** Offset column divisions (7:5 or 8:4 splits) instead of monotonous 6:6 symmetry.
- **Generous Atmospheric Breathing Space:** `py-24` to `py-32` between major thematic domains.
- **Bespoke Detail Panels:** Interactive live tools (Terminal, Scraper, Arbitrage Burner) integrated natively into the narrative flow rather than relegated to standard demo cards.
