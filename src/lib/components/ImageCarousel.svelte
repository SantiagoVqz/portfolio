<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		images: string[];
		alt: string;
		accentColor?: string;
	}

	let { images, alt, accentColor = 'var(--color-accent)' }: Props = $props();

	let stripRef = $state<HTMLElement>();
	let isDragging = $state(false);
	let hasOverflow = $state(false);
	let atStart = $state(true);
	let atEnd = $state(false);
	let dragStartX = 0;
	let dragScrollStart = 0;

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
		updateScrollState();
		const observer = new ResizeObserver(() => updateScrollState());
		if (stripRef) observer.observe(stripRef);
		return () => observer.disconnect();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	class="gallery"
	aria-label="{alt} gallery"
	onkeydown={handleKeydown}
	tabindex="0"
>
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

	<!-- Scroll hint (only visible when there's overflow and at start) -->
	{#if hasOverflow && atStart}
		<div class="scroll-hint" style="--accent: {accentColor}">
			<span class="scroll-hint-text">Drag to explore</span>
			<span class="scroll-hint-arrow">&rarr;</span>
		</div>
	{/if}
</section>

<style>
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
