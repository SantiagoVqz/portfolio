<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { magnetic } from '$lib/actions/magnetic';
	import { revealWithExit } from '$lib/actions/reveal';
	import { textReveal } from '$lib/actions/textReveal';
	import { parallaxScale } from '$lib/actions/parallax';
	import { pageLoad } from '$lib/actions/pageLoad';
	import Navbar from '$lib/components/Navbar.svelte';
	import GenerativeMesh from '$lib/components/GenerativeMesh.svelte';
	import ProjectEditorial from '$lib/components/ProjectEditorial.svelte';
	import ProjectData from '$lib/components/ProjectData.svelte';
	import ProjectImmersive from '$lib/components/ProjectImmersive.svelte';
	import CaseStudyModal from '$lib/components/CaseStudyModal.svelte';
	import DisplayCabinet from '$lib/components/DisplayCabinet.svelte';
	import Constellation from '$lib/components/Constellation.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import SectionIndicators from '$lib/components/SectionIndicators.svelte';

	import {
		personalInfo,
		professionalProfile,
		technicalSkills,
		languages,
		projects,
		education,
		philosophies,
		meta,
		timelineData
	} from '$lib/constants';

	import type { Project } from '$lib/constants/profile';

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
				// Reveal each project on scroll
				const projectItems = document.querySelectorAll('.project-item');
				projectItems.forEach((item, i) => {
					gsap.fromTo(
						item,
						{ opacity: 0, y: 60 },
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: item,
								start: 'top 85%',
								toggleActions: 'play none none reverse'
							}
						}
					);
				});
			});
		};

		initScrollMorphs();

		return () => ctx?.revert();
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{meta.title}</title>
	<meta name="title" content={meta.title} />
	<meta name="description" content={meta.description} />
	<meta name="keywords" content="Full-Stack Engineer, Software Developer, SvelteKit, TypeScript, AI, IoT, Monterrey, Mexico, Santiago Vazquez" />
	<meta name="author" content={personalInfo.name} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://santivqzv.dev" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://santivqzv.dev" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content="https://santivqzv.dev/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Santiago Vazquez Portfolio" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://santivqzv.dev" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content="https://santivqzv.dev/og-image.png" />
	<meta name="twitter:creator" content="@santivqzv" />

	<!-- Theme & Mobile -->
	<meta name="theme-color" content="#fdfcf8" />
	<meta name="msapplication-TileColor" content="#fdfcf8" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "${personalInfo.name}",
		"url": "https://santivqzv.dev",
		"image": "https://santivqzv.dev/memoji.png",
		"jobTitle": "Full-Stack Engineer",
		"description": "${meta.description}",
		"email": "mailto:${personalInfo.email}",
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "Monterrey",
			"addressCountry": "MX"
		},
		"sameAs": [
			"${personalInfo.social.github}",
			"${personalInfo.social.linkedin}"
		],
		"knowsAbout": ["TypeScript", "SvelteKit", "React", "Node.js", "AWS", "AI/ML", "IoT", "PostgreSQL"]
	}
	</script>`}

	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Santiago Vazquez Portfolio",
		"url": "https://santivqzv.dev",
		"description": "${meta.description}",
		"author": {
			"@type": "Person",
			"name": "${personalInfo.name}"
		}
	}
	</script>`}

	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": [
			{
				"@type": "ListItem",
				"position": 1,
				"name": "Home",
				"item": "https://santivqzv.dev"
			},
			{
				"@type": "ListItem",
				"position": 2,
				"name": "Work",
				"item": "https://santivqzv.dev#artifacts"
			},
			{
				"@type": "ListItem",
				"position": 3,
				"name": "Process",
				"item": "https://santivqzv.dev#process"
			},
			{
				"@type": "ListItem",
				"position": 4,
				"name": "Journey",
				"item": "https://santivqzv.dev#archive"
			},
			{
				"@type": "ListItem",
				"position": 5,
				"name": "Contact",
				"item": "https://santivqzv.dev#contact"
			}
		]
	}
	</script>`}
</svelte:head>

<!-- Snippets -->
{#snippet sectionLabel(text: string)}
	<span
		class="mb-4 inline-block font-mono text-[10px] tracking-widest uppercase"
		style="color: var(--color-accent)"
	>
		{text}
	</span>
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
			{ label: 'Artifacts', href: '#artifacts' },
			{ label: 'Process', href: '#process' },
			{ label: 'Archive', href: '#archive' },
			{ label: 'Contact', href: '#contact' }
		]}
	/>
</div>

<!-- Section Indicators (right side dots) -->
<SectionIndicators />

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
     THE ARRIVAL (HERO)
     Full-bleed Canvas 2D generative mesh background, text floats on top
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	id="hero"
	class="hero relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-12 lg:px-20"
	aria-label="Introduction"
>
	<!-- Generative Mesh Background -->
	<GenerativeMesh />

	<!-- Main content floating on top -->
	<div
		class="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center"
		use:parallaxScale={{ scaleStart: 1, scaleEnd: 0.95, opacityStart: 1, opacityEnd: 0.3, start: 'top top', end: '80% top' }}
	>
		<!-- Text content -->
		<div class="flex-1" data-load="hero-content">
			<!-- Availability badge -->
			<div data-load="hero-badge" class="mb-6">
				<span
					class="inline-flex items-center gap-3 rounded-full px-4 py-2"
					style="background: color-mix(in srgb, var(--color-surface) 80%, transparent); border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);"
				>
					<span class="h-2 w-2 animate-pulse rounded-full bg-[--color-tension]"></span>
					<span class="font-mono text-[10px] tracking-widest text-[--color-ink]/60 uppercase">
						{personalInfo.locationShort} · Available for work
					</span>
				</span>
			</div>

			<!-- Large name -->
			<h1
				class="mb-6 font-serif leading-none tracking-tight"
				style="font-family: var(--font-headline)"
			>
				<span
					class="mb-3 block text-lg font-normal text-[--color-ink]/40 md:text-xl"
					style="font-family: var(--font-data); letter-spacing: 0.12em; font-weight: 300;"
				>
					Hi, I'm
				</span>
				<span
					class="hero-name block text-5xl font-medium text-[--color-ink] md:text-7xl lg:text-8xl"
					style="line-height: 0.95;"
					use:textReveal={{ stagger: 0.025, duration: 1, y: 80, rotationX: -60, delay: 0.3 }}
				>
					Santiago Vazquez
				</span>
			</h1>

			<!-- Tagline -->
			<div data-load="hero-subtitle" class="mb-8">
				<p
					class="mx-auto max-w-lg leading-relaxed font-light text-[--color-ink]/50 text-base md:text-lg lg:text-xl"
					style="font-family: var(--font-headline); font-style: italic;"
				>
					Building products that scale — from municipal AI systems to IoT solutions
				</p>
			</div>

			<!-- CTA -->
			<div data-load="hero-cta">
				<a
					href="#artifacts"
					class="group inline-flex items-center gap-4 font-mono text-xs tracking-widest text-[--color-ink]/60 uppercase transition-colors duration-500 hover:text-[--color-accent]"
					use:magnetic={{ strength: 0.3, duration: 0.5 }}
					data-cursor-hover
				>
					<span>Explore my work</span>
					<span class="h-[1px] w-8 bg-current transition-all duration-500 group-hover:w-12"></span>
					<span class="transition-transform duration-500 group-hover:translate-x-1">↓</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Bottom decoration -->
	<div class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
		<div class="flex flex-col items-center gap-2 opacity-20">
			<div class="h-16 w-[1px] bg-gradient-to-b from-transparent via-[--color-ink] to-transparent"></div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE ARTIFACTS (PROJECTS)
     Varied layouts — editorial, data, immersive
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="artifacts" class="relative" aria-label="Selected Work">
	<!-- Section header -->
	<div class="px-6 py-24 md:px-12 lg:px-20">
		<div
			class="mx-auto max-w-6xl"
			use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}
		>
			<div class="mb-4 flex items-center gap-4">
				<span class="text-2xl">◈</span>
				{@render sectionLabel('The Artifacts')}
			</div>
			<h2
				class="font-serif text-4xl font-medium tracking-tight text-[--color-ink] md:text-5xl lg:text-6xl"
				style="font-family: var(--font-headline)"
			>
				Selected Work
			</h2>
			<p class="mt-4 max-w-xl text-[--color-ink]/50 text-base md:text-lg">
				Products I've shipped — from enterprise SaaS to embedded systems.
			</p>
		</div>
	</div>

	<!-- Varied project layouts -->
	<div class="space-y-16 px-6 pb-24 md:px-12 lg:px-20">
		{#each projects as project, i (project.id)}
			<div class="project-item mx-auto max-w-6xl">
				{#if project.layoutType === 'editorial'}
					<ProjectEditorial
						{project}
						index={i}
						onViewCaseStudy={() => openCaseStudy(project)}
					/>
				{:else if project.layoutType === 'data'}
					<ProjectData
						{project}
						index={i}
						onViewCaseStudy={() => openCaseStudy(project)}
					/>
				{:else if project.layoutType === 'immersive'}
					<ProjectImmersive
						{project}
						index={i}
						onViewCaseStudy={() => openCaseStudy(project)}
					/>
				{/if}
			</div>
		{/each}
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE PROCESS (TECH STACK)
     Display cabinet with glass compartments
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="process" class="relative bg-[--color-surface] px-6 py-24 md:py-32" aria-label="Technical Skills">
	<div class="relative z-10 mx-auto max-w-4xl">
		<div
			class="mb-12 text-center"
			use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}
		>
			<div class="mb-4 flex items-center justify-center gap-4">
				<span class="text-2xl">⚙</span>
				{@render sectionLabel('The Process')}
			</div>
			<h2
				class="font-serif text-4xl font-medium tracking-tight text-[--color-ink] md:text-5xl"
				style="font-family: var(--font-headline)"
			>
				My Toolbox
			</h2>
			<p class="mx-auto mt-4 max-w-md text-[--color-ink]/50 text-base">
				The technologies and frameworks I reach for when building products.
			</p>
		</div>

		<DisplayCabinet skills={technicalSkills} />

		<!-- Languages as small badges -->
		<div
			class="mt-12 text-center"
			use:revealWithExit={{ blur: 8, y: 20, duration: 0.8, persist: true }}
		>
			<span
				class="mb-4 block font-mono text-[10px] tracking-widest text-[--color-ink]/40 uppercase"
			>
				I also speak
			</span>
			<div class="flex flex-wrap justify-center gap-3">
				{#each languages as lang (lang.name)}
					<span
						class="inline-flex items-center gap-2 rounded-full border border-[--color-ink]/10 bg-[--color-base] px-4 py-2"
					>
						<span class="text-lg">{lang.flag}</span>
						<span class="font-mono text-xs text-[--color-ink]/70">{lang.name}</span>
						<span class="font-mono text-[9px] text-[--color-ink]/40 uppercase">
							{lang.proficiency}
						</span>
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE ARCHIVE (JOURNEY & ABOUT)
     Editorial timeline with alternating entries
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="archive" class="relative px-6 py-24 md:py-32" aria-label="Career Journey">
	<div class="mx-auto max-w-4xl">
		<div
			class="mb-12 text-center"
			use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}
		>
			<div class="mb-4 flex items-center justify-center gap-4">
				<span class="text-2xl">✧</span>
				{@render sectionLabel('The Archive')}
			</div>
			<h2
				class="font-serif text-4xl font-medium tracking-tight text-[--color-ink] md:text-5xl"
				style="font-family: var(--font-headline)"
			>
				My Journey
			</h2>
			<p class="mt-4 mx-auto max-w-lg text-[--color-ink]/40 text-sm md:text-base" style="font-family: var(--font-data)">
				From the classroom to the codebase — the milestones that shaped how I build.
			</p>
		</div>

		<Constellation
			timeline={timelineData}
			{education}
			{philosophies}
			bio={professionalProfile.bio as unknown as string[]}
		/>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE CONTACT
     Email-first + social hub + playful exit + resume download
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="contact" class="relative bg-[--color-surface] px-6 py-24 md:py-32" aria-label="Contact Information">
	<!-- Ambient background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full opacity-12"
			style="background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%); filter: blur(100px);"
		></div>
		<div
			class="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full opacity-8"
			style="background: radial-gradient(circle, var(--color-tension) 0%, transparent 70%); filter: blur(80px);"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Hero email area -->
		<div
			class="mb-16 text-center"
			use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}
		>
			<div class="mb-4 flex items-center justify-center gap-4">
				<span class="text-2xl">◆</span>
				{@render sectionLabel('Get in Touch')}
			</div>
			<h2
				class="font-serif text-4xl font-medium tracking-tight text-[--color-ink] md:text-5xl"
				style="font-family: var(--font-headline)"
			>
				Let's build something together
			</h2>
			<p class="mx-auto mt-4 max-w-md text-[--color-ink]/50 text-base">
				Have a project in mind? I'd love to hear from you.
			</p>
		</div>

		<!-- Email hero + social hub -->
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" use:revealWithExit={{ blur: 15, y: 30, duration: 1, persist: true }}>

			<!-- Email Card (Large) -->
			<a
				href="mailto:{personalInfo.email}"
				class="card group relative flex flex-col justify-between overflow-hidden p-8 md:col-span-2 lg:col-span-2 lg:row-span-2"
				use:magnetic={{ strength: 0.15, duration: 0.5 }}
				data-cursor-hover
				aria-label="Send email to {personalInfo.email}"
			>
				<div
					class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					style="background: radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 60%);"
				></div>

				<div class="relative">
					<div class="mb-6 flex items-center gap-3">
						<span class="relative flex h-3 w-3">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
							<span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
						</span>
						<span class="font-mono text-[10px] tracking-widest text-emerald-600 uppercase">
							Available for projects
						</span>
					</div>

					<h3
						class="mb-4 font-serif text-2xl font-medium text-[--color-ink] md:text-3xl"
						style="font-family: var(--font-headline)"
					>
						Let's work together
					</h3>
					<p class="max-w-md text-[--color-ink]/50 text-sm leading-relaxed md:text-base">
						Whether you need a technical partner for your next venture or want to discuss an idea — I'm always open to interesting conversations.
					</p>
				</div>

				<div class="relative mt-8 flex items-center justify-between">
					<span
						class="font-serif text-lg font-medium text-[--color-ink] transition-colors duration-300 group-hover:text-[--color-accent] md:text-xl lg:text-2xl"
						style="font-family: var(--font-headline)"
					>
						{personalInfo.email}
					</span>
					<span class="flex h-12 w-12 items-center justify-center rounded-full bg-[--color-accent] text-xl text-[--color-ink] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-45">
						→
					</span>
				</div>
			</a>

			<!-- GitHub Card -->
			<a
				href={personalInfo.social.github}
				target="_blank"
				rel="noopener noreferrer"
				class="card group relative flex flex-col justify-between overflow-hidden p-6"
				use:magnetic={{ strength: 0.25, duration: 0.4 }}
				data-cursor-hover
				aria-label="View GitHub profile (opens in new tab)"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-ink] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						⌘
					</div>
					<h3 class="mb-2 font-serif text-lg font-medium text-[--color-ink]" style="font-family: var(--font-headline)">
						GitHub
					</h3>
					<p class="text-[--color-ink]/50 text-sm">
						Check out my code and open source work
					</p>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>View profile</span>
					<span class="transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</div>
			</a>

			<!-- LinkedIn Card -->
			<a
				href={personalInfo.social.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				class="card group relative flex flex-col justify-between overflow-hidden p-6"
				use:magnetic={{ strength: 0.25, duration: 0.4 }}
				data-cursor-hover
				aria-label="Connect on LinkedIn (opens in new tab)"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-tension] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						◎
					</div>
					<h3 class="mb-2 font-serif text-lg font-medium text-[--color-ink]" style="font-family: var(--font-headline)">
						LinkedIn
					</h3>
					<p class="text-[--color-ink]/50 text-sm">
						Connect professionally
					</p>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>Connect</span>
					<span class="transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</div>
			</a>

			<!-- Resume Download Card -->
			<a
				href="/resume.pdf"
				download="Santiago_Vazquez_Resume.pdf"
				class="card group relative flex flex-col justify-between overflow-hidden p-6"
				use:magnetic={{ strength: 0.25, duration: 0.4 }}
				data-cursor-hover
				aria-label="Download resume as PDF"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-gold] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						↓
					</div>
					<h3 class="mb-2 font-serif text-lg font-medium text-[--color-ink]" style="font-family: var(--font-headline)">
						Resume
					</h3>
					<p class="text-[--color-ink]/50 text-sm">
						Download my full CV
					</p>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>Download PDF</span>
					<span class="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
				</div>
			</a>

			<!-- Phone Card -->
			<a
				href="tel:{personalInfo.phone}"
				class="card group relative flex flex-col justify-between overflow-hidden p-6"
				use:magnetic={{ strength: 0.25, duration: 0.4 }}
				data-cursor-hover
				aria-label="Call {personalInfo.phone}"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-accent] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						☎
					</div>
					<h3 class="mb-2 font-serif text-lg font-medium text-[--color-ink]" style="font-family: var(--font-headline)">
						Phone
					</h3>
					<p class="text-[--color-ink]/50 text-sm">
						{personalInfo.phone}
					</p>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>Call</span>
					<span class="transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</div>
			</a>

			<!-- Playful exit card -->
			<div
				class="card group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 lg:col-span-3"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-accent] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						✦
					</div>
					<blockquote
						class="font-serif text-lg italic text-[--color-ink]/80 leading-relaxed"
						style="font-family: var(--font-headline)"
					>
						Fun fact: This portfolio has 0 npm packages with security vulnerabilities. I checked.
					</blockquote>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>— Built with obsessive attention to detail</span>
				</div>
			</div>
		</div>

		<!-- Location & Footer info -->
		<div
			class="mt-12 flex flex-col items-center gap-6 text-center"
			use:revealWithExit={{ blur: 8, y: 15, duration: 0.8, persist: true }}
		>
			<div class="flex items-center gap-4 text-[--color-ink]/30">
				<span class="font-mono text-xs">Monterrey, MX</span>
				<span class="h-1 w-1 rounded-full bg-current"></span>
				<span class="font-mono text-xs">CST (UTC-6)</span>
			</div>
			<div class="inline-flex items-center gap-4 text-[--color-ink]/20">
				<span class="h-[1px] w-8 bg-current"></span>
				<span class="font-mono text-[10px] tracking-widest uppercase">Looking forward to it</span>
				<span class="h-[1px] w-8 bg-current"></span>
			</div>
		</div>
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
