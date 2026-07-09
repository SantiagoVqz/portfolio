<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		VIEW_W,
		VIEW_H,
		anchor,
		edgeGeometry,
		type SchematicDef,
		type SchematicNode
	} from '$lib/constants/schematics';

	interface Props {
		def: SchematicDef;
		/** Figure number for the patent-style caption. */
		fig?: number;
		/** Show the FIG. caption line. */
		caption?: boolean;
		/** Draw-on-scroll animation (reduced motion always wins). */
		animate?: boolean;
		/** Extra delay before the draw starts, in seconds. */
		delay?: number;
	}

	let { def, fig = 1, caption = true, animate = true, delay = 0 }: Props = $props();

	let svgEl = $state<SVGSVGElement>();

	const edges = $derived(def.edges.map((e) => ({ edge: e, geo: edgeGeometry(def.nodes, e) })));

	// Label anchor points per node kind.
	function labelPos(n: SchematicNode): { x: number; y: number } {
		const cx = n.x + n.w / 2;
		switch (n.kind) {
			case 'users':
				return { x: cx, y: n.y + n.h + 14 };
			case 'browser':
				return { x: cx, y: n.y + 26 + (n.h - 26) / 2 + (n.sub ? 0 : 4) };
			case 'db':
				return { x: cx, y: n.y + n.h / 2 + (n.sub ? 4 : 8) };
			default:
				return { x: cx, y: n.y + n.h / 2 + (n.sub ? -1 : 4) };
		}
	}

	onMount(() => {
		if (!browser || !animate || !svgEl) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let io: IntersectionObserver | null = null;
		let killed = false;
		let tl: gsap.core.Timeline | null = null;
		const el = svgEl;

		(async () => {
			const { gsap } = await import('gsap');
			if (killed) return;

			const strokes = el.querySelectorAll('.sch-s');
			const fades = el.querySelectorAll('.sch-l, .sch-dash');

			gsap.set(strokes, { strokeDasharray: 100, strokeDashoffset: 100 });
			gsap.set(fades, { opacity: 0 });

			const play = () => {
				tl = gsap.timeline({ delay });
				tl.to(strokes, {
					strokeDashoffset: 0,
					duration: 0.85,
					ease: 'power3.inOut',
					stagger: 0.06
				});
				tl.to(
					fades,
					{ opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.025 },
					'-=0.4'
				);
			};

			// Already in view (e.g. above the fold) → play now.
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
				play();
				return;
			}

			io = new IntersectionObserver(
				(entries) => {
					if (entries.some((e) => e.isIntersecting)) {
						play();
						io?.disconnect();
					}
				},
				{ threshold: 0.3 }
			);
			io.observe(el);
		})();

		return () => {
			killed = true;
			io?.disconnect();
			tl?.kill();
		};
	});
</script>

<svg
	bind:this={svgEl}
	viewBox="0 0 {VIEW_W} {VIEW_H}"
	class="schematic"
	role="img"
	aria-label="{def.title}. Architecture diagram."
