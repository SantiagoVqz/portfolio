/**
 * Blog data layer
 *
 * Posts are authored as Markdown files in `src/lib/content/blog/*.md` with
 * YAML frontmatter. mdsvex compiles each file to a Svelte component (the
 * `default` export) and exposes the frontmatter as a `metadata` export.
 *
 * This module collects every post at build time via `import.meta.glob`,
 * derives the slug from the filename, and computes an estimated reading
 * time from the raw Markdown body.
 */
import type { Component } from 'svelte';

export interface Frontmatter {
	title: string;
	description: string;
	/** ISO date string, e.g. "2026-05-27" */
	date: string;
	/** ISO date string for the last meaningful edit (optional) */
	updated?: string;
	keywords?: string[];
	/** Absolute path to a cover image served from /static, e.g. "/blog/foo.png" */
	cover?: string;
	coverAlt?: string;
	author?: string;
	/** Drafts are excluded from listings, sitemap, and RSS */
	draft?: boolean;
}

export interface PostMeta extends Frontmatter {
	slug: string;
	keywords: string[];
	/** Estimated reading time in minutes (>= 1) */
	readingTime: number;
}

interface MdModule {
	default: Component;
	metadata: Frontmatter;
}

const WORDS_PER_MINUTE = 200;

// Compiled components + frontmatter for every post.
const modules = import.meta.glob<MdModule>('/src/lib/content/blog/*.md', { eager: true });
// Raw Markdown source, used purely to estimate reading time.
const sources = import.meta.glob<string>('/src/lib/content/blog/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

function estimateReadingTime(raw: string): number {
	const body = raw.replace(/^---[\s\S]*?---/, '');
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** All posts (including drafts), newest first. */
export const posts: PostMeta[] = Object.entries(modules)
	.map(([path, mod]) => {
		const slug = slugFromPath(path);
		const fm = mod.metadata;
		return {
			...fm,
			slug,
			keywords: fm.keywords ?? [],
			readingTime: estimateReadingTime(sources[path] ?? '')
		} satisfies PostMeta;
	})
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/** Map of slug -> compiled post component, for rendering in the route. */
export const postComponents: Record<string, Component> = Object.fromEntries(
	Object.entries(modules).map(([path, mod]) => [slugFromPath(path), mod.default])
);

const isPublished = (p: PostMeta) => !p.draft;

/** Published posts only (drafts hidden), newest first. */
export function getPublishedPosts(): PostMeta[] {
	return posts.filter(isPublished);
}

/** Look up a single published post by slug. */
export function getPost(slug: string): PostMeta | undefined {
	return posts.find((p) => p.slug === slug && isPublished(p));
}
