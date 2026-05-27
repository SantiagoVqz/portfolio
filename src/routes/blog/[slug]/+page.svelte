<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { postComponents } from '$lib/blog';
	import { siteUrl, personalInfo } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const post = $derived(data.post);
	const Content = $derived(postComponents[post.slug]);

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
	const formatDate = (iso: string) => dateFmt.format(new Date(iso));

	const url = $derived(`${siteUrl}/blog/${post.slug}`);
	const author = $derived(post.author ?? personalInfo.name);

	// Social share image: an explicit cover wins, otherwise the auto-generated
	// per-post card at /blog/[slug]/og.png.
	const ogImage = $derived(post.cover ?? `/blog/${post.slug}/og.png`);

	const dateFmtShort = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
	const formatShort = (iso: string) => dateFmtShort.format(new Date(iso));

	// Article structured data — datePublished/dateModified, author, keywords.
	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.updated ?? post.date,
		author: { '@type': 'Person', name: author, url: siteUrl },
		publisher: { '@type': 'Person', name: personalInfo.name, url: siteUrl },
		image: new URL(ogImage, siteUrl).href,
		keywords: post.keywords.join(', '),
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url }
	});
</script>

<Seo
	title={`${post.title} — Santiago Vazquez`}
	description={post.description}
	path={`/blog/${post.slug}`}
	keywords={post.keywords}
	image={ogImage}
	type="article"
	article={{
		publishedTime: post.date,
		modifiedTime: post.updated ?? post.date,
		author,
		tags: post.keywords
	}}
	{jsonLd}
/>

