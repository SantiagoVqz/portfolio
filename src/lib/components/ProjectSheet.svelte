<script lang="ts">
	import { magnetic } from '$lib/actions/magnetic';
	import type { Snippet } from 'svelte';

	interface Metric {
		label: string;
		value: string;
	}

	interface Props {
		title: string;
		subtitle: string;
		description: string;
		year: string;
		index: number;
		total: number;
		tags?: string[];
		href?: string;
		accentColor?: string;
		image?: string;
		video?: string;
		metrics?: Metric[];
		children?: Snippet;
	}

	let {
		title,
		subtitle,
		description,
		year,
		index,
		total,
		tags = [],
		href = '#',
		accentColor = 'var(--color-accent)',
		image,
		video,
		metrics = [],
		children
	}: Props = $props();

	let isHovered = $state(false);
	let videoRef: HTMLVideoElement | null = $state(null);
	let mediaLoaded = $state(false);
	let mediaError = $state(false);

	// Format index for display - use $derived for reactivity
	const displayIndex = $derived(String(index + 1).padStart(2, '0'));
	const displayTotal = $derived(String(total).padStart(2, '0'));

	// Determine if we should show fallback
	const showFallback = $derived(!image && !video && !children || mediaError);

	// Handle media load states
	function handleMediaLoad() {
		mediaLoaded = true;
	}

	function handleMediaError() {
		mediaError = true;
	}

	// Handle video hover playback
	$effect(() => {
		if (videoRef) {
			if (isHovered) {
				videoRef.play().catch(() => {});
			} else {
				videoRef.pause();
				videoRef.currentTime = 0;
			}
		}
	});
</script>

