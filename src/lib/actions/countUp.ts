import type { Action } from 'svelte/action';

interface CountUpOptions {
	duration?: number;
	delay?: number;
	start?: number;
	separator?: string;
	prefix?: string;
	suffix?: string;
	decimals?: number;
}

/**
 * Count Up Animation Action
 * Animates numeric values from 0 (or a start value) to their final value
 * when the element enters the viewport. Supports various number formats.
 *
 * @example
 * <span use:countUp={{ duration: 2 }}>1,234</span>
 * <span use:countUp={{ prefix: '$', suffix: 'K' }}>50</span>
 */
export const countUp: Action<HTMLElement, CountUpOptions | undefined> = (node, options = {}) => {
	// Only run on client
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const {
		duration = 2,
		delay = 0,
		start = 0,
		separator = ',',
		prefix = '',
		suffix = '',
		decimals = 0
	} = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let scrollTriggerInstance: import('gsap/ScrollTrigger').ScrollTrigger | null = null;
	const originalText = node.textContent || '';

	// Check if value is primarily numeric (should be animated)
	// Returns false for text-heavy values like "Multiple U.S. Cities" or "Sprayers & Planters"
	const isNumericValue = (text: string): boolean => {
		// Remove common numeric formatting characters
		const cleaned = text.replace(/[$€£¥₹%+<>~]/g, '').replace(/[,\s]/g, '').trim();
		// Check if starts with a number or is mostly numeric
		const numMatch = cleaned.match(/^[\d.]+/);
		if (!numMatch) return false;
		// If number portion is at least 30% of the cleaned string, treat as numeric
		return numMatch[0].length >= cleaned.length * 0.3;
	};

	// Skip animation for non-numeric values - just display original text
	if (!isNumericValue(originalText)) {
		return { destroy() {} };
	}

	// Parse the target number from the element's text content
	const parseNumber = (text: string): number => {
		// Remove common formatting characters
		const cleaned = text
			.replace(/[$€£¥₹%+<>~]/g, '')
			.replace(/[,\s]/g, '')
			.replace(/[kK]$/, '000')
			.replace(/[mM]$/, '000000')
			.replace(/[bB]$/, '000000000');
		return parseFloat(cleaned) || 0;
	};

	// Format number with separators
	const formatNumber = (num: number): string => {
		const fixed = num.toFixed(decimals);
		const parts = fixed.split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
		return prefix + parts.join('.') + suffix;
	};

	const targetNumber = parseNumber(originalText);

	// Detect suffix from original text (including < and > symbols)
	const detectSuffix = (): string => {
		const match = originalText.match(/[kKmMbB%+]$/);
		return match ? match[0] : suffix;
	};

	// Detect prefix from original text (like < or ~)
	const detectPrefix = (): string => {
		const match = originalText.match(/^[<>~]/);
		return match ? match[0] : prefix;
	};

	const detectedSuffix = detectSuffix() || suffix;
	const detectedPrefix = detectPrefix() || prefix;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		// Set initial value
		const counter = { value: start };
		node.textContent = formatNumber(start);

		// Check if already visible
		const rect = node.getBoundingClientRect();
		const isAlreadyVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

		const animate = () => {
			gsap.to(counter, {
				value: targetNumber,
				duration,
				delay,
				ease: 'power2.out',
				onUpdate: () => {
					// Build final text with detected prefix and suffix
					const formatted = formatNumber(counter.value);
					// Remove default prefix/suffix and add detected ones
					const baseNumber = formatted.replace(prefix, '').replace(suffix, '');
					node.textContent = detectedPrefix + baseNumber + detectedSuffix;
				}
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
			// Restore original text
			node.textContent = originalText;
			if (gsapInstance) {
				gsapInstance.killTweensOf(node);
			}
		}
	};
};

/**
 * Animate Value Action
 * A simpler version that just animates any numeric property of an element.
 * Good for progress bars, gauges, etc.
 */
interface AnimateValueOptions {
	property?: string; // CSS property to animate
	from?: number;
	to?: number;
	duration?: number;
	unit?: string;
}

export const animateValue: Action<HTMLElement, AnimateValueOptions | undefined> = (
	node,
	options = {}
) => {
	if (typeof window === 'undefined') {
		return { destroy() {} };
	}

	const { property = 'width', from = 0, to = 100, duration = 1.5, unit = '%' } = options;

	let gsapInstance: typeof import('gsap').gsap | null = null;
	let scrollTriggerInstance: import('gsap/ScrollTrigger').ScrollTrigger | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsapInstance = gsap;

		// Set initial value
		node.style.setProperty(property, `${from}${unit}`);

		scrollTriggerInstance = ScrollTrigger.create({
			trigger: node,
			start: 'top 85%',
			once: true,
			onEnter: () => {
				gsap.to(node, {
					[property]: `${to}${unit}`,
					duration,
					ease: 'power2.out'
				});
			}
		});
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

