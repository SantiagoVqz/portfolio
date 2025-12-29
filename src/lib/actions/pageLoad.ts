import type { Action } from 'svelte/action';

interface PageLoadOptions {
	/** Delay before starting the animation sequence */
	delay?: number;
	/** Duration for each element's animation */
	duration?: number;
	/** Callback when animation completes */
	onComplete?: () => void;
}

/**
 * Page Load Animation Action
 * Creates an orchestrated entrance animation sequence when the page first loads.
 * Animates child elements with specific data attributes in a choreographed timeline.
 *
 * Supported data attributes:
 * - data-load="navbar" - Slides down from top
 * - data-load="hero-content" - Fades up from bottom
 * - data-load="hero-avatar" - Scales up with fade
 * - data-load="hero-badge" - Fades in with slight blur
 * - data-load="hero-cta" - Slides in from bottom with delay
 *
 * @example
 * <div use:pageLoad={{ delay: 0.2 }}>
 *   <nav data-load="navbar">...</nav>
 *   <div data-load="hero-content">...</div>
 * </div>
 */
export const pageLoad: Action<HTMLElement, PageLoadOptions | undefined> = (node, options = {}) => {
	// Only run on client
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const { delay = 0.1, duration = 0.8, onComplete } = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let timeline: gsap.core.Timeline | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		gsapInstance = gsap;

		// Find elements with data-load attributes
		const navbar = node.querySelector('[data-load="navbar"]');
		const heroContent = node.querySelector('[data-load="hero-content"]');
		const heroAvatar = node.querySelector('[data-load="hero-avatar"]');
		const heroBadge = node.querySelector('[data-load="hero-badge"]');
		const heroCta = node.querySelector('[data-load="hero-cta"]');
		const heroName = node.querySelector('[data-load="hero-name"]');
		const heroSubtitle = node.querySelector('[data-load="hero-subtitle"]');

		// Set initial states
		if (navbar) {
			gsap.set(navbar, { y: -100, opacity: 0 });
		}
		if (heroContent) {
			gsap.set(heroContent, { opacity: 0, y: 50 });
		}
		if (heroAvatar) {
			gsap.set(heroAvatar, { scale: 0.8, opacity: 0, filter: 'blur(10px)' });
		}
		if (heroBadge) {
			gsap.set(heroBadge, { opacity: 0, y: 20, filter: 'blur(5px)' });
		}
		if (heroCta) {
			gsap.set(heroCta, { opacity: 0, y: 30 });
		}
		if (heroName) {
			gsap.set(heroName, { opacity: 0, y: 60, filter: 'blur(10px)' });
		}
		if (heroSubtitle) {
			gsap.set(heroSubtitle, { opacity: 0, y: 30, filter: 'blur(5px)' });
		}

		// Create orchestrated timeline
		timeline = gsap.timeline({
			delay,
			onComplete: () => {
				// Clean up will-change properties after animation
				[navbar, heroContent, heroAvatar, heroBadge, heroCta, heroName, heroSubtitle].forEach(
					(el) => {
						if (el instanceof HTMLElement) {
							el.style.willChange = 'auto';
						}
					}
				);
				onComplete?.();
			}
		});

		// Navbar slides down first
		if (navbar) {
			timeline.to(
				navbar,
				{
					y: 0,
					opacity: 1,
					duration: duration * 0.8,
					ease: 'power3.out'
				},
				0
			);
		}

		// Hero badge fades in
		if (heroBadge) {
			timeline.to(
				heroBadge,
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: duration * 0.7,
					ease: 'power2.out'
				},
				0.2
			);
		}

		// Hero name reveals with dramatic entrance
		if (heroName) {
			timeline.to(
				heroName,
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: duration * 1.2,
					ease: 'power4.out'
				},
				0.3
			);
		}

		// Hero subtitle follows
		if (heroSubtitle) {
			timeline.to(
				heroSubtitle,
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: duration * 0.9,
					ease: 'power3.out'
				},
				0.5
			);
		}

		// Hero content (generic) fades up
		if (heroContent) {
			timeline.to(
				heroContent,
				{
					opacity: 1,
					y: 0,
					duration: duration,
					ease: 'power3.out'
				},
				0.3
			);
		}

		// Avatar scales up with a nice ease
		if (heroAvatar) {
			timeline.to(
				heroAvatar,
				{
					scale: 1,
					opacity: 1,
					filter: 'blur(0px)',
					duration: duration * 1.2,
					ease: 'back.out(1.4)'
				},
				0.4
			);
		}

		// CTA slides in last
		if (heroCta) {
			timeline.to(
				heroCta,
				{
					opacity: 1,
					y: 0,
					duration: duration * 0.8,
					ease: 'power3.out'
				},
				0.7
			);
		}
	};

	init();

	return {
		destroy() {
			timeline?.kill();
			if (gsapInstance) {
				const elements = node.querySelectorAll('[data-load]');
				elements.forEach((el) => {
					gsapInstance!.killTweensOf(el);
				});
			}
		}
	};
};

/**
 * Staggered Entrance Action
 * A simpler version that just staggers the entrance of child elements.
 * Good for lists, grids, and card collections.
 */
interface StaggerEntranceOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	delay?: number;
}

export const staggerEntrance: Action<HTMLElement, StaggerEntranceOptions | undefined> = (
	node,
	options = {}
) => {
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const { stagger = 0.1, duration = 0.8, y = 40, scale = 0.95, delay = 0 } = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let scrollTriggerInstance: import('gsap/ScrollTrigger').ScrollTrigger | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		const children = Array.from(node.children);

		// Set initial state
		gsap.set(children, {
			opacity: 0,
			y,
			scale
		});

		// Check if already visible
		const rect = node.getBoundingClientRect();
		const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

		const animate = () => {
			gsap.to(children, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration,
				stagger: {
					each: stagger,
					ease: 'power2.inOut'
				},
				delay,
				ease: 'back.out(1.2)'
			});
		};

		if (isAlreadyVisible) {
			animate();
		} else {
			scrollTriggerInstance = ScrollTrigger.create({
				trigger: node,
				start: 'top 85%',
				once: true,
				onEnter: animate
			});
		}
	};

	init();

	return {
		destroy() {
			scrollTriggerInstance?.kill();
			if (gsapInstance) {
				gsapInstance.killTweensOf(node.children);
			}
		}
	};
};

