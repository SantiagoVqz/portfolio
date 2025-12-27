import { gsap } from 'gsap';
import type { Action } from 'svelte/action';

interface MagneticOptions {
	strength?: number;
	duration?: number;
}

/**
 * Magnetic Action
 * Creates a subtle magnetic pull effect where elements are attracted toward the cursor.
 * Uses GSAP's quickTo for 10x better performance than gsap.to for mouse-followers.
 *
 * @example
 * <button use:magnetic={{ strength: 0.5, duration: 0.6 }}>Hover me</button>
 */
export const magnetic: Action<HTMLElement, MagneticOptions | undefined> = (
	node,
	options = {}
) => {
	const { strength = 0.5, duration = 0.6 } = options;

	let xTo: gsap.QuickToFunc;
	let yTo: gsap.QuickToFunc;

	const init = () => {
		// quickTo is 10x more performant for mouse-followers than gsap.to
		xTo = gsap.quickTo(node, 'x', {
			duration,
			ease: 'power4.out'
		});
		yTo = gsap.quickTo(node, 'y', {
			duration,
			ease: 'power4.out'
		});
	};

	const handleMouseMove = (e: MouseEvent) => {
		const { clientX, clientY } = e;
		const { height, width, left, top } = node.getBoundingClientRect();

		// Calculate the distance from the center of the element
		const x = (clientX - (left + width / 2)) * strength;
		const y = (clientY - (top + height / 2)) * strength;

		xTo(x);
		yTo(y);
	};

	const handleMouseLeave = () => {
		// Return to origin with a 'weighted' elastic snap
		gsap.to(node, {
			x: 0,
			y: 0,
			duration: duration * 1.5,
			ease: 'elastic.out(1, 0.3)'
		});
	};

	init();

	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			// Kill any ongoing animations to prevent memory leaks
			gsap.killTweensOf(node);
		}
	};
};

