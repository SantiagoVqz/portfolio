<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		images: string[];
		alt: string;
		accentColor?: string;
		variant?: 'strip' | 'paged';
	}

	let {
		images,
		alt,
		accentColor = 'var(--color-accent)',
		variant = 'paged'
	}: Props = $props();

	// ── Strip mode state ──
	let stripRef = $state<HTMLElement>();
	let isDragging = $state(false);
	let hasOverflow = $state(false);
	let atStart = $state(true);
	let atEnd = $state(false);
	let dragStartX = 0;
	let dragScrollStart = 0;

	// ── Paged mode state ──
	let currentIndex = $state(0);
	let transitioning = $state(false);
	let direction = $state<'next' | 'prev'>('next');

	const totalImages = $derived(images.length);
	const isFirst = $derived(currentIndex === 0);
	const isLast = $derived(currentIndex === totalImages - 1);

	function goTo(index: number) {
		if (index === currentIndex || transitioning) return;
		direction = index > currentIndex ? 'next' : 'prev';
		transitioning = true;
		currentIndex = index;
		setTimeout(() => (transitioning = false), 400);
	}

	function goNext() {
		if (!isLast) goTo(currentIndex + 1);
	}

	function goPrev() {
		if (!isFirst) goTo(currentIndex - 1);
	}

	// ── Strip mode functions ──
	function updateScrollState() {
		if (!stripRef) return;
		const { scrollLeft, scrollWidth, clientWidth } = stripRef;
		const maxScroll = scrollWidth - clientWidth;
		hasOverflow = maxScroll > 2;
		atStart = scrollLeft <= 2;
		atEnd = scrollLeft >= maxScroll - 2;
	}

	function handlePointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch' || !stripRef) return;
		isDragging = true;
		dragStartX = e.clientX;
		dragScrollStart = stripRef.scrollLeft;
		stripRef.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || !stripRef) return;
		e.preventDefault();
		const delta = e.clientX - dragStartX;
		stripRef.scrollLeft = dragScrollStart - delta;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging || !stripRef) return;
		isDragging = false;
		stripRef.releasePointerCapture(e.pointerId);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (variant === 'paged') {
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				goNext();
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				goPrev();
			}
			return;
		}
		if (!stripRef) return;
		const step = 240;
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			stripRef.scrollBy({ left: step, behavior: 'smooth' });
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			stripRef.scrollBy({ left: -step, behavior: 'smooth' });
		}
	}

	onMount(() => {
		if (variant === 'strip') {
			updateScrollState();
			const observer = new ResizeObserver(() => updateScrollState());
			if (stripRef) observer.observe(stripRef);
			return () => observer.disconnect();
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	class="gallery"
	class:gallery--paged={variant === 'paged'}
	aria-label="{alt} gallery"
	onkeydown={handleKeydown}
	tabindex="0"
>
	{#if variant === 'paged'}
		<!-- Paged carousel -->
		<div class="paged-viewport">
			{#each images as image, i (i)}
				<div
					class="paged-slide"
					class:active={i === currentIndex}
					class:slide-from-right={i === currentIndex && direction === 'next'}
					class:slide-from-left={i === currentIndex && direction === 'prev'}
					aria-hidden={i !== currentIndex}
				>
					<img
						src={image}
						alt="{alt} — screen {i + 1} of {totalImages}"
						loading={i < 2 ? 'eager' : 'lazy'}
						draggable="false"
					/>
				</div>
			{/each}
		</div>

		<!-- Navigation arrows -->
		<div class="paged-controls">
			<button
				class="paged-arrow paged-arrow--prev"
				onclick={goPrev}
				disabled={isFirst}
				aria-label="Previous image"
				style="--accent: {accentColor}"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M15 18L9 12L15 6" />
				</svg>
			</button>

			<!-- Dot indicators -->
			<div class="paged-dots" role="tablist" aria-label="Image navigation">
				{#each images as _, i (i)}
					<button
						class="paged-dot"
						class:active={i === currentIndex}
						onclick={() => goTo(i)}
						role="tab"
						aria-selected={i === currentIndex}
						aria-label="Go to image {i + 1}"
						style="--accent: {accentColor}"
					></button>
				{/each}
			</div>

			<button
				class="paged-arrow paged-arrow--next"
				onclick={goNext}
				disabled={isLast}
				aria-label="Next image"
				style="--accent: {accentColor}"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M9 6L15 12L9 18" />
				</svg>
			</button>
		</div>

		<!-- Counter -->
		<div class="paged-counter">
			<span>{String(currentIndex + 1).padStart(2, '0')}</span>
			<span class="paged-counter-sep">/</span>
			<span>{String(totalImages).padStart(2, '0')}</span>
		</div>
	{:else}
		<!-- Strip carousel (original) -->
		<div
			class="gallery-strip"
			bind:this={stripRef}
			onscroll={updateScrollState}
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			class:dragging={isDragging}
			role="group"
			aria-label="Scrollable image strip"
		>
			{#each images as image, i (i)}
				<img
					src={image}
					alt="{alt} — screen {i + 1} of {images.length}"
					loading={i < 3 ? 'eager' : 'lazy'}
					draggable="false"
				/>
			{/each}
		</div>

		<!-- Edge fade indicators -->
		{#if hasOverflow}
			<div class="fade-edge fade-left" class:visible={!atStart}></div>
			<div class="fade-edge fade-right" class:visible={!atEnd}></div>
		{/if}

		<!-- Scroll hint -->
		{#if hasOverflow && atStart}
			<div class="scroll-hint" style="--accent: {accentColor}">
				<span class="scroll-hint-text">Drag to explore</span>
				<span class="scroll-hint-arrow">&rarr;</span>
			</div>
		{/if}
	{/if}
</section>

<style>
	/* ══════════════════════════════════════════
	   SHARED
	   ══════════════════════════════════════════ */
	.gallery {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: var(--color-surface);
		outline: none;
	}

	.gallery:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	/* ══════════════════════════════════════════
	   PAGED MODE
	   ══════════════════════════════════════════ */
	.gallery--paged {
		display: flex;
		flex-direction: column;
		background: transparent;
		height: 100%;
	}

	.paged-viewport {
		position: relative;
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.paged-slide {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		opacity: 0;
		transform: translateX(20px);
		transition:
			opacity 350ms ease,
			transform 350ms ease;
		pointer-events: none;
	}

	.paged-slide.active {
		opacity: 1;
		transform: translateX(0);
		pointer-events: auto;
		position: relative;
	}

	.paged-slide.slide-from-left {
		animation: slideFromLeft 350ms ease forwards;
	}

	.paged-slide.slide-from-right {
		animation: slideFromRight 350ms ease forwards;
	}

	@keyframes slideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideFromRight {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.paged-slide img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: var(--radius-md, 8px);
		user-select: none;
		-webkit-user-drag: none;
	}

	/* Controls bar */
	.paged-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
	}

	.paged-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--color-ink) 15%, transparent);
		background: color-mix(in srgb, var(--color-base) 80%, transparent);
		color: var(--color-ink);
		cursor: pointer;
		transition: all 200ms ease;
		flex-shrink: 0;
	}

	.paged-arrow:hover:not(:disabled) {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.paged-arrow:disabled {
		opacity: 0.25;
		cursor: default;
	}

	/* Dots */
	.paged-dots {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.paged-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1.5px solid color-mix(in srgb, var(--color-ink) 25%, transparent);
		background: transparent;
		padding: 0;
		cursor: pointer;
		transition: all 250ms ease;
	}

	.paged-dot.active {
		background: var(--accent, var(--color-accent));
		border-color: var(--accent, var(--color-accent));
		transform: scale(1.25);
	}

	.paged-dot:hover:not(.active) {
		border-color: var(--color-ink);
		background: color-mix(in srgb, var(--color-ink) 15%, transparent);
	}

	/* Counter */
	.paged-counter {
		position: absolute;
		top: 1rem;
		right: 1.25rem;
		font-family: var(--font-data, monospace);
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.35;
		pointer-events: none;
	}

	.paged-counter-sep {
		margin: 0 0.2em;
		opacity: 0.5;
	}

	/* ══════════════════════════════════════════
	   STRIP MODE (original)
	   ══════════════════════════════════════════ */
	.gallery-strip {
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		cursor: grab;
		touch-action: pan-x;
	}

	.gallery-strip::-webkit-scrollbar {
		display: none;
	}

	.gallery-strip.dragging {
		cursor: grabbing;
		user-select: none;
	}

	.gallery-strip img {
		height: 380px;
		width: auto;
		flex-shrink: 0;
		display: block;
		object-fit: cover;
		user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.gallery-strip img {
			height: 460px;
		}
	}

	@media (min-width: 1024px) {
		.gallery-strip img {
			height: 520px;
		}
	}

	/* Edge fades */
	.fade-edge {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 56px;
		pointer-events: none;
		opacity: 0;
		transition: opacity var(--duration-normal, 300ms) ease;
		z-index: 2;
	}

	.fade-edge.visible {
		opacity: 1;
	}

	.fade-left {
		left: 0;
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--color-surface) 90%, transparent),
			transparent
		);
	}

	.fade-right {
		right: 0;
		background: linear-gradient(
			to left,
			color-mix(in srgb, var(--color-surface) 90%, transparent),
			transparent
		);
	}

	/* Scroll hint */
	.scroll-hint {
		position: absolute;
		bottom: 1rem;
		right: 1.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-data, monospace);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink, #36322f);
		opacity: 0.45;
		pointer-events: none;
		animation: hintPulse 2.5s ease-in-out infinite;
		z-index: 3;
	}

	.scroll-hint-arrow {
		display: inline-block;
		animation: hintSlide 1.8s ease-in-out infinite;
	}

	@keyframes hintPulse {
		0%,
		100% {
			opacity: 0.45;
		}
		50% {
			opacity: 0.25;
		}
	}

	@keyframes hintSlide {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}
</style>
