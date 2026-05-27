<script lang="ts">
	import { siteUrl, personalInfo } from '$lib/constants';

	interface ArticleMeta {
		publishedTime: string;
		modifiedTime?: string;
		author?: string;
		tags?: string[];
	}

	interface Props {
		title: string;
		description: string;
		/** Path beginning with "/", appended to siteUrl for the canonical URL */
		path?: string;
		keywords?: string[];
		/** Absolute URL or "/"-rooted path to the social share image */
		image?: string;
		type?: 'website' | 'article';
		/** Present only for type="article" — drives og:article + JSON-LD */
		article?: ArticleMeta;
		/** Inline JSON-LD object(s) to emit verbatim */
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
		noindex?: boolean;
	}

	let {
		title,
		description,
		path = '/',
		keywords = [],
		image = '/memoji.png',
		type = 'website',
		article,
		jsonLd,
		noindex = false
	}: Props = $props();

	const canonical = $derived(new URL(path, siteUrl).href);
	const absImage = $derived(image.startsWith('http') ? image : new URL(image, siteUrl).href);
	const robots = $derived(noindex ? 'noindex, nofollow' : 'index, follow');

	// Serialize JSON-LD safely for inline injection. Every "<" is escaped so a
	// stray closing script sequence inside content can't break out of the tag.
	const jsonLdBlocks = $derived(
		(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []).map((block) =>
			JSON.stringify(block).replaceAll('<', '\\u003c')
		)
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="author" content={article?.author ?? personalInfo.name} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={absImage} />
	<meta property="og:image:alt" content={`${title} — social preview`} />
	<meta property="og:site_name" content="Santiago Vazquez Portfolio" />
	<meta property="og:locale" content="en_US" />
	{#if type === 'article' && article}
		<meta property="article:published_time" content={article.publishedTime} />
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		<meta property="article:author" content={article.author ?? personalInfo.name} />
		{#each article.tags ?? [] as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absImage} />
	<meta name="twitter:creator" content="@santivqzv" />

	<!-- JSON-LD structured data -->
	{#each jsonLdBlocks as block (block)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${block}</script>`}
	{/each}
</svelte:head>
