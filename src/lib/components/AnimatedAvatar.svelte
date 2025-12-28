<script lang="ts">
	import { browser } from '$app/environment';
	import { magnetic } from '$lib/actions/magnetic';

	// GSAP types for dynamic imports
	type GSAPInstance = typeof import('gsap').gsap;

	interface Props {
		size?: number;
		imageSrc?: string;
		showStatus?: boolean;
		class?: string;
	}

	let { size = 280, imageSrc, showStatus = true, class: className = '' }: Props = $props();

	let containerRef: HTMLDivElement;
	let isHovered = $state(false);
	let hasError = $state(false);

	// Reset error state when image source changes
	$effect(() => {
		if (imageSrc) hasError = false;
	});

	// Initialize breathing animation
	$effect(() => {
		if (!containerRef || !browser) return;

		let breatheTl: gsap.core.Timeline | null = null;
		let gsapInstance: GSAPInstance | null = null;

		const initAnimations = async () => {
			const { gsap } = await import('gsap');
			gsapInstance = gsap;

			const circles = containerRef.querySelectorAll('.orbit-circle');
			const innerGlow = containerRef.querySelector('.inner-glow');
			const pulseRing = containerRef.querySelector('.pulse-ring');

			// Breathing animation for inner glow
			breatheTl = gsap.timeline({ repeat: -1, yoyo: true });
			breatheTl.to(innerGlow, {
				scale: 1.05,
				opacity: 0.8,
				duration: 3,
				ease: 'sine.inOut'
			});

			// Rotating orbits with different speeds
			circles.forEach((circle, i) => {
				const direction = i % 2 === 0 ? 1 : -1;
				const duration = 20 + i * 8;

				gsap.to(circle, {
					rotation: 360 * direction,
					duration,
					repeat: -1,
					ease: 'none',
					transformOrigin: '50% 50%'
				});
			});

			// Pulse ring animation
			gsap.to(pulseRing, {
				scale: 1.4,
				opacity: 0,
				duration: 2.5,
				repeat: -1,
				ease: 'power2.out'
			});
		};

		initAnimations();

		return () => {
			if (gsapInstance && containerRef) {
				breatheTl?.kill();
				const circles = containerRef.querySelectorAll('.orbit-circle');
				const innerGlow = containerRef.querySelector('.inner-glow');
				const pulseRing = containerRef.querySelector('.pulse-ring');
				gsapInstance.killTweensOf(circles);
				gsapInstance.killTweensOf(innerGlow);
				gsapInstance.killTweensOf(pulseRing);
			}
		};
	});
</script>

<div
	bind:this={containerRef}
	class="animated-avatar relative {className}"
	style="--max-size: {size}px"
	use:magnetic={{ strength: 0.15, duration: 0.8 }}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	data-cursor-hover
	role="img"
	aria-label="Santiago Vazquez avatar"
