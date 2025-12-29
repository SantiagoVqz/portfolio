import type { Action } from 'svelte/action';

interface ParallaxOptions {
	speed?: number; // Negative = moves opposite to scroll, positive = same direction
	start?: string;
	end?: string;
	scrub?: number | boolean;
}

/**
 * Parallax Action
 * Creates a scroll-based parallax effect where elements move at different speeds
 * relative to the scroll position, creating depth and visual interest.
 *
 * @example
 * <div use:parallax={{ speed: -0.3 }}>Background element</div>
 */
export const parallax: Action<HTMLElement, ParallaxOptions | undefined> = (node, options = {}) => {
	// Only run on client
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	// Skip on touch devices for performance
	const isTouchDevice =
		'ontouchstart' in window ||
		(navigator.maxTouchPoints > 0 && window.matchMedia('(hover: none)').matches);

	if (isTouchDevice) {
		return { destroy() {} };
	}

	const { speed = -0.2, start = 'top bottom', end = 'bottom top', scrub = 1 } = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let tween: gsap.core.Tween | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		// Calculate the y movement based on speed
		// Speed of -0.5 means element moves up 50% slower than scroll
		const yMovement = speed * 200; // Percentage of viewport

		tween = gsap.to(node, {
			y: `${yMovement}%`,
			ease: 'none',
			scrollTrigger: {
				trigger: node.parentElement || node,
				start,
				end,
				scrub,
				invalidateOnRefresh: true
			}
		});
	};

	init();

	return {
		destroy() {
			// Kill the tween which also cleans up its ScrollTrigger
			tween?.kill();
			if (gsapInstance) {
				gsapInstance.killTweensOf(node);
			}
		}
	};
};

interface ParallaxScaleOptions {
	scaleStart?: number;
	scaleEnd?: number;
	opacityStart?: number;
	opacityEnd?: number;
	start?: string;
	end?: string;
}

/**
 * Parallax Scale Action
 * Creates a scroll-based scale and fade effect, great for hero sections
 * where elements should scale up or down as user scrolls.
 */
export const parallaxScale: Action<HTMLElement, ParallaxScaleOptions | undefined> = (
	node,
	options = {}
) => {
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	// Skip on touch devices
	const isTouchDevice =
		'ontouchstart' in window &&
		navigator.maxTouchPoints > 0 &&
		window.matchMedia('(hover: none)').matches;

	if (isTouchDevice) {
		return { destroy() {} };
	}

	const {
		scaleStart = 1,
		scaleEnd = 0.8,
		opacityStart = 1,
		opacityEnd = 0,
		start = 'top top',
		end = 'bottom top'
	} = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		gsap.to(node, {
			scale: scaleEnd,
			opacity: opacityEnd,
			ease: 'none',
			scrollTrigger: {
				trigger: node.parentElement || node,
				start,
				end,
				scrub: 1
			}
		});

		// Set initial state
		gsap.set(node, {
			scale: scaleStart,
			opacity: opacityStart
		});
	};

	init();

	return {
		destroy() {
			if (gsapInstance) {
				gsapInstance.killTweensOf(node);
			}
		}
	};
};

