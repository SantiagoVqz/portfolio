// Type definitions for GSAP imports
type GSAPInstance = typeof import('gsap').gsap;

/**
 * Global Scroll Progress State
 * Uses Svelte 5 runes for reactive scroll tracking.
 * Exports a reactive object that updates on scroll.
 */
function createScrollState() {
	let progress = $state(0);
	let direction = $state<'up' | 'down'>('down');
	let velocity = $state(0);
	let isScrolling = $state(false);

	let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
	let lastY = 0;
	let lastTime = 0;
	let handler: (() => void) | null = null;

	function init() {
		// Only run in browser
		if (typeof window === 'undefined') return;

		// Plain scroll math — a document-level ScrollTrigger went stale across
		// client-side navigations and pinned the progress bar at 100%.
		const measure = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
		};

		handler = () => {
			const now = performance.now();
			const y = window.scrollY;
			direction = y >= lastY ? 'down' : 'up';
			velocity = now > lastTime ? Math.abs(y - lastY) / (now - lastTime) : 0;
			lastY = y;
			lastTime = now;
			measure();

			isScrolling = true;
			if (scrollTimeout) clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				isScrolling = false;
			}, 150);
		};

		lastY = window.scrollY;
		lastTime = performance.now();
		measure();
		window.addEventListener('scroll', handler, { passive: true });
		window.addEventListener('resize', handler, { passive: true });
	}

	function destroy() {
		if (handler) {
			window.removeEventListener('scroll', handler);
			window.removeEventListener('resize', handler);
			handler = null;
		}
		if (scrollTimeout) clearTimeout(scrollTimeout);
	}

	return {
		get progress() {
			return progress;
		},
		get direction() {
			return direction;
		},
		get velocity() {
			return velocity;
		},
		get isScrolling() {
			return isScrolling;
		},
		init,
		destroy
	};
}

export const scrollState = createScrollState();

/**
 * Cursor State
 * Reactive cursor position and interaction state using Svelte 5 runes.
 */
function createCursorState() {
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);
	let hoverTarget = $state<HTMLElement | null>(null);
	let isPressed = $state(false);
	let isVisible = $state(true);

	// Smooth cursor position using GSAP lerp
	let smoothX = $state(0);
	let smoothY = $state(0);

	let xTo: ReturnType<GSAPInstance['quickTo']> | null = null;
	let yTo: ReturnType<GSAPInstance['quickTo']> | null = null;

	function handleMouseMove(e: MouseEvent) {
		x = e.clientX;
		y = e.clientY;
		xTo?.(e.clientX);
		yTo?.(e.clientY);
	}

	function handleMouseDown() {
		isPressed = true;
	}

	function handleMouseUp() {
		isPressed = false;
	}

	function handleMouseLeave() {
		isVisible = false;
	}

	function handleMouseEnter() {
		isVisible = true;
	}

	function handleMouseOver(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (
			target.tagName === 'A' ||
			target.tagName === 'BUTTON' ||
			target.closest('a') ||
			target.closest('button') ||
			target.hasAttribute('data-cursor-hover')
		) {
			isHovering = true;
			hoverTarget = target;
		}
	}

	function handleMouseOut(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (
			target.tagName === 'A' ||
			target.tagName === 'BUTTON' ||
			target.closest('a') ||
			target.closest('button') ||
			target.hasAttribute('data-cursor-hover')
		) {
			isHovering = false;
			hoverTarget = null;
		}
	}

	async function init() {
		if (typeof window === 'undefined') return;

		const { gsap } = await import('gsap');

		// Use quickTo for smooth cursor following
		const cursorProxy = { x: 0, y: 0 };

		xTo = gsap.quickTo(cursorProxy, 'x', {
			duration: 0.4,
			ease: 'power4.out',
			onUpdate: () => {
				smoothX = cursorProxy.x;
			}
		});

		yTo = gsap.quickTo(cursorProxy, 'y', {
			duration: 0.4,
			ease: 'power4.out',
			onUpdate: () => {
				smoothY = cursorProxy.y;
			}
		});

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('mouseenter', handleMouseEnter);

		// Detect hoverable elements
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mouseout', handleMouseOut);
	}

	function destroy() {
		if (typeof window === 'undefined') return;

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mousedown', handleMouseDown);
		window.removeEventListener('mouseup', handleMouseUp);
		window.removeEventListener('mouseleave', handleMouseLeave);
		window.removeEventListener('mouseenter', handleMouseEnter);
		document.removeEventListener('mouseover', handleMouseOver);
		document.removeEventListener('mouseout', handleMouseOut);

		// Release quickTo instances to prevent orphaned tweens
		xTo = null;
		yTo = null;
	}

	return {
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get smoothX() {
			return smoothX;
		},
		get smoothY() {
			return smoothY;
		},
		get isHovering() {
			return isHovering;
		},
		get hoverTarget() {
			return hoverTarget;
		},
		get isPressed() {
			return isPressed;
		},
		get isVisible() {
			return isVisible;
		},
		init,
		destroy
	};
}

export const cursorState = createCursorState();
