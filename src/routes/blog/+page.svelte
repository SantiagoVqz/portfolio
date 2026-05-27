<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { siteUrl, meta } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const formatDate = (iso: string) => dateFmt.format(new Date(iso));

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

{#if data.posts.length === 0}
	<p class="empty">No posts yet — check back soon.</p>
{:else}
	<ul class="post-list">
		{#each data.posts as post (post.slug)}
			<li class="post-item">
				<a class="post-link" href="/blog/{post.slug}" data-cursor-hover>
					<div class="post-meta">
						<time datetime={post.date}>{formatDate(post.date)}</time>
						<span aria-hidden="true">·</span>
						<span>{post.readingTime} min read</span>
					</div>
					<h2 class="post-title">{post.title}</h2>
					<p class="post-desc">{post.description}</p>
					{#if post.keywords.length}
						<ul class="tag-list" aria-label="Topics">
							{#each post.keywords.slice(0, 4) as tag (tag)}
								<li>{tag}</li>
							{/each}
						</ul>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.blog-header {
		margin-bottom: 4rem;
	}

	.eyebrow {
		display: inline-block;
		margin-bottom: 1rem;
		font-family: var(--font-data);
		font-size: 0.7rem;
		letter-spacing: var(--tracking-widest, 0.2em);
		text-transform: uppercase;
		color: var(--color-accent);
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
		padding: 2.25rem 0;
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

	.empty {
		font-family: var(--font-data);
		color: color-mix(in srgb, var(--color-ink) 60%, transparent);
	}
</style>