>
	<!-- Corner registration marks (static — part of the paper) -->
	{#each [
		[14, 14],
		[VIEW_W - 14, 14],
		[14, VIEW_H - 14],
		[VIEW_W - 14, VIEW_H - 14]
	] as [mx, my] (`${mx}-${my}`)}
		<g class="sch-corner" aria-hidden="true">
			<line x1={mx - 6} y1={my} x2={mx + 6} y2={my} />
			<line x1={mx} y1={my - 6} x2={mx} y2={my + 6} />
		</g>
	{/each}

	<!-- Edges under nodes so fills occlude line ends cleanly -->
	{#each edges as { edge, geo } (`${edge.from}-${edge.to}`)}
		<g class="sch-edge">
			{#if edge.dashed}
				<path d={geo.d} class="sch-dash sch-edge-line" pathLength="100" />
			{:else}
				<path d={geo.d} class="sch-s sch-edge-line" pathLength="100" />
			{/if}
			{#if edge.arrow !== false}
				<path d={geo.arrow} class="sch-l sch-arrow" />
			{/if}
			{#if edge.label}
				<text x={geo.labelX} y={geo.labelY} text-anchor={geo.labelAnchor} class="sch-l sch-edge-label">
					{edge.label}
				</text>
			{/if}
		</g>
	{/each}

	<!-- Nodes -->
	{#each def.nodes as n (n.id)}
		{@const lp = labelPos(n)}
		{@const cx = n.x + n.w / 2}
		<g class="sch-node" data-accent={n.accent ?? 'ink'}>
			{#if n.kind === 'box'}
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" class="sch-s sch-shape" pathLength="100" />
			{:else if n.kind === 'pill'}
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} class="sch-s sch-shape" pathLength="100" />
			{:else if n.kind === 'db'}
				<path
					d="M {n.x} {n.y + 10} L {n.x} {n.y + n.h - 10} A {n.w / 2} 10 0 0 0 {n.x + n.w} {n.y + n.h - 10} L {n.x + n.w} {n.y + 10}"
					class="sch-s sch-shape"
					pathLength="100"
				/>
				<ellipse cx={cx} cy={n.y + 10} rx={n.w / 2} ry="10" class="sch-s sch-shape" pathLength="100" />
			{:else if n.kind === 'stack'}
				<rect x={n.x + 10} y={n.y - 10} width={n.w} height={n.h} rx="10" class="sch-s sch-ghost" pathLength="100" />
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" class="sch-s sch-shape sch-filled" pathLength="100" />
			{:else if n.kind === 'device'}
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="16" class="sch-s sch-shape" pathLength="100" />
				<line x1={cx - 16} y1={n.y + n.h - 14} x2={cx + 16} y2={n.y + n.h - 14} class="sch-s sch-detail" pathLength="100" />
			{:else if n.kind === 'browser'}
				<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" class="sch-s sch-shape" pathLength="100" />
				<line x1={n.x} y1={n.y + 26} x2={n.x + n.w} y2={n.y + 26} class="sch-s sch-detail" pathLength="100" />
				<circle cx={n.x + 14} cy={n.y + 13} r="2.5" class="sch-l sch-dot" />
				<circle cx={n.x + 24} cy={n.y + 13} r="2.5" class="sch-l sch-dot" />
			{:else if n.kind === 'users'}
				{#each [-22, 0, 22] as dx, i (dx)}
					<circle cx={cx + dx} cy={n.y + (i === 1 ? 12 : 15)} r={i === 1 ? 8 : 7} class="sch-s sch-shape" pathLength="100" />
					<path
						d="M {cx + dx - 10} {n.y + (i === 1 ? 38 : 40)} a 10 10 0 0 1 20 0"
						class="sch-s sch-shape"
						pathLength="100"
					/>
				{/each}
			{/if}

			<text x={lp.x} y={lp.y} text-anchor="middle" class="sch-l sch-label">{n.label}</text>
			{#if n.sub}
				<text x={lp.x} y={lp.y + 14} text-anchor="middle" class="sch-l sch-sub">{n.sub}</text>
			{/if}
		</g>
	{/each}

	<!-- Figure caption -->
	{#if caption}
		<text x="34" y={VIEW_H - 12} class="sch-l sch-caption">
			FIG. {String(fig).padStart(2, '0')} — {def.title}
		</text>
	{/if}
</svg>

<style>
	.schematic {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* ── Strokes ── */
	.sch-corner line {
		stroke: color-mix(in srgb, var(--color-ink) 22%, transparent);
		stroke-width: 1;
	}

	.sch-shape {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 72%, transparent);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.sch-filled {
		fill: var(--color-base);
	}

	.sch-ghost {
		fill: var(--color-base);
		stroke: color-mix(in srgb, var(--color-ink) 32%, transparent);
		stroke-width: 1.25;
	}

	.sch-detail {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 45%, transparent);
		stroke-width: 1.25;
		stroke-linecap: round;
	}

	.sch-node[data-accent='clay'] .sch-shape {
		stroke: var(--color-accent);
		fill: color-mix(in srgb, var(--color-accent) 6%, transparent);
	}

	.sch-node[data-accent='sage'] .sch-shape {
		stroke: color-mix(in srgb, var(--color-tension) 85%, var(--color-ink));
	}

	.sch-node[data-accent='gold'] .sch-shape {
		stroke: var(--color-gold);
	}

	/* Keep multi-part shapes (db, users, device) from double-tinting */
	.sch-node[data-accent='clay'] ellipse.sch-shape,
	.sch-node[data-accent='clay'] path.sch-shape {
		fill: none;
	}
	.sch-node[data-accent='clay'] rect.sch-shape {
		fill: color-mix(in srgb, var(--color-accent) 6%, transparent);
	}

	/* ── Edges ── */
	.sch-edge-line {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 52%, transparent);
		stroke-width: 1.25;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.sch-dash {
		stroke-dasharray: 4 5;
	}

	.sch-arrow {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 52%, transparent);
		stroke-width: 1.25;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* ── Text ── */
	text {
		font-family: var(--font-data);
	}

	.sch-label {
		font-size: 13px;
		font-weight: 500;
		fill: color-mix(in srgb, var(--color-ink) 88%, transparent);
	}

	.sch-sub {
		font-size: 10.5px;
		fill: color-mix(in srgb, var(--color-ink) 52%, transparent);
		letter-spacing: 0.03em;
	}

	.sch-edge-label {
		font-size: 10.5px;
		fill: color-mix(in srgb, var(--color-ink) 55%, transparent);
		letter-spacing: 0.05em;
	}

	.sch-dot {
		fill: color-mix(in srgb, var(--color-ink) 40%, transparent);
	}

	.sch-caption {
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		fill: color-mix(in srgb, var(--color-ink) 48%, transparent);
	}
</style>
