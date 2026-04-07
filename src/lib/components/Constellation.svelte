<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { TimelineItem, Education, Philosophy } from '$lib/constants/profile';
	import { revealWithExit } from '$lib/actions/reveal';

	interface Props {
		timeline: TimelineItem[];
		education: Education[];
		philosophies: Philosophy[];
		bio: string[];
	}

	let { timeline, education, philosophies, bio }: Props = $props();

	let containerRef = $state<HTMLElement>();
	let threadRef = $state<HTMLDivElement>();
	let entryRefs: HTMLElement[] = $state([]);

	// Merge education into timeline for a unified story
	const unifiedTimeline = $derived.by(() => {
		// The timeline already contains education entries, work entries, and milestones.
		// We enrich them with additional data from the education array where applicable.
		return timeline.map((item) => {
			// Find matching education entry for richer data
			const matchingEdu = education.find(
				(edu) =>
					edu.institution === item.company ||
					(item.type === 'education' && edu.institution.includes(item.company.split(' ')[0]))
			);
			return {
				...item,
				education: matchingEdu ?? null
			};
		});
	});

	// Type badge labels
	function getTypeBadge(type: string): string {
		if (type === 'milestone') return 'Milestone';
		if (type === 'work') return 'Experience';
		return 'Education';
	}

	// Accent color per type
	function getTypeColor(type: string): string {
		if (type === 'milestone') return 'var(--color-gold)';
		if (type === 'work') return 'var(--color-accent)';
		return 'var(--color-tension)';
	}

	onMount(() => {
		if (!browser) return;

		let ctx: gsap.Context | null = null;

		const initGSAP = async () => {
			if (!containerRef) return;
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				// Animate the thread height as user scrolls
				if (threadRef) {
					gsap.fromTo(
						threadRef,
						{ scaleY: 0 },
						{
							scaleY: 1,
							ease: 'none',
							scrollTrigger: {
								trigger: containerRef,
								start: 'top 60%',
								end: 'bottom 40%',
								scrub: 0.8
							}
						}
					);
				}

				// Staggered entry reveal
				entryRefs.forEach((entry, i) => {
					if (!entry) return;

					const marker = entry.querySelector('.timeline-marker');
					const content = entry.querySelector('.timeline-body');

					if (marker) {
						gsap.fromTo(
							marker,
							{ scale: 0, opacity: 0 },
							{
								scale: 1,
								opacity: 1,
								duration: 0.5,
								ease: 'back.out(2)',
								scrollTrigger: {
									trigger: entry,
									start: 'top 80%',
									toggleActions: 'play none none reverse'
								}
							}
						);
					}

					if (content) {
						gsap.fromTo(
							content,
							{ opacity: 0, y: 30, filter: 'blur(6px)' },
							{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
								duration: 0.7,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: entry,
									start: 'top 78%',
									toggleActions: 'play none none reverse'
								}
							}
						);
					}
				});
			}, containerRef);
		};

		initGSAP();

		return () => {
			ctx?.revert();
		};
	});
</script>

