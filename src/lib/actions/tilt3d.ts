import type { Action } from 'svelte/action';

interface Tilt3DOptions {
	maxRotation?: number; // Max rotation in degrees
	perspective?: number; // Perspective distance in pixels
	scale?: number; // Scale on hover
	speed?: number; // Animation speed
	glare?: boolean; // Add glare effect
	glareOpacity?: number;
}

/**
 * 3D Tilt Effect Action
 * Creates a 3D perspective tilt effect that follows the mouse position.
 * Adds depth and interactivity to cards and containers.
 *
 * @example
 * <div use:tilt3d={{ maxRotation: 15, glare: true }}>Card content</div>
 */
export const tilt3d: Action<HTMLElement, Tilt3DOptions | undefined> = (node, options = {}) => {
	// Only run on client
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	// Skip on touch devices
	const isTouchDevice =
		('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
		window.matchMedia('(hover: none)').matches;

	if (isTouchDevice) {
		return { destroy() {} };
	}

	const {
		maxRotation = 10,
		perspective = 1000,
		scale = 1.02,
		speed = 0.4,
		glare = true,
		glareOpacity = 0.15
	} = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let glareElement: HTMLDivElement | null = null;
	let bounds: DOMRect | null = null;

	// Create glare element if enabled
	if (glare) {
		glareElement = document.createElement('div');
		glareElement.className = 'tilt-glare';
		glareElement.style.cssText = `
			position: absolute;
			inset: 0;
			pointer-events: none;
			background: linear-gradient(
				135deg,
				rgba(255, 255, 255, ${glareOpacity}) 0%,
				transparent 50%
			);
			opacity: 0;
			transition: opacity ${speed}s ease;
			border-radius: inherit;
			z-index: 10;
		`;
		node.style.position = 'relative';
		node.style.overflow = 'hidden';
		node.appendChild(glareElement);
	}

	const handleMouseEnter = () => {
		bounds = node.getBoundingClientRect();
		if (gsapInstance) {
			gsapInstance.to(node, {
				scale,
				duration: speed,
				ease: 'power2.out'
			});
		}
		if (glareElement) {
			glareElement.style.opacity = '1';
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!bounds || !gsapInstance) return;

		const mouseX = e.clientX - bounds.left;
		const mouseY = e.clientY - bounds.top;

		const centerX = bounds.width / 2;
		const centerY = bounds.height / 2;

		// Calculate rotation based on mouse position relative to center
		const rotateX = ((mouseY - centerY) / centerY) * -maxRotation;
		const rotateY = ((mouseX - centerX) / centerX) * maxRotation;

		gsapInstance.to(node, {
			rotateX,
			rotateY,
			transformPerspective: perspective,
			transformOrigin: 'center center',
			duration: speed,
			ease: 'power2.out'
		});

		// Update glare position
		if (glareElement) {
			const glareX = (mouseX / bounds.width) * 100;
			const glareY = (mouseY / bounds.height) * 100;
			glareElement.style.background = `
				radial-gradient(
					circle at ${glareX}% ${glareY}%,
					rgba(255, 255, 255, ${glareOpacity * 1.5}) 0%,
					rgba(255, 255, 255, ${glareOpacity * 0.5}) 30%,
					transparent 60%
				)
			`;
		}
	};

	const handleMouseLeave = () => {
		if (!gsapInstance) return;

		gsapInstance.to(node, {
			rotateX: 0,
			rotateY: 0,
			scale: 1,
			duration: speed * 1.5,
			ease: 'elastic.out(1, 0.5)'
		});

		if (glareElement) {
			glareElement.style.opacity = '0';
		}

		bounds = null;
	};

	// Initialize GSAP
	const init = async () => {
		const { gsap } = await import('gsap');
		gsapInstance = gsap;

		// Set initial transform style
		node.style.transformStyle = 'preserve-3d';
		node.style.willChange = 'transform';
	};

	init();

	node.addEventListener('mouseenter', handleMouseEnter);
	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleMouseEnter);
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);

			if (glareElement && node.contains(glareElement)) {
				node.removeChild(glareElement);
			}

			if (gsapInstance) {
				gsapInstance.killTweensOf(node);
			}

			// Reset styles
			node.style.transform = '';
			node.style.transformStyle = '';
			node.style.willChange = '';
		}
	};
};

