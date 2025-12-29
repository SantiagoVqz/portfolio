import type { Action } from 'svelte/action';

interface TextRevealOptions {
	stagger?: number;
	duration?: number;
	delay?: number;
	y?: number;
	rotationX?: number;
	ease?: string;
	splitBy?: 'chars' | 'words';
}

/**
 * Text Reveal Action
 * Splits text into individual characters or words and animates them in
 * with a staggered reveal effect. Creates a dramatic entrance animation.
 *
 * @example
 * <h1 use:textReveal={{ stagger: 0.03, duration: 1 }}>Hello World</h1>
 */
export const textReveal: Action<HTMLElement, TextRevealOptions | undefined> = (
	node,
	options = {}
) => {
	// Only run on client
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const {
		stagger = 0.03,
		duration = 0.8,
		delay = 0,
		y = 100,
		rotationX = -80,
		ease = 'power4.out',
		splitBy = 'chars'
	} = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let scrollTriggerInstance: import('gsap/ScrollTrigger').ScrollTrigger | null = null;
	const originalHTML = node.innerHTML;
	const originalStyle = node.style.cssText;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		// Get the text content
		const text = node.textContent || '';

		// Split into spans
		let spans: HTMLSpanElement[] = [];

		if (splitBy === 'chars') {
			// Split by characters, but preserve word boundaries for proper wrapping
			const words = text.split(' ');
			node.innerHTML = '';

			words.forEach((word, wordIndex) => {
				// Create a word wrapper to keep characters together
				const wordWrapper = document.createElement('span');
				wordWrapper.style.display = 'inline-block';
				wordWrapper.style.whiteSpace = 'nowrap';

				// Split word into characters
				for (let i = 0; i < word.length; i++) {
					const char = word[i];
					const span = document.createElement('span');
					span.textContent = char;
					span.style.display = 'inline-block';
					span.style.willChange = 'transform, opacity';
					wordWrapper.appendChild(span);
					spans.push(span);
				}

				node.appendChild(wordWrapper);

				// Add space between words (not after last word)
				if (wordIndex < words.length - 1) {
					const space = document.createTextNode(' ');
					node.appendChild(space);
				}
			});
		} else {
			// Split by words
			const words = text.split(' ');
			node.innerHTML = '';

			words.forEach((word, i) => {
				const span = document.createElement('span');
				span.textContent = word;
				span.style.display = 'inline-block';
				span.style.willChange = 'transform, opacity';
				span.style.marginRight = i < words.length - 1 ? '0.3em' : '0';
				node.appendChild(span);
				spans.push(span);
			});
		}

		// Set initial state
		gsap.set(spans, {
			y,
			rotationX,
			opacity: 0,
			transformOrigin: '50% 50% -50px',
			transformPerspective: 1000
		});

		// Check if element is already visible
		const rect = node.getBoundingClientRect();
		const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

		const animate = () => {
			gsap.to(spans, {
				y: 0,
				rotationX: 0,
				opacity: 1,
				duration,
				stagger: {
					each: stagger,
					ease: 'power2.inOut'
				},
				ease,
				delay
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
			// Restore original content
			node.innerHTML = originalHTML;
			node.style.cssText = originalStyle;
			if (gsapInstance) {
				gsapInstance.killTweensOf(node.children);
			}
		}
	};
};

/**
 * Line Reveal Action
 * Animates lines of text with a wave effect, ideal for paragraphs or descriptions.
 */
interface LineRevealOptions {
	stagger?: number;
	duration?: number;
	delay?: number;
	y?: number;
}

export const lineReveal: Action<HTMLElement, LineRevealOptions | undefined> = (
	node,
	options = {}
) => {
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const { stagger = 0.1, duration = 0.8, delay = 0, y = 30 } = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let scrollTriggerInstance: import('gsap/ScrollTrigger').ScrollTrigger | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		// Set initial state
		gsap.set(node, {
			y,
			opacity: 0,
			filter: 'blur(4px)'
		});

		const rect = node.getBoundingClientRect();
		const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

		const animate = () => {
			gsap.to(node, {
				y: 0,
				opacity: 1,
				filter: 'blur(0px)',
				duration,
				delay,
				ease: 'power3.out'
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
				gsapInstance.killTweensOf(node);
			}
		}
	};
};

