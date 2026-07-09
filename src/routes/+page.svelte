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
	import Schematic from '$lib/components/Schematic.svelte';
	import TraceButton from '$lib/components/TraceButton.svelte';
	import { schematicFor } from '$lib/constants/schematics';
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

	// Figure numbers: every project keeps one number across the whole site
	// (home schematic + case study), patent-sheet style.
	const figNumber = (p: Project) => projects.findIndex((x) => x.id === p.id) + 1;

	// One-line proof, composed from the project's real metrics.
	const proofLine = (p: Project) =>
		p.metrics?.map((m) => `${m.value} ${m.label}`).join(' · ') ?? null;

	// Structured data: who I am (ProfilePage → Person), the site itself
	// (WebSite), and the in-page section nav (BreadcrumbList).
	const homeJsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'ProfilePage',
			dateModified: new Date().toISOString().slice(0, 10),
			mainEntity: {
				'@type': 'Person',
				name: personalInfo.name,
				alternateName: personalInfo.shortName,
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
				worksFor: { '@type': 'Organization', name: 'CityFront AI' },
				alumniOf: {
					'@type': 'CollegeOrUniversity',
					name: 'Tecnológico de Monterrey'
				},
				sameAs: [personalInfo.social.github, personalInfo.social.linkedin],
				knowsAbout: [
					'TypeScript',
					'SvelteKit',
					'React',
					'Node.js',
					'AWS',
					'AI/ML',
					'IoT',
					'PostgreSQL'
				]
			}
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
				{ '@type': 'ListItem', position: 3, name: 'Archive', item: `${siteUrl}#archive` },
				{ '@type': 'ListItem', position: 4, name: 'Timeline', item: `${siteUrl}#timeline` },
				{ '@type': 'ListItem', position: 5, name: 'Tools', item: `${siteUrl}#tools` },
				{ '@type': 'ListItem', position: 6, name: 'Writing', item: `${siteUrl}#writing` },
				{ '@type': 'ListItem', position: 7, name: 'Contact', item: `${siteUrl}#contact` }
			]
		}
	];

	// Featured work gets the full schematic compositions; the rest is the archive.
	const featuredProjects = $derived(projects.filter((p) => p.featured));
	const archiveProjects = $derived(projects.filter((p) => !p.featured));

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

	// Scroll-linked touches: list-row reveals + the timeline's drawn line.
	onMount(() => {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let ctx: gsap.Context | null = null;

		const initScrollMorphs = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				// Reveal each list row (archive + writing + contact) as it enters.
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
{#snippet traceMarker()}
	<!-- The section marker: a short trace ending in a via-dot — same grammar as the schematics. -->
	<svg width="40" height="10" viewBox="0 0 40 10" aria-hidden="true" class="mb-4 block">
		<line x1="0" y1="5" x2="28" y2="5" stroke="color-mix(in srgb, var(--color-ink) 30%, transparent)" stroke-width="1.5" stroke-linecap="round" />
		<circle cx="34" cy="5" r="3" fill="var(--color-accent)" />
	</svg>
{/snippet}

{#snippet sectionHead(title: string, description: string)}
	{@render traceMarker()}
	<h2
		class="font-serif text-3xl font-medium tracking-tight text-(color:--color-ink) md:text-4xl"
		style="font-family: var(--font-headline); text-wrap: balance"
	>
		{title}
	</h2>
	<p class="mt-3 max-w-xl text-sm text-(color:--color-ink)/70 md:text-base">
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
	<Navbar brand={personalInfo.shortName} />
</div>

<!-- Command Palette -->
<CommandPalette />

<!-- Case Study Modal -->
<CaseStudyModal
	project={caseStudyProject}
	fig={caseStudyProject ? figNumber(caseStudyProject) : 1}
	open={caseStudyOpen}
	onClose={closeCaseStudy}
/>

<!-- Main Content Wrapper -->
<main id="main-content">

<!-- ═══════════════════════════════════════════════════════════════════════════
     HERO — the drawn monogram leads; statement + proof; CTA pair.
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
			class="mb-6 block font-mono text-[11px] tracking-[0.2em] text-(color:--color-ink)/70 uppercase"
		>
			{personalInfo.shortName} — {personalInfo.title}
		</span>

		<!-- Statement — the focal point -->
		<h1
			class="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-(color:--color-ink) md:text-5xl lg:text-[3.25rem]"
			style="font-family: var(--font-headline); text-wrap: balance"
			use:textReveal={{ stagger: 0.012, duration: 0.9, y: 40, rotationX: -40, delay: 0.2 }}
		>
			I turn hard, ambiguous problems into products that ship.
		</h1>

		<!-- Supporting line — the specifics, quieter -->
		<p
			data-load="hero-subtitle"
			class="mt-6 max-w-xl text-base leading-relaxed text-(color:--color-ink)/70 md:text-lg"
		>
			Engineer and builder. Lately: municipal AI for U.S. cities, IoT fulfillment, and a
			couple of startups.
		</p>

		<!-- Proof — measured, annotated -->
		<p class="mt-5 font-mono text-[11px] tracking-[0.1em] text-(color:--color-ink)/70">
			&lt;72 hr client onboarding&ensp;·&ensp;98%+ E2E coverage&ensp;·&ensp;4 apps shipped &amp; led
		</p>

		<!-- CTA pair -->
		<div data-load="hero-cta" class="mt-10 flex flex-wrap items-center gap-6">
			<TraceButton href="#contact" variant="solid">
				<span>Get in touch</span>
				<span aria-hidden="true">→</span>
			</TraceButton>
			<a
				href="#work"
				class="group inline-flex items-center gap-3 font-mono text-xs tracking-widest text-(color:--color-ink)/70 uppercase transition-colors duration-300 hover:text-(color:--color-accent-deep)"
				use:magnetic={{ strength: 0.3, duration: 0.5 }}
				data-cursor-hover
			>
				<span>see the work</span>
				<span class="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     WORK — featured projects as annotated figures; schematic + story, alternating.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="work" class="relative px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Selected work">
	<div class="mx-auto max-w-6xl">
		<div class="mx-auto max-w-3xl lg:mx-0" use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Selected work', 'Three systems, drawn the way I think about them. Each one opens into its full case study.')}
		</div>

		<div class="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
			{#each featuredProjects as project, i (project.id)}
				{@const schematic = schematicFor(project.id)}
				{@const proof = proofLine(project)}
				<article
					class="grid items-center gap-10 md:grid-cols-12 md:gap-12"
					aria-label="{project.title} — featured project"
				>
					<!-- Schematic -->
					{#if schematic}
						<div class="min-w-0 md:col-span-7 {i % 2 === 1 ? 'md:order-2' : ''}">
							<div class="schematic-scroll">
							<button
								type="button"
								class="schematic-btn block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
								onclick={() => openCaseStudy(project)}
								data-cursor-hover
								aria-label="Open {project.title} case study"
							>
								<Schematic def={schematic} fig={figNumber(project)} />
							</button>
							</div>
						</div>
					{/if}

					<!-- Story -->
					<div class="min-w-0 md:col-span-5 {i % 2 === 1 ? 'md:order-1' : ''}">
						<span class="font-mono text-[11px] tracking-[0.15em] text-(color:--color-ink)/70 uppercase">
							{project.subtitle} · {project.year}
						</span>
						<h3 class="mt-3">
							<button
								type="button"
								class="cursor-pointer border-0 bg-transparent p-0 text-left font-serif text-3xl font-medium tracking-tight text-(color:--color-ink) transition-colors duration-300 hover:text-(color:--color-accent-deep) md:text-4xl"
								style="font-family: var(--font-headline); text-wrap: balance"
								onclick={() => openCaseStudy(project)}
								data-cursor-hover
							>
								{project.title}
							</button>
						</h3>
						<p class="mt-4 max-w-md text-sm leading-relaxed text-(color:--color-ink)/70 md:text-base">
							{project.description}
						</p>

						{#if proof}
							<p class="mt-5 font-mono text-[11px] tracking-[0.08em] text-(color:--color-ink)/70">
								{proof}
							</p>
						{/if}

						{#if project.tags?.length}
							<div class="mt-4 flex flex-wrap gap-x-3 gap-y-1">
								{#each project.tags.slice(0, 5) as tag (tag)}
									<span class="font-mono text-[10px] tracking-wide text-(color:--color-ink)/70 uppercase">{tag}</span>
								{/each}
							</div>
						{/if}

						<div class="mt-8">
							<TraceButton variant="outline" onclick={() => openCaseStudy(project)}>
								<span>Read case study</span>
								<span aria-hidden="true">→</span>
							</TraceButton>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     ARCHIVE — the rest of the sheet: dense index rows, each opens its figure.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="archive" class="relative bg-(--color-surface) px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Project archive">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Archive', 'Client platforms, internal tools, and things built to learn.')}
		</div>

		<ul class="mt-12 border-t border-(--color-ink)/10">
			{#each archiveProjects as project (project.id)}
				<li class="list-row border-b border-(--color-ink)/10">
					<button
						type="button"
						class="group w-full cursor-pointer py-5 text-left"
						onclick={() => openCaseStudy(project)}
						data-cursor-hover
						aria-label="View case study for {project.title}"
					>
						<div class="flex items-baseline justify-between gap-4">
							<span class="flex items-baseline gap-3">
								<span
									class="font-serif text-lg font-medium text-(color:--color-ink) transition-colors duration-300 group-hover:text-(color:--color-accent-deep) md:text-xl"
									style="font-family: var(--font-headline)"
								>
									{project.title}
								</span>
								<span class="hidden font-mono text-[10px] tracking-[0.1em] text-(color:--color-ink)/70 uppercase sm:inline">
									{project.subtitle}
								</span>
							</span>
							<span class="shrink-0 font-mono text-xs text-(color:--color-ink)/70">{project.year}</span>
						</div>
						<p class="mt-1.5 max-w-xl text-sm text-(color:--color-ink)/70">
							{project.description}
						</p>
						{#if project.tags?.length}
							<div class="mt-2 flex flex-wrap gap-x-3 gap-y-1">
								{#each project.tags.slice(0, 4) as tag (tag)}
									<span class="font-mono text-[10px] tracking-wide text-(color:--color-ink)/70 uppercase">{tag}</span>
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
				class="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-(color:--color-ink)/70 transition-colors duration-300 hover:text-(color:--color-accent-deep)"
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
     TIMELINE — one annotated line, newest first; the page's earned sequence.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="timeline" class="relative px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Timeline">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Timeline', 'From the classroom to the codebase.')}
		</div>

		<ol class="relative mt-12 pl-6">
			<!-- Drawn vertical line -->
			<span
				class="timeline-line pointer-events-none absolute top-2 bottom-2 left-[3px] w-[1px] bg-(--color-ink)/15"
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
						<span class="font-mono text-[11px] tracking-wide text-(color:--color-ink)/70">
							{item.year}{item.endYear ? `–${item.endYear}` : item.current ? '–now' : ''}
						</span>
					</div>
					<h3
						class="mt-1 font-serif text-lg font-medium text-(color:--color-ink)"
						style="font-family: var(--font-headline)"
					>
						{item.title}
						<span class="text-(color:--color-ink)/70">· {item.company}</span>
					</h3>
					<p class="mt-1 max-w-xl text-sm text-(color:--color-ink)/70">{item.description}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     TOOLS — what I reach for, grouped by category.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="tools" class="relative bg-(--color-surface) px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Tools">
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
			<span class="font-mono text-[10px] tracking-widest text-(color:--color-ink)/70 uppercase">
				languages
			</span>
			<span class="text-sm text-(color:--color-ink)/70">
				{#each languages as lang, i (lang.name)}{i > 0 ? ', ' : ''}{lang.name} ({lang.proficiency}){/each}
			</span>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     WRITING — latest posts; full archive lives at /blog.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="writing" class="relative px-6 py-24 md:px-12 md:py-32 lg:px-20" aria-label="Recent writing">
	<div class="mx-auto max-w-3xl">
		<div use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionHead('Recent writing', 'Notes on engineering, AI, and shipping.')}
		</div>

		<ul class="mt-12 border-t border-(--color-ink)/10">
			{#each recentPosts as post (post.slug)}
				<li class="list-row border-b border-(--color-ink)/10">
					<a
						href="/blog/{post.slug}"
						class="group block py-6"
						data-cursor-hover
					>
						<div class="flex items-baseline justify-between gap-4">
							<span
								class="font-serif text-lg font-medium text-(color:--color-ink) transition-colors duration-300 group-hover:text-(color:--color-accent-deep) md:text-xl"
								style="font-family: var(--font-headline)"
							>
								{post.title}
							</span>
							<span class="shrink-0 font-mono text-xs text-(color:--color-ink)/70">{postDate(post.date)}</span>
						</div>
						<p class="mt-2 max-w-xl text-sm text-(color:--color-ink)/70">{post.description}</p>
					</a>
				</li>
			{/each}
		</ul>

		<div class="mt-10">
			<a
				href="/blog"
				class="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-(color:--color-ink)/70 transition-colors duration-300 hover:text-(color:--color-accent-deep)"
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
     CONTACT — the ink band. The page's single loudest moment.
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="contact" class="relative bg-(--color-ink) px-6 py-28 md:px-12 md:py-36 lg:px-20" aria-label="Get in touch">
	<div class="mx-auto max-w-3xl">
		<!-- Trace marker, inverted -->
		<svg width="40" height="10" viewBox="0 0 40 10" aria-hidden="true" class="mb-6 block">
			<line x1="0" y1="5" x2="28" y2="5" stroke="color-mix(in srgb, var(--color-base) 35%, transparent)" stroke-width="1.5" stroke-linecap="round" />
			<circle cx="34" cy="5" r="3" fill="var(--color-accent)" />
		</svg>

		<h2
			class="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-(color:--color-base) md:text-5xl"
			style="font-family: var(--font-headline); text-wrap: balance"
		>
			Have a hard problem?<br />Let's ship it.
		</h2>

		<p class="mt-5 max-w-xl text-base leading-relaxed text-(color:--color-base)/70">
			A role, a technical partner, an idea to kick around — always open.
		</p>

		<!-- The one big action -->
		<div class="mt-10">
			<a
				href="mailto:{personalInfo.email}"
				class="contact-email group inline-block font-serif text-2xl font-medium tracking-tight text-(color:--color-base) transition-colors duration-300 hover:text-(color:--color-accent) md:text-4xl"
				style="font-family: var(--font-headline)"
				data-cursor-hover
				aria-label="Send email to {personalInfo.email}"
			>
				{personalInfo.email}
				<span
					aria-hidden="true"
					class="ml-2 inline-block font-mono text-xl text-(color:--color-base)/50 transition-transform duration-300 group-hover:translate-x-1 md:text-2xl"
				>→</span>
			</a>
		</div>

		<!-- Secondary channels -->
		<ul class="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
			<li>
				<a
					href={personalInfo.social.github}
					target="_blank"
					rel="noopener noreferrer"
					class="font-mono text-xs tracking-[0.12em] text-(color:--color-base)/75 uppercase transition-colors duration-300 hover:text-(color:--color-accent)"
					data-cursor-hover
					aria-label="View GitHub profile (opens in new tab)"
				>GitHub ↗</a>
			</li>
			<li>
				<a
					href={personalInfo.social.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="font-mono text-xs tracking-[0.12em] text-(color:--color-base)/75 uppercase transition-colors duration-300 hover:text-(color:--color-accent)"
					data-cursor-hover
					aria-label="Connect on LinkedIn (opens in new tab)"
				>LinkedIn ↗</a>
			</li>
			<li>
				<a
					href="/resume.pdf"
					download="Santiago_Vazquez_Resume.pdf"
					class="font-mono text-xs tracking-[0.12em] text-(color:--color-base)/75 uppercase transition-colors duration-300 hover:text-(color:--color-accent)"
					data-cursor-hover
					aria-label="Download resume as PDF"
				>Resume ↓</a>
			</li>
			<li>
				<a
					href="tel:{personalInfo.phone}"
					class="font-mono text-xs tracking-[0.12em] text-(color:--color-base)/75 uppercase transition-colors duration-300 hover:text-(color:--color-accent)"
					data-cursor-hover
					aria-label="Call {personalInfo.phone}"
				>{personalInfo.phone}</a>
			</li>
		</ul>

		<!-- npm joke — a quiet personality beat -->
		<p class="mt-14 max-w-xl font-serif text-base italic text-(color:--color-base)/65" style="font-family: var(--font-headline)">
			This portfolio has 0 npm packages with security vulnerabilities. I checked.
		</p>

		<!-- Location, one quiet line -->
		<p class="mt-6 font-mono text-[11px] tracking-wide text-(color:--color-base)/62">
			Monterrey · CST (UTC−6) · {personalInfo.availability}
		</p>
	</div>
</section>

</main>
<!-- End Main Content Wrapper -->

<!-- Footer — continues the ink band -->
<footer class="border-t border-(--color-base)/10 bg-(--color-ink) px-6 py-8">
	<div class="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 md:flex-row">
		<span
			class="font-serif text-sm font-medium text-(color:--color-base)/70"
			style="font-family: var(--font-headline)"
		>
			{personalInfo.shortName}
		</span>
		<span class="font-mono text-[10px] text-(color:--color-base)/62" style="font-family: var(--font-data); letter-spacing: 0.06em;">
			Designed & crafted in Monterrey · © {new Date().getFullYear()}
		</span>
	</div>
</footer>

</div>
<!-- End Page Load Animation Wrapper -->

<style>
	/* On narrow screens the figure keeps a readable size and pans
	   inside its own container — like sliding a drafting sheet. */
	.schematic-scroll {
		overflow-x: auto;
		max-width: 100%;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
	}

	.schematic-scroll .schematic-btn {
		min-width: 33rem;
	}

	@media (min-width: 640px) {
		.schematic-scroll {
			overflow-x: visible;
		}
		.schematic-scroll .schematic-btn {
			min-width: 0;
		}
	}

	/* Featured schematics: subtle lift affordance, no card chrome */
	.schematic-btn {
		transition: transform var(--duration-normal) var(--ease-smooth);
	}

	.schematic-btn:hover {
		transform: translateY(-3px);
	}

	.schematic-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 8px;
		border-radius: var(--radius-md);
	}

	@media (prefers-reduced-motion: reduce) {
		.schematic-btn,
		.schematic-btn:hover {
			transition: none;
			transform: none;
		}
	}
</style>