<article class="post">
	<a class="back-link" href="/blog" data-cursor-hover>← All posts</a>

	<header class="post-header">
		<div class="post-meta">
			<time datetime={post.date}>{formatDate(post.date)}</time>
			<span aria-hidden="true">·</span>
			<span>{post.readingTime} min read</span>
			{#if post.updated && post.updated !== post.date}
				<span aria-hidden="true">·</span>
				<span>Updated {formatDate(post.updated)}</span>
			{/if}
		</div>
		<h1>{post.title}</h1>
		<p class="post-lede">{post.description}</p>
		{#if post.keywords.length}
			<ul class="tag-list" aria-label="Topics">
				{#each post.keywords as tag (tag)}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>

	{#if post.cover}
		<img class="post-cover" src={post.cover} alt={post.coverAlt ?? post.title} loading="lazy" />
	{/if}

	<div class="post-body prose">
		<Content />
	</div>
</article>

{#if data.prev || data.next}
	<nav class="post-pager" aria-label="More posts">
		{#if data.prev}
			<a class="pager-link prev" href="/blog/{data.prev.slug}" data-cursor-hover>
				<span class="pager-dir">← Older</span>
				<span class="pager-title">{data.prev.title}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="pager-link next" href="/blog/{data.next.slug}" data-cursor-hover>
				<span class="pager-dir">Newer →</span>
				<span class="pager-title">{data.next.title}</span>
			</a>
		{/if}
	</nav>
{/if}

{#if data.related.length}
	<aside class="related" aria-label="Related posts">
		<h2 class="related-heading">Related reading</h2>
		<ul class="related-list">
			{#each data.related as rel (rel.slug)}
				<li>
					<a class="related-link" href="/blog/{rel.slug}" data-cursor-hover>
						<span class="related-date">{formatShort(rel.date)}</span>
						<span class="related-title">{rel.title}</span>
						<span class="related-desc">{rel.description}</span>
					</a>
				</li>
			{/each}
		</ul>
	</aside>
{/if}

<style>
	.post {
		display: flex;
		flex-direction: column;
	}

	.back-link {
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		text-decoration: none;
		color: color-mix(in srgb, var(--color-ink) 60%, transparent);
		margin-bottom: 2.5rem;
		transition: color var(--duration-normal) ease;
	}
	.back-link:hover {
		color: var(--color-accent);
	}

	.post-header {
		margin-bottom: 2.5rem;
	}

	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ink) 55%, transparent);
		margin-bottom: 1.25rem;
	}

	h1 {
		font-family: var(--font-headline);
		font-size: clamp(2.25rem, 6vw, 3.5rem);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: var(--tracking-tight);
		color: var(--color-ink);
		margin: 0 0 1.25rem;
	}

	.post-lede {
		font-size: 1.15rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--color-ink) 75%, transparent);
		margin: 0 0 1.5rem;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.tag-list li {
		font-family: var(--font-data);
		font-size: 0.65rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		padding: 0.3rem 0.6rem;
		border-radius: var(--radius-full);
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
		color: color-mix(in srgb, var(--color-ink) 65%, transparent);
	}

	.post-cover {
		width: 100%;
		height: auto;
		border-radius: var(--radius-lg, 1rem);
		margin-bottom: 2.5rem;
	}

	/* Long-form typography for the rendered Markdown body. */
	.post-body {
		font-size: 1.0625rem;
		line-height: 1.75;
		color: color-mix(in srgb, var(--color-ink) 88%, transparent);
	}

	.post-body :global(h2) {
		font-family: var(--font-headline);
		font-size: 1.75rem;
		font-weight: 400;
		line-height: 1.2;
		color: var(--color-ink);
		margin: 2.75rem 0 1rem;
	}
	.post-body :global(h3) {
		font-family: var(--font-headline);
		font-size: 1.35rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 2rem 0 0.75rem;
	}
	.post-body :global(p) {
		margin: 0 0 1.35rem;
	}
	.post-body :global(a) {
		color: var(--color-accent);
		text-underline-offset: 3px;
	}
	.post-body :global(ul),
	.post-body :global(ol) {
		margin: 0 0 1.35rem;
		padding-left: 1.4rem;
	}
	.post-body :global(li) {
		margin-bottom: 0.5rem;
	}
	.post-body :global(blockquote) {
		margin: 1.75rem 0;
		padding-left: 1.25rem;
		border-left: 3px solid var(--color-accent);
		font-style: italic;
		color: color-mix(in srgb, var(--color-ink) 70%, transparent);
	}
	.post-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius-md, 0.75rem);
		margin: 1.75rem 0;
	}
	.post-body :global(code) {
		font-family: var(--font-data);
		font-size: 0.875em;
		background: color-mix(in srgb, var(--color-ink) 8%, transparent);
		padding: 0.15em 0.4em;
		border-radius: 0.35rem;
	}
	.post-body :global(pre) {
		background: var(--color-ink);
		color: var(--color-base);
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius-md, 0.75rem);
		overflow-x: auto;
		margin: 1.75rem 0;
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.post-body :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}
	.post-body :global(hr) {
		border: none;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
		margin: 2.5rem 0;
	}

	/* Prev / next pager */
	.post-pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 4rem;
		padding-top: 2.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.pager-link {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		text-decoration: none;
		color: inherit;
		transition: transform var(--duration-normal) var(--ease-smooth);
	}
	.pager-link.next {
		text-align: right;
		align-items: flex-end;
	}
	.pager-link:hover {
		transform: translateY(-2px);
	}

	.pager-dir {
		font-family: var(--font-data);
		font-size: 0.7rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-accent);
	}
	.pager-title {
		font-family: var(--font-headline);
		font-size: 1.15rem;
		line-height: 1.2;
		color: var(--color-ink);
	}

	/* Related posts */
	.related {
		margin-top: 4rem;
		padding-top: 2.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}
	.related-heading {
		font-family: var(--font-data);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-widest, 0.2em);
		text-transform: uppercase;
		color: var(--color-accent);
		margin: 0 0 1.5rem;
	}
	.related-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	.related-link {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 1.25rem;
		row-gap: 0.25rem;
		padding: 1.25rem 0;
		text-decoration: none;
		color: inherit;
		border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		transition: padding var(--duration-normal) var(--ease-smooth);
	}
	.related-link:hover {
		padding-left: 0.75rem;
	}
	.related-date {
		font-family: var(--font-data);
		font-size: 0.7rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ink) 50%, transparent);
		padding-top: 0.25rem;
	}
	.related-title {
		font-family: var(--font-headline);
		font-size: 1.15rem;
		line-height: 1.2;
		color: var(--color-ink);
		transition: color var(--duration-normal) ease;
	}
	.related-link:hover .related-title {
		color: var(--color-accent);
	}
	.related-desc {
		grid-column: 2;
		font-size: 0.9rem;
		line-height: 1.5;
		color: color-mix(in srgb, var(--color-ink) 65%, transparent);
	}

	@media (max-width: 640px) {
		.post-pager {
			grid-template-columns: 1fr;
		}
		.pager-link.next {
			text-align: left;
			align-items: flex-start;
		}
		.related-link {
			grid-template-columns: 1fr;
		}
		.related-desc {
			grid-column: 1;
		}
	}
</style>
