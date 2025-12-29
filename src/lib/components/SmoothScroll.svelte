<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	// Note: ScrollSmoother requires GSAP Club membership
	// If not available, we'll use a CSS-based smooth scroll fallback

	interface Props {
		smooth?: number;
		effects?: boolean;
		normalizeScroll?: boolean;
		children: Snippet;
	}

	let { smooth = 1.2, effects = true, normalizeScroll = true, children }: Props = $props();

	let wrapper = $state<HTMLDivElement | null>(null);
	let content = $state<HTMLDivElement | null>(null);
	let smoother: import('gsap/ScrollSmoother').ScrollSmoother | null = null;
	let useNativeSmooth = $state(true);

	// Detect touch/mobile devices - ScrollSmoother causes issues on these
	function isTouchDevice(): boolean {
		if (!browser) return true;
		return (
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia('(hover: none) and (pointer: coarse)').matches
		);
	}

	// Use $effect to initialize when elements are available
	$effect(() => {
		// Only try to initialize ScrollSmoother when elements are available
		if (!wrapper || !content || !browser) return;

		// Skip ScrollSmoother on touch devices - causes scroll locking issues
		if (isTouchDevice()) {
			useNativeSmooth = true;
			return;
		}

		let cleanupFn: (() => void) | undefined;

		const initSmoother = async () => {
			try {
				const { gsap } = await import('gsap');
				const { ScrollTrigger } = await import('gsap/ScrollTrigger');
				const { ScrollSmoother } = await import('gsap/ScrollSmoother');

				gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

				smoother = ScrollSmoother.create({
					wrapper,
					content,
					smooth,
					effects,
					normalizeScroll
				});

				useNativeSmooth = false;

				cleanupFn = () => {
					smoother?.kill();
				};
			} catch {
				// ScrollSmoother not available, use native smooth scroll
				useNativeSmooth = true;
			}
		};

		initSmoother();

		return () => {
			cleanupFn?.();
		};
	});

	// Expose scroll methods
	export function scrollTo(target: string | HTMLElement) {
		if (smoother) {
			smoother.scrollTo(target, true);
		} else {
			const element = typeof target === 'string' ? document.querySelector(target) : target;
			element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	export function pause() {
		smoother?.paused(true);
	}

	export function resume() {
		smoother?.paused(false);
	}
</script>

{#if useNativeSmooth}
	<!-- Native CSS smooth scroll fallback -->
	<div class="smooth-scroll-native">
		{@render children()}
	</div>
{:else}
	<!-- GSAP ScrollSmoother wrapper -->
	<div bind:this={wrapper} id="smooth-wrapper" class="smooth-wrapper">
		<div bind:this={content} id="smooth-content" class="smooth-content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.smooth-scroll-native {
		display: contents;
	}

	.smooth-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.smooth-content {
		display: contents;
	}

	/* Data-speed effects for ScrollSmoother */
	:global([data-speed]) {
		will-change: transform;
	}

	:global([data-lag]) {
		will-change: transform;
	}
</style>
