<script lang="ts">
	interface Props {
		images: string[];
		alt: string;
		accentColor?: string;
	}

	let { images, alt, accentColor = 'var(--color-accent)' }: Props = $props();

	let currentIndex = $state(0);
	let containerRef = $state<HTMLElement>();
	let pointerStartX = $state(0);
	let pointerDown = $state(false);

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function goTo(index: number) {
		currentIndex = index;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}

	function handlePointerDown(e: PointerEvent) {
		pointerDown = true;
		pointerStartX = e.clientX;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!pointerDown) return;
		pointerDown = false;
		const delta = e.clientX - pointerStartX;
		if (Math.abs(delta) > 50) {
			if (delta < 0) next();
			else prev();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	class="carousel"
	aria-roledescription="carousel"
	aria-label="{alt} gallery"
	bind:this={containerRef}
	onkeydown={handleKeydown}
	tabindex="0"
>
	<div class="carousel-track" style="transform: translateX(-{currentIndex * 100}%)">
		{#each images as image, i (i)}
			<div
				class="carousel-slide"
				role="group"
				aria-roledescription="slide"
				aria-label="Slide {i + 1} of {images.length}"
			>
				<img src={image} alt="{alt} {i + 1}" loading="lazy" />
			</div>
		{/each}
	</div>

	<!-- Arrow buttons -->
	{#if images.length > 1}
		<button class="carousel-arrow carousel-arrow--prev" onclick={prev} aria-label="Previous slide">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M13 4L7 10L13 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
		<button class="carousel-arrow carousel-arrow--next" onclick={next} aria-label="Next slide">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}

	<!-- Dots + counter -->
	<div class="carousel-nav">
		<span class="carousel-counter">{currentIndex + 1} / {images.length}</span>
		<div
			class="carousel-dots"
			role="tablist"
			aria-label="Slide navigation"
			onpointerdown={handlePointerDown}
			onpointerup={handlePointerUp}
		>
			{#each images as _, i (i)}
				<button
					class="carousel-dot"
					class:active={i === currentIndex}
					onclick={() => goTo(i)}
					role="tab"
					aria-selected={i === currentIndex}
					aria-label="Go to slide {i + 1}"
					style="--accent: {accentColor}"
				></button>
			{/each}
		</div>
	</div>
</section>

<style>
	.carousel {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		margin-bottom: 2rem;
		outline: none;
	}

	.carousel:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.carousel-track {
		display: flex;
		transition: transform 300ms ease;
	}

	.carousel-slide {
		min-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.carousel-slide img {
		max-width: 100%;
		max-height: 70vh;
		object-fit: contain;
		border-radius: var(--radius-md, 8px);
		user-select: none;
		-webkit-user-drag: none;
	}

	.carousel-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--color-base) 90%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
		border-radius: var(--radius-full);
		color: var(--color-ink);
		cursor: pointer;
		transition: all var(--duration-normal) ease;
		backdrop-filter: blur(4px);
		z-index: 2;
	}

	.carousel-arrow:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.carousel-arrow--prev {
		left: 0.75rem;
	}

	.carousel-arrow--next {
		right: 0.75rem;
	}

	.carousel-nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0 1rem;
	}

	.carousel-counter {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.carousel-dots {
		display: flex;
		gap: 0.5rem;
		touch-action: pan-y;
	}

	.carousel-dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--color-ink) 25%, transparent);
		background: transparent;
		padding: 0;
		cursor: pointer;
		transition: all var(--duration-normal) ease;
	}

	.carousel-dot.active {
		background: var(--accent);
		border-color: var(--accent);
		transform: scale(1.25);
	}

	.carousel-dot:hover:not(.active) {
		background: color-mix(in srgb, var(--color-ink) 20%, transparent);
	}
</style>
