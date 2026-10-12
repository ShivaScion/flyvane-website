---
name: taste-skill
description: >-
  Eliminates generic AI slop in web and frontend design. Enforces intentional aesthetic choices, custom color palettes, balanced spatial rhythm, nuanced lighting, and avoidance of AI template cliches. Use whenever designing or implementing frontend UI or web components.
---

# Taste Skill: Anti-Slop Frontend Design Guide

## 1. Anti-Slop Core Principles
- ❌ **No Cliché Gradients:** No default purple-to-indigo or violet radial hero glows. Use atmospheric lighting or rich monochromatic themes.
- ❌ **No Monotonous Bento Grids:** Vary card weights, sizes, and layout archetypes (masonry, list with inline previews, split interactive viewports).
- ❌ **No Over-Pilling:** Avoid putting every label in generic pill badges. Use typographic contrast and monospace accents.
- ❌ **No Cookie-Cutter Center Heroes:** Use strong left-aligned editorial lockups, asymmetrical split screens, or content-first dynamic layouts.

## 2. Design Dials
- **`VISUAL_DENSITY`:** Low-to-medium for portfolio work. Generous negative space (`py-24`, `gap-16`).
- **`DESIGN_VARIANCE`:** High craft. Display serif headers, mixed column widths, and interactive hover previews.
- **`MOTION_INTENSITY`:** Snappy, refined micro-interactions (150ms–250ms `cubic-bezier(0.16, 1, 0.3, 1)`).

## 3. Surface & Depth Architecture
- **Borders over Shadows:** Sharp 1px borders with subtle opacity (`border border-white/[0.08]`).
- **Surface Elevation:** Micro-contrast (`#0a0a0a` background → `#121212` card surface → `#181818` active state).
