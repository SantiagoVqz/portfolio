---
name: Santiago Vázquez — Portfolio
description: A tactile, engineered portfolio — ceramic-and-paper materials proving the craft they claim.
colors:
  base: "#fdfcf8"
  surface: "#f2f0e9"
  accent: "#cc8b65"
  accent-deep: "#8f6347"
  tension: "#7d9c8b"
  ink: "#36322f"
  gold: "#d4a843"
typography:
  display:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 3.5vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'DM Mono', 'Input Mono', 'Courier New', monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'DM Mono', 'Input Mono', 'Courier New', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.15em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  2xl: "1.5rem"
  full: "9999px"
spacing:
  sm: "1.5rem"
  md: "3rem"
  lg: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.base}"
  button-secondary:
    backgroundColor: "{colors.base}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base}"
  card:
    backgroundColor: "{colors.base}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
---

# Design System: Santiago Vázquez — Portfolio

## 1. Overview

**Creative North Star: "The Engineer's Workbench"**

This is a portfolio where the design is itself the argument. Everything on the surface is tactile and exact at once — sun-bleached paper, raw ceramic, baked clay — the materials of something made by hand, but assembled with an engineer's precision. Warmth carries the personality; precision carries the credibility. The two are never traded against each other. A recruiter should feel, within seconds, that the person behind this sweats the details, and should keep reading because the depth rewards it.

The system rejects the stock engineer-portfolio entirely: no dark mode with a neon accent, no hero-metric card template, no identical icon-heading-text project grid, no glass-everything. It equally rejects the opposite failure — the sterile navy-and-blue corporate gloss with no personality. The line it walks is **enterprise-credible without being sterile, distinctive without being gimmicky**. Motion and material are present because they aid comprehension and memorability, never as decoration for its own sake.

Serif headlines (Fraunces) speak with confidence; a monospace body (DM Mono) speaks with technical precision. That single pairing is the whole voice: expressive where it should assert, exacting where it should inform.

**Key Characteristics:**
- Warm ceramic-and-paper palette — never dark mode, never neon.
- Fraunces serif display against a DM Mono body: confident + technical in one pairing.
- Tactile depth via soft inset+drop shadows, not hard drop shadows or flat corporate surfaces.
- Full, quiet borders and generous radii; no colored side-stripes, no hard edges.
- Motion is choreographed and purposeful (GSAP + Lenis), with full reduced-motion equivalents.

## 2. Colors

A warm, sun-bleached material palette: paper and ceramic neutrals grounded by a soft charcoal ink, warmed by baked clay, cooled by dried sage.