{#snippet artifactLabel(text: string, position: 'tl' | 'tr' | 'bl' | 'br')}
	<span
		class="absolute font-mono text-[10px] tracking-widest uppercase text-[--color-ink]/40
			   {position === 'tl' ? 'top-6 left-6' : ''}
			   {position === 'tr' ? 'top-6 right-6' : ''}
			   {position === 'bl' ? 'bottom-6 left-6' : ''}
			   {position === 'br' ? 'bottom-6 right-6' : ''}"
	>
		{text}
	</span>
{/snippet}

{#snippet tagPill(text: string)}
	<span
		class="inline-block px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest
			   rounded-full border border-current text-[--color-ink]/60"
	>
		{text}
	</span>
{/snippet}

<article
	class="project-sheet relative w-full min-h-screen will-change-transform"
	style="--accent: {accentColor}; --sheet-index: {index}"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	data-sheet-index={index}
>
	<!-- Paper texture background -->
	<div class="absolute inset-0 bg-[--color-surface] rounded-t-3xl overflow-hidden">
		<!-- Grain texture -->
		<div
			class="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply"
			style="background-image: var(--glass-grain); background-repeat: repeat"
		></div>

		<!-- Subtle gradient overlay -->
		<div
			class="absolute inset-0 pointer-events-none"
			style="background: linear-gradient(
				180deg,
				transparent 0%,
				rgba(54, 50, 47, 0.02) 100%
			)"
		></div>
	</div>

	<!-- Content container -->
	<div class="relative z-10 min-h-screen px-6 py-16 md:px-12 lg:px-20 lg:py-24">
		<!-- Artifact labels in corners -->
		{@render artifactLabel(`${displayIndex}/${displayTotal}`, 'tl')}
		{@render artifactLabel(year, 'tr')}
		{@render artifactLabel('Scroll', 'bl')}
		{@render artifactLabel('Project', 'br')}

		<!-- Main content grid -->
		<div class="h-full flex flex-col justify-center max-w-6xl mx-auto">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
				<!-- Left column: Meta -->
				<div class="lg:col-span-5 space-y-8">
					<!-- Subtitle / Category -->
					<span
						class="inline-block font-mono text-xs uppercase tracking-widest"
						style="color: var(--accent)"
					>
						{subtitle}
					</span>

					<!-- Title -->
					<h2
						class="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-none tracking-tight text-[--color-ink]"
						style="font-family: var(--font-headline); letter-spacing: var(--tracking-tight)"
					>
						{title}
					</h2>

					<!-- Description -->
					<p
						class="text-base lg:text-lg leading-relaxed max-w-md text-[--color-ink]/70"
						style="line-height: var(--leading-relaxed)"
					>
						{description}
					</p>

					<!-- Metrics -->
					{#if metrics && metrics.length > 0}
						<div class="flex flex-wrap gap-4">
							{#each metrics as metric (metric.label)}
								<div class="p-3 bg-[--color-base] rounded-xl" style="box-shadow: var(--shadow-diffused)">
									<div class="font-serif text-xl font-semibold text-[--color-ink]" style="font-family: var(--font-headline)">
										{metric.value}
									</div>
									<div class="font-mono text-[10px] uppercase tracking-widest text-[--color-ink]/50">
										{metric.label}
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Tags -->
					{#if tags.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each tags as tag (tag)}
								{@render tagPill(tag)}
							{/each}
						</div>
					{/if}

					<!-- CTA Button -->
					<div class="pt-4">
						<a
							href={href}
							class="group inline-flex items-center gap-4 px-8 py-4 rounded-full
								   border border-[--color-ink] transition-all duration-300
								   hover:bg-[--color-ink] hover:text-[--color-base] text-[--color-ink]"
							use:magnetic={{ strength: 0.3, duration: 0.5 }}
							data-cursor-hover
						>
							<span class="font-mono text-xs uppercase tracking-widest">
								View Project
							</span>
							<svg
								class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d="M7 17L17 7M17 7H7M17 7V17" />
							</svg>
						</a>
					</div>
				</div>

				<!-- Right column: Visual / Slot -->
				<div class="lg:col-span-7">
					{#if children}
						{@render children()}
					{:else}
						<!-- Media or fallback visual -->
						<div
							class="aspect-[4/3] rounded-2xl overflow-hidden relative"
							class:is-hovered={isHovered}
						>
							{#if video && !mediaError}
								<video
									bind:this={videoRef}
									src={video}
									class="media-element"
									class:is-loaded={mediaLoaded}
									class:is-hovered={isHovered}
									muted
									loop
									playsinline
									preload="metadata"
									onloadeddata={handleMediaLoad}
									onerror={handleMediaError}
								>
									<track kind="captions" />
								</video>
							{:else if image && !mediaError}
								<img
									src={image}
									alt={title}
									class="media-element"
									class:is-loaded={mediaLoaded}
									class:is-hovered={isHovered}
									onload={handleMediaLoad}
									onerror={handleMediaError}
									loading="lazy"
								/>
							{/if}

							<!-- Fallback visual -->
							<div class="fallback-visual" class:visible={showFallback}>
								<!-- Background gradient -->
								<div
									class="absolute inset-0"
									style="background: linear-gradient(
										135deg,
										color-mix(in srgb, var(--accent) 15%, var(--color-surface)) 0%,
										var(--color-surface) 50%,
										color-mix(in srgb, var(--accent) 8%, var(--color-base)) 100%
									)"
								></div>

								<!-- Decorative elements -->
								<div class="fallback-pattern">
									<div class="circle circle-1" style="border-color: var(--accent)"></div>
									<div class="circle circle-2" style="border-color: var(--accent)"></div>
									<div class="circle circle-3" style="border-color: var(--accent)"></div>
									<div class="line line-1" style="background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)"></div>
									<div class="line line-2" style="background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)"></div>
								</div>

								<!-- Index number -->
								<span
									class="absolute bottom-8 right-8 font-serif text-8xl font-light opacity-10 text-[--color-ink]"
									style="font-family: var(--font-headline)"
								>
									{displayIndex}
								</span>

								<!-- Animated icon -->
								<div class="fallback-icon" class:is-hovered={isHovered}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--accent)">
										<path d="M12 2L12 22M2 12L22 12" class="cross" />
										<circle cx="12" cy="12" r="8" class="orbit" />
									</svg>
								</div>
							</div>

							<!-- Loading skeleton -->
							{#if !mediaLoaded && !showFallback}
								<div class="skeleton">
									<div class="skeleton-shimmer"></div>
								</div>
							{/if}

							<!-- Grain overlay -->
							<div
								class="absolute inset-0 pointer-events-none opacity-20"
								style="background-image: var(--glass-grain); background-repeat: repeat"
							></div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom edge shadow (paper stack effect) -->
	<div
		class="absolute bottom-0 left-0 right-0 h-px"
		style="background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(54, 50, 47, 0.1) 20%,
			rgba(54, 50, 47, 0.1) 80%,
			transparent 100%
		)"
	></div>
</article>

<style>
	.project-sheet {
		box-shadow:
			0 -1px 0 0 rgba(54, 50, 47, 0.05),
			0 -20px 60px -20px rgba(54, 50, 47, 0.1);
	}

	/* Media elements */
	.media-element {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.media-element.is-loaded {
		opacity: 1;
	}

	.media-element.is-hovered {
		transform: scale(1.03);
	}

	/* Fallback visual */
	.fallback-visual {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s ease;
	}

	.fallback-visual.visible {
		opacity: 1;
	}

	/* Fallback patterns */
	.fallback-pattern {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.circle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		border: 1px solid;
		opacity: 0.15;
	}

	.circle-1 {
		width: 100px;
		height: 100px;
		animation: pulse 4s ease-in-out infinite;
	}

	.circle-2 {
		width: 180px;
		height: 180px;
		animation: pulse 4s ease-in-out infinite 0.5s;
	}

	.circle-3 {
		width: 260px;
		height: 260px;
		animation: pulse 4s ease-in-out infinite 1s;
	}

	.line {
		position: absolute;
		width: 150%;
		height: 1px;
		opacity: 0.1;
		top: 50%;
		left: 50%;
	}

	.line-1 {
		transform: translate(-50%, -50%) rotate(30deg);
	}

	.line-2 {
		transform: translate(-50%, -50%) rotate(-30deg);
	}

	/* Fallback icon */
	.fallback-icon {
		position: relative;
		z-index: 1;
		width: 64px;
		height: 64px;
		opacity: 0.4;
		transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.fallback-icon.is-hovered {
		opacity: 0.6;
		transform: rotate(45deg) scale(1.1);
	}

	.fallback-icon .orbit {
		stroke-dasharray: 50;
		animation: orbit 8s linear infinite;
	}

	/* Skeleton */
	.skeleton {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-base) 100%);
		overflow: hidden;
	}

	.skeleton-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			color-mix(in srgb, var(--color-ink) 5%, transparent) 50%,
			transparent 100%
		);
		animation: shimmer 1.5s infinite;
	}

	/* Animations */
	@keyframes pulse {
		0%, 100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.15;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 0.08;
		}
	}

	@keyframes orbit {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 100;
		}
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
