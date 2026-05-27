---
title: 'Why I Reach for SvelteKit'
description: 'The handful of reasons SvelteKit keeps winning my greenfield projects — from runes to prerendering to how little ceremony it asks for.'
date: '2026-06-10'
keywords:
  - SvelteKit
  - Engineering
  - Performance
  - TypeScript
author: 'Santiago Vázquez Villarreal'
draft: false
---

Most of the apps I've shipped recently started the same way: an empty directory,
`pnpm create svelte`, and a deadline. Here's why SvelteKit keeps earning that
first commit.

## Runes make state obvious

Svelte 5's runes (`$state`, `$derived`, `$effect`) removed the last bit of magic
I had to explain to new teammates. Reactivity is now a function call you can
point at, not a compiler convention you have to memorize.

## Prerendering is a one-liner

```ts
export const prerender = true;
```

That single line turns a route into static HTML at build time — which is exactly
what you want for content like this blog: instant loads and clean indexing.

## It gets out of the way

No provider pyramids, no bundler config archaeology. The framework makes the
boring choices so I can spend my time on the product. For a deeper look at the
architecture behind this site, see [the launch post](/blog/hello-world).
