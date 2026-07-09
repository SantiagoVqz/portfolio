# CLAUDE.md — Portfolio Codebase Guide

## Design Context

Strategic design intent lives in **PRODUCT.md** (root). Register: **brand** (portfolio — design IS the product). Audience: **enterprise recruiters/hiring managers** screening for stack fit + scale. Personality: **confident, technical, direct** — enterprise-credible without the sterile corporate look; distinctive without gimmicks. Core principles: show don't tell, reward the skim + earn the deep read, the medium is the proof, substance over spectacle, specific beats generic. A11y target: **WCAG 2.1 AA**. Read PRODUCT.md (and DESIGN.md, when present) before design work.

## Project Overview

A modern, highly-animated personal portfolio website built with **Svelte 5 + SvelteKit 2**. Single-page design with anchor-based navigation, scroll-driven animations, and a tactile design system.

## Tech Stack

- **Framework:** SvelteKit 2.49 / Svelte 5 (runes mode)
- **Build Tool:** Vite 7
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 + component-scoped `<style>` blocks
- **Animations:** GSAP 3.14 (ScrollTrigger, quickTo) + Lenis (smooth scroll)
- **Package Manager:** pnpm

## Directory Structure

```
src/
├── lib/
│   ├── actions/        # 7 Svelte action directives (countUp, magnetic, parallax, reveal, textReveal, tilt3d, pageLoad)
│   ├── assets/         # Images and project screenshots
│   ├── components/     # 11 Svelte components (PascalCase)
│   ├── constants/      # Centralized portfolio data (profile.ts)
│   ├── stores/         # Svelte 5 rune-based stores (scroll.svelte.ts)
│   ├── index.ts        # Library barrel exports
│   └── theme.ts        # Design tokens
├── routes/
│   ├── +layout.svelte  # Root layout (cursor, smooth scroll, global setup)
│   ├── +page.svelte    # Single home page with all sections
│   └── layout.css      # Global styles, Tailwind config, CSS variables
└── app.d.ts            # TypeScript ambient declarations
static/                 # Static assets served at root
```

## Commands

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # Type-check with svelte-check
pnpm check:watch  # Type-check in watch mode
pnpm lint         # Prettier + ESLint check
pnpm format       # Auto-format with Prettier
```

## Key Conventions

### Svelte 5 Runes

All components use Svelte 5 runes — **never** use legacy `$:`, `export let`, or Svelte 4 patterns:

- `$state()` for reactive state
- `$derived()` for computed values
- `$effect()` for side effects
- `$props()` with typed interfaces for component props
- `{#snippet}` for reusable template blocks

### Props Pattern

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
  }
  let { title, count = 0 }: Props = $props();
</script>
```

### SSR Safety

GSAP and browser APIs must be dynamically imported or guarded:

```ts
// Dynamic import pattern for GSAP (avoids SSR 500 errors)
const { gsap } = await import('gsap');
const { ScrollTrigger } = await import('gsap/ScrollTrigger');

// Browser guard
import { browser } from '$app/environment';
if (browser) { /* DOM access here */ }
```

### File Naming

- Components: `PascalCase.svelte` (e.g., `ProjectCard.svelte`)
- Actions/utilities: `camelCase.ts` (e.g., `reveal.ts`)
- Stores: `name.svelte.ts` (e.g., `scroll.svelte.ts`)
- Constants: `camelCase.ts`

### Styling

- **Design tokens** defined as CSS variables in `layout.css` (`--color-base`, `--color-accent`, etc.)
- **Color palette:** Sun-bleached Paper (#FDFCF8), Raw Ceramic (#F2F0E9), Baked Clay (#CC8B65), Dried Sage (#7D9C8B), Soft Charcoal (#36322F)
- **Fonts:** Fraunces (serif headlines), DM Mono (monospace data)
- **Transitions:** `--transition-fast` (150ms), `--transition-normal` (300ms), `--transition-slow` (500ms)
- Prefer Tailwind utilities; use scoped `<style>` for keyframes and complex selectors

### Overlay / Dialog Safety

- Any fullscreen overlay, modal, or `dialog` must be non-interactive when closed
- Use default closed state like `display: none; pointer-events: none;` and enable only on `[open]`
- For dialogs, prefer explicit rules:
  - `.component-dialog { display: none; pointer-events: none; }`
  - `.component-dialog[open] { display: flex; pointer-events: auto; }`
- Never leave fixed `inset: 0` layers visible/interactable without an open state guard
- Hidden cursor styles (`cursor: none`) must never be used as a click-blocking mechanism

### Animations

- Custom Svelte actions in `src/lib/actions/` handle all scroll/interaction animations
- GSAP ScrollTrigger for scroll-linked effects
- Actions must clean up in their `destroy` hook (remove listeners, kill tweens)
- Disable magnetic/cursor/tilt effects on touch devices
- Use hardware-accelerated transforms (`translate`, `scale`, `rotate`)

### Data & Content

All portfolio content lives in `src/lib/constants/profile.ts`. To update projects, skills, experience, or personal info, edit this single file. Components receive data via props.

### Accessibility

- Semantic HTML (`nav`, `main`, `article`, `section`, `footer`)
- ARIA attributes on interactive elements
- Keyboard navigation support (Escape closes mobile menu)
- `loading="lazy"` on images
- Proper heading hierarchy

### Routing

Single-page with anchor sections: `#hero`, `#artifacts`, `#process`, `#archive`, `#contact`. No nested routes.

### Performance

- Lazy-load images with `loading="lazy"`
- Dynamic GSAP imports (no SSR bundle)
- `$derived()` over recalculating in templates
- `requestAnimationFrame` for resize debouncing
- Touch device detection to skip heavy mouse-follow effects

## Deployment

Uses `@sveltejs/adapter-auto` — auto-detects platform (Vercel, Netlify, Cloudflare, Node). No special deploy config needed.

## MCP Tools (Svelte Documentation Server)

When a Svelte MCP server is available, use these tools:

1. **list-sections** — Discover documentation sections. Call first when working on Svelte/SvelteKit topics.
2. **get-documentation** — Fetch full docs for relevant sections found via list-sections.
3. **svelte-autofixer** — Validate Svelte code before finalizing. Run until no issues remain.
4. **playground-link** — Generate a Svelte Playground link. Only offer after code is complete; never use if code was written to project files.
