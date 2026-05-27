<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { personalInfo } from '$lib/constants';

	let { children } = $props();
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Santiago Vazquez — Blog"
		href="/blog/rss.xml"
	/>
</svelte:head>

<div data-load="navbar">
	<Navbar
		brand={personalInfo.shortName}
		ctaHref="/#contact"
		links={[
			{ label: 'Work', href: '/#artifacts' },
			{ label: 'Process', href: '/#process' },
			{ label: 'Archive', href: '/#archive' },
			{ label: 'Blog', href: '/blog' }
		]}
	/>
</div>

<main id="main-content" class="blog-shell">
	{@render children()}
</main>

<footer class="blog-footer">
	<div class="blog-footer-inner">
		<span class="footer-name">{personalInfo.name}</span>
		<nav class="footer-links" aria-label="Footer">
			<a href="/">Home</a>
			<a href="/blog">Blog</a>
			<a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
			<a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
		</nav>
		<span class="footer-copy">© {year}</span>
	</div>
</footer>

<style>
	.blog-shell {
		max-width: 760px;
		margin: 0 auto;
		padding: 9rem 1.5rem 5rem;
		min-height: 100vh;
	}

	.blog-footer {
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		padding: 2.5rem 1.5rem;
	}

	.blog-footer-inner {
		max-width: 760px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		color: color-mix(in srgb, var(--color-ink) 65%, transparent);
	}

	.footer-links {
		display: flex;
		gap: 1.25rem;
	}

	.footer-links a {
		color: inherit;
		text-decoration: none;
		text-transform: uppercase;
		transition: color var(--duration-normal) ease;
	}

	.footer-links a:hover {
		color: var(--color-accent);
	}

	.footer-name {
		font-family: var(--font-headline);
		color: var(--color-ink);
	}
</style>
