<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { magnetic } from '$lib/actions/magnetic';
	import { revealWithExit } from '$lib/actions/reveal';
	import { textReveal } from '$lib/actions/textReveal';
	import { pageLoad } from '$lib/actions/pageLoad';
	import Navbar from '$lib/components/Navbar.svelte';
	import GenerativeMesh from '$lib/components/GenerativeMesh.svelte';
	import CaseStudyModal from '$lib/components/CaseStudyModal.svelte';
	import DisplayCabinet from '$lib/components/DisplayCabinet.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { getPublishedPosts } from '$lib/blog';

	import {
		personalInfo,
		technicalSkills,
		languages,
		projects,
		meta,
		siteUrl,
		timelineData
	} from '$lib/constants';

	import type { Project } from '$lib/constants/profile';

	// Latest writing, surfaced on the home page (full archive lives at /blog).
	const recentPosts = getPublishedPosts().slice(0, 3);

	// A short month-year label for writing rows, e.g. "Jun 2026".
	const postDate = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

	// Structured data for the home page: who I am (Person), the site itself
	// (WebSite), and the in-page section nav (BreadcrumbList).
	const homeJsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: personalInfo.name,
			url: siteUrl,
			image: `${siteUrl}/memoji.png`,
			jobTitle: personalInfo.title,
			description: meta.description,
			email: `mailto:${personalInfo.email}`,
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Monterrey',
				addressCountry: 'MX'
			},
			sameAs: [personalInfo.social.github, personalInfo.social.linkedin],
			knowsAbout: ['TypeScript', 'SvelteKit', 'React', 'Node.js', 'AWS', 'AI/ML', 'IoT', 'PostgreSQL']
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'Santiago Vazquez Portfolio',
			url: siteUrl,
			description: meta.description,
			author: { '@type': 'Person', name: personalInfo.name }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
				{ '@type': 'ListItem', position: 2, name: 'Work', item: `${siteUrl}#work` },
				{ '@type': 'ListItem', position: 3, name: 'Tools', item: `${siteUrl}#tools` },
				{ '@type': 'ListItem', position: 4, name: 'Timeline', item: `${siteUrl}#timeline` },
				{ '@type': 'ListItem', position: 5, name: 'Writing', item: `${siteUrl}#writing` },
				{ '@type': 'ListItem', position: 6, name: 'Contact', item: `${siteUrl}#contact` }
			]
		}
	];

	// Home shows a short, uniform list of featured work; the full archive is /work.
	const featuredProjects = $derived(projects.filter((p) => p.featured));

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

	// Section morph — scroll-driven background color transitions
	onMount(() => {
		if (!browser) return;

		let ctx: gsap.Context | null = null;

		const initScrollMorphs = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				// Reveal each list row (work + writing) as it enters the viewport.
				const rows = document.querySelectorAll('.list-row');
				rows.forEach((item) => {
					gsap.fromTo(
						item,
						{ opacity: 0, y: 24 },
						{
							opacity: 1,
							y: 0,
							duration: 0.7,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: item,
								start: 'top 90%',
								toggleActions: 'play none none reverse'
							}
						}
					);
				});

				// Draw the timeline's vertical line as the section scrolls through.
				const line = document.querySelector('.timeline-line');
				if (line) {
					gsap.fromTo(
						line,
						{ scaleY: 0, transformOrigin: 'top' },
						{
							scaleY: 1,
							ease: 'none',
							scrollTrigger: {
								trigger: '#timeline',
								start: 'top 70%',
								end: 'bottom 80%',
								scrub: true
							}
						}
					);
				}
			});
		};

		initScrollMorphs();

		return () => ctx?.revert();
	});
</script>

<Seo
	title={meta.title}
	description={meta.description}
	path="/"
	keywords={[...meta.keywords, 'Software Developer', 'AI', 'IoT', 'Monterrey', 'Mexico', personalInfo.name]}
	image="/memoji.png"
	jsonLd={homeJsonLd}
/>

<svelte:head>
	<!-- Theme & Mobile (not covered by <Seo>) -->
	<meta name="theme-color" content="#fdfcf8" />
	<meta name="msapplication-TileColor" content="#fdfcf8" />
</svelte:head>

