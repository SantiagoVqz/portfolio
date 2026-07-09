<script lang="ts">
	import { browser } from '$app/environment';
	import type { Project } from '$lib/constants/profile';
	import ImageCarousel from './ImageCarousel.svelte';
	import Schematic from './Schematic.svelte';
	import { schematicFor } from '$lib/constants/schematics';

	interface Props {
		project: Project | null;
		open: boolean;
		/** Figure number — matches the project's number on the home sheet. */
		fig?: number;
		onClose: () => void;
	}

	let { project, open, fig = 1, onClose }: Props = $props();

	const schematic = $derived(project ? schematicFor(project.id) : null);

	let dialogRef = $state<HTMLDialogElement>();
	let contentRef = $state<HTMLDivElement>();
	let hadCustomCursor = false;
	let animCtx: { revert: () => void } | null = null;
	let entering = $state(false);

	const imageMode = $derived(
		project?.images && project.images.length > 2
			? 'strip'
			: project?.image || (project?.images && project.images.length > 0)
				? 'single'
				: 'none'
	);

	const singleImage = $derived(
		imageMode === 'single'
			? project?.images?.[0] ?? project?.image ?? null
			: null
	);

	const sections = $derived(
		project
			? [
					{ number: '01', name: 'The Problem', body: project.caseStudy.problem },
					{ number: '02', name: 'The Approach', body: project.caseStudy.approach },
					{ number: '03', name: 'The Solution', body: project.caseStudy.solution },
					{ number: '04', name: 'The Outcome', body: project.caseStudy.outcome }
				]
			: []
	);

	$effect(() => {
		if (!dialogRef) return;
		if (open && project) {
			entering = true;
			dialogRef.showModal();
			document.body.style.overflow = 'hidden';
			hadCustomCursor = document.body.classList.contains('custom-cursor-active');
			if (hadCustomCursor) {
				document.body.classList.remove('custom-cursor-active');
			}
			animateIn();
		} else {
			document.body.style.overflow = '';
			if (hadCustomCursor) {
				document.body.classList.add('custom-cursor-active');
			}
			if (animCtx) {
				animCtx.revert();
				animCtx = null;
			}
			if (dialogRef.open) {
				dialogRef.close();
			}
			entering = false;
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogRef) {
			onClose();
		}
	}

	async function animateIn() {
		if (!browser || !contentRef) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			entering = false;
			return;
		}

		const { gsap } = await import('gsap');

		// Card entrance
		gsap.fromTo(
			contentRef,
			{ y: 30, opacity: 0, scale: 0.97 },
			{ y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
		);

		animCtx = gsap.context(() => {
			const tl = gsap.timeline({
				delay: 0.12,
				onComplete: () => {
					entering = false;
				}
			});

			// Eyebrow
			tl.fromTo(
				'.csm-eyebrow',
				{ y: 14, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
			);

			// Title
			tl.fromTo(
				'.csm-title',
				{ y: 24, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
				'-=0.3'
			);

			// Tags
			tl.fromTo(
				'.csm-tag',
				{ y: 8, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out' },
				'-=0.35'
			);

			// Divider
			tl.fromTo(
				'.csm-divider',
				{ scaleX: 0 },
				{ scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
				'-=0.15'
			);

			// Schematic figure
			tl.fromTo(
				'.csm-schematic',
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
				'-=0.2'
			);

			// Images
			tl.fromTo(
				'.csm-images',
				{ y: 24, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
				'-=0.25'
			);

			// Metrics
			tl.fromTo(
				'.csm-metric',
				{ y: 16, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' },
				'-=0.2'
			);

			// Case study sections
			tl.fromTo(
				'.csm-section',
				{ y: 24, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.45, stagger: 0.09, ease: 'power3.out' },
				'-=0.15'
			);

			// Footer CTA
			tl.fromTo(
				'.csm-footer',
				{ y: 12, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
				'-=0.1'
			);
		}, contentRef);
	}
</script>

<dialog
	bind:this={dialogRef}
	class="csm-dialog"
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
	aria-modal="true"
	aria-label="{project?.title ?? 'Case Study'} case study"
>
	{#if project}
		<div
			class="csm-content"
			class:csm-entering={entering}
			bind:this={contentRef}
			role="document"
			style="--project-color: {project.color}"
		>
			<!-- Grain texture -->
			<div class="csm-grain"></div>

			<!-- Subtle top gradient tinted by project color -->
			<div class="csm-hero-gradient"></div>

			<!-- Close button -->
			<button class="csm-close" onclick={onClose} aria-label="Close case study">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>

			<!-- Scrollable interior -->
			<div class="csm-scroll" data-lenis-prevent>
				<!-- Header -->
				<header class="csm-header">
					<span class="csm-eyebrow">{project.subtitle} &middot; {project.year}</span>
					<h2 class="csm-title">{project.title}</h2>
					<div class="csm-tags">
						{#each project.tags as tag (tag)}
							<span class="csm-tag">{tag}</span>
						{/each}
					</div>
				</header>

				<!-- Accent divider -->
				<div class="csm-divider"></div>

				<!-- The figure — same schematic as the home sheet -->
				{#if schematic}
					<figure class="csm-schematic" aria-label="{project.title} architecture diagram">
						<Schematic def={schematic} {fig} delay={0.35} />
					</figure>
				{/if}

				<!-- Image zone -->
				{#if imageMode === 'strip' && project.images}
					<div class="csm-images csm-images--strip">
						<ImageCarousel
							images={project.images}
							alt="{project.title} screenshot"
							accentColor={project.color}
							variant="strip"
						/>
					</div>
				{:else if imageMode === 'single' && singleImage}
					<figure class="csm-images csm-images--single">
						<img src={singleImage} alt={project.title} loading="lazy" />
					</figure>
				{/if}

				<!-- Metrics -->
				{#if project.metrics && project.metrics.length > 0}
					<div class="csm-metrics">
						{#each project.metrics as metric (metric.label)}
							<div class="csm-metric">
								<span class="csm-metric-value">{metric.value}</span>
								<span class="csm-metric-label">{metric.label}</span>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Case study sections -->
				<div class="csm-body">
					{#each sections as section (section.number)}
						<section class="csm-section">
							<div class="csm-section-header">
								<span class="csm-section-number">{section.number}</span>
								<span class="csm-section-name">{section.name}</span>
							</div>
							<p class="csm-section-text">{section.body}</p>
						</section>
					{/each}
				</div>

				<!-- Footer CTA -->
				{#if project.href}
					<footer class="csm-footer">
						<a
							href={project.href}
							target="_blank"
							rel="noopener noreferrer"
							class="csm-cta"
						>
							<span>View Project</span>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M7 17L17 7M17 7H7M17 7v10" />
							</svg>
						</a>
					</footer>
				{/if}
			</div>
		</div>
	{/if}
</dialog>

<style>
	/* ══════════════════════════════════════════
	   DIALOG SHELL
	   ══════════════════════════════════════════ */
	.csm-dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		z-index: 1000;
		display: none;
		visibility: hidden;
		pointer-events: none;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.csm-dialog[open] {
		display: flex;
		visibility: visible;
		pointer-events: auto;
	}

	.csm-dialog::backdrop {
		background: rgba(54, 50, 47, 0.6);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* ══════════════════════════════════════════
	   GLASS CARD
	   ══════════════════════════════════════════ */
	.csm-content {
		position: relative;
		max-width: 1060px;
		width: 96vw;
		max-height: 90vh;
		border-radius: var(--radius-2xl, 1.5rem);
		background: color-mix(in srgb, var(--color-base) 92%, transparent);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid color-mix(in srgb, var(--color-ink) 7%, transparent);
		box-shadow:
			0 32px 64px -16px rgba(54, 50, 47, 0.2),
			0 0 0 1px rgba(253, 252, 248, 0.08) inset;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 768px) {
		.csm-content {
			width: 92vw;
		}
	}

	@media (min-width: 1024px) {
		.csm-content {
			width: 92vw;
		}
	}

	@media (min-width: 1200px) {
		.csm-content {
			width: 1060px;
		}
	}

	/* Grain texture */
	.csm-grain {
		position: absolute;
		inset: 0;
		background-image: var(--glass-grain);
		background-repeat: repeat;
		opacity: 0.12;
		pointer-events: none;
		z-index: 5;
		border-radius: inherit;
	}

	/* Hero gradient — project-colored tint at top */
	.csm-hero-gradient {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 260px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--project-color) 7%, transparent) 0%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 1;
		border-radius: inherit;
	}

	/* ══════════════════════════════════════════
	   ENTERING STATE (elements hidden before GSAP)
	   ══════════════════════════════════════════ */
	.csm-entering .csm-eyebrow,
	.csm-entering .csm-title,
	.csm-entering .csm-tag,
	.csm-entering .csm-divider,
	.csm-entering .csm-schematic,
	.csm-entering .csm-images,
	.csm-entering .csm-metric,
	.csm-entering .csm-section,
	.csm-entering .csm-footer {
		opacity: 0;
	}

	/* ══════════════════════════════════════════
	   CLOSE BUTTON
	   ══════════════════════════════════════════ */
	.csm-close {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--color-base) 85%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		border-radius: 50%;
		color: var(--color-ink);
		cursor: pointer;
		z-index: 10;
		transition: all 220ms ease;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.csm-close:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
		transform: scale(1.05);
	}

	/* ══════════════════════════════════════════
	   SCROLLABLE INTERIOR
	   ══════════════════════════════════════════ */
	.csm-scroll {
		position: relative;
		z-index: 2;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		padding: 2.5rem 1.75rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 0;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--project-color) 25%, transparent) transparent;
	}

	@media (min-width: 768px) {
		.csm-scroll {
			padding: 3rem 2.75rem 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.csm-scroll {
			padding: 3.5rem 3.25rem 3rem;
		}
	}

	.csm-scroll::-webkit-scrollbar {
		width: 4px;
	}

	.csm-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.csm-scroll::-webkit-scrollbar-thumb {
		background: color-mix(in srgb, var(--project-color) 25%, transparent);
		border-radius: 2px;
	}

	/* ══════════════════════════════════════════
	   HEADER
	   ══════════════════════════════════════════ */
	.csm-header {
		padding-top: 0.25rem;
		margin-bottom: 1.75rem;
	}

	.csm-eyebrow {
		font-family: var(--font-data);
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--project-color) 55%, var(--color-ink));
		display: block;
		margin-bottom: 1rem;
	}

	.csm-title {
		font-family: var(--font-headline);
		font-size: 2.5rem;
		font-weight: 380;
		color: var(--color-ink);
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin: 0 0 1.25rem;
	}

	@media (min-width: 768px) {
		.csm-title {
			font-size: 3rem;
		}
	}

	@media (min-width: 1024px) {
		.csm-title {
			font-size: 3.5rem;
		}
	}

	.csm-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.csm-tag {
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 0.3rem 0.7rem;
		background: color-mix(in srgb, var(--project-color) 10%, var(--color-surface));
		color: color-mix(in srgb, var(--project-color) 50%, var(--color-ink));
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--project-color) 18%, transparent);
	}

	/* ══════════════════════════════════════════
	   ACCENT DIVIDER
	   ══════════════════════════════════════════ */
	.csm-divider {
		height: 1px;
		background: color-mix(in srgb, var(--project-color) 45%, var(--color-ink) 15%);
		margin-bottom: 2rem;
		transform-origin: center;
	}

	/* ══════════════════════════════════════════
	   IMAGE ZONE
	   ══════════════════════════════════════════ */
	/* ══════════════════════════════════════════
	   SCHEMATIC FIGURE
	   ══════════════════════════════════════════ */
	.csm-schematic {
		margin: 0 auto 2.25rem;
		max-width: 640px;
		width: 100%;
		/* Keep figure text readable on narrow screens: pan, don't shrink */
		overflow-x: auto;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
	}

	.csm-schematic :global(svg) {
		min-width: 33rem;
	}

	@media (min-width: 640px) {
		.csm-schematic {
			overflow-x: visible;
		}
		.csm-schematic :global(svg) {
			min-width: 0;
		}
	}

	.csm-images {
		margin-bottom: 2rem;
	}

	/* Strip mode — full bleed with negative margins */
	.csm-images--strip {
		margin-left: -1.75rem;
		margin-right: -1.75rem;
	}

	@media (min-width: 768px) {
		.csm-images--strip {
			margin-left: -2.75rem;
			margin-right: -2.75rem;
		}
	}

	@media (min-width: 1024px) {
		.csm-images--strip {
			margin-left: -3.25rem;
			margin-right: -3.25rem;
		}
	}

	/* Single image */
	.csm-images--single {
		display: block;
		margin: 0 0 2rem;
		padding: 1rem;
		overflow: hidden;
		border-radius: var(--radius-lg);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
		background: var(--color-surface);
		flex-shrink: 0;
	}

	.csm-images--single img {
		width: 100%;
		height: auto;
		max-height: 420px;
		object-fit: contain;
		display: block;
		border-radius: var(--radius-md);
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.csm-images--single img {
			max-height: 460px;
		}
	}

	/* ══════════════════════════════════════════
	   METRICS
	   ══════════════════════════════════════════ */
	.csm-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
		margin-bottom: 2.5rem;
	}

	.csm-metric {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 1rem 1.125rem;
		background: color-mix(in srgb, var(--color-surface) 65%, transparent);
		border-radius: var(--radius-md);
		border: 1px solid color-mix(in srgb, var(--color-ink) 5%, transparent);
		border-top: 2px solid color-mix(in srgb, var(--project-color) 50%, var(--color-ink) 10%);
	}

	.csm-metric-value {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 500;
		color: color-mix(in srgb, var(--project-color) 60%, var(--color-ink));
		line-height: 1;
		letter-spacing: -0.01em;
	}

	@media (min-width: 768px) {
		.csm-metric-value {
			font-size: 1.75rem;
		}
	}

	.csm-metric-label {
		font-family: var(--font-data);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.45;
	}

	/* ══════════════════════════════════════════
	   CASE STUDY BODY
	   ══════════════════════════════════════════ */
	.csm-body {
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
		margin-bottom: 2.5rem;
	}

	.csm-section {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	/* Two-column rhythm on desktop: number + name rail, prose right */
	@media (min-width: 768px) {
		.csm-section {
			display: grid;
			grid-template-columns: 150px 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}

	.csm-section-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.csm-section-number {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 350;
		color: color-mix(in srgb, var(--project-color) 60%, var(--color-ink));
		line-height: 1;
		letter-spacing: -0.01em;
	}

	@media (min-width: 768px) {
		.csm-section-number {
			font-size: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.csm-section-number {
			font-size: 2rem;
		}
	}

	.csm-section-name {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.csm-section-text {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.85;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	@media (min-width: 768px) {
		.csm-section-text {
			font-size: 0.9375rem;
		}
	}

	/* ══════════════════════════════════════════
	   FOOTER / CTA
	   ══════════════════════════════════════════ */
	.csm-footer {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.csm-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		font-family: var(--font-data);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: var(--color-ink);
		padding: 0.8rem 1.4rem;
		border-radius: var(--radius-full);
		text-decoration: none;
		cursor: pointer;
		transition: all 250ms ease;
		width: fit-content;
	}

	.csm-cta:hover {
		background: var(--project-color);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px -4px color-mix(in srgb, var(--project-color) 40%, transparent);
	}

	.csm-cta svg {
		transition: transform 250ms ease;
	}

	.csm-cta:hover svg {
		transform: translate(2px, -2px);
	}
</style>
