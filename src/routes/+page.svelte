<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { magnetic } from '$lib/actions/magnetic';
	import { revealWithExit } from '$lib/actions/reveal';
	import { textReveal } from '$lib/actions/textReveal';
	import { parallax, parallaxScale } from '$lib/actions/parallax';
	import { pageLoad } from '$lib/actions/pageLoad';
	import AnimatedAvatar from '$lib/components/AnimatedAvatar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import StudioJournal from '$lib/components/StudioJournal.svelte';
	import Memoji from '$lib/assets/memoji.png';

	// Import all data from constants
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

	// Refs for horizontal scroll
	let horizontalSection = $state<HTMLElement | null>(null);
	let horizontalTrack = $state<HTMLElement | null>(null);
	let isMobile = $state(false);
	let isTouchDevice = $state(false);
	let sectionHeight = $state<string>('100vh');
	let resizeTimer: ReturnType<typeof setTimeout> | undefined;

	// GSAP instances (loaded dynamically)
	type GSAPInstance = typeof import('gsap').gsap;
	type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger;
	let gsapInstance: GSAPInstance | null = null;
	let ScrollTriggerInstance: ScrollTriggerType | null = null;

	// Detect touch devices - horizontal scroll with pinning causes issues
	function detectTouchDevice(): boolean {
		return (
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia('(hover: none) and (pointer: coarse)').matches
		);
	}

	onMount(() => {
		// Check if mobile or touch device
		const checkMobile = () => {
			isMobile = window.innerWidth < 1024;
			isTouchDevice = detectTouchDevice();
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Initialize horizontal scroll for desktop only
		let ctx: gsap.Context | null = null;

		const initHorizontalScroll = () => {
			// Skip on mobile, touch devices, or if elements not ready
			if (isMobile || isTouchDevice || !horizontalSection || !horizontalTrack || !gsapInstance) return;

			// Ensure context is clean before creating a new one
			if (ctx) {
				ctx.revert();
				ctx = null;
			}

			const cards = horizontalTrack.querySelectorAll('.project-card-wrapper');
			const totalWidth = horizontalTrack.scrollWidth;
			const viewportWidth = window.innerWidth;
			const scrollDistance = Math.max(0, totalWidth - viewportWidth);

			sectionHeight = '100vh';

			const gsap = gsapInstance;

			requestAnimationFrame(() => {
				ctx = gsap.context(() => {
					gsap.to(horizontalTrack, {
						x: -scrollDistance,
						ease: 'none',
						id: 'horizontal-scroll',
						scrollTrigger: {
							trigger: horizontalSection,
							start: 'top top',
							end: () => `+=${scrollDistance}`,
							pin: true,
							scrub: 1,
							invalidateOnRefresh: true,
							anticipatePin: 1
						}
					});

					cards.forEach((card) => {
						gsap.fromTo(
							card,
							{ opacity: 0.3, scale: 0.95 },
							{
								opacity: 1,
								scale: 1,
								scrollTrigger: {
									trigger: card,
									containerAnimation: gsap.getById('horizontal-scroll') as gsap.core.Animation,
									start: 'left 80%',
									end: 'left 20%',
									scrub: true
								}
							}
						);
					});
				});
			});
		};

		const handleResize = () => {
			clearTimeout(resizeTimer);
			checkMobile();

			// Immediate cleanup to prevent visual artifacts during resize
			if (ctx) {
				ctx.revert();
				ctx = null;
			}

			// Reset track position when switching to mobile
			if ((isMobile || isTouchDevice) && horizontalTrack) {
				horizontalTrack.style.transform = '';
			}

			// Debounce re-initialization
			resizeTimer = setTimeout(() => {
				if (!isMobile && !isTouchDevice && horizontalTrack && horizontalSection) {
					sectionHeight = '100vh';
					requestAnimationFrame(initHorizontalScroll);
				}
				ScrollTriggerInstance?.refresh();
			}, 250);
		};

		// Load GSAP dynamically and initialize
		const loadGSAP = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			gsapInstance = gsap;
			ScrollTriggerInstance = ScrollTrigger;

			// Initial start after GSAP is loaded
			setTimeout(() => {
				initHorizontalScroll();
			}, 100);
		};

		loadGSAP();

		window.addEventListener('resize', handleResize);

		return () => {
			clearTimeout(resizeTimer);
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('resize', handleResize);
			ctx?.revert();
		};
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

	<!-- Preconnect for fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />

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

<!-- Main Content Wrapper -->
<main id="main-content">

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE ARRIVAL (HERO)
     Large, serene typography with avatar on the right
     ═══════════════════════════════════════════════════════════════════════════ -->
<section
	id="hero"
	class="hero relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-12 lg:px-20"
	aria-label="Introduction"
>
	<!-- Ambient background elements with parallax -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="ambient-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20"
			style="background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%); filter: blur(80px);"
			use:parallax={{ speed: -0.15 }}
		></div>
		<div
			class="ambient-blob absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full opacity-15"
			style="background: radial-gradient(circle, var(--color-tension) 0%, transparent 70%); filter: blur(60px);"
			use:parallax={{ speed: -0.25 }}
		></div>
		<!-- Additional decorative element for more depth -->
		<div
			class="absolute top-1/2 right-1/3 h-48 w-48 rounded-full opacity-10"
			style="background: radial-gradient(circle, var(--color-ink) 0%, transparent 70%); filter: blur(60px);"
			use:parallax={{ speed: -0.1 }}
		></div>
	</div>

	<!-- Main content - horizontal layout with parallax fade -->
	<div
		class="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-16"
		use:parallaxScale={{ scaleStart: 1, scaleEnd: 0.95, opacityStart: 1, opacityEnd: 0.3, start: 'top top', end: '80% top' }}
	>
		<!-- Left side: Text content -->
		<div class="flex-1 text-center lg:text-left" data-load="hero-content">
			<!-- Subtle greeting badge -->
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

			<!-- Large, serene name -->
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
					data-load="hero-name"
					use:textReveal={{ stagger: 0.025, duration: 1, y: 80, rotationX: -60, delay: 0.3 }}
				>
					Santiago Vazquez
				</span>
			</h1>

			<!-- Subtle role description -->
			<div data-load="hero-subtitle" class="mb-8">
				<p
					class="max-w-lg leading-relaxed font-light text-[--color-ink]/50 text-base md:text-lg lg:text-xl"
					style="font-family: var(--font-headline); font-style: italic;"
				>
					Building products that scale — from municipal AI systems to IoT solutions
				</p>
			</div>

			<!-- Single elegant CTA -->
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

		<!-- Right side: Animated Avatar -->
		<div
			class="mx-auto w-full max-w-[280px] flex-shrink-0 md:max-w-[360px] lg:mx-0 lg:max-w-[480px]"
			data-load="hero-avatar"
		>
			<AnimatedAvatar size={500} imageSrc={Memoji} showStatus={true} />
		</div>
	</div>

	<!-- Bottom decoration -->
	<div class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
		<div class="flex flex-col items-center gap-2 opacity-20">
			<div
				class="h-16 w-[1px] bg-gradient-to-b from-transparent via-[--color-ink] to-transparent"
			></div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE ARTIFACTS (PROJECTS)
     Horizontal scroll gallery of work
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

	<!-- Horizontal scroll container (desktop) / Vertical stack (mobile/touch) -->
	{#if isMobile || isTouchDevice}
		<div class="space-y-8 px-6 pb-24">
			{#each projects as project, i (project.id)}
				<div class="project-card-wrapper" style="--card-index: {i}">
					<ProjectCard
						title={project.title}
						subtitle={project.subtitle}
						description={project.description}
						year={project.year}
						tags={project.tags}
						image={project.image}
						accentColor={project.color}
						href={project.href}
						index={i}
						metrics={project.metrics}
					/>
				</div>
			{/each}
		</div>
	{:else}
		<div
			bind:this={horizontalSection}
			class="horizontal-scroll-section relative overflow-hidden"
			style="height: {sectionHeight}"
		>
			<div class="sticky top-0 flex h-screen items-center overflow-hidden">
				<div
					bind:this={horizontalTrack}
					class="horizontal-track flex gap-8 pr-[50vw] pl-20"
					style="will-change: transform"
				>
					{#each projects as project, i (project.id)}
						<div
							class="project-card-wrapper flex-shrink-0"
							style="--card-index: {i}; width: min(600px, 80vw)"
						>
							<ProjectCard
								title={project.title}
								subtitle={project.subtitle}
								description={project.description}
								year={project.year}
								tags={project.tags}
								image={project.image}
								accentColor={project.color}
								href={project.href}
								index={i}
								metrics={project.metrics}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE PROCESS (TECH STACK)
     Interactive "Toolbox" drawer system
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="process" class="relative bg-[--color-surface] px-6 py-24 md:py-32" aria-label="Technical Skills">
	<!-- Grain overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-30"
		style="background-image: var(--glass-grain); background-repeat: repeat"
	></div>

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

		<TechStack skills={technicalSkills} />

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
     A combined timeline that feels like a journal
     ═══════════════════════════════════════════════════════════════════════════ -->
<section id="archive" class="relative px-6 py-24 md:py-32" aria-label="Career Journey">
	<div class="mx-auto max-w-4xl">
		<div
			class="mb-8 text-center"
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
		</div>

		<StudioJournal
			timeline={timelineData}
			{education}
			{philosophies}
			bio={professionalProfile.bio as unknown as string[]}
		/>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     THE CONTACT (OUTRO)
     Bento-box style with quote and distinct social blocks
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

	<!-- Grain overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-30"
		style="background-image: var(--glass-grain); background-repeat: repeat"
	></div>

	<div class="relative z-10 mx-auto max-w-5xl">
		<!-- Section Header -->
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
				Let's Connect
			</h2>
			<p class="mx-auto mt-4 max-w-md text-[--color-ink]/50 text-base">
				Have a project in mind? I'd love to hear from you.
			</p>
		</div>

		<!-- Bento Grid -->
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" use:revealWithExit={{ blur: 15, y: 30, duration: 1, persist: true }}>
			
		<!-- Email Card (Large - spans 2 cols on lg) -->
		<a
			href="mailto:{personalInfo.email}"
			class="card group relative flex flex-col justify-between overflow-hidden p-8 md:col-span-2 lg:col-span-2 lg:row-span-2"
			use:magnetic={{ strength: 0.15, duration: 0.5 }}
			data-cursor-hover
			aria-label="Send email to {personalInfo.email}"
		>
				<!-- Hover glow -->
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

		<!-- Quote Card -->
			<div
				class="card group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 lg:col-span-3"
			>
				<div>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[--radius-md] bg-[--color-accent] text-2xl text-[--color-base] transition-transform duration-[--duration-slow] group-hover:scale-[--scale-emphasis] group-hover:rotate-6">
						❝
					</div>
					<blockquote 
						class="font-serif text-lg italic text-[--color-ink]/80 leading-relaxed"
						style="font-family: var(--font-headline)"
					>
						The next great idea is just one conversation away.
					</blockquote>
				</div>
				<div class="mt-4 flex items-center gap-2 font-mono text-xs text-[--color-ink]/40 uppercase">
					<span>— Let's talk</span>
				</div>
			</div>

		</div>

		<!-- Location & Footer info -->
		<div 
			class="mt-12 flex flex-col items-center gap-6 text-center"
			use:revealWithExit={{ blur: 8, y: 15, duration: 0.8, persist: true }}
		>
			<div class="flex items-center gap-4 text-[--color-ink]/30">
				<span class="font-mono text-xs">📍 {personalInfo.locationShort}</span>
				<span class="h-1 w-1 rounded-full bg-current"></span>
				<span class="font-mono text-xs">🕐 CST (UTC-6)</span>
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
		<span class="font-mono text-[10px] text-[--color-ink]/30">
			Built with SvelteKit + GSAP · © {new Date().getFullYear()}
		</span>
	</div>
</footer>

</div>
<!-- End Page Load Animation Wrapper -->

<style>
	/* Horizontal scroll section */
	.horizontal-scroll-section {
		isolation: isolate;
	}

	.horizontal-track {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.project-card-wrapper {
		height: fit-content;
	}

	/* Floating animation */
	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(5deg); }
	}

	/* Pulse animation for cards */
	@keyframes pulse-glow {
		0%, 100% { opacity: 0.05; }
		50% { opacity: 0.15; }
	}
</style>
