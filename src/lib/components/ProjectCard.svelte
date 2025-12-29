<script lang="ts">
	import { magnetic } from '$lib/actions/magnetic';
	import { revealWithExit } from '$lib/actions/reveal';
	import { tilt3d } from '$lib/actions/tilt3d';
	import { countUp } from '$lib/actions/countUp';

	interface Metric {
		label: string;
		value: string;
	}

	interface Props {
		title: string;
		subtitle?: string;
		description: string;
		tags?: string[];
		image?: string;
		video?: string;
		href?: string;
		year?: string;
		index?: number;
		accentColor?: string;
		metrics?: Metric[];
	}

	let {
		title,
		subtitle = '',
		description,
		tags = [],
		image,
		video,
		href = '#',
		year,
		index = 0,
		accentColor = '#D4E0D8',
		metrics = []
	}: Props = $props();

	let isHovered = $state(false);
	let videoRef: HTMLVideoElement | null = $state(null);
	let mediaLoaded = $state(false);
	let mediaError = $state(false);

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

	// Determine if we should show fallback
	const showFallback = $derived((!image && !video) || mediaError);

	// Format index for display - use $derived for reactivity
	const displayIndex = $derived(String(index + 1).padStart(2, '0'));
</script>

<article
	class="project-card h-full"
	use:revealWithExit={{ blur: 15, y: 40, duration: 1, persist: true }}
	style="--delay: {index * 0.1}s; --accent: {accentColor}"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<a {href} class="card-link block h-full" data-cursor-hover use:tilt3d={{ maxRotation: 8, glare: true, glareOpacity: 0.1, scale: 1.01 }}>
		<!-- Image/Video container with fallback -->
		<div class="card-media-container">
			{#if video && !mediaError}
				<video
					bind:this={videoRef}
					src={video}
					class="card-media"
					class:is-hovered={isHovered}
					class:is-loaded={mediaLoaded}
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
					class="card-media"
					class:is-hovered={isHovered}
					class:is-loaded={mediaLoaded}
					onload={handleMediaLoad}
					onerror={handleMediaError}
					loading="lazy"
				/>
			{/if}

			<!-- Fallback visual (always rendered, shown when no media) -->
			<div class="card-fallback" class:visible={showFallback}>
				<!-- Decorative geometric patterns -->
				<div class="fallback-pattern">
					<!-- Concentric circles -->
					<div class="circle circle-1"></div>
					<div class="circle circle-2"></div>
					<div class="circle circle-3"></div>

					<!-- Diagonal lines -->
					<div class="line line-1"></div>
					<div class="line line-2"></div>

					<!-- Floating dots -->
					<div class="dot dot-1"></div>
					<div class="dot dot-2"></div>
					<div class="dot dot-3"></div>
				</div>

				<!-- Project number watermark -->
				<span class="fallback-number">{displayIndex}</span>

				<!-- Animated icon -->
				<div class="fallback-icon" class:is-hovered={isHovered}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
						<path d="M12 2L12 22M2 12L22 12" class="cross" />
						<circle cx="12" cy="12" r="8" class="orbit" />
					</svg>
				</div>
			</div>

			<!-- Loading skeleton -->
			{#if !mediaLoaded && !showFallback}
				<div class="card-skeleton">
					<div class="skeleton-shimmer"></div>
				</div>
			{/if}

			<!-- Hover overlay -->
			<div class="card-overlay" class:is-hovered={isHovered}>
				<span class="view-text" use:magnetic={{ strength: 0.3, duration: 0.4 }}>View Project</span>
			</div>

			<!-- Grain texture -->
			<div class="card-grain"></div>
		</div>

		<!-- Card content -->
		<div class="card-content">
			<header class="card-header">
				<div class="card-header-left">
					{#if subtitle}
						<span class="card-subtitle">{subtitle}</span>
					{/if}
					<h3 class="card-title">{title}</h3>
				</div>
				{#if year}
					<span class="card-year">{year}</span>
				{/if}
			</header>

			<p class="card-description">{description}</p>

			<!-- Metrics row -->
			{#if metrics && metrics.length > 0}
				<div class="card-metrics">
					{#each metrics as metric (metric.label)}
						<div class="metric">
							<span class="metric-value" use:countUp={{ duration: 2, delay: 0.2 }}>{metric.value}</span>
							<span class="metric-label">{metric.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if tags.length > 0}
				<ul class="card-tags">
					{#each tags as tag (tag)}
						<li class="tag">{tag}</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Arrow indicator -->
		<div class="card-arrow" class:is-hovered={isHovered}>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path d="M7 17L17 7M17 7H7M17 7V17" />
			</svg>
		</div>
	</a>
</article>

<style>
	.project-card {
		--card-radius: var(--radius-xl);
		position: relative;
		animation-delay: var(--delay);
	}

	.card-link {
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border-radius: var(--card-radius);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		box-shadow: var(--shadow-diffused);
		transition:
			box-shadow var(--duration-slow) var(--ease-smooth),
			transform var(--duration-slow) var(--ease-smooth);
	}

	.card-link:hover {
		box-shadow: var(--shadow-deep);
		transform: translateY(var(--lift-card));
	}

	/* Media Section */
	.card-media-container {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-base) 100%);
	}

	.card-media {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition:
			opacity var(--duration-slow) ease,
			transform var(--duration-slow) var(--ease-smooth),
			filter var(--duration-slow) ease;
	}

	.card-media.is-loaded {
		opacity: 1;
	}

	.card-media.is-hovered {
		transform: scale(var(--scale-medium));
		filter: brightness(0.9);
	}

	/* Fallback Visual */
	.card-fallback {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 15%, var(--color-surface)) 0%,
			var(--color-surface) 50%,
			color-mix(in srgb, var(--accent) 8%, var(--color-base)) 100%
		);
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--duration-slow) ease;
	}

	.card-fallback.visible {
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
		border: 1px solid var(--accent);
		opacity: 0.15;
	}

	.circle-1 {
		width: 80px;
		height: 80px;
		animation: pulse 4s ease-in-out infinite;
	}

	.circle-2 {
		width: 140px;
		height: 140px;
		animation: pulse 4s ease-in-out infinite 0.5s;
	}

	.circle-3 {
		width: 200px;
		height: 200px;
		animation: pulse 4s ease-in-out infinite 1s;
	}

	.line {
		position: absolute;
		width: 150%;
		height: 1px;
		background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
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

	.dot {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0.3;
	}

	.dot-1 {
		top: 20%;
		left: 15%;
		animation: float 6s ease-in-out infinite;
	}

	.dot-2 {
		top: 70%;
		right: 20%;
		animation: float 6s ease-in-out infinite 1s;
	}

	.dot-3 {
		bottom: 25%;
		left: 25%;
		animation: float 6s ease-in-out infinite 2s;
	}

	/* Fallback number watermark */
	.fallback-number {
		position: absolute;
		bottom: 1rem;
		right: 1.5rem;
		font-family: var(--font-headline);
		font-size: 5rem;
		font-weight: 300;
		color: var(--accent);
		opacity: 0.08;
		line-height: 1;
		pointer-events: none;
	}

	/* Fallback icon */
	.fallback-icon {
		width: 48px;
		height: 48px;
		color: var(--accent);
		opacity: 0.4;
		transition:
			opacity var(--duration-normal) ease,
			transform var(--duration-slow) var(--ease-smooth);
	}

	.fallback-icon.is-hovered {
		opacity: 0.6;
		transform: rotate(45deg) scale(var(--scale-emphasis));
	}

	.fallback-icon .cross {
		stroke-dasharray: 20;
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 0.6s ease;
	}

	.fallback-icon.is-hovered .cross {
		stroke-dashoffset: 20;
	}

	.fallback-icon .orbit {
		stroke-dasharray: 50;
		animation: orbit 8s linear infinite;
	}

	/* Loading skeleton */
	.card-skeleton {
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

	/* Grain texture overlay */
	.card-grain {
		position: absolute;
		inset: 0;
		background-image: var(--glass-grain);
		background-repeat: repeat;
		opacity: 0.2;
		pointer-events: none;
		mix-blend-mode: multiply;
	}

	/* Hover Overlay */
	.card-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--color-base) 70%, transparent);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		opacity: 0;
		transition: opacity var(--duration-slow) ease;
	}

	.card-overlay.is-hovered {
		opacity: 1;
	}

	.view-text {
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-ink);
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--color-ink);
		border-radius: var(--radius-full);
		transition:
			background var(--duration-normal) ease,
			color var(--duration-normal) ease;
	}

	.view-text:hover {
		background: var(--color-ink);
		color: var(--color-base);
	}

	/* Content Section */
	.card-content {
		padding: 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.card-header-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.card-subtitle {
		font-family: var(--font-data);
		font-size: 0.65rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--accent);
	}

	.card-title {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: var(--tracking-tight);
		line-height: var(--leading-tight);
		color: var(--color-ink);
		margin: 0;
	}

	.card-year {
		font-family: var(--font-data);
		font-size: 0.75rem;
		color: var(--color-ink);
		opacity: 0.5;
		letter-spacing: var(--tracking-wide);
		flex-shrink: 0;
	}

	.card-description {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: var(--leading-relaxed);
		color: color-mix(in srgb, var(--color-ink) 70%, transparent);
		margin: 0 0 1rem;
		flex: 1;
	}

	/* Metrics */
	.card-metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: color-mix(in srgb, var(--accent) 8%, var(--color-base));
		border-radius: 0.75rem;
	}

	.metric {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-ink);
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 0.625rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.5;
	}

	/* Tags */
	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
		margin-top: auto;
	}

	.tag {
		font-family: var(--font-data);
		font-size: 0.625rem;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		background: color-mix(in srgb, var(--color-tension) 15%, var(--color-surface));
		color: var(--color-tension);
		border-radius: var(--radius-lg);
	}

	/* Arrow */
	.card-arrow {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		color: var(--accent);
		opacity: 0;
		transform: translate(-8px, 8px);
		transition:
			opacity var(--duration-normal) ease,
			transform var(--duration-normal) var(--ease-smooth);
		z-index: 10;
	}

	.card-arrow.is-hovered {
		opacity: 1;
		transform: translate(0, 0);
	}

	/* Animations */
	@keyframes pulse {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.15;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 0.08;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
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
