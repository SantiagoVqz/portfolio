---
name: publish-blog
description: Publish a new blog post to this portfolio. Takes the post's title + body (or a full Markdown draft), writes it to src/lib/content/blog/<slug>.md using the project's frontmatter spec, validates with pnpm build, and creates a git commit. Trigger when the user says "publish blog", "add this blog", "post this to the blog", or pastes a draft and asks to ship it.
---

# Publish Blog

Author and commit a new blog post in this SvelteKit portfolio. The publishing pipeline (listing, SEO meta, OG image, sitemap, RSS, related posts) is fully automated — your job is to produce a single valid Markdown file and commit it.

## Authoritative reference

Read `docs/blog-post-template.md` before writing the file. That file defines the frontmatter schema, golden rules, and content constraints. This skill never overrides it — if anything here conflicts, the template wins.

## Inputs

The user will provide either:
- A full Markdown draft including a top-level `# Title`, or
- A title plus body content, or
- A pasted essay with no structure.

Treat the user's prose as the source of truth. Do not rewrite, summarize, or "improve" the body unless asked.

## Steps

1. **Derive the slug.** Lowercase, hyphenated, no stop words if avoidable, stable and descriptive. Examples: `ai-valuations-feedback-loops`, `why-sveltekit`. The slug is the URL — pick once.
2. **Build frontmatter.** Required fields: `title`, `description` (120–160 chars, single complete sentence), `date` (today, `'YYYY-MM-DD'` quoted — get from the system date), `keywords` (3–5, prefer existing tags from the template: `Engineering`, `SvelteKit`, `TypeScript`, `Performance`, `Security`, `AppSec`, `AI`, `Writing`, `Product`), `author: 'Santiago Vázquez Villarreal'`, `draft: false`.
3. **Strip the H1.** The page renders the H1 from frontmatter `title`. Remove any leading `# ...` from the body. Section headings use `##`.
4. **Verify links.** Every external link must resolve. If a URL looks fabricated or you can't confirm it, flag it to the user before writing — do not invent replacements.
5. **No raw HTML, no `<script>`, no `<style>`, no `<!-- comments -->`.** Plain Markdown only. Convert callout syntax like `> [!image]` into a plain blockquote.
6. **Write the file** at `src/lib/content/blog/<slug>.md` using the Write tool.
7. **Validate.** Run `pnpm build` from the repo root. This catches frontmatter errors, broken links inside the mdsvex pipeline, and prerender failures. If it fails, fix and re-run. Do not skip this step — a malformed post breaks the entire site build.
8. **Commit.** Stage only the new file:
   ```
   git add src/lib/content/blog/<slug>.md
   git commit -m "$(cat <<'EOF'
   blog: <slug>

   <one-line summary of the post>

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   EOF
   )"
   ```
   Do **not** push unless the user asks. Do **not** run `pnpm format` repo-wide (see user memory).

## After committing

Report: the slug, the local URL (`http://localhost:5173/blog/<slug>`), and the commit SHA. Ask whether to push.

## Things to refuse

- Writing a post with fabricated URLs.
- Committing without a successful `pnpm build`.
- Editing other blog posts or unrelated files in the same commit.
- Setting `draft: false` on a post the user explicitly called a draft.