>
	<!-- Pulse ring (radiates outward) -->
	<div
		class="pulse-ring absolute inset-0 rounded-full border-2 border-[--color-accent] opacity-40"
	></div>

	<!-- Outer orbit circles -->
	<svg class="orbit-circle absolute inset-0 h-full w-full" viewBox="0 0 100 100">
		<circle
			cx="50"
			cy="50"
			r="48"
			fill="none"
			stroke="url(#orbit-gradient-1)"
			stroke-width="0.5"
			stroke-dasharray="8 12"
			opacity="0.4"
		/>
		<defs>
			<linearGradient id="orbit-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="var(--color-accent)" />
				<stop offset="100%" stop-color="var(--color-tension)" />
			</linearGradient>
		</defs>
	</svg>

	<svg class="orbit-circle absolute inset-0 h-full w-full" viewBox="0 0 100 100">
		<circle
			cx="50"
			cy="50"
			r="42"
			fill="none"
			stroke="url(#orbit-gradient-2)"
			stroke-width="0.5"
			stroke-dasharray="4 16"
			opacity="0.3"
		/>
		<defs>
			<linearGradient id="orbit-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stop-color="var(--color-tension)" />
				<stop offset="100%" stop-color="var(--color-accent)" />
			</linearGradient>
		</defs>
	</svg>

	<svg class="orbit-circle absolute inset-0 h-full w-full" viewBox="0 0 100 100">
		<circle
			cx="50"
			cy="50"
			r="35"
			fill="none"
			stroke="var(--color-accent)"
			stroke-width="0.3"
			stroke-dasharray="2 8"
			opacity="0.25"
		/>
	</svg>

	<!-- Inner glow background -->
	<div
		class="inner-glow absolute rounded-full"
		style="
			inset: 12%;
			background: radial-gradient(
				circle at 50% 60%,
				color-mix(in srgb, var(--color-surface) 95%, var(--color-accent)) 0%,
				color-mix(in srgb, var(--color-surface) 90%, var(--color-tension)) 70%,
				var(--color-surface) 100%
			);
			box-shadow:
				inset 0 -20px 40px -10px rgba(204, 139, 101, 0.12),
				0 25px 50px -15px rgba(54, 50, 47, 0.25);
		"
	></div>

	<!-- Avatar content area -->
	<div
		class="avatar-content absolute flex items-end justify-center overflow-hidden rounded-full"
		style="inset: 12%"
	>
		{#if imageSrc && !hasError}
			<!-- Actual memoji/avatar image -->
			<img
				src={imageSrc}
				alt="Santiago Vazquez"
				class="h-auto w-[115%] object-contain"
				class:memoji-hover={isHovered}
				style="
					transition: transform var(--duration-slow) var(--ease-smooth);
					transform: translateY(8%);
					filter: drop-shadow(0 8px 16px rgba(54, 50, 47, 0.15));
				"
				onerror={() => (hasError = true)}
			/>
		{:else}
			<!-- Placeholder: Stylized initials -->
			<div
				class="flex h-full w-full items-center justify-center"
				style="
					background: linear-gradient(
						135deg,
						color-mix(in srgb, var(--color-accent) 15%, var(--color-surface)) 0%,
						var(--color-surface) 100%
					);
				"
			>
				<span
					class="font-serif text-6xl font-light tracking-tight select-none"
					style="
						font-family: var(--font-headline);
						color: var(--color-accent);
						opacity: 0.7;
						text-shadow: 0 2px 20px rgba(204, 139, 101, 0.3);
					"
					class:scale-110={isHovered}
				>
					SV
				</span>
			</div>
		{/if}
	</div>

	<!-- Floating accent dots -->
	<div
		class="accent-dot absolute h-2 w-2 rounded-full"
		style="
			top: 10%;
			right: 20%;
			background: var(--color-accent);
			opacity: 0.6;
			animation: float-dot 4s ease-in-out infinite;
		"
	></div>
	<div
		class="accent-dot absolute h-1.5 w-1.5 rounded-full"
		style="
			bottom: 15%;
			left: 15%;
			background: var(--color-tension);
			opacity: 0.5;
			animation: float-dot 5s ease-in-out infinite reverse;
		"
	></div>
	<div
		class="accent-dot absolute h-1 w-1 rounded-full"
		style="
			top: 25%;
			left: 10%;
			background: var(--color-accent);
			opacity: 0.4;
			animation: float-dot 6s ease-in-out infinite 1s;
		"
	></div>

	<!-- Status indicator -->
	{#if showStatus}
		<div
			class="status-indicator absolute right-[12%] bottom-[8%] flex items-center gap-2 rounded-full border
				border-[--color-ink]/10 bg-[--color-base] px-3 py-1.5"
			style="box-shadow: 0 4px 16px -4px rgba(54, 50, 47, 0.2)"
		>
			<span class="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
		</div>
	{/if}
</div>

<style>
	.animated-avatar {
		width: 100%;
		max-width: var(--max-size);
		aspect-ratio: 1 / 1;
		height: auto;
	}

	@keyframes float-dot {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-4px, -6px);
		}
	}

	.avatar-content span {
		transition: transform var(--duration-slow) var(--ease-smooth);
	}

	.avatar-content img.memoji-hover {
		transform: translateY(8%) scale(var(--scale-medium));
	}
</style>
