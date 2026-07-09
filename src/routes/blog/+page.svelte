<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { siteUrl, meta } from '$lib/constants';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const PAGE_SIZE = 6;

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
	const formatDate = (iso: string) => dateFmt.format(new Date(iso));

	// Distinct topics across all posts, most common first.
	const tags = $derived(
		[...new Set(data.posts.flatMap((p) => p.keywords))].sort((a, b) => a.localeCompare(b))
	);

	// The URL query string is the source of truth for filter + page, so views
	// are shareable and the back button works. Query params can't be read while
	// prerendering, so the static page renders the unfiltered first page and the
	// client applies the query after hydration.
	const activeTag = $derived(browser ? page.url.searchParams.get('tag') : null);
	const requestedPage = $derived(
		browser ? Math.max(1, Number(page.url.searchParams.get('page')) || 1) : 1
	);

	const filtered = $derived(
		activeTag ? data.posts.filter((p) => p.keywords.includes(activeTag)) : data.posts
	);
	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const currentPage = $derived(Math.min(requestedPage, totalPages));
	const pagePosts = $derived(
		filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	// Build the canonical /blog URL for a given filter + page. Used as real
	// anchor hrefs so the controls are plain links: clickable before/without
	// hydration, shareable, and indexable. data-sveltekit-* attributes on the
	// links keep the original UX (replace history instead of stacking entries,
	// no scroll jump when re-filtering).
	function hrefFor(tag: string | null, p: number) {
		const params = new URLSearchParams();
		if (tag) params.set('tag', tag);
		if (p > 1) params.set('page', String(p));
		const qs = params.toString();
		return qs ? `/blog?${qs}` : '/blog';
	}

	// Clicking the active tag again clears the filter (toggle behaviour).
	const tagHref = (tag: string) => hrefFor(activeTag === tag ? null : tag, 1);

	const pageTitle = 'Blog — Santiago Vazquez';
	const pageDescription =
		'Notes and news from Santiago Vazquez on full-stack engineering, SvelteKit, serverless architecture, AI, and building products that scale.';

	// Blog + ItemList structured data so search engines can surface posts.
	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'Blog',
			name: pageTitle,
			description: pageDescription,
			url: `${siteUrl}/blog`,
			author: { '@type': 'Person', name: 'Santiago Vázquez Villarreal', url: siteUrl }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: data.posts.map((post, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${siteUrl}/blog/${post.slug}`,
				name: post.title
			}))
		}
	]);
</script>

<Seo
	title={pageTitle}
	description={pageDescription}
	path="/blog"
	keywords={[...meta.keywords, 'Blog', 'Engineering', 'Tutorials']}
	{jsonLd}
/>

<header class="blog-header">
	<span class="eyebrow">Writing</span>
	<h1>Blog</h1>
	<p class="lede">{pageDescription}</p>
</header>

{#if tags.length}
	<nav class="tag-filter" aria-label="Filter posts by topic">
		<a
			class="filter-chip"
			class:active={!activeTag}
			aria-current={!activeTag ? 'true' : undefined}
			href={hrefFor(null, 1)}
			data-sveltekit-replacestate
			data-sveltekit-noscroll
			data-cursor-hover
		>
			All
		</a>
		{#each tags as tag (tag)}
			<a
				class="filter-chip"
				class:active={activeTag === tag}
				aria-current={activeTag === tag ? 'true' : undefined}
				href={tagHref(tag)}
				data-sveltekit-replacestate
				data-sveltekit-noscroll
				data-cursor-hover
			>
				{tag}
			</a>
		{/each}
	</nav>
{/if}

{#if filtered.length === 0}
	<p class="empty">
		{#if activeTag}
			No posts tagged "{activeTag}" yet.
		{:else}
			No posts yet — check back soon.
		{/if}
	</p>
{:else}
	<ul class="post-list">
		{#each pagePosts as post (post.slug)}
			<li class="post-item">
				<a class="post-link" href="/blog/{post.slug}" data-cursor-hover>
					<div class="post-meta">
						<time datetime={post.date}>{formatDate(post.date)}</time>
						<span aria-hidden="true">·</span>
						<span>{post.readingTime} min read</span>
					</div>
					<h2 class="post-title">{post.title}</h2>
					<p class="post-desc">{post.description}</p>
				</a>
				{#if post.keywords.length}
					<ul class="tag-list" aria-label="Filter by topic">
						{#each post.keywords.slice(0, 4) as tag (tag)}
							<li>
								<a
									class="tag-pill"
									class:active={activeTag === tag}
									aria-current={activeTag === tag ? 'true' : undefined}
									href={tagHref(tag)}
									data-sveltekit-replacestate
									data-sveltekit-noscroll
									data-cursor-hover
								>
									{tag}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>

	{#if totalPages > 1}
		<nav class="pagination" aria-label="Pagination">
			{#if currentPage === 1}
				<span class="page-btn" aria-disabled="true">← Prev</span>
			{:else}
				<a
					class="page-btn"
					href={hrefFor(activeTag, currentPage - 1)}
					data-sveltekit-replacestate
					rel="prev"
					data-cursor-hover
				>
					← Prev
				</a>
			{/if}
			<span class="page-status">Page {currentPage} of {totalPages}</span>
			{#if currentPage === totalPages}
				<span class="page-btn" aria-disabled="true">Next →</span>
			{:else}
				<a
					class="page-btn"
					href={hrefFor(activeTag, currentPage + 1)}
					data-sveltekit-replacestate
					rel="next"
					data-cursor-hover
				>
					Next →
				</a>
			{/if}
		</nav>
	{/if}
{/if}

<style>
	.blog-header {
		margin-bottom: 2.5rem;
	}

	.eyebrow {
		display: inline-block;
		margin-bottom: 1rem;
		font-family: var(--font-data);
		font-size: 0.7rem;
		letter-spacing: var(--tracking-widest, 0.2em);
		text-transform: uppercase;
		color: var(--color-accent-deep, var(--color-accent));
	}

	h1 {
		font-family: var(--font-headline);
		font-size: clamp(2.75rem, 8vw, 4.5rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: var(--tracking-tight);
		color: var(--color-ink);
		margin: 0 0 1.25rem;
	}

	.lede {
		max-width: 48ch;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--color-ink) 75%, transparent);
	}

	/* Tag filter */
	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 3rem;
	}

	.filter-chip {
		display: inline-block;
		font-family: var(--font-data);
		font-size: 0.7rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		padding: 0.45rem 0.85rem;
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
		background: transparent;
		color: color-mix(in srgb, var(--color-ink) 65%, transparent);
		cursor: pointer;
		transition:
			background var(--duration-normal) ease,
			color var(--duration-normal) ease,
			border-color var(--duration-normal) ease;
	}
	.filter-chip:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
	.filter-chip.active {
		background: var(--color-ink);
		border-color: var(--color-ink);
		color: var(--color-base);
	}

	.post-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.post-item {
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}
	.post-item:last-child {
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.post-link {
		display: block;
		padding: 2.25rem 0 1.25rem;
		text-decoration: none;
		color: inherit;
		transition:
			padding var(--duration-normal) var(--ease-smooth),
			background var(--duration-normal) ease;
	}

	.post-link:hover {
		padding-left: 1rem;
		padding-right: 1rem;
		background: color-mix(in srgb, var(--color-accent) 6%, transparent);
	}

	.post-meta {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ink) 55%, transparent);
		margin-bottom: 0.75rem;
	}

	.post-title {
		font-family: var(--font-headline);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 400;
		line-height: 1.1;
		color: var(--color-ink);
		margin: 0 0 0.6rem;
		transition: color var(--duration-normal) ease;
	}

	.post-link:hover .post-title {
		color: var(--color-accent);
	}

	.post-desc {
		max-width: 56ch;
		line-height: 1.55;
		color: color-mix(in srgb, var(--color-ink) 72%, transparent);
		margin: 0 0 1rem;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0 0 2.25rem;
	}

	.tag-list li {
		display: flex;
	}

	.tag-pill {
		display: inline-block;
		font-family: var(--font-data);
		font-size: 0.65rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		padding: 0.3rem 0.6rem;
		border-radius: var(--radius-full);
		border: 1px solid transparent;
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
		color: color-mix(in srgb, var(--color-ink) 65%, transparent);
		cursor: pointer;
		transition:
			background var(--duration-normal) ease,
			color var(--duration-normal) ease,
			border-color var(--duration-normal) ease;
	}

	.tag-pill:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.tag-pill.active {
		background: var(--color-ink);
		color: var(--color-base);
	}

	/* Pagination */
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
	}
	.page-btn {
		display: inline-block;
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		padding: 0.6rem 1.1rem;
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
		background: transparent;
		color: var(--color-ink);
		cursor: pointer;
		transition:
			border-color var(--duration-normal) ease,
			color var(--duration-normal) ease,
			opacity var(--duration-normal) ease;
	}
	.page-btn:hover:not([aria-disabled='true']) {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
	.page-btn[aria-disabled='true'] {
		opacity: 0.35;
		cursor: default;
	}
	.page-status {
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ink) 55%, transparent);
	}

	.empty {
		font-family: var(--font-data);
		color: color-mix(in srgb, var(--color-ink) 60%, transparent);
	}
</style>
