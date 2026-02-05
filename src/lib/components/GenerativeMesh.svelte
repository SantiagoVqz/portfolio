<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let canvasRef = $state<HTMLCanvasElement>();
	let isTouchDevice = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let scrollY = $state(0);
	let animFrame: number;

	// Simplex noise implementation (inline, no dependencies)
	class SimplexNoise {
		private grad3 = [
			[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
			[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
			[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
		];
		private perm: number[] = [];

		constructor(seed = Math.random()) {
			const p: number[] = [];
			for (let i = 0; i < 256; i++) p[i] = i;
			// Fisher-Yates shuffle with seed
			let s = seed * 256;
			for (let i = 255; i > 0; i--) {
				s = (s * 16807) % 2147483647;
				const j = Math.floor((s / 2147483647) * (i + 1));
				[p[i], p[j]] = [p[j], p[i]];
			}
			for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
		}

		private dot(g: number[], x: number, y: number): number {
			return g[0] * x + g[1] * y;
		}

		noise2D(xin: number, yin: number): number {
			const F2 = 0.5 * (Math.sqrt(3) - 1);
			const G2 = (3 - Math.sqrt(3)) / 6;
			const s = (xin + yin) * F2;
			const i = Math.floor(xin + s);
			const j = Math.floor(yin + s);
			const t = (i + j) * G2;
			const X0 = i - t;
			const Y0 = j - t;
			const x0 = xin - X0;
			const y0 = yin - Y0;

			let i1: number, j1: number;
			if (x0 > y0) { i1 = 1; j1 = 0; }
			else { i1 = 0; j1 = 1; }

			const x1 = x0 - i1 + G2;
			const y1 = y0 - j1 + G2;
			const x2 = x0 - 1 + 2 * G2;
			const y2 = y0 - 1 + 2 * G2;

			const ii = i & 255;
			const jj = j & 255;
			const gi0 = this.perm[ii + this.perm[jj]] % 12;
			const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
			const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

			let n0 = 0, n1 = 0, n2 = 0;
			let t0 = 0.5 - x0 * x0 - y0 * y0;
			if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); }
			let t1 = 0.5 - x1 * x1 - y1 * y1;
			if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); }
			let t2 = 0.5 - x2 * x2 - y2 * y2;
			if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); }

			return 70 * (n0 + n1 + n2);
		}
	}

	onMount(() => {
		if (!browser || !canvasRef) return;

		isTouchDevice =
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			window.matchMedia('(hover: none) and (pointer: coarse)').matches;

		if (isTouchDevice) return;

		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;

		const noise = new SimplexNoise(42);
		const cols = 28;
		const rows = 18;

		// Colors from palette with low opacity
		const colors = [
			{ r: 204, g: 139, b: 101 }, // terracotta/accent
			{ r: 125, g: 156, b: 139 }, // sage/tension
			{ r: 212, g: 168, b: 67 },  // gold
		];

		let width = 0;
		let height = 0;
		let dpr = 1;

		function resize() {
			dpr = window.devicePixelRatio || 1;
			width = window.innerWidth;
			height = window.innerHeight;
			canvasRef!.width = width * dpr;
			canvasRef!.height = height * dpr;
			canvasRef!.style.width = `${width}px`;
			canvasRef!.style.height = `${height}px`;
			ctx!.scale(dpr, dpr);
		}

		resize();

		const handleResize = () => resize();
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', handleScroll, { passive: true });

		let time = 0;

		function draw() {
			if (!ctx) return;
			time += 0.003;

			ctx.clearRect(0, 0, width, height);

			const cellW = width / (cols - 1);
			const cellH = height / (rows - 1);
			const scrollOffset = scrollY * 0.0003;

			// Generate point grid with noise displacement
			const points: { x: number; y: number }[][] = [];
			for (let row = 0; row < rows; row++) {
				points[row] = [];
				for (let col = 0; col < cols; col++) {
					const baseX = col * cellW;
					const baseY = row * cellH;

					const noiseScale = 0.04;
					const nx = noise.noise2D(col * noiseScale + time, row * noiseScale + scrollOffset) * 35;
					const ny = noise.noise2D(col * noiseScale + 100 + time * 0.7, row * noiseScale + 100 + scrollOffset) * 35;

					// Cursor interaction — gentle warp
					const dx = baseX - mouseX;
					const dy = baseY - mouseY;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const influence = Math.max(0, 1 - dist / 250) * 20;
					const cursorNx = dist > 0 ? (dx / dist) * influence : 0;
					const cursorNy = dist > 0 ? (dy / dist) * influence : 0;

					points[row][col] = {
						x: baseX + nx + cursorNx,
						y: baseY + ny + cursorNy
					};
				}
			}

			// Draw mesh lines
			ctx.lineWidth = 0.5;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const p = points[row][col];

					// Choose color based on position
					const colorIdx = (row + col) % colors.length;
					const c = colors[colorIdx];

					// Opacity based on noise
					const alpha = 0.06 + Math.abs(noise.noise2D(col * 0.1 + time * 0.5, row * 0.1)) * 0.08;

					ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;

					// Horizontal line
					if (col < cols - 1) {
						const next = points[row][col + 1];
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(next.x, next.y);
						ctx.stroke();
					}

					// Vertical line
					if (row < rows - 1) {
						const below = points[row + 1][col];
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(below.x, below.y);
						ctx.stroke();
					}

					// Draw small dots at intersections
					if ((row + col) % 3 === 0) {
						const dotAlpha = 0.08 + Math.abs(noise.noise2D(col * 0.2 + time, row * 0.2)) * 0.12;
						ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${dotAlpha})`;
						ctx.beginPath();
						ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
						ctx.fill();
					}
				}
			}

			animFrame = requestAnimationFrame(draw);
		}

		animFrame = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(animFrame);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if !isTouchDevice}
	<canvas
		bind:this={canvasRef}
		class="absolute inset-0 z-0"
		aria-hidden="true"
	></canvas>
{:else}
	<!-- Mobile fallback: subtle gradient -->
	<div
		class="absolute inset-0 z-0"
		style="background: radial-gradient(ellipse at 30% 40%, rgba(204,139,101,0.08) 0%, transparent 50%),
		       radial-gradient(ellipse at 70% 60%, rgba(125,156,139,0.06) 0%, transparent 50%),
		       radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.04) 0%, transparent 50%);"
		aria-hidden="true"
	></div>
{/if}
