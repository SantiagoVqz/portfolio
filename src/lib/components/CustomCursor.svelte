<script lang="ts">
	import { cursorState, scrollState } from '$lib/stores/scroll.svelte';
	import { onMount } from 'svelte';

	// Initialize cursor and scroll tracking on mount
	onMount(() => {
		cursorState.init();
		scrollState.init();

		return () => {
			cursorState.destroy();
			scrollState.destroy();
		};
	});

	// Reactive cursor size based on state
	let cursorSize = $derived(cursorState.isHovering ? 48 : cursorState.isPressed ? 16 : 24);

	// Reactive cursor opacity based on visibility and scroll
	let cursorOpacity = $derived(cursorState.isVisible ? 1 : 0);
</script>

<!-- Outer ring (follows with delay) -->
<div
	class="custom-cursor-ring"
	style="
		--x: {cursorState.smoothX}px;
		--y: {cursorState.smoothY}px;
		--size: {cursorSize}px;
		--opacity: {cursorOpacity};
	"
	class:is-hovering={cursorState.isHovering}
	class:is-pressed={cursorState.isPressed}
	aria-hidden="true"
></div>

<!-- Inner dot (follows immediately) -->
<div
	class="custom-cursor-dot"
	style="
		--x: {cursorState.x}px;
		--y: {cursorState.y}px;
		--opacity: {cursorOpacity};
	"
	class:is-hovering={cursorState.isHovering}
	class:is-pressed={cursorState.isPressed}
	aria-hidden="true"
></div>

<style>
	.custom-cursor-ring,
	.custom-cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		mix-blend-mode: difference;
	}

	.custom-cursor-ring {
		width: var(--size);
		height: var(--size);
		border: 1.5px solid var(--color-accent, #cc8b65);
		border-radius: 50%;
		transform: translate(calc(var(--x) - var(--size) / 2), calc(var(--y) - var(--size) / 2));
		opacity: var(--opacity);
		transition:
			width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.3s ease,
			opacity 0.3s ease;
	}

	.custom-cursor-ring.is-hovering {
		border-color: var(--color-tension, #7d9c8b);
		background: rgba(125, 156, 139, 0.1);
	}

	.custom-cursor-ring.is-pressed {
		border-width: 2px;
	}

	.custom-cursor-dot {
		width: 6px;
		height: 6px;
		background: var(--color-accent, #cc8b65);
		border-radius: 50%;
		transform: translate(calc(var(--x) - 3px), calc(var(--y) - 3px));
		opacity: var(--opacity);
		transition:
			transform 0.1s ease,
			opacity 0.3s ease;
	}

	.custom-cursor-dot.is-hovering {
		background: var(--color-tension, #7d9c8b);
		transform: translate(calc(var(--x) - 3px), calc(var(--y) - 3px)) scale(1.5);
	}

	.custom-cursor-dot.is-pressed {
		transform: translate(calc(var(--x) - 3px), calc(var(--y) - 3px)) scale(0.5);
	}

	/* Hide default cursor when custom cursor is active */
	:global(body) {
		cursor: none;
	}

	:global(a, button, [data-cursor-hover]) {
		cursor: none;
	}

	/* Fallback for touch devices */
	@media (hover: none) and (pointer: coarse) {
		.custom-cursor-ring,
		.custom-cursor-dot {
			display: none;
		}

		:global(body),
		:global(a),
		:global(button),
		:global([data-cursor-hover]) {
			cursor: auto;
		}
	}
</style>

