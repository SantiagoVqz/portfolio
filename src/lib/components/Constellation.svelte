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
	let svgRef = $state<SVGSVGElement>();
	let activeNode = $state<number | null>(null);
	let isMobile = $state(false);
	let revealedCount = $state(0);

	// Node positions along a constellation path
	const nodePositions = $derived.by(() => {
		const count = timeline.length;
		const positions: { x: number; y: number }[] = [];

		// Organic path through SVG viewBox (1000 x 600)
		const basePoints = [
			{ x: 120, y: 480 },
			{ x: 300, y: 350 },
			{ x: 480, y: 200 },
			{ x: 660, y: 320 },
			{ x: 850, y: 150 },
		];

		for (let i = 0; i < count; i++) {
			if (i < basePoints.length) {
				positions.push(basePoints[i]);
			} else {
				positions.push({
					x: 120 + (i * 730) / (count - 1),
					y: 300 + Math.sin(i * 1.5) * 150
				});
			}
		}
		return positions;
	});

	// Node sizes based on type
	function getNodeRadius(type: string): number {
		if (type === 'milestone') return 12;
		if (type === 'work') return 9;
		return 7;
	}

	onMount(() => {
		if (!browser) return;
		isMobile = window.innerWidth < 768;

		let ctx: gsap.Context | null = null;

		const initGSAP = async () => {
			if (!containerRef) return;
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				// Progressive reveal of nodes
				ScrollTrigger.create({
					trigger: containerRef,
					start: 'top 70%',
					end: 'bottom 30%',
					onUpdate: (self) => {
						const progress = self.progress;
						revealedCount = Math.ceil(progress * timeline.length);
					}
				});

				// Animate connection lines
				const lines = containerRef!.querySelectorAll('.constellation-line');
				lines.forEach((line) => {
					const length = (line as SVGPathElement).getTotalLength?.() || 200;
					gsap.set(line, {
						strokeDasharray: length,
						strokeDashoffset: length
					});
				});

				ScrollTrigger.create({
					trigger: containerRef,
					start: 'top 70%',
					end: 'bottom 30%',
					onUpdate: (self) => {
						lines.forEach((line, i) => {
							const lineProgress = Math.max(0, Math.min(1, (self.progress * timeline.length - i) / 1));
							const length = (line as SVGPathElement).getTotalLength?.() || 200;
							gsap.set(line, {
								strokeDashoffset: length * (1 - lineProgress)
							});
						});
					}
				});
			}, containerRef);
		};

		initGSAP();
		const handleResize = () => { isMobile = window.innerWidth < 768; };
		window.addEventListener('resize', handleResize);

		return () => {
			ctx?.revert();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="constellation-container" bind:this={containerRef}>
	<!-- Bio intro -->
	<div class="constellation-intro" use:revealWithExit={{ blur: 12, y: 25, duration: 0.9, persist: true }}>
		<div class="intro-label">
			<span class="label-icon">✎</span>
			<span>About Me</span>
		</div>
		<div class="intro-content">
			{#each bio as paragraph, idx (idx)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	{#if !isMobile}
		<!-- Desktop: SVG Constellation -->
		<div class="constellation-svg-wrapper">
			<svg
				bind:this={svgRef}
				viewBox="0 0 1000 600"
				class="constellation-svg"
				role="img"
				aria-label="Career timeline constellation"
			>
				<!-- Connection lines -->
				{#each timeline as _, i}
					{#if i < timeline.length - 1}
						{@const from = nodePositions[i]}
						{@const to = nodePositions[i + 1]}
						<line
							class="constellation-line"
							x1={from.x}
							y1={from.y}
							x2={to.x}
							y2={to.y}
							stroke="var(--color-tension)"
							stroke-width="1.5"
							opacity={i < revealedCount - 1 ? 0.4 : 0.1}
						/>
					{/if}
				{/each}

				<!-- Nodes -->
				{#each timeline as item, i (item.year + item.company)}
					{@const pos = nodePositions[i]}
					{@const r = getNodeRadius(item.type)}
					{@const isRevealed = i < revealedCount}
					{@const isActive = activeNode === i}

					<g
						class="constellation-node"
						class:revealed={isRevealed}
						class:active={isActive}
						transform="translate({pos.x}, {pos.y})"
						role="button"
						tabindex="0"
						aria-label="{item.year}: {item.title} at {item.company}"
						onmouseenter={() => activeNode = i}
						onmouseleave={() => activeNode = null}
						onfocus={() => activeNode = i}
						onblur={() => activeNode = null}
					>
						<!-- Glow -->
						{#if isActive}
							<circle
								r={r + 8}
								fill="none"
								stroke="var(--color-gold)"
								stroke-width="1"
								opacity="0.5"
							/>
						{/if}

						<!-- Node circle -->
						<circle
							{r}
							fill={isRevealed ? 'var(--color-accent)' : 'var(--color-surface)'}
							stroke={isActive ? 'var(--color-gold)' : 'var(--color-accent)'}
							stroke-width={item.type === 'milestone' ? 2.5 : 1.5}
							opacity={isRevealed ? 1 : 0.3}
							style="transition: all 0.4s ease"
						/>

						<!-- Type indicator for milestones -->
						{#if item.type === 'milestone' && isRevealed}
							<text
								y="1"
								text-anchor="middle"
								dominant-baseline="central"
								fill="var(--color-base)"
								font-size="10"
							>★</text>
						{/if}
					</g>
				{/each}
			</svg>

			<!-- Detail cards (positioned absolutely) -->
			{#each timeline as item, i (item.year + item.company)}
				{@const pos = nodePositions[i]}
				{#if activeNode === i}
					<div
						class="detail-card"
						style="left: {pos.x / 10}%; top: {pos.y / 6}%"
					>
						<span class="card-year">{item.year}</span>
						<h4 class="card-title">{item.title}</h4>
						<span class="card-company">{item.company}</span>
						<p class="card-desc">{item.description}</p>
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<!-- Mobile: Simplified vertical layout -->
		<div class="mobile-timeline">
			{#each timeline as item, i (item.year + item.company)}
				{@const isRevealed = i < revealedCount}
				<div
					class="mobile-node"
					class:revealed={isRevealed}
					class:milestone={item.type === 'milestone'}
				>
					<div class="mobile-line-segment">
						<div class="mobile-dot" class:active={item.type === 'milestone'}></div>
						{#if i < timeline.length - 1}
							<div class="mobile-connector"></div>
						{/if}
					</div>
					<div class="mobile-content">
						<span class="mobile-year">{item.year}</span>
						<h4 class="mobile-title">{item.title}</h4>
						<span class="mobile-company">{item.company}</span>
						<p class="mobile-desc">{item.description}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Philosophy section -->
	<div class="philosophy-section">
		<div class="philosophy-header" use:revealWithExit={{ blur: 10, y: 20, duration: 0.8, persist: true }}>
			<div class="header-decoration">
				<div class="decoration-line"></div>
				<span class="decoration-symbol">◈</span>
				<div class="decoration-line"></div>
			</div>
			<h4 class="philosophy-title">Guiding Principles</h4>
		</div>

		<div class="philosophy-entries">
			{#each philosophies as philosophy, i (philosophy.number)}
				<div
					class="philosophy-entry"
					use:revealWithExit={{ blur: 8, y: 20, duration: 0.7, persist: true }}
				>
					<span class="philosophy-number">{philosophy.number}</span>
					<div class="philosophy-content">
						<h5 class="philosophy-name">{philosophy.title}</h5>
						<p class="philosophy-desc">{philosophy.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Education appendix -->
	<div class="education-section">
		<div class="education-header" use:revealWithExit={{ blur: 10, y: 20, duration: 0.8, persist: true }}>
			<span class="education-label">Education</span>
		</div>
		<div class="education-items">
			{#each education as edu, i (edu.institution)}
				<div
					class="education-item"
					use:revealWithExit={{ blur: 6, y: 15, duration: 0.6, persist: true }}
				>
					<div class="edu-icon">🎓</div>
					<div class="edu-content">
						<span class="edu-institution">{edu.institution}</span>
						<span class="edu-degree">{edu.degree}{edu.focus ? ` · ${edu.focus}` : ''}</span>
						<span class="edu-meta">{edu.location} · {edu.period}{edu.gpa ? ` · ${edu.gpa} GPA` : ''}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.constellation-container {
		width: 100%;
		margin: 0 auto;
		padding: 2rem 0;
	}

	/* Bio intro */
	.constellation-intro {
		background: var(--color-surface);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		margin-bottom: 3rem;
		border-left: 3px solid var(--color-accent);
	}

	.intro-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		margin-bottom: 1rem;
	}

	.label-icon { font-size: 1rem; }

	.intro-content {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--color-ink);
		opacity: 0.8;
	}

	.intro-content p { margin: 0 0 0.75rem; }
	.intro-content p:last-child { margin-bottom: 0; }

	/* SVG Constellation */
	.constellation-svg-wrapper {
		position: relative;
		margin-bottom: 3rem;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
		border-radius: var(--radius-xl);
		padding: 1rem;
		overflow: visible;
	}

	.constellation-svg {
		width: 100%;
		height: auto;
	}

	.constellation-node {
		cursor: none;
		outline: none;
	}

	.constellation-node:focus-visible circle:first-of-type {
		stroke: var(--color-gold);
		stroke-width: 2;
	}

	/* Detail card */
	.detail-card {
		position: absolute;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
		border-radius: var(--radius-md);
		padding: 1rem;
		min-width: 200px;
		max-width: 260px;
		box-shadow: var(--shadow-deep);
		z-index: 10;
		pointer-events: none;
		animation: cardIn 0.2s ease forwards;
		transform: translateX(-50%);
	}

	@keyframes cardIn {
		from { opacity: 0; transform: translateX(-50%) translateY(8px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.card-year {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		text-transform: uppercase;
	}

	.card-title {
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0.25rem 0;
	}

	.card-company {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
		display: block;
		margin-bottom: 0.5rem;
	}

	.card-desc {
		font-family: var(--font-data);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	/* Mobile timeline */
	.mobile-timeline {
		display: flex;
		flex-direction: column;
		margin-bottom: 3rem;
	}

	.mobile-node {
		display: flex;
		gap: 1rem;
		opacity: 0.4;
		transition: opacity var(--duration-slow) ease;
	}

	.mobile-node.revealed { opacity: 1; }

	.mobile-line-segment {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.25rem;
	}

	.mobile-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-accent);
		flex-shrink: 0;
	}

	.mobile-dot.active {
		width: 14px;
		height: 14px;
		background: var(--color-gold);
		box-shadow: 0 0 12px rgba(212, 168, 67, 0.3);
	}

	.mobile-connector {
		width: 1.5px;
		flex: 1;
		min-height: 2rem;
		background: var(--color-tension);
		opacity: 0.3;
	}

	.mobile-content {
		padding-bottom: 1.5rem;
	}

	.mobile-year {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		text-transform: uppercase;
	}

	.mobile-title {
		font-family: var(--font-headline);
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0.25rem 0;
	}

	.mobile-company {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
		display: block;
		margin-bottom: 0.375rem;
	}

	.mobile-desc {
		font-family: var(--font-data);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	/* Philosophy */
	.philosophy-section { margin-bottom: 3rem; }

	.philosophy-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header-decoration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.decoration-line {
		width: 60px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-ink), transparent);
		opacity: 0.2;
	}

	.decoration-symbol { color: var(--color-accent); font-size: 1rem; }

	.philosophy-title {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 400;
		font-style: italic;
		color: var(--color-ink);
		margin: 0;
	}

	.philosophy-entries {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.philosophy-entry {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.philosophy-entry:hover { box-shadow: var(--shadow-diffused); }

	.philosophy-number {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--color-accent);
		opacity: 0.6;
		line-height: 1;
	}

	.philosophy-content { flex: 1; }

	.philosophy-name {
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 0.5rem;
	}

	.philosophy-desc {
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	/* Education */
	.education-section {
		padding-top: 2rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.education-header { margin-bottom: 1.5rem; }

	.education-label {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.education-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.education-item {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
		border-radius: var(--radius-sm);
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.education-item:hover {
		border-color: color-mix(in srgb, var(--color-ink) 15%, transparent);
	}

	.edu-icon { font-size: 1.25rem; }

	.edu-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.edu-institution {
		font-family: var(--font-headline);
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-ink);
	}

	.edu-degree {
		font-family: var(--font-data);
		font-size: 11px;
		color: var(--color-ink);
		opacity: 0.7;
	}

	.edu-meta {
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.5;
	}

	@media (max-width: 640px) {
		.philosophy-entry {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>
