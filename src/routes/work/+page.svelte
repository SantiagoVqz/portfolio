<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ProjectCompact from '$lib/components/ProjectCompact.svelte';
	import CaseStudyModal from '$lib/components/CaseStudyModal.svelte';
	import { personalInfo, projects, meta, siteUrl } from '$lib/constants';
	import type { Project, ProjectCategory } from '$lib/constants/profile';

	const year = new Date().getFullYear();

	// Filter options. Order is intentional — most prominent work first.
	const filters: { label: string; value: ProjectCategory | 'all' }[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Client', value: 'client' },
		{ label: 'Startup', value: 'startup' },
		{ label: 'Personal', value: 'personal' }
	];

	// The URL query string is the source of truth for the filter, so views are
	// shareable and the back button works. Query params can't be read while
	// prerendering, so the static page renders unfiltered and the client applies
	// the query after hydration.
	const activeCategory = $derived(browser ? page.url.searchParams.get('category') : null);

	const filtered = $derived(
		activeCategory && activeCategory !== 'all'
			? projects.filter((p) => p.category === activeCategory)
			: projects
	);

	function hrefFor(value: ProjectCategory | 'all') {
		return value === 'all' ? '/work' : `/work?category=${value}`;
	}

	// Case study modal state
	let caseStudyProject = $state<Project | null>(null);
	let caseStudyOpen = $state(false);

	function openCaseStudy(project: Project) {
		caseStudyProject = project;
		caseStudyOpen = true;
	}

	function closeCaseStudy() {
		caseStudyOpen = false;
		caseStudyProject = null;
	}

	const pageTitle = 'Work — Santiago Vazquez';
	const pageDescription =
		'The full archive of products Santiago Vazquez has shipped — client platforms, co-founded startups, and personal tools across full-stack, AI, and mobile.';

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: pageTitle,
			description: pageDescription,
			url: `${siteUrl}/work`
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: projects.map((p, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: p.title,
				description: p.description
			}))
		}
	];
</script>

<Seo
	title={pageTitle}
	description={pageDescription}
	path="/work"
	keywords={[...meta.keywords, 'Projects', 'Portfolio', 'Case Studies']}
	{jsonLd}
/>

<div data-load="navbar">
	<Navbar
		brand={personalInfo.shortName}
		ctaHref="/#contact"
		links={[
			{ label: 'Home', href: '/' },
			{ label: 'Work', href: '/work' },
			{ label: 'Process', href: '/#process' },
			{ label: 'Blog', href: '/blog' },
			{ label: 'Contact', href: '/#contact' }
		]}
	/>
</div>

<main id="main-content" class="work-shell">
	<header class="work-header">
		<span class="eyebrow">The Full Archive</span>
		<h1>Work</h1>
		<p class="lede">{pageDescription}</p>
	</header>

	<nav class="filter-bar" aria-label="Filter projects by type">
		{#each filters as filter (filter.value)}
			{@const isActive =
				filter.value === 'all' ? !activeCategory : activeCategory === filter.value}
			<a
				class="filter-chip"
				class:active={isActive}
				aria-current={isActive ? 'true' : undefined}
				href={hrefFor(filter.value)}
				data-sveltekit-replacestate
				data-sveltekit-noscroll
				data-cursor-hover
			>
				{filter.label}
			</a>
		{/each}
	</nav>

	{#if filtered.length === 0}
		<p class="empty">Nothing here yet — check back soon.</p>
	{:else}
		<div class="project-grid">
			{#each filtered as project, i (project.id)}
				<ProjectCompact {project} index={i} onViewCaseStudy={() => openCaseStudy(project)} />
			{/each}
		</div>
	{/if}
</main>

<footer class="work-footer">
	<div class="work-footer-inner">
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

<CaseStudyModal project={caseStudyProject} open={caseStudyOpen} onClose={closeCaseStudy} />

<style>
	.work-shell {
		max-width: 1200px;
		margin: 0 auto;
		padding: 9rem 1.5rem 5rem;
		min-height: 100vh;
	}

	.work-header {
		margin-bottom: 2.5rem;
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
		max-width: 56ch;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--color-ink) 75%, transparent);
	}

	/* Filter bar */
	.filter-bar {
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

	/* Grid */
	.project-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.project-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.project-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.empty {
		font-family: var(--font-data);
		color: color-mix(in srgb, var(--color-ink) 60%, transparent);
	}

	/* Footer */
	.work-footer {
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		padding: 2.5rem 1.5rem;
	}

	.work-footer-inner {
		max-width: 1200px;
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
