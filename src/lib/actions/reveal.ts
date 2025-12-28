import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Action } from 'svelte/action';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
	blur?: number;
	y?: number;
	x?: number;
	rotation?: number;
	scale?: number;
	duration?: number;
	stagger?: number;
	start?: string;
	markers?: boolean;
	settle?: boolean; // Enable card-settle physics
}

/**
 * Reveal Action — "Card Settle" Edition
 * Creates a physical reveal effect where elements enter like cards
 * being gently placed on a wooden table.
 *
 * Features:
 * - Subtle rotation for organic feel
 * - Soft blur-to-sharp transition
 * - "Settle" overshoot for weight
 * - Variable stagger for natural rhythm
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	const {
		blur = 20,
		y = 60,
		x = 0,
		rotation = 0,
		scale = 1,
		duration = 1.4,
		stagger = 0,
		start = 'top 85%',
		markers = false,
		settle = true
	} = options;

	let scrollTriggerInstance: ScrollTrigger | null = null;
	let tween: gsap.core.Tween | gsap.core.Timeline | null = null;

	// Determine if we're animating children or the node itself
	const targets = stagger > 0 && node.children.length > 0 ? node.children : node;

	// Calculate organic variations for each element
	const getVariation = (index: number) => {
		// Pseudo-random but deterministic based on index
		const seed = (index * 7) % 11;
		return {
			rotationOffset: ((seed - 5) / 5) * 1.5, // -1.5 to 1.5 degrees
			yOffset: ((seed % 3) - 1) * 8, // -8 to 8px variation
			durationOffset: ((seed % 5) / 10) * 0.2 // 0 to 0.2s variation
		};
	};

	// Set initial state with organic variations
	if (stagger > 0 && node.children.length > 0) {
		Array.from(node.children).forEach((child, i) => {
			const v = getVariation(i);
			gsap.set(child, {
				opacity: 0,
				y: y + v.yOffset,
				x,
				rotation: rotation + v.rotationOffset + 2, // Slight tilt
				scale: scale * 0.96,
				filter: `blur(${blur}px)`,
				transformOrigin: '50% 100%' // Pivot from bottom for card feel
			});
		});
	} else {
		gsap.set(targets, {
			opacity: 0,
			y,
			x,
			rotation: rotation + 1.5,
			scale: scale * 0.98,
			filter: `blur(${blur}px)`,
			transformOrigin: '50% 100%'
		});
	}

	// The "settle" ease — slight overshoot then rest
	// Mimics a card landing and settling on a surface
	const settleEase = settle ? 'back.out(1.2)' : 'power4.out';

	// Create the animation
	if (stagger > 0 && node.children.length > 0) {
		const tl = gsap.timeline({ paused: true });

		Array.from(node.children).forEach((child, i) => {
			const v = getVariation(i);
			const elementDuration = duration + v.durationOffset;

			// Variable stagger — accelerates then decelerates like dealing cards
			const staggerDelay = i * stagger * (1 + Math.sin((i / node.children.length) * Math.PI) * 0.3);

			tl.to(
				child,
				{
					opacity: 1,
					y: 0,
					x: 0,
					rotation: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: elementDuration,
					ease: settleEase
				},
				staggerDelay
			);
		});

		tween = tl;
	} else {
		tween = gsap.to(targets, {
			opacity: 1,
			y: 0,
			x: 0,
			rotation: 0,
			scale: 1,
			filter: 'blur(0px)',
			duration,
			ease: settleEase
		});
		tween.pause();
	}

	// Check if element is already visible in viewport
	const rect = node.getBoundingClientRect();
	const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

	if (isAlreadyVisible) {
		// Element is already in view - play animation immediately
		tween?.play();
	} else {
		// Create ScrollTrigger - only reveal once, don't hide on scroll
		scrollTriggerInstance = ScrollTrigger.create({
			trigger: node,
			start,
			markers,
			once: true, // Only trigger once - content stays visible after reveal
			onEnter: () => tween?.play()
		});
	}

	return {
		destroy() {
			scrollTriggerInstance?.kill();
			tween?.kill();
			gsap.killTweensOf(targets);
		}
	};
};

/**
 * Reveal with Exit Action
 * Creates reveal animations when entering viewport AND
 * fade-out animations when leaving viewport.
 *
 * Perfect for sections that should animate both in and out
 * for a professional, polished experience.
 */
