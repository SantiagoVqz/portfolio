<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';
	import { magnetic } from '$lib/actions/magnetic';
	import { reveal, revealWithExit } from '$lib/actions/reveal';
	import MagneticButton from '$lib/components/MagneticButton.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import AnimatedAvatar from '$lib/components/AnimatedAvatar.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Timeline from '$lib/components/Timeline.svelte';

	// Import all data from constants
	import {
		personalInfo,
		professionalProfile,
		technicalSkills,
		languages,
		projects,
		education,
		philosophies,
		navLinks,
		meta
	} from '$lib/constants';

	gsap.registerPlugin(ScrollTrigger);

// Refs for horizontal scroll
let horizontalSection = $state<HTMLElement | null>(null);
let horizontalTrack = $state<HTMLElement | null>(null);
	let isMobile = $state(false);
	let sectionHeight = $state<string>('100vh'); // Default height, will be calculated dynamically

	onMount(() => {
		// Check if mobile
		const checkMobile = () => {
			isMobile = window.innerWidth < 1024;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Initialize horizontal scroll for desktop only
		let ctx: gsap.Context | null = null;

		const initHorizontalScroll = () => {
			if (isMobile || !horizontalSection || !horizontalTrack) return;

			// Calculate height first, before creating ScrollTrigger
			const cards = horizontalTrack.querySelectorAll('.project-card-wrapper');
			const totalWidth = horizontalTrack.scrollWidth;
			const viewportWidth = window.innerWidth;
			const scrollDistance = Math.max(0, totalWidth - viewportWidth);

			// Ensure section height is viewport height for pinning
			sectionHeight = '100vh';

			// Wait for height to be applied before creating ScrollTrigger
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

					// Animate each card as it comes into view
					cards.forEach((card, i) => {
						gsap.fromTo(
							card,
							{
								opacity: 0.3,
								scale: 0.95
							},
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

		// Delay initialization to ensure DOM is ready
		const timer = setTimeout(() => {
			initHorizontalScroll();
		}, 100);

		const handleResize = () => {
			checkMobile();
			// Revert existing context and reinitialize on resize
			if (ctx) {
				ctx.revert();
				ctx = null;
			}
			// Recalculate height on resize
			if (!isMobile && horizontalTrack && horizontalSection) {
				const totalWidth = horizontalTrack.scrollWidth;
				const viewportWidth = window.innerWidth;
				const scrollDistance = Math.max(0, totalWidth - viewportWidth);
				sectionHeight = '100vh';
				// Reinitialize after a brief delay to ensure height is applied
				setTimeout(() => {
					initHorizontalScroll();
				}, 50);
			}
			ScrollTrigger.refresh();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('resize', handleResize);
			ctx?.revert();
		};
	});

	const highlightTerms = ['CityFront AI', 'Tecnológico de Monterrey', 'IÉSEG School of Management'];

	function getBioSegments(paragraph: string) {
		const pattern = new RegExp(`(${highlightTerms.join('|')})`, 'g');
		return paragraph
			.split(pattern)
			.filter(Boolean)
			.map((part) => ({
				text: part,
				highlight: highlightTerms.includes(part)
			}));
	}
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>

<!-- Snippets for repeating UI elements -->
{#snippet sectionLabel(text: string)}
	<span
		class="inline-block font-mono text-[10px] uppercase tracking-widest mb-4"
		style="color: var(--color-accent)"
	>
		{text}
	</span>
{/snippet}

{#snippet socialLink(href: string, label: string, icon: string)}
	<a
		{href}
		target="_blank"
		rel="noopener noreferrer"
		class="group flex items-center gap-3 px-5 py-3 rounded-full border border-[--color-ink]/20
			   transition-all duration-300 hover:border-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-base]"
		use:magnetic={{ strength: 0.3, duration: 0.4 }}
		data-cursor-hover
	>
		<span class="text-lg">{icon}</span>
		<span class="font-mono text-xs uppercase tracking-widest">{label}</span>
	</a>
{/snippet}

{#snippet bentoItem(item: typeof technicalSkills[0], index: number)}
	<div
		class="bento-item bento-{item.size} relative bg-[--color-surface] rounded-2xl p-5
			   flex flex-col justify-between overflow-hidden"
		use:magnetic={{ strength: 0.12, duration: 0.5 }}
		use:revealWithExit={{ blur: 8, y: 20, duration: 0.8, persist: true }}
		style="--delay: {index * 0.05}s; box-shadow: var(--shadow-diffused)"
		data-cursor-hover
	>
		<span class="font-mono text-[10px] uppercase tracking-widest text-[--color-tension]/50">
			{item.category}
		</span>
		<span
			class="font-serif text-xl md:text-2xl font-medium tracking-tight text-[--color-ink]"
			style="font-family: var(--font-headline)"
			class:text-3xl={item.size === 'large'}
		>
			{item.name}
		</span>
		<div
			class="absolute inset-0 pointer-events-none opacity-20"
			style="background-image: var(--glass-grain); background-repeat: repeat"
		></div>
	</div>
{/snippet}

{#snippet languageItem(lang: typeof languages[0], index: number)}
	<div
		class="flex items-center gap-3 px-4 py-3 bg-[--color-surface] rounded-xl"
		use:revealWithExit={{ blur: 6, y: 15, duration: 0.6, persist: true }}
		style="--delay: {index * 0.1}s; box-shadow: var(--shadow-diffused)"
	>
		<span class="text-2xl">{lang.flag}</span>
		<div class="flex flex-col">
			<span class="font-serif text-sm font-medium text-[--color-ink]" style="font-family: var(--font-headline)">{lang.name}</span>
			<span class="font-mono text-[10px] uppercase tracking-widest text-[--color-tension]/70">{lang.proficiency}</span>
		</div>
	</div>
{/snippet}

<!-- Navigation -->
<Navbar brand={personalInfo.shortName} links={navLinks} />

<!-- Hero Section -->
<section class="hero min-h-screen flex items-center justify-center relative overflow-hidden px-6 pt-24 pb-16">
	<div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
		<!-- Left: Content -->
		<div class="order-2 lg:order-1 text-center lg:text-left">
			<!-- Location badge -->
			<div use:revealWithExit={{ blur: 8, y: 15, duration: 0.8, persist: true }} class="mb-6">
				<span
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--color-surface] border border-[--color-ink]/10"
					style="box-shadow: var(--shadow-diffused)"
				>
					<span class="w-2 h-2 rounded-full bg-[--color-tension] animate-pulse"></span>
					<span class="font-mono text-[10px] uppercase tracking-widest text-[--color-ink]/60">
						{personalInfo.locationShort} · {personalInfo.availability}
					</span>
				</span>
			</div>

			<!-- Name & Title -->
			<div use:revealWithExit={{ blur: 12, y: 25, duration: 1, persist: true }}>
				{@render sectionLabel(personalInfo.title)}
			</div>

			<h1
				class="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-6 text-[--color-ink]"
				use:revealWithExit={{ blur: 20, y: 40, duration: 1.2, persist: true }}
				style="font-family: var(--font-headline)"
			>
				<span class="block">Hi, I'm</span>
				<span class="block italic text-[--color-accent]">{personalInfo.shortName}</span>
			</h1>

			<!-- Tagline -->
			<p
				class="text-base md:text-lg text-[--color-ink]/70 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
				use:revealWithExit={{ blur: 10, y: 30, duration: 1, persist: true }}
			>
				{professionalProfile.tagline}
			</p>

			<!-- CTAs -->
			<div class="flex flex-wrap gap-4 justify-center lg:justify-start" use:revealWithExit={{ blur: 8, y: 20, duration: 1, persist: true }}>
				<MagneticButton href="#work" variant="primary" size="lg">
					<span>View My Work</span>
				</MagneticButton>
				<MagneticButton href="#contact" variant="secondary" size="lg">
					<span>Get in Touch</span>
				</MagneticButton>
			</div>
		</div>

		<!-- Right: Avatar -->
		<div class="order-1 lg:order-2 flex justify-center" use:revealWithExit={{ blur: 15, y: 30, duration: 1.2, settle: false, persist: true }}>
			<AnimatedAvatar size={300} />
		</div>
	</div>
</section>

<!-- Work Section: Horizontal Scroll -->
<section id="work" class="relative">
	<!-- Section header -->
	<div class="px-6 md:px-12 lg:px-20 py-24">
		<div class="max-w-6xl mx-auto" use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionLabel('Selected Work')}
			<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[--color-ink]" style="font-family: var(--font-headline)">
				Projects I've Built
			</h2>
			<p class="mt-4 text-base text-[--color-ink]/60 max-w-xl">
				From enterprise SaaS to embedded systems—here's a selection of products I've shipped.
			</p>
		</div>
	</div>

	<!-- Horizontal scroll container (desktop) / Vertical stack (mobile) -->
	{#if isMobile}
		<!-- Mobile: Vertical stack -->
		<div class="px-6 pb-24 space-y-8">
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
		<!-- Desktop: Horizontal scroll -->
		<div
			bind:this={horizontalSection}
			class="horizontal-scroll-section relative overflow-hidden"
			style="height: {sectionHeight}"
		>
			<div class="sticky top-0 h-screen flex items-center overflow-hidden">
				<div
					bind:this={horizontalTrack}
					class="horizontal-track flex gap-8 pl-20 pr-[50vw]"
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

<!-- Timeline Section -->
<section id="timeline" class="relative py-24 md:py-32 px-6">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16" use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionLabel('My Journey')}
			<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[--color-ink]" style="font-family: var(--font-headline)">
				Experience & Education
			</h2>
		</div>
		<Timeline />
	</div>
</section>

<!-- About Section -->
<section id="about" class="relative bg-[--color-surface] py-24 md:py-32 px-6 md:px-12 lg:px-20">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
			<!-- Left: Bio -->
			<div use:revealWithExit={{ blur: 15, y: 40, duration: 1.2, persist: true }}>
				{@render sectionLabel('About Me')}
				<h2
					class="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-8 text-[--color-ink]"
					style="font-family: var(--font-headline)"
				>
					I turn complex problems into<br />
					<em class="text-[--color-accent]">elegant solutions.</em>
				</h2>
				<div class="space-y-4 text-base text-[--color-ink]/70 leading-relaxed max-w-lg">
					{#each professionalProfile.bio as paragraph, idx (idx)}
						<p>
							{#each getBioSegments(paragraph) as segment, segIdx (segIdx)}
								{#if segment.highlight}
									<strong>{segment.text}</strong>
								{:else}
									{segment.text}
								{/if}
							{/each}
						</p>
					{/each}
				</div>

				<!-- Languages -->
				<div class="mt-8">
					<span class="font-mono text-[10px] uppercase tracking-widest text-[--color-ink]/50 block mb-4">Languages</span>
					<div class="flex flex-wrap gap-3">
						{#each languages as lang, i (lang.name)}
							{@render languageItem(lang, i)}
						{/each}
					</div>
				</div>

				<!-- Education -->
				<div class="mt-8">
					<span class="font-mono text-[10px] uppercase tracking-widest text-[--color-ink]/50 block mb-4">Education</span>
					<div class="space-y-4">
						{#each education as edu (edu.institution)}
							<div
								class="p-4 bg-[--color-base] rounded-xl"
								use:revealWithExit={{ blur: 6, y: 15, duration: 0.6, persist: true }}
								style="box-shadow: var(--shadow-diffused)"
							>
								<div class="flex items-start justify-between gap-4">
									<div>
										<h4 class="font-serif text-base font-medium text-[--color-ink]" style="font-family: var(--font-headline)">{edu.institution}</h4>
										<p class="font-mono text-xs text-[--color-ink]/60 mt-1">{edu.degree}{edu.focus ? ` • ${edu.focus}` : ''}</p>
									</div>
									{#if edu.gpa}
										<span class="px-2 py-1 bg-[--color-accent]/10 rounded-full font-mono text-[10px] text-[--color-accent] font-medium">
											{edu.gpa} GPA
										</span>
									{/if}
								</div>
								<p class="font-mono text-[10px] text-[--color-ink]/40 mt-2">{edu.location} • {edu.period}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right: Philosophy -->
			<div class="space-y-8 lg:pt-16">
				{#each philosophies as philosophy, i (philosophy.number)}
					<div
						class="pl-8 border-l-2 border-[--color-tension]"
						use:revealWithExit={{ blur: 10, y: 30, duration: 1, persist: true }}
						style="--delay: {i * 0.15}s"
					>
						<span class="font-mono text-xs uppercase tracking-widest text-[--color-ink]/50 block mb-2">{philosophy.number}</span>
						<h4 class="font-serif text-xl font-medium tracking-tight mb-2 text-[--color-ink]" style="font-family: var(--font-headline)">
							{philosophy.title}
						</h4>
						<p class="text-sm text-[--color-ink]/60 leading-relaxed">
							{philosophy.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Grain overlay -->
	<div
		class="absolute inset-0 pointer-events-none opacity-30"
		style="background-image: var(--glass-grain); background-repeat: repeat"
	></div>
</section>

<!-- Tech Stack Bento -->
<section id="stack" class="py-24 md:py-32 px-6 md:px-12 lg:px-20">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-16" use:revealWithExit={{ blur: 12, y: 30, duration: 1, persist: true }}>
			{@render sectionLabel('Toolkit')}
			<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[--color-ink]" style="font-family: var(--font-headline)">
				Technologies I Use
			</h2>
		</div>

		<div class="bento-grid grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
			{#each technicalSkills as item, i (item.name)}
				{@render bentoItem(item, i)}
			{/each}
		</div>
	</div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-24 md:py-32 px-6">
	<div class="max-w-3xl mx-auto text-center" use:revealWithExit={{ blur: 20, y: 50, duration: 1.2, persist: true }}>
		{@render sectionLabel("Let's Connect")}
		<h2
			class="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight mb-8 text-[--color-ink]"
			style="font-family: var(--font-headline)"
		>
			Got a project?<br />
			<span class="text-[--color-accent]">Let's talk.</span>
		</h2>

		<p class="text-base md:text-lg text-[--color-ink]/60 max-w-md mx-auto mb-12">
			I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
		</p>

		<!-- Contact Links -->
		<div class="flex flex-wrap justify-center gap-4 mb-12">
			{@render socialLink(`mailto:${personalInfo.email}`, 'Email', '✉')}
			{@render socialLink(`tel:${personalInfo.phone}`, 'Phone', '📞')}
			{@render socialLink(personalInfo.social.github, 'GitHub', '🐙')}
			{@render socialLink(personalInfo.social.linkedin, 'LinkedIn', '💼')}
		</div>

		<!-- Primary email CTA -->
		<a
			href="mailto:{personalInfo.email}"
			class="group inline-flex items-center gap-4 px-10 py-5 rounded-full
				   bg-[--color-ink] text-[--color-base]
				   transition-all duration-300 hover:bg-[--color-accent]"
			use:magnetic={{ strength: 0.5, duration: 0.6 }}
			data-cursor-hover
		>
			<span class="font-mono text-sm md:text-base tracking-widest">{personalInfo.email}</span>
			<span class="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="py-8 px-6 border-t border-[--color-ink]/10">
	<div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
		<span class="font-serif text-sm font-medium text-[--color-ink]" style="font-family: var(--font-headline)">
			{personalInfo.shortName}
		</span>
		<span class="font-mono text-xs text-[--color-ink]/50">
			Built with SvelteKit + GSAP · © {new Date().getFullYear()}
		</span>
	</div>
</footer>

<style>
	/* Bento grid sizing */
	.bento-large {
		grid-column: span 2;
		min-height: 140px;
	}

	.bento-medium {
		grid-column: span 2;
		min-height: 100px;
	}

	@media (min-width: 768px) {
		.bento-medium {
			grid-column: span 1;
		}
	}

	.bento-small {
		grid-column: span 1;
		min-height: 80px;
	}

	.bento-item {
		transition: box-shadow 0.3s ease;
	}

	.bento-item:hover {
		box-shadow: var(--shadow-deep);
	}

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
</style>