<div class="journey-container" bind:this={containerRef}>
	<!-- Opening statement — the bio as a rich editorial lead-in -->
	<div class="journey-opening" use:revealWithExit={{ blur: 14, y: 30, duration: 1, persist: true }}>
		<div class="opening-rule"></div>
		<blockquote class="opening-quote">
			{bio[0]}
		</blockquote>
		<div class="opening-body">
			{#each bio.slice(1) as paragraph, idx (idx)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	<!-- Timeline -->
	<div class="timeline">
		<!-- The continuous thread -->
		<div class="timeline-thread-track">
			<div class="timeline-thread" bind:this={threadRef}></div>
		</div>

		{#each unifiedTimeline as item, i (item.year + item.company)}
			<article
				class="timeline-entry"
				class:entry-right={i % 2 !== 0}
				class:is-current={item.current}
				bind:this={entryRefs[i]}
			>
				<!-- Marker on the thread -->
				<div class="timeline-marker" style="--type-color: {getTypeColor(item.type)}">
					<div class="marker-ring" class:marker-current={item.current}>
						{#if item.current}
							<div class="marker-pulse"></div>
						{/if}
						{#if item.type === 'milestone'}
							<div class="marker-star">&#9670;</div>
						{:else}
							<div class="marker-dot"></div>
						{/if}
					</div>
				</div>

				<!-- Year — large typographic anchor -->
				<div class="timeline-year-col">
					<span class="timeline-year">{item.year}</span>
				</div>

				<!-- Content card -->
				<div class="timeline-body">
					<div class="body-header">
						<span class="mobile-year-inline">{item.year}</span>
						<span class="type-badge" style="--type-color: {getTypeColor(item.type)}">
							{getTypeBadge(item.type)}
						</span>
						{#if item.current}
							<span class="current-badge">Current</span>
						{/if}
					</div>

					<h4 class="body-title">{item.title}</h4>
					<span class="body-company">{item.company}</span>

					<!-- Period -->
					<span class="body-period">
						{item.year}{#if item.current}
							{' '}– Present
						{:else if item.endYear}
							{' '}– {item.endYear}
						{/if}
					</span>

					<p class="body-description">{item.description}</p>

					{#if item.education}
						<div class="body-education-detail">
							<span class="edu-detail-degree">{item.education.degree}</span>
							{#if item.education.focus}
								<span class="edu-detail-focus">{item.education.focus}</span>
							{/if}
							<span class="edu-detail-meta">
								{item.education.location}{item.education.gpa ? ` · ${item.education.gpa} GPA` : ''}
							</span>
						</div>
					{/if}
				</div>
			</article>
		{/each}
	</div>

	<!-- Guiding Principles — as a refined coda -->
	<div class="principles-section">
		<div class="principles-header" use:revealWithExit={{ blur: 10, y: 20, duration: 0.8, persist: true }}>
			<div class="principles-rule"></div>
			<h4 class="principles-title">Guiding Principles</h4>
			<div class="principles-rule"></div>
		</div>

		<div class="principles-grid">
			{#each philosophies as philosophy (philosophy.number)}
				<div
					class="principle-card"
					use:revealWithExit={{ blur: 8, y: 20, duration: 0.7, persist: true }}
				>
					<span class="principle-index">{philosophy.number}</span>
					<div class="principle-content">
						<h5 class="principle-name">{philosophy.title}</h5>
						<p class="principle-desc">{philosophy.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.journey-container {
		width: 100%;
		margin: 0 auto;
		padding: 1rem 0 2rem;
	}

	/* ========================================
	   OPENING STATEMENT
	   ======================================== */
	.journey-opening {
		max-width: 640px;
		margin: 0 auto 4rem;
		text-align: center;
	}

	.opening-rule {
		width: 48px;
		height: 2px;
		background: var(--color-accent);
		margin: 0 auto 2rem;
		border-radius: 1px;
	}

	.opening-quote {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 400;
		font-style: italic;
		line-height: 1.6;
		color: var(--color-ink);
		margin: 0 0 1.5rem;
		letter-spacing: -0.01em;
	}

	@media (min-width: 768px) {
		.opening-quote {
			font-size: 1.5rem;
		}
	}

	.opening-body {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.75;
		color: var(--color-ink);
		opacity: 0.7;
	}

	.opening-body p {
		margin: 0 0 0.75rem;
	}

	.opening-body p:last-child {
		margin-bottom: 0;
	}

	/* ========================================
	   TIMELINE
	   ======================================== */
	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto 4rem;
		padding: 2rem 0;
	}

	/* The continuous vertical thread */
	.timeline-thread-track {
		position: absolute;
		left: 28px;
		top: 0;
		bottom: 0;
		width: 1px;
	}

	.timeline-thread {
		width: 100%;
		height: 100%;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			color-mix(in srgb, var(--color-accent) 40%, transparent) 8%,
			color-mix(in srgb, var(--color-accent) 25%, transparent) 92%,
			transparent 100%
		);
		transform-origin: top center;
	}

	@media (min-width: 768px) {
		.timeline-thread-track {
			left: 50%;
			transform: translateX(-50%);
		}
	}

	/* Individual timeline entry */
	.timeline-entry {
		position: relative;
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 0;
		padding: 0 0 3rem;
	}

	@media (min-width: 768px) {
		.timeline-entry {
			grid-template-columns: 1fr 56px 1fr;
			gap: 0;
			padding-bottom: 4rem;
		}

		/* Default: year left, content right */
		.timeline-entry .timeline-year-col {
			grid-column: 1;
			grid-row: 1;
			text-align: right;
			padding-right: 2rem;
			display: flex;
			align-items: flex-start;
			justify-content: flex-end;
			padding-top: 0.5rem;
		}

		.timeline-entry .timeline-marker {
			grid-column: 2;
			grid-row: 1;
		}

		.timeline-entry .timeline-body {
			grid-column: 3;
			grid-row: 1;
			padding-left: 2rem;
		}

		/* Alternating: content left, year right */
		.timeline-entry.entry-right .timeline-year-col {
			grid-column: 3;
			text-align: left;
			padding-right: 0;
			padding-left: 2rem;
			justify-content: flex-start;
		}

		.timeline-entry.entry-right .timeline-body {
			grid-column: 1;
			grid-row: 1;
			padding-left: 0;
			padding-right: 2rem;
			text-align: right;
		}

		.timeline-entry.entry-right .body-header {
			justify-content: flex-end;
		}

		.timeline-entry.entry-right .body-education-detail {
			align-items: flex-end;
		}
	}

	/* Mobile layout — marker and year share left column */
	@media (max-width: 767px) {
		.timeline-entry .timeline-year-col {
			display: none;
		}

		.timeline-entry .timeline-marker {
			grid-column: 1;
			grid-row: 1;
		}

		.timeline-entry .timeline-body {
			grid-column: 2;
			grid-row: 1;
			padding-left: 1rem;
		}
	}

	/* ========================================
	   MARKER
	   ======================================== */
	.timeline-marker {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 0.4rem;
		z-index: 2;
	}

	.marker-ring {
		position: relative;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-base);
		border: 2px solid var(--type-color);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--duration-normal) var(--ease-smooth);
		box-shadow: 0 0 0 4px var(--color-base);
	}

	.timeline-entry:hover .marker-ring {
		transform: scale(1.15);
		box-shadow: 0 0 0 4px var(--color-base), 0 0 16px color-mix(in srgb, var(--type-color) 25%, transparent);
	}

	.marker-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--type-color);
	}

	.marker-current {
		border-width: 2.5px;
		box-shadow: 0 0 0 4px var(--color-base), 0 0 12px color-mix(in srgb, var(--type-color) 30%, transparent);
	}

	.marker-pulse {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1.5px solid var(--type-color);
		animation: pulse-ring 2.5s ease-out infinite;
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(1);
			opacity: 0.6;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}

	.marker-star {
		font-size: 9px;
		line-height: 1;
		color: var(--type-color);
	}

	/* ========================================
	   YEAR TYPOGRAPHY
	   ======================================== */
	.timeline-year {
		font-family: var(--font-headline);
		font-size: 1.75rem;
		font-weight: 300;
		color: var(--color-ink);
		opacity: 0.18;
		letter-spacing: -0.03em;
		line-height: 1;
		white-space: nowrap;
		transition: opacity var(--duration-normal) var(--ease-smooth);
	}

	.timeline-entry:hover .timeline-year {
		opacity: 0.35;
	}

	@media (min-width: 768px) {
		.timeline-year {
			font-size: 2.5rem;
		}
	}

	/* ========================================
	   BODY CONTENT
	   ======================================== */
	.timeline-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.body-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.type-badge {
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--type-color);
		background: color-mix(in srgb, var(--type-color) 10%, transparent);
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-full);
		line-height: 1;
	}

	.current-badge {
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: var(--color-accent);
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-full);
		line-height: 1;
	}

	.body-title {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
		letter-spacing: var(--tracking-tight);
		line-height: 1.3;
	}

	@media (min-width: 768px) {
		.body-title {
			font-size: 1.375rem;
		}
	}

	.body-company {
		font-family: var(--font-data);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.45;
		display: block;
	}

	.body-period {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--color-ink);
		opacity: 0.35;
		display: block;
	}

	.body-description {
		font-family: var(--font-data);
		font-size: 0.8125rem;
		line-height: 1.7;
		color: var(--color-ink);
		opacity: 0.65;
		margin: 0.25rem 0 0;
	}

	/* Education enrichment detail */
	.body-education-detail {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		margin-top: 0.5rem;
		padding: 0.75rem;
		background: var(--color-surface);
		border-radius: var(--radius-sm);
		border-left: 2px solid var(--color-tension);
	}

	.timeline-entry.entry-right .body-education-detail {
		border-left: none;
		border-right: 2px solid var(--color-tension);
	}

	.edu-detail-degree {
		font-family: var(--font-data);
		font-size: 11px;
		color: var(--color-ink);
		opacity: 0.8;
	}

	.edu-detail-focus {
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-tension);
		letter-spacing: 0.04em;
	}

	.edu-detail-meta {
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.4;
		letter-spacing: 0.04em;
	}

	/* Mobile year — visible only on small screens */
	.mobile-year-inline {
		display: none;
	}

	@media (max-width: 767px) {
		.mobile-year-inline {
			display: block;
			font-family: var(--font-headline);
			font-size: 0.875rem;
			font-weight: 300;
			color: var(--color-ink);
			opacity: 0.3;
			line-height: 1;
		}
	}

	/* ========================================
	   GUIDING PRINCIPLES
	   ======================================== */
	.principles-section {
		max-width: 800px;
		margin: 0 auto;
		padding-top: 2rem;
	}

	.principles-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.principles-rule {
		flex: 1;
		max-width: 80px;
		height: 1px;
		background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-ink) 15%, transparent), transparent);
	}

	.principles-title {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-weight: 400;
		font-style: italic;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
		white-space: nowrap;
	}

	.principles-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.principles-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	.principle-card {
		padding: 1.5rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
		transition: all var(--duration-normal) var(--ease-smooth);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.principle-card:hover {
		box-shadow: var(--shadow-diffused);
		transform: translateY(-2px);
	}

	.principle-index {
		font-family: var(--font-headline);
		font-size: 2rem;
		font-weight: 300;
		color: var(--color-accent);
		opacity: 0.35;
		line-height: 1;
	}

	.principle-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.principle-name {
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
		letter-spacing: var(--tracking-tight);
	}

	.principle-desc {
		font-size: 0.8125rem;
		line-height: 1.65;
		color: var(--color-ink);
		opacity: 0.6;
		margin: 0;
		font-family: var(--font-data);
	}
</style>