interface RevealWithExitOptions extends RevealOptions {
	exitBlur?: number;
	exitY?: number;
	exitScale?: number;
	exitDuration?: number;
	end?: string;
	persist?: boolean; // If true, elements stay visible after reveal (no exit animation)
}

export const revealWithExit: Action<HTMLElement, RevealWithExitOptions | undefined> = (
	node,
	options = {}
) => {
	const {
		blur = 20,
		y = 60,
		x = 0,
		rotation = 0,
		scale = 1,
		duration = 1.2,
		stagger = 0,
		start = 'top 85%',
		end = 'bottom -50%', // Changed from 'top -20%' to be less aggressive
		markers = false,
		settle = true,
		exitBlur = 10,
		exitY = -30,
		exitScale = 0.98,
		exitDuration = 0.6,
		persist = false // Default to false for backward compatibility
	} = options;

	let scrollTriggerInstance: ScrollTrigger | null = null;
	let hasEntered = false;

	// Determine if we're animating children or the node itself
	const targets = stagger > 0 && node.children.length > 0 ? Array.from(node.children) : [node];

	// Calculate organic variations for each element
	const getVariation = (index: number) => {
		const seed = (index * 7) % 11;
		return {
			rotationOffset: ((seed - 5) / 5) * 1.5,
			yOffset: ((seed % 3) - 1) * 8,
			durationOffset: ((seed % 5) / 10) * 0.2
		};
	};

	// Set initial state
	targets.forEach((target, i) => {
		const v = stagger > 0 ? getVariation(i) : { rotationOffset: 0, yOffset: 0, durationOffset: 0 };
		gsap.set(target, {
			opacity: 0,
			y: y + v.yOffset,
			x,
			rotation: rotation + v.rotationOffset + (stagger > 0 ? 2 : 1.5),
			scale: scale * (stagger > 0 ? 0.96 : 0.98),
			filter: `blur(${blur}px)`,
			transformOrigin: '50% 100%'
		});
	});

	const settleEase = settle ? 'back.out(1.2)' : 'power4.out';

	// Enter animation
	const animateEnter = () => {
		hasEntered = true;
		targets.forEach((target, i) => {
			const v = stagger > 0 ? getVariation(i) : { durationOffset: 0 };
			const elementDuration = duration + v.durationOffset;
			const delay =
				stagger > 0 ? i * stagger * (1 + Math.sin((i / targets.length) * Math.PI) * 0.3) : 0;

			gsap.to(target, {
				opacity: 1,
				y: 0,
				x: 0,
				rotation: 0,
				scale: 1,
				filter: 'blur(0px)',
				duration: elementDuration,
				delay,
				ease: settleEase,
				overwrite: 'auto'
			});
		});
	};

	// Exit animation (when leaving viewport going up)
	const animateExit = () => {
		targets.forEach((target, i) => {
			const delay = stagger > 0 ? (targets.length - 1 - i) * (stagger * 0.5) : 0;

			gsap.to(target, {
				opacity: 0,
				y: exitY,
				scale: exitScale,
				filter: `blur(${exitBlur}px)`,
				duration: exitDuration,
				delay,
				ease: 'power2.in',
				overwrite: 'auto'
			});
		});
	};

	// Re-enter animation (when scrolling back down)
	const animateEnterBack = () => {
		targets.forEach((target, i) => {
			const delay = stagger > 0 ? i * (stagger * 0.5) : 0;

			gsap.to(target, {
				opacity: 1,
				y: 0,
				scale: 1,
				filter: 'blur(0px)',
				duration: exitDuration * 1.2,
				delay,
				ease: 'power3.out',
				overwrite: 'auto'
			});
		});
	};

	// Check if element is already visible in viewport
	const rect = node.getBoundingClientRect();
	const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

	if (isAlreadyVisible) {
		animateEnter();
	}

	// Create ScrollTrigger with enter and leave callbacks
	scrollTriggerInstance = ScrollTrigger.create({
		trigger: node,
		start,
		end: persist ? undefined : end, // Don't set end if persist is true
		markers,
		once: persist, // If persist is true, only trigger once
		onEnter: () => {
			if (!hasEntered) {
				animateEnter();
			}
		},
		onLeave: () => {
			if (!persist) {
				animateExit();
			}
		},
		onEnterBack: () => {
			if (!persist) {
				animateEnterBack();
			}
		},
		onLeaveBack: () => {
			if (!persist) {
				// Reset to initial hidden state when scrolling back past the trigger
				targets.forEach((target, i) => {
					const v = stagger > 0 ? getVariation(i) : { rotationOffset: 0, yOffset: 0 };
					gsap.to(target, {
						opacity: 0,
						y: y + v.yOffset,
						rotation: rotation + v.rotationOffset + (stagger > 0 ? 2 : 1.5),
						scale: scale * (stagger > 0 ? 0.96 : 0.98),
						filter: `blur(${blur}px)`,
						duration: exitDuration,
						ease: 'power2.in',
						overwrite: 'auto'
					});
				});
				hasEntered = false;
			}
		}
	});

	return {
		destroy() {
			scrollTriggerInstance?.kill();
			targets.forEach((target) => gsap.killTweensOf(target));
		}
	};
};

