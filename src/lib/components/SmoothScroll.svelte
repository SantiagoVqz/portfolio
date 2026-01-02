<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import Lenis from 'lenis';

	interface Props {
		smooth?: number;
		children: Snippet;
	}

	let { smooth = 1.2, children }: Props = $props();
	let lenis: Lenis | null = null;

	// Detect touch/mobile devices - smooth scroll can cause issues on these
	function isTouchDevice(): boolean {
		if (!browser) return true;
		return (
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia('(hover: none) and (pointer: coarse)').matches
		);
	}

	$effect(() => {
		if (!browser) return;

		// Skip on touch devices
		if (isTouchDevice()) return;

		// Check for reduced motion preference
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// Initialize Lenis
		lenis = new Lenis({
			duration: smooth,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2
		});

		// Animation frame loop
		function raf(time: number) {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// Integrate with GSAP ScrollTrigger if available
		const integrateWithGSAP = async () => {
			try {
				const { gsap } = await import('gsap');
				const { ScrollTrigger } = await import('gsap/ScrollTrigger');
				
				gsap.registerPlugin(ScrollTrigger);

				// Sync Lenis scroll with ScrollTrigger
				lenis?.on('scroll', ScrollTrigger.update);

				gsap.ticker.add((time) => {
					lenis?.raf(time * 1000);
				});

				gsap.ticker.lagSmoothing(0);
			} catch {
				// GSAP not available, that's fine
			}
		};

		integrateWithGSAP();

		return () => {
			lenis?.destroy();
			lenis = null;
		};
	});

	// Expose scroll methods
	export function scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
		if (lenis) {
			lenis.scrollTo(target, {
				offset: options?.offset ?? 0,
				duration: options?.duration ?? 1.2
			});
		} else {
			const element = typeof target === 'string' ? document.querySelector(target) : target;
			element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	export function stop() {
		lenis?.stop();
	}

	export function start() {
		lenis?.start();
	}
</script>

<div class="lenis-wrapper">
	{@render children()}
</div>

<style>
	.lenis-wrapper {
		display: contents;
	}

	/* Lenis recommended styles */
	:global(html.lenis, html.lenis body) {
		height: auto;
	}

	:global(.lenis.lenis-smooth) {
		scroll-behavior: auto !important;
	}

	:global(.lenis.lenis-smooth [data-lenis-prevent]) {
		overscroll-behavior: contain;
	}

	:global(.lenis.lenis-stopped) {
		overflow: hidden;
	}

	:global(.lenis.lenis-smooth iframe) {
		pointer-events: none;
	}
</style>
