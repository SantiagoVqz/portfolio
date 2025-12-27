<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
	let smoother: ScrollSmoother | null = null;
	let useNativeSmooth = $state(true);

	// Use $effect to initialize when elements are bound
	$effect(() => {
		// Only try to initialize ScrollSmoother when elements are available
		if (!wrapper || !content) return;

		// Check if ScrollSmoother is available (requires GSAP Club)
		if (typeof ScrollSmoother !== 'undefined') {
			try {
				gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

				smoother = ScrollSmoother.create({
					wrapper,
					content,
					smooth,
					effects,
					normalizeScroll
				});

				useNativeSmooth = false;
			} catch {
				// ScrollSmoother not available, use native smooth scroll
				useNativeSmooth = true;
			}
		}

		return () => {
			smoother?.kill();
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
	/* Native smooth scroll fallback */
	.smooth-scroll-native {
		min-height: 100vh;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	/* GSAP ScrollSmoother styles */
	.smooth-wrapper {
		overflow: hidden;
		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.smooth-content {
		overflow: visible;
		width: 100%;
	}

	/* Parallax effect classes for use with data-speed attribute */
	:global([data-speed]) {
		will-change: transform;
	}

	/* Lag effect for trailing elements */
	:global([data-lag]) {
		will-change: transform;
	}
</style>

