<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { cssVariables } from '$lib/theme';
	import { browser } from '$app/environment';
	import SmoothScroll from '$lib/components/SmoothScroll.svelte';

	let { children } = $props();

	// Sunlight cursor state
	let sunlightX = $state(0);
	let sunlightY = $state(0);
	let cursorX = $state(0);
	let cursorY = $state(0);
	let cursorScale = $state(1);
	let isHovering = $state(false);
	let isVisible = $state(false);

	// Page load animation state
	let pageLoaded = $state(false);

	$effect(() => {
		// Only run on client
		if (!browser) return;

		// Dynamically import GSAP to avoid SSR issues
		const initGSAP = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');

			// Register GSAP plugins
			gsap.registerPlugin(ScrollTrigger);

			// Page load animation sequence
			const runPageLoadAnimation = () => {
				if (pageLoaded) return;
				pageLoaded = true;

				const tl = gsap.timeline({
					defaults: { ease: 'power4.out' }
				});

				// Animate navbar
				const navbar = document.querySelector('.navbar');
				if (navbar) {
					gsap.set(navbar, { y: -100, opacity: 0 });
					tl.to(navbar, {
						y: 0,
						opacity: 1,
						duration: 0.8
					});
				}

				// Animate ambient blobs
				const blobs = document.querySelectorAll('.ambient-blob');
				if (blobs.length > 0) {
					gsap.set(blobs, { scale: 0.5, opacity: 0 });
					tl.to(
						blobs,
						{
							scale: 1,
							opacity: (i) => (i === 0 ? 0.2 : 0.15),
							duration: 1.2,
							stagger: 0.15,
							ease: 'power2.out'
						},
						'-=0.4'
					);
				}

				// Animate scroll progress indicator with a subtle pulse
				const scrollProgress = document.querySelector('.scroll-progress');
				if (scrollProgress) {
					tl.fromTo(
						scrollProgress,
						{ scaleX: 0, transformOrigin: 'left' },
						{ scaleX: 1, duration: 0.6 },
						'-=0.8'
					);
				}
			};

			// Run page load animation after a brief delay
			setTimeout(runPageLoadAnimation, 100);

			// Initialize sunlight follower with slower, dreamy movement
			const sunlightProxy = { x: 0, y: 0 };
			const sunlightXTo = gsap.quickTo(sunlightProxy, 'x', {
				duration: 1.5,
				ease: 'power2.out',
				onUpdate: () => {
					sunlightX = sunlightProxy.x;
				}
			});
			const sunlightYTo = gsap.quickTo(sunlightProxy, 'y', {
				duration: 1.5,
				ease: 'power2.out',
				onUpdate: () => {
					sunlightY = sunlightProxy.y;
				}
			});

			// Initialize cursor follower with snappy movement
			const cursorProxy = { x: 0, y: 0 };
			const cursorXTo = gsap.quickTo(cursorProxy, 'x', {
				duration: 0.4,
				ease: 'power4.out',
				onUpdate: () => {
					cursorX = cursorProxy.x;
				}
			});
			const cursorYTo = gsap.quickTo(cursorProxy, 'y', {
				duration: 0.4,
				ease: 'power4.out',
				onUpdate: () => {
					cursorY = cursorProxy.y;
				}
			});

			// Mouse move handler
			const handleMouseMove = (e: MouseEvent) => {
				sunlightXTo(e.clientX);
				sunlightYTo(e.clientY);
				cursorXTo(e.clientX);
				cursorYTo(e.clientY);
			};

			// Hover detection for interactive elements
			const handleMouseOver = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (
					target.tagName === 'A' ||
					target.tagName === 'BUTTON' ||
					target.closest('a') ||
					target.closest('button') ||
					target.hasAttribute('data-cursor-hover')
				) {
					isHovering = true;
					cursorScale = 2;
				}
			};

			const handleMouseOut = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (
					target.tagName === 'A' ||
					target.tagName === 'BUTTON' ||
					target.closest('a') ||
					target.closest('button') ||
					target.hasAttribute('data-cursor-hover')
				) {
					isHovering = false;
					cursorScale = 1;
				}
			};

			const handleMouseEnter = () => (isVisible = true);
			const handleMouseLeave = () => (isVisible = false);

			window.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseover', handleMouseOver);
			document.addEventListener('mouseout', handleMouseOut);
			document.addEventListener('mouseenter', handleMouseEnter);
			document.addEventListener('mouseleave', handleMouseLeave);

			// Trigger visibility
			isVisible = true;

			// Return cleanup function
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseover', handleMouseOver);
				document.removeEventListener('mouseout', handleMouseOut);
				document.removeEventListener('mouseenter', handleMouseEnter);
				document.removeEventListener('mouseleave', handleMouseLeave);
			};
		};

		let cleanup: (() => void) | undefined;
		initGSAP().then((cleanupFn) => {
			cleanup = cleanupFn;
		});

		return () => {
			cleanup?.();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Inject CSS variables -->
	{@html `<style>${cssVariables}</style>`}
	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=DM+Mono:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Sunlight glow effect (large, soft radial gradient) -->
<div
	class="sunlight-glow pointer-events-none fixed inset-0 z-[9990] opacity-60"
	style="
		background: radial-gradient(
			600px circle at {sunlightX}px {sunlightY}px,
			rgba(204, 139, 101, 0.08) 0%,
			rgba(204, 139, 101, 0.02) 40%,
			transparent 70%
		);
	"
	aria-hidden="true"
></div>

<!-- Global grain overlay -->
<div class="grain-overlay pointer-events-none fixed inset-0 z-[9991]" aria-hidden="true"></div>

<!-- Custom cursor -->
<div
	class="custom-cursor pointer-events-none fixed z-[9999] mix-blend-difference"
	class:opacity-0={!isVisible}
	class:opacity-100={isVisible}
	style="
		left: {cursorX}px;
		top: {cursorY}px;
		transform: translate(-50%, -50%) scale({cursorScale});
	"
	aria-hidden="true"
>
	<div
		class="h-3 w-3 rounded-full border transition-all duration-300"
		class:border-[--color-accent]={!isHovering}
		class:border-[--color-tension]={isHovering}
		class:bg-[--color-tension]={isHovering}
		class:bg-opacity-20={isHovering}
	></div>
</div>

<!-- Main content with smooth scrolling -->
<SmoothScroll smooth={1.2}>
	<div class="app-wrapper min-h-screen bg-[--color-base] text-[--color-ink]">
		{@render children()}
	</div>
</SmoothScroll>

<style>
	.grain-overlay {
		background-image: var(--glass-grain);
		background-repeat: repeat;
		opacity: 0.4;
	}

	.custom-cursor {
		transition:
			opacity 0.3s ease,
			transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Hide default cursor globally */
	:global(body) {
		cursor: none;
	}

	:global(a, button, [data-cursor-hover]) {
		cursor: none;
	}

	/* Restore cursor on touch devices */
	@media (hover: none) and (pointer: coarse) {
		.sunlight-glow,
		.custom-cursor {
			display: none;
		}

		:global(body),
		:global(a),
		:global(button),
		:global([data-cursor-hover]) {
			cursor: auto;
		}
	}

	/* Smooth scroll */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
