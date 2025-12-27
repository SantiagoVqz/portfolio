<script lang="ts">
	import { gsap } from 'gsap';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		size?: number;
		imageSrc?: string;
	}

	let { size = 280, imageSrc }: Props = $props();

	let containerRef: HTMLDivElement;
	let isHovered = $state(false);

	// Initialize breathing animation
	$effect(() => {
		if (!containerRef) return;

		const circles = containerRef.querySelectorAll('.orbit-circle');
		const innerGlow = containerRef.querySelector('.inner-glow');
		const pulseRing = containerRef.querySelector('.pulse-ring');

		// Breathing animation for inner glow
		const breatheTl = gsap.timeline({ repeat: -1, yoyo: true });
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

		return () => {
			breatheTl.kill();
			gsap.killTweensOf(circles);
			gsap.killTweensOf(innerGlow);
			gsap.killTweensOf(pulseRing);
		};
	});
</script>

<div
	bind:this={containerRef}
	class="animated-avatar relative"
	style="--size: {size}px"
	use:magnetic={{ strength: 0.15, duration: 0.8 }}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	data-cursor-hover
>
	<!-- Pulse ring (radiates outward) -->
	<div class="pulse-ring absolute inset-0 rounded-full border-2 border-[--color-accent] opacity-40"></div>

	<!-- Outer orbit circles -->
	<svg class="orbit-circle absolute inset-0 w-full h-full" viewBox="0 0 100 100">
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

	<svg class="orbit-circle absolute inset-0 w-full h-full" viewBox="0 0 100 100">
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

	<svg class="orbit-circle absolute inset-0 w-full h-full" viewBox="0 0 100 100">
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
			inset: 15%;
			background: radial-gradient(
				circle at 30% 30%,
				color-mix(in srgb, var(--color-accent) 20%, var(--color-surface)) 0%,
				color-mix(in srgb, var(--color-tension) 10%, var(--color-surface)) 60%,
				var(--color-surface) 100%
			);
			box-shadow:
				inset 0 0 40px rgba(204, 139, 101, 0.15),
				0 20px 60px -20px rgba(54, 50, 47, 0.2);
		"
	></div>

	<!-- Avatar content area -->
	<div
		class="avatar-content absolute rounded-full overflow-hidden flex items-center justify-center"
		style="inset: 18%"
	>
		{#if imageSrc}
			<!-- Actual memoji/avatar image -->
			<img
				src={imageSrc}
				alt="Santiago Vazquez"
				class="w-full h-full object-cover"
				class:scale-105={isHovered}
				style="transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
			/>
		{:else}
			<!-- Placeholder: Stylized initials -->
			<div
				class="w-full h-full flex items-center justify-center"
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
		class="accent-dot absolute w-2 h-2 rounded-full"
		style="
			top: 10%;
			right: 20%;
			background: var(--color-accent);
			opacity: 0.6;
			animation: float-dot 4s ease-in-out infinite;
		"
	></div>
	<div
		class="accent-dot absolute w-1.5 h-1.5 rounded-full"
		style="
			bottom: 15%;
			left: 15%;
			background: var(--color-tension);
			opacity: 0.5;
			animation: float-dot 5s ease-in-out infinite reverse;
		"
	></div>
	<div
		class="accent-dot absolute w-1 h-1 rounded-full"
		style="
			top: 25%;
			left: 10%;
			background: var(--color-accent);
			opacity: 0.4;
			animation: float-dot 6s ease-in-out infinite 1s;
		"
	></div>

	<!-- Status indicator -->
	<div
		class="status-indicator absolute bottom-[18%] right-[18%] flex items-center gap-2 px-3 py-1.5
			   rounded-full bg-[--color-surface] border border-[--color-tension] border-opacity-30"
		style="box-shadow: 0 4px 12px -4px rgba(54, 50, 47, 0.15)"
	>
		<span class="w-2 h-2 rounded-full bg-[--color-tension] animate-pulse"></span>
		<span class="font-mono text-[9px] uppercase tracking-widest opacity-60">Available</span>
	</div>
</div>

<style>
	.animated-avatar {
		width: var(--size);
		height: var(--size);
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
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>

