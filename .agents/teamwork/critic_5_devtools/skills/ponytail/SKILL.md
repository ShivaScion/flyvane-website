---
name: ponytail
description: >-
  Pragmatic, anti-bloat coding ruleset that enforces a "lazy senior developer" approach. Prevents over-engineering, unnecessary external libraries, and over-abstracted code through a strict 7-rung decision ladder. Use when planning, scaffolding, or implementing code.
---

# Ponytail Skill: Anti-Bloat Senior Dev Rules

## The 7-Rung Decision Ladder
1. **YAGNI:** Does this feature or abstraction really need to exist right now?
2. **Reuse:** Is there existing code, component, or pattern to reuse?
3. **Stdlib:** Can vanilla JS/CSS solve it without a package?
4. **Native Platform:** Use native HTML5/CSS (`<dialog>`, `<details>`, `@container`, `accent-color`, `scroll-snap`) instead of heavy JS packages.
5. **Installed Dependencies:** Stick strictly to what is already installed.
6. **Minimalist Implementation:** Prefer a clear 5-line function over a 50kb npm dependency.
7. **New Code:** Build from scratch only when strictly necessary, maintaining high quality and accessibility.