### Primary
- **Baked Clay** (#cc8b65): The signature accent. Hover states, active nav, key links, focus rings, selection highlight. Warm terracotta that carries the brand's personality without shouting. Used sparingly — its scarcity is what makes it read as intentional.
- **Fired Clay** (#8f6347): The accent's text-safe shade. Any clay-colored *text on light backgrounds* (hover states, eyebrows) uses this — plain Baked Clay is 2.7:1 on paper and fails WCAG. On the ink band, plain Baked Clay is fine (4.5:1).

### Secondary
- **Dried Sage** (#7d9c8b): The cool counterweight. Tags, categories, secondary metadata, quiet supporting accents. Balances the clay warmth so the surface never tips fully into one temperature.

### Tertiary
- **Muted Gold** (#d4a843): Rare highlight for emphasis moments (a standout metric, a co-founded badge). The least-used color; reserve it for genuine peaks.

### Neutral
- **Sun-bleached Paper** (#fdfcf8): The dominant body background and the color of text-on-dark. The near-white the whole system sits on.
- **Raw Ceramic** (#f2f0e9): Surface color for cards, panels, and raised material. One tonal step down from paper to signal a distinct plane.
- **Soft Charcoal** (#36322f): Primary ink for all text, and the fill for primary buttons and dark surfaces. Never pure black.

### Named Rules
**The Warm-Neutral Rule.** The body is always paper (#fdfcf8) or ceramic (#f2f0e9). Dark mode is forbidden; a dark surface is a deliberate, local inversion (a button, a footer band), never the page.

**The One-Clay Rule.** Baked Clay stays under ~10% of any screen. Text hierarchy comes from weight, size, and the ink ramp (100% / 70% / 50% opacity), not from spraying the accent everywhere.

## 3. Typography

**Display Font:** Fraunces (with "Times New Roman", serif)
**Body Font:** DM Mono (with "Input Mono", "Courier New", monospace)

**Character:** A high-contrast pairing on the right axis: an expressive optical serif for confidence, a precise monospace for technical authority. They differ enough to never be mistaken for each other, which is what makes the contrast read as designed rather than accidental. Fraunces asserts; DM Mono documents.

### Hierarchy
- **Display** (Fraunces 600, clamp 2.5–4rem, lh 1.1, tracking -0.02em): Hero and section-opening headlines. Ceiling held at ~4rem — confident, not shouting. Use `text-wrap: balance`.
- **Headline** (Fraunces 500, clamp 2–3.5rem, lh 1.1): Major section titles.
- **Title** (Fraunces 500, ~1.25rem, lh 1.3): Card titles, project names, sub-section heads.
- **Body** (DM Mono 400, 1rem, lh 1.6): All running copy. Monospace is denser to read, so keep measure tight — cap at ~65–70ch — and lean on the 1.6 line-height for breathing room.
- **Label** (DM Mono 500, 0.75rem, tracking 0.15em, often UPPERCASE): Metadata, tags, button text, nav items, eyebrow data.

### Named Rules
**The Two-Voice Rule.** Serif for what asserts (headlines, names), mono for what informs (body, data, labels). Never blur the two — no serif body, no mono headlines.

**The Mono-Measure Rule.** Monospace body is wider per character; never run it past ~70ch or it becomes a wall. Break long copy into short paragraphs.

## 4. Elevation

The system is tactile, not flat and not floating. Depth is conveyed through soft, low-contrast shadows that combine a faint inner inset with a diffuse drop — surfaces read as pressed-and-lifted ceramic material rather than floating cards. Shadows are keyed to the ink color at very low opacity (never black), so elevation stays warm. Cards are flat-ish at rest and deepen on hover; the shadow is a response to interaction, not a permanent halo.

### Shadow Vocabulary
- **Diffused** (`box-shadow: inset 0px 2px 8px -2px rgba(54,50,47,0.08), 0px 8px 24px -6px rgba(54,50,47,0.04)`): Resting state for surface cards and panels. Barely-there tactility.
- **Deep** (`box-shadow: inset 0px 4px 16px -4px rgba(54,50,47,0.12), 0px 12px 32px -8px rgba(54,50,47,0.08)`): Hover / active elevation. The material presses up toward the reader.

### Named Rules
**The Warm-Shadow Rule.** Shadows are always keyed to ink (#36322f) at low opacity, never black. A cold gray shadow breaks the ceramic warmth instantly.

**The Depth-On-Intent Rule.** Surfaces rest at Diffused and rise to Deep only on hover/focus. Depth signals interactivity; a static deep shadow is noise.

## 5. Components

### Buttons
- **Shape:** Fully pill-shaped (radius `full`, 9999px). Text is DM Mono, UPPERCASE, tracking 0.15em.
- **Primary:** Soft Charcoal fill (#36322f), Sun-bleached Paper text; padding ~0.75rem 1.75rem.
- **Hover / Focus:** Primary shifts fill to Baked Clay (#cc8b65). Magnetic pull on pointer devices (GSAP), disabled on touch. Focus-visible: 2px clay outline, 2px offset.
- **Secondary:** Paper background with a 1px ink border and ink text; inverts to ink fill + paper text on hover.
- **Ghost:** Text-only, ink color, shifts to clay on hover. No background, no border.

### Cards / Containers
- **Corner Style:** Generous — `xl` (1.25rem) is the default card radius; panels range md–2xl.
- **Background:** Paper (#fdfcf8) for cards on ceramic sections; Ceramic (#f2f0e9) for surface panels on paper sections. One step of tonal contrast, always.
- **Shadow Strategy:** Diffused at rest, Deep on hover (see Elevation).
- **Border:** 1px ink at 8% opacity (subtle). On hover, border shifts toward clay at 40% and the card lifts -4px.
- **Internal Padding:** Section scale — ~3rem (`md`) for feature cards, tighter for compact list items.

### Navigation
- **Style:** Fixed top bar, glass backdrop (paper at ~80% + 12px blur) so content reads through while scrolling. DM Mono labels.
- **States:** Default ink; hover/active shift to clay. Active section tracked to scroll position.
- **Mobile:** Collapses to a menu; Escape closes it; full keyboard support.

### Signature Components
- **Custom Cursor** (pointer devices only): a JS-driven cursor replaces the native one via `body.custom-cursor-active`. Restored automatically on touch/coarse pointers. **Never** rely on `cursor: none` to block clicks — hit-testing must always work.
- **Project Layouts:** Four editorial treatments (`editorial` / `data` / `immersive` / `compact`) so featured work gets bespoke composition instead of a uniform grid. This variety is the anti-template move — lean into it.

## 6. Do's and Don'ts

### Do:
- **Do** keep the body on Sun-bleached Paper (#fdfcf8) or Raw Ceramic (#f2f0e9). Warmth lives in the surface.
- **Do** pair Fraunces headlines with DM Mono body — serif asserts, mono informs.
- **Do** hold Baked Clay under ~10% of any screen; derive hierarchy from the ink opacity ramp (100/70/50%).
- **Do** key every shadow to ink at low opacity, resting at Diffused and rising to Deep on interaction.
- **Do** give featured projects bespoke layouts (editorial/data/immersive/compact) rather than one repeated card.
- **Do** ship a full `prefers-reduced-motion` equivalent for every GSAP/scroll animation; reveals must enhance already-visible content, never gate it (WCAG 2.1 AA).
- **Do** verify body text hits ≥4.5:1 — ink on paper passes; `.text-muted` (ink at 50%) is metadata-only, never body.

### Don't:
- **Don't** ship a **generic template portfolio**: no dark mode + neon accent, no hero-metric card template, no identical icon-heading-text project grid.
- **Don't** drift **corporate/SaaS sterile**: no navy-and-blue, no flat personality-free enterprise gloss.
- **Don't** go **overdesigned/gimmicky**: no motion or effects that fight legibility, no cleverness over clarity.
- **Don't** let it read as a **resume-as-webpage**: no flat CV text dump without hierarchy or narrative.
- **Don't** use glassmorphism decoratively — it's reserved for the nav backdrop and rare purposeful overlays only.
- **Don't** use `cursor: none` (or any hidden-cursor trick) as a click-blocking mechanism.
- **Don't** use colored side-stripe borders (`border-left`/`right` >1px) or gradient text — both banned.
- **Don't** run DM Mono body past ~70ch, or use pure black anywhere.
