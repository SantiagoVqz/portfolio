# Product

## Register

brand

## Users

Primarily **enterprise recruiters and hiring managers** evaluating Santiago Vázquez Villarreal (Full-Stack Engineer, Monterrey MX) for engineering roles. They arrive from LinkedIn, a referral, or a job application, often skimming on limited time and screening for stack fit, scale of impact, and whether the work is real.

Their job-to-be-done: decide quickly whether Santiago is worth a conversation. Secondary audiences — startup/product teams and potential collaborators — read the same surface for evidence of product ownership and craft.

Context of use: desktop and mobile, short attention window, comparing against many other candidates. The site must reward a 20-second skim and a 5-minute deep read equally.

## Product Purpose

A single-page portfolio that converts a skim into a callback. It exists to prove — not assert — that Santiago builds products that scale: municipal AI systems serving U.S. cities, IoT fulfillment for major retailers, co-founded SaaS. Success = a recruiter leaves convinced the work is real, the range is broad (full-stack, cloud-native, embedded), and the person behind it thinks in products, then reaches out or advances the application.

The design is the product here: it is itself evidence of the engineering craft it claims.

## Brand Personality

**Confident, technical, direct.** Expert-forward voice that lets metrics, architecture, and shipped outcomes carry the weight — no over-explaining, no hedging. Warm and tactile in execution (the ceramic/paper material system) but never soft on substance. Speaks like a senior engineer who has shipped: specific, quantified, unbothered by buzzwords.

Emotional goal for the visitor: quiet certainty. "This person is the real thing, and clearly sweats the details."

## Anti-references

- **Generic template portfolio** — dark mode + neon accent, hero-metric card template, identical icon-heading-text project grid, the stock dev-portfolio scaffold. Instant "AI/template made this."
- **Corporate/SaaS sterile** — navy-and-blue, flat, personality-free enterprise gloss. Professional must not mean soulless.
- **Overdesigned/gimmicky** — motion and effects for their own sake, style obstructing legibility, cleverness over clarity.
- **Resume-as-webpage** — a flat CV text dump with no narrative, hierarchy, or craft.

The tension to hold: enterprise-credible *without* being sterile; distinctive *without* being gimmicky.

## Design Principles

1. **Show, don't tell.** Every claim is backed by a shipped artifact, a metric, or a case study. The portfolio demonstrates competence rather than asserting it.
2. **Reward the skim, earn the deep read.** Hierarchy delivers the headline in seconds; depth is there for those who keep reading. Neither audience is starved.
3. **The medium is the proof.** Craft, performance, and polish of the site itself are part of the argument. Bugs, jank, or sloppiness undercut the whole pitch.
4. **Substance over spectacle.** Motion and material serve comprehension and memorability, never decoration. If an effect doesn't help the reader, it goes.
5. **Specific beats generic.** Real numbers, real client names, real architecture. Concreteness is what separates this from the template it must not resemble.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1 contrast; large text ≥3:1. Full keyboard navigation, visible focus states, semantic landmarks, proper heading hierarchy. Every GSAP/scroll-driven animation needs a `prefers-reduced-motion` equivalent that keeps content fully accessible (reveals must enhance already-visible content, never gate it). Respect `prefers-contrast: high`. Alt text on all meaningful imagery.