/**
 * Card Settle Action
 * Specifically designed for stacking sheet/card elements.
 * Creates that satisfying "thwap" of a card landing on a table.
 */
interface CardSettleOptions {
	delay?: number;
	duration?: number;
	fromY?: number;
	fromRotation?: number;
}

export const cardSettle: Action<HTMLElement, CardSettleOptions | undefined> = (
	node,
	options = {}
) => {
	const { delay = 0, duration = 0.8, fromY = 100, fromRotation = 3 } = options;

	// Set initial state — card hovering above, slightly tilted
	gsap.set(node, {
		y: fromY,
		rotation: fromRotation,
		opacity: 0.8,
		scale: 1.02,
		transformOrigin: '50% 100%',
		boxShadow: '0 40px 80px -20px rgba(54, 50, 47, 0.3)'
	});

	let scrollTriggerInstance: ScrollTrigger | null = null;
	let tween: gsap.core.Timeline | null = null;

	// Create the settle animation
	tween = gsap.timeline({ paused: true, delay });

	// Phase 1: Drop with overshoot
	tween.to(node, {
		y: -8, // Overshoot past resting position
		rotation: -0.5,
		opacity: 1,
		scale: 1,
		duration: duration * 0.6,
		ease: 'power2.in'
	});

	// Phase 2: Settle back with micro-bounce
	tween.to(node, {
		y: 0,
		rotation: 0,
		boxShadow: '0 8px 24px -8px rgba(54, 50, 47, 0.15)',
		duration: duration * 0.4,
		ease: 'elastic.out(1, 0.5)'
	});

	// Create ScrollTrigger
	scrollTriggerInstance = ScrollTrigger.create({
		trigger: node,
		start: 'top 90%',
		onEnter: () => tween?.play()
	});

	return {
		destroy() {
			scrollTriggerInstance?.kill();
			tween?.kill();
			gsap.killTweensOf(node);
		}
	};
};

/**
 * Batch Reveal Action
 * For performance-critical scenarios with many elements.
 * Uses ScrollTrigger.batch for optimized handling of multiple elements.
 */
export const revealBatch: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	const { blur = 20, y = 60, duration = 1.4, stagger = 0.08, start = 'top 85%' } = options;

	// Set initial state for all children
	const children = node.querySelectorAll('[data-reveal]');

	Array.from(children).forEach((child, i) => {
		const rotationOffset = ((((i * 7) % 11) - 5) / 5) * 1.5;
		gsap.set(child, {
			opacity: 0,
			y,
			rotation: rotationOffset + 2,
			scale: 0.97,
			filter: `blur(${blur}px)`,
			transformOrigin: '50% 100%'
		});
	});

	// Create batch animation - reveal once and stay visible
	const batchInstance = ScrollTrigger.batch(children, {
		start,
		once: true, // Only trigger once - content stays visible after reveal
		onEnter: (batch) =>
			gsap.to(batch, {
				opacity: 1,
				y: 0,
				rotation: 0,
				scale: 1,
				filter: 'blur(0px)',
				duration,
				stagger: {
					each: stagger,
					ease: 'power2.inOut' // Accelerate then decelerate stagger
				},
				ease: 'back.out(1.2)'
			})
	});

	return {
		destroy() {
			batchInstance.forEach((trigger) => trigger.kill());
			gsap.killTweensOf(children);
		}
	};
};