<!-- Snippets -->
{#snippet sectionHead(title: string, description: string)}
	<h2
		class="font-serif text-3xl font-medium tracking-tight text-[--color-ink] md:text-4xl"
		style="font-family: var(--font-headline)"
	>
		{title}
	</h2>
	<p class="mt-3 max-w-xl text-[--color-ink]/50 text-sm md:text-base">
		{description}
	</p>
{/snippet}

<!-- Skip to Content - Accessibility -->
<a href="#main-content" class="skip-to-content">
	Skip to main content
</a>

<!-- Page Load Animation Wrapper -->
<div use:pageLoad={{ delay: 0.1, duration: 0.8 }}>

<!-- Navigation -->
<div data-load="navbar">
	<Navbar
		brand={personalInfo.shortName}
		links={[
			{ label: 'Work', href: '#work' },
			{ label: 'Tools', href: '#tools' },
			{ label: 'Timeline', href: '#timeline' },
			{ label: 'Writing', href: '/blog' },
			{ label: 'Contact', href: '#contact' }
		]}
	/>
</div>

<!-- Command Palette -->
<CommandPalette />

<!-- Case Study Modal -->
<CaseStudyModal
	project={caseStudyProject}
	open={caseStudyOpen}
	onClose={closeCaseStudy}
/>

<!-- Main Content Wrapper -->
<main id="main-content">

<!-- ═══════════════════════════════════════════════════════════════════════════
     HERO — statement-led, left-aligned. The idea leads; the name is a quiet label.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	id="hero"
	class="hero relative flex min-h-screen items-center overflow-hidden px-6 md:px-12 lg:px-20"
	aria-label="Introduction"
>
	<!-- Generative Mesh Background -->
	<GenerativeMesh />

	<!-- Content -->
	<div class="relative z-10 mx-auto w-full max-w-3xl" data-load="hero-content">
		<!-- Name, small -->
		<span
			class="mb-8 block font-mono text-[11px] tracking-[0.2em] text-[--color-ink]/40 uppercase"
		>
			{personalInfo.shortName}
		</span>

		<!-- Statement — the focal point -->
		<h1
			class="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-[--color-ink] md:text-5xl lg:text-[3.25rem]"
			style="font-family: var(--font-headline)"
			use:textReveal={{ stagger: 0.012, duration: 0.9, y: 40, rotationX: -40, delay: 0.2 }}
		>
			I turn hard, ambiguous problems into products that ship.
		</h1>

		<!-- Supporting line — the specifics, quieter -->
		<p
			data-load="hero-subtitle"
			class="mt-6 max-w-xl text-base leading-relaxed text-[--color-ink]/55 md:text-lg"
		>
			Engineer and builder. Lately: municipal AI for U.S. cities, IoT fulfillment, and a
			couple of startups.
		</p>

		<!-- Philosophies, distilled to one quiet line -->
		<p class="mt-5 font-mono text-[11px] tracking-[0.12em] text-[--color-ink]/35 lowercase">
			product-first · built to scale · shipped with tests
		</p>

		<!-- CTA -->
		<div data-load="hero-cta" class="mt-10">
			<a
				href="#work"
				class="group inline-flex items-center gap-4 font-mono text-xs tracking-widest text-[--color-ink]/60 uppercase transition-colors duration-500 hover:text-[--color-accent]"
				use:magnetic={{ strength: 0.3, duration: 0.5 }}
				data-cursor-hover
			>
				<span>see my work</span>
				<span class="h-[1px] w-8 bg-current transition-all duration-500 group-hover:w-12"></span>
				<span class="transition-transform duration-500 group-hover:translate-x-1">→</span>
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     WORK — uniform list of featured projects; a row opens its case study.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="work" class="relative px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Selected work">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Selected work', 'A few things I’ve built and shipped.')}
		</div>

		<ul class="mt-12 border-t border-[--color-ink]/10">
			{#each featuredProjects as project (project.id)}
				<li class="list-row border-b border-[--color-ink]/10">
					<button
						type="button"
						class="work-row group w-full py-6 text-left"
						onclick={() => openCaseStudy(project)}
						data-cursor-hover
						aria-label="View case study for {project.title}"
					>
						<div class="flex items-baseline justify-between gap-4">
							<span
								class="font-serif text-xl font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-2xl"
								style="font-family: var(--font-headline)"
							>
								{project.title}
							</span>
							<span class="shrink-0 font-mono text-xs text-[--color-ink]/40">{project.year}</span>
						</div>
						<p class="mt-2 max-w-xl text-sm text-[--color-ink]/55 md:text-base">
							{project.subtitle ?? project.description}
						</p>
						{#if project.tags?.length}
							<div class="mt-3 flex flex-wrap gap-x-3 gap-y-1">
								{#each project.tags.slice(0, 4) as tag (tag)}
									<span class="font-mono text-[10px] tracking-wide text-[--color-ink]/35 uppercase">{tag}</span>
								{/each}
							</div>
						{/if}
					</button>
				</li>
			{/each}
		</ul>

		<div class="mt-10">
			<a
				href="/work"
				class="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[--color-ink]/60 transition-colors duration-300 hover:text-[--color-accent]"
				use:magnetic={{ strength: 0.2, duration: 0.4 }}
				data-cursor-hover
			>
				<span>all work</span>
				<span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-1">→</span>
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     TOOLS — what I reach for, grouped by category (uniform tiles).
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="tools" class="relative bg-[--color-surface] px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Tools">
	<div class="relative z-10 mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Tools', 'What I reach for when building products.')}
		</div>

		<div class="mt-12">
			<DisplayCabinet skills={technicalSkills} />
		</div>

		<!-- Languages as plain text -->
		<div
			class="mt-10 flex flex-wrap items-baseline gap-x-2 gap-y-1"
			use:revealWithExit={{ blur: 8, y: 20, duration: 0.8, persist: true }}
		>
			<span class="font-mono text-[10px] tracking-widest text-[--color-ink]/40 uppercase">
				languages
			</span>
			<span class="text-sm text-[--color-ink]/60">
				{#each languages as lang, i (lang.name)}{i > 0 ? ', ' : ''}{lang.name} ({lang.proficiency}){/each}
			</span>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     TIMELINE — compact single column, newest first, with a scroll-drawn line.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="timeline" class="relative px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Timeline">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Timeline', 'From the classroom to the codebase.')}
		</div>

		<ol class="relative mt-12 pl-6">
			<!-- Drawn vertical line -->
			<span
				class="timeline-line pointer-events-none absolute top-2 bottom-2 left-[3px] w-[1px] bg-[--color-ink]/15"
				aria-hidden="true"
			></span>

			{#each [...timelineData].reverse() as item (item.title)}
				<li class="list-row relative pb-8 last:pb-0">
					<!-- Dot -->
					<span
						class="absolute top-[7px] -left-6 h-[7px] w-[7px] rounded-full"
						style="background: {item.type === 'milestone' ? 'var(--color-gold)' : item.type === 'work' ? 'var(--color-accent)' : 'var(--color-tension)'}"
						aria-hidden="true"
					></span>

					<div class="flex items-baseline gap-3">
						<span class="font-mono text-[11px] tracking-wide text-[--color-ink]/40">
							{item.year}{item.endYear ? `–${item.endYear}` : item.current ? '–now' : ''}
						</span>
					</div>
					<h3
						class="mt-1 font-serif text-lg font-medium text-[--color-ink]"
						style="font-family: var(--font-headline)"
					>
						{item.title}
						<span class="text-[--color-ink]/40">· {item.company}</span>
					</h3>
					<p class="mt-1 max-w-xl text-sm text-[--color-ink]/55">{item.description}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     WRITING — latest posts; full archive lives at /blog.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="writing" class="relative bg-[--color-surface] px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Recent writing">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Recent writing', 'Notes on engineering, AI, and shipping.')}
		</div>

		<ul class="mt-12 border-t border-[--color-ink]/10">
			{#each recentPosts as post (post.slug)}
				<li class="list-row border-b border-[--color-ink]/10">
					<a
						href="/blog/{post.slug}"
						class="group block py-6"
						data-cursor-hover
					>
						<div class="flex items-baseline justify-between gap-4">
							<span
								class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
								style="font-family: var(--font-headline)"
							>
								{post.title}
							</span>
							<span class="shrink-0 font-mono text-xs text-[--color-ink]/40">{postDate(post.date)}</span>
						</div>
						<p class="mt-2 max-w-xl text-sm text-[--color-ink]/55">{post.description}</p>
					</a>
				</li>
			{/each}
		</ul>

		<div class="mt-10">
			<a
				href="/blog"
				class="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[--color-ink]/60 transition-colors duration-300 hover:text-[--color-accent]"
				use:magnetic={{ strength: 0.2, duration: 0.4 }}
				data-cursor-hover
			>
				<span>all writing</span>
				<span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-1">→</span>
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     CONTACT — quiet hairline rows; same column + idiom as Work/Writing.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="contact" class="relative bg-[--color-base] px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Get in touch">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Get in touch', 'A technical partner, an idea to kick around — always open.')}
		</div>

		<ul class="mt-12 border-t border-[--color-ink]/10">
			<!-- Email -->
			<li class="list-row border-b border-[--color-ink]/10">
				<a
					href="mailto:{personalInfo.email}"
					class="group flex items-center justify-between gap-4 py-6"
					data-cursor-hover
					aria-label="Send email to {personalInfo.email}"
				>
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
						style="font-family: var(--font-headline)"
					>
						{personalInfo.email}
					</span>
					<span aria-hidden="true" class="font-mono text-sm text-[--color-ink]/40 transition-transform duration-300 group-hover:translate-x-1">→</span>
				</a>
			</li>

			<!-- GitHub -->
			<li class="list-row border-b border-[--color-ink]/10">
				<a
					href={personalInfo.social.github}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center justify-between gap-4 py-6"
					data-cursor-hover
					aria-label="View GitHub profile (opens in new tab)"
				>
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
						style="font-family: var(--font-headline)"
					>
						GitHub
					</span>
					<span aria-hidden="true" class="font-mono text-sm text-[--color-ink]/40 transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</a>
			</li>

			<!-- LinkedIn -->
			<li class="list-row border-b border-[--color-ink]/10">
				<a
					href={personalInfo.social.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center justify-between gap-4 py-6"
					data-cursor-hover
					aria-label="Connect on LinkedIn (opens in new tab)"
				>
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
						style="font-family: var(--font-headline)"
					>
						LinkedIn
					</span>
					<span aria-hidden="true" class="font-mono text-sm text-[--color-ink]/40 transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</a>
			</li>

			<!-- Resume -->
			<li class="list-row border-b border-[--color-ink]/10">
				<a
					href="/resume.pdf"
					download="Santiago_Vazquez_Resume.pdf"
					class="group flex items-center justify-between gap-4 py-6"
					data-cursor-hover
					aria-label="Download resume as PDF"
				>
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
						style="font-family: var(--font-headline)"
					>
						Resume <span class="text-[--color-ink]/40">(PDF)</span>
					</span>
					<span aria-hidden="true" class="font-mono text-sm text-[--color-ink]/40 transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
				</a>
			</li>

			<!-- Phone -->
			<li class="list-row border-b border-[--color-ink]/10">
				<a
					href="tel:{personalInfo.phone}"
					class="group flex items-center justify-between gap-4 py-6"
					data-cursor-hover
					aria-label="Call {personalInfo.phone}"
				>
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl"
						style="font-family: var(--font-headline)"
					>
						Phone <span class="text-[--color-ink]/40">· {personalInfo.phone}</span>
					</span>
					<span aria-hidden="true" class="font-mono text-sm text-[--color-ink]/40 transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</a>
			</li>
		</ul>

		<!-- npm joke — a quiet personality beat -->
		<p class="mt-10 max-w-xl font-serif text-base italic text-[--color-ink]/50" style="font-family: var(--font-headline)">
			This portfolio has 0 npm packages with security vulnerabilities. I checked.
		</p>

		<!-- Location, one quiet line -->
		<p class="mt-8 font-mono text-[11px] tracking-wide text-[--color-ink]/30">
			Monterrey · CST (UTC−6)
		</p>
	</div>
</section>

</main>
<!-- End Main Content Wrapper -->

<!-- Footer -->
<footer class="border-t border-[--color-ink]/5 bg-[--color-base] px-6 py-8">
	<div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
		<span
			class="font-serif text-sm font-medium text-[--color-ink]/60"
			style="font-family: var(--font-headline)"
		>
			{personalInfo.shortName}
		</span>
		<span class="font-mono text-[10px] text-[--color-ink]/30" style="font-family: var(--font-data); letter-spacing: 0.06em;">
			Designed & crafted in Monterrey · © {new Date().getFullYear()}
		</span>
	</div>
</footer>

</div>
<!-- End Page Load Animation Wrapper -->
