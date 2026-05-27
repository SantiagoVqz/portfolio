# Blog Post Template & Authoring Spec

Reference for authoring blog posts (human or AI research agent). This file lives
in `docs/` — **outside** `src/lib/content/blog/`, so it is never published.

To publish a post: create one Markdown file in `src/lib/content/blog/`. Everything
else (listing, SEO meta, JSON-LD, OG image, sitemap, RSS, reading time, related
posts) is generated automatically at build time.

## Golden rules

1. **Output a single `.md` file** in `src/lib/content/blog/`.
2. **The filename is the URL slug** — lowercase, hyphenated, no spaces.
   `ai-attack-surface.md` → `/blog/ai-attack-surface`. Renaming it later changes
   the URL, so choose a stable, descriptive slug.
3. **Frontmatter is mandatory** and must be the very first thing in the file
   (`---` on line 1). Missing or malformed frontmatter throws at build time and
   breaks the build for the **entire site**, not just this post.
4. **Do not repeat the title as a heading in the body.** The page renders the H1
   from `title`. Start the body with the opening paragraph; use `##` / `###` for
   section headings.
5. **Dates are `'YYYY-MM-DD'` strings**, quoted.

## Template (copy verbatim)

````markdown
---
title: 'Title Case Headline, No Trailing Period'
description: 'One sentence, 120–160 characters. Used for the meta description, social preview, and list blurb. A complete thought, not a teaser.'
date: 'YYYY-MM-DD'
keywords:
  - Topic One
  - Topic Two
  - Topic Three
author: 'Santiago Vázquez Villarreal'
draft: false
---

Opening paragraph — no H1, no repeated title. Hook the reader and state the thesis.

## First section heading (use ## for sections)

Body content in standard Markdown: **bold**, _italic_, `inline code`,
[descriptive link text](https://real-url.example.com), and lists.

```ts
// fenced code blocks get syntax styling
export const prerender = true;
```

> Blockquotes for pulled-out emphasis.

## Second section heading

Close with the takeaway.
````

## Frontmatter fields

| Field         | Required | Rules                                                                                                                            |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | yes      | Title case, no trailing period. Becomes the H1, `<title>`, and OG card.                                                          |
| `description` | yes      | 120–160 chars, one complete sentence. Drives the SEO meta description and social preview.                                        |
| `date`        | yes      | `'YYYY-MM-DD'`, quoted. Controls sort order and the displayed date.                                                              |
| `keywords`    | yes      | 3–5 tags. Power the tag filter, topic chips, and related-post matching. Reuse existing tags where they fit so posts cross-link.  |
| `author`      | no       | Defaults to the site owner; set only to override.                                                                                |
| `cover`       | no       | `/blog/img.png` (served from `static/`) for a custom social image. Omit to auto-generate one at `/blog/<slug>/og.png`.           |
| `coverAlt`    | no       | Alt text. Required if `cover` is set.                                                                                            |
| `updated`     | no       | `'YYYY-MM-DD'` of the last meaningful edit. Adds an "Updated" label and sets `dateModified` in structured data.                  |
| `draft`       | no       | `true` hides the post everywhere (site, sitemap, RSS). Defaults to `false`.                                                       |

Existing tags in use (prefer these for cross-linking): `Engineering`, `SvelteKit`,
`TypeScript`, `Performance`, `Security`, `AppSec`, `AI`, `Writing`, `Product`.

## Content rules

- **Verify every external link resolves to a real URL.** No placeholders (e.g.
  `badhost.org`). Broken or fabricated links are an automatic fail.
- No bare title heading in the body — the H1 comes from frontmatter `title`.
- Plain Markdown only. **No raw `<script>` / `<style>`**, and no HTML comments
  (`<!-- ... -->`) — a comment containing the closing-script sequence breaks the
  mdsvex compile.
- Keep `description` self-contained; it is read out of context on Google,
  Twitter, and LinkedIn.
- Reading time is computed automatically from word count (~200 wpm); do not set it.

## Workflow

1. Write the file in `src/lib/content/blog/`.
2. Preview: `pnpm dev`, then open `http://localhost:5173/blog`.
3. Validate before publishing: `pnpm check` (type-check) and `pnpm build`
   (catches frontmatter/link/compile errors and prerenders the post + OG image).
4. Publish: commit and push. The post goes live on deploy.

Set `draft: true` to keep a work-in-progress in the repo without publishing it.
