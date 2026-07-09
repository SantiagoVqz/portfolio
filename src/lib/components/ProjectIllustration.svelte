<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { projects } from '$lib/constants';

	interface Props {
		/** Project id — picks the illustration. */
		id: string;
		title: string;
		/** Draw-on-scroll (reduced motion always wins). */
		animate?: boolean;
	}

	let { id, title, animate = true }: Props = $props();

	let svgEl = $state<SVGSVGElement>();

	// Same figure number the project carries on the home sheet + case study.
	const fig = $derived(projects.findIndex((p) => p.id === id) + 1);

	const captions: Record<string, string> = {
		echo: 'civic AI assistant',
		knot: 'wedding SaaS',
		piggy: 'personal finance',
		'cityfront-portal': 'resident portal',
		'cityfront-311': 'multi-tenant 311',
		'cityfront-mobile': 'field reporting',
		inkwell: 'feed pipeline',
		vvf: 'manufacturing ERP'
	};

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

			const strokes = el.querySelectorAll('.ill-s');
			const fades = el.querySelectorAll('.ill-f');

			gsap.set(strokes, { strokeDasharray: 100, strokeDashoffset: 100 });
			gsap.set(fades, { opacity: 0 });

			const play = () => {
				tl = gsap.timeline();
				tl.to(strokes, {
					strokeDashoffset: 0,
					duration: 0.8,
					ease: 'power3.inOut',
					stagger: 0.05
				});
				tl.to(fades, { opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.04 }, '-=0.35');
			};

			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
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
				{ threshold: 0.25 }
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

<!-- Spot illustration — same ink-on-paper sketch grammar as the schematics -->
<svg
	bind:this={svgEl}
	viewBox="0 0 480 300"
	class="illustration"
	role="img"
	aria-label="{title} — sketch illustration"
>
	<!-- Corner registration marks -->
	{#each [
		[16, 16],
		[464, 16],
		[16, 284],
		[464, 284]
	] as [mx, my] (`${mx}-${my}`)}
		<g class="ill-corner" aria-hidden="true">
			<line x1={mx - 5} y1={my} x2={mx + 5} y2={my} />
			<line x1={mx} y1={my - 5} x2={mx} y2={my + 5} />
		</g>
	{/each}

	{#if id === 'echo'}
		<!-- City hall + speech bubble -->
		<g>
			<!-- Pediment -->
			<path d="M 150 122 L 240 80 L 330 122" class="ill-s" pathLength="100" />
			<line x1="146" y1="122" x2="334" y2="122" class="ill-s" pathLength="100" />
			<!-- Columns -->
			<line x1="172" y1="134" x2="172" y2="208" class="ill-s" pathLength="100" />
			<line x1="217" y1="134" x2="217" y2="208" class="ill-s" pathLength="100" />
			<line x1="262" y1="134" x2="262" y2="208" class="ill-s" pathLength="100" />
			<line x1="307" y1="134" x2="307" y2="208" class="ill-s" pathLength="100" />
			<!-- Column caps -->
			<line x1="164" y1="132" x2="180" y2="132" class="ill-s ill-thin" pathLength="100" />
			<line x1="209" y1="132" x2="225" y2="132" class="ill-s ill-thin" pathLength="100" />
			<line x1="254" y1="132" x2="270" y2="132" class="ill-s ill-thin" pathLength="100" />
			<line x1="299" y1="132" x2="315" y2="132" class="ill-s ill-thin" pathLength="100" />
			<!-- Steps -->
			<line x1="146" y1="212" x2="334" y2="212" class="ill-s" pathLength="100" />
			<line x1="134" y1="230" x2="346" y2="230" class="ill-s" pathLength="100" />
			<!-- Speech bubble -->
			<path
				d="M 316 42 H 406 Q 420 42 420 56 V 84 Q 420 98 406 98 H 356 L 340 118 L 344 98 H 330 Q 316 98 316 84 V 56 Q 316 42 316 42 Z"
				class="ill-s ill-clay"
				pathLength="100"
			/>
			<circle cx="346" cy="70" r="4.5" class="ill-f ill-dot" />
			<circle cx="368" cy="70" r="4.5" class="ill-f ill-dot" />
			<circle cx="390" cy="70" r="4.5" class="ill-f ill-dot" />
		</g>
	{:else if id === 'knot'}
		<!-- Interlocked rings + invitation card -->
		<g>
			<!-- Invitation card behind -->
			<rect x="290" y="158" width="100" height="66" rx="6" class="ill-s ill-sage" pathLength="100" />
			<line x1="304" y1="178" x2="376" y2="178" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="304" y1="192" x2="376" y2="192" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="304" y1="206" x2="352" y2="206" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Rings -->
			<circle cx="196" cy="150" r="46" class="ill-s" pathLength="100" />
			<circle cx="250" cy="150" r="46" class="ill-s ill-clay" pathLength="100" />
			<!-- Sparkles -->
			<g class="ill-f" aria-hidden="true">
				<line x1="150" y1="84" x2="150" y2="96" class="ill-spark" />
				<line x1="144" y1="90" x2="156" y2="90" class="ill-spark" />
				<line x1="292" y1="92" x2="292" y2="102" class="ill-spark" />
				<line x1="287" y1="97" x2="297" y2="97" class="ill-spark" />
			</g>
		</g>
	{:else if id === 'piggy'}
		<!-- Piggy bank + coin -->
		<g>
			<!-- Body -->
			<ellipse cx="245" cy="176" rx="86" ry="60" class="ill-s" pathLength="100" />
			<!-- Snout -->
			<ellipse cx="152" cy="172" rx="15" ry="20" class="ill-s" pathLength="100" />
			<circle cx="149" cy="166" r="1.8" class="ill-f ill-ink-dot" />
			<circle cx="149" cy="178" r="1.8" class="ill-f ill-ink-dot" />
			<!-- Ear -->
			<path d="M 198 122 L 208 100 L 226 116" class="ill-s" pathLength="100" />
			<!-- Eye -->
			<circle cx="192" cy="150" r="3" class="ill-f ill-ink-dot" />
			<!-- Legs -->
			<line x1="196" y1="232" x2="196" y2="254" class="ill-s" pathLength="100" />
			<line x1="226" y1="236" x2="226" y2="256" class="ill-s" pathLength="100" />
			<line x1="266" y1="236" x2="266" y2="256" class="ill-s" pathLength="100" />
			<line x1="296" y1="232" x2="296" y2="254" class="ill-s" pathLength="100" />
			<!-- Tail -->
			<path d="M 330 166 Q 348 158 344 144 Q 340 132 328 138" class="ill-s ill-thin" pathLength="100" />
			<!-- Coin slot -->
			<path d="M 226 120 Q 246 114 266 120" class="ill-s" pathLength="100" />
			<!-- Coin -->
			<circle cx="248" cy="80" r="19" class="ill-s ill-clay" pathLength="100" />
			<line x1="248" y1="70" x2="248" y2="90" class="ill-s ill-thin ill-clay" pathLength="100" />
		</g>
	{:else if id === 'cityfront-portal'}
		<!-- Map pin over a street grid -->
		<g>
			<!-- Streets -->
			<line x1="92" y1="124" x2="388" y2="124" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="76" y1="176" x2="404" y2="176" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="100" y1="228" x2="380" y2="228" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="158" y1="92" x2="158" y2="252" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="240" y1="84" x2="240" y2="258" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="322" y1="92" x2="322" y2="252" class="ill-s ill-thin ill-sage" pathLength="100" />
			<path d="M 96 252 L 404 100" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Pin -->
			<path
				d="M 240 96 C 214 96 202 116 202 136 C 202 162 240 204 240 204 C 240 204 278 162 278 136 C 278 116 266 96 240 96 Z"
				class="ill-s ill-clay"
				pathLength="100"
			/>
			<circle cx="240" cy="136" r="11" class="ill-f ill-dot" />
		</g>
	{:else if id === 'cityfront-311'}
		<!-- Stack of city sheets + notification arcs -->
		<g>
			<!-- Ghost sheets -->
			<rect x="152" y="96" width="180" height="126" rx="10" class="ill-s ill-ghost" pathLength="100" />
			<rect x="164" y="110" width="180" height="126" rx="10" class="ill-s ill-ghost" pathLength="100" />
			<!-- Top sheet -->
			<rect x="176" y="124" width="180" height="126" rx="10" class="ill-s ill-filled" pathLength="100" />
			<!-- Skyline on the sheet -->
			<path
				d="M 196 226 V 196 H 218 V 180 H 240 V 206 H 262 V 186 H 284 V 226"
				class="ill-s"
				pathLength="100"
			/>
			<circle cx="318" cy="164" r="7" class="ill-s ill-clay" pathLength="100" />
			<!-- Notification arcs -->
			<path d="M 366 118 A 22 22 0 0 1 388 140" class="ill-s ill-sage" pathLength="100" />
			<path d="M 372 100 A 40 40 0 0 1 406 140" class="ill-s ill-sage" pathLength="100" />
		</g>
	{:else if id === 'cityfront-mobile'}
		<!-- Phone with a pin on screen, in motion -->
		<g>
			<!-- Motion dashes -->
			<line x1="120" y1="120" x2="156" y2="120" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="108" y1="152" x2="152" y2="152" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="122" y1="184" x2="156" y2="184" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Phone -->
			<rect x="196" y="58" width="116" height="196" rx="20" class="ill-s" pathLength="100" />
			<line x1="234" y1="238" x2="274" y2="238" class="ill-s ill-thin" pathLength="100" />
			<!-- Map lines on screen -->
			<line x1="212" y1="120" x2="296" y2="120" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="238" y1="80" x2="238" y2="216" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Pin -->
			<path
				d="M 262 118 C 250 118 244 127 244 136 C 244 148 262 168 262 168 C 262 168 280 148 280 136 C 280 127 274 118 262 118 Z"
				class="ill-s ill-clay"
				pathLength="100"
			/>
			<circle cx="262" cy="136" r="5" class="ill-f ill-dot" />
			<!-- Signal -->
			<path d="M 330 84 A 18 18 0 0 1 348 102" class="ill-s ill-sage" pathLength="100" />
			<path d="M 336 68 A 34 34 0 0 1 364 102" class="ill-s ill-sage" pathLength="100" />
		</g>
	{:else if id === 'inkwell'}
		<!-- Inkpot + quill + ripples -->
		<g>
			<!-- Pot -->
			<ellipse cx="240" cy="152" rx="32" ry="8" class="ill-s" pathLength="100" />
			<path d="M 208 152 L 200 170 L 194 214 C 194 234 286 234 286 214 L 280 170 L 272 152" class="ill-s" pathLength="100" />
			<!-- Ink surface -->
			<path d="M 216 156 Q 240 162 264 156" class="ill-s ill-thin ill-clay" pathLength="100" />
			<!-- Quill -->
			<path d="M 258 158 C 282 128 306 98 334 66" class="ill-s" pathLength="100" />
			<path d="M 282 128 C 296 126 306 118 312 106" class="ill-s ill-thin" pathLength="100" />
			<path d="M 296 110 C 310 108 320 100 326 88" class="ill-s ill-thin" pathLength="100" />
			<path d="M 270 144 C 282 142 290 136 296 126" class="ill-s ill-thin" pathLength="100" />
			<circle cx="260" cy="160" r="3.5" class="ill-f ill-dot" />
			<!-- Ripples (feeds arriving) -->
			<path d="M 150 200 A 30 30 0 0 1 172 176" class="ill-s ill-sage" pathLength="100" />
			<path d="M 134 210 A 48 48 0 0 1 168 160" class="ill-s ill-sage" pathLength="100" />
			<!-- Drop -->
			<path d="M 310 196 C 310 190 316 182 316 182 C 316 182 322 190 322 196 A 6 6 0 0 1 310 196 Z" class="ill-s ill-thin ill-clay" pathLength="100" />
		</g>
	{:else if id === 'vvf'}
		<!-- Thread spool + needle + running stitch -->
		<g>
			<!-- Spool flanges -->
			<rect x="176" y="86" width="76" height="15" rx="5" class="ill-s" pathLength="100" />
			<rect x="176" y="198" width="76" height="15" rx="5" class="ill-s" pathLength="100" />
			<!-- Barrel -->
			<line x1="188" y1="101" x2="188" y2="198" class="ill-s" pathLength="100" />
			<line x1="240" y1="101" x2="240" y2="198" class="ill-s" pathLength="100" />
			<!-- Thread wraps -->
			<line x1="191" y1="116" x2="237" y2="120" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="191" y1="134" x2="237" y2="138" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="191" y1="152" x2="237" y2="156" class="ill-s ill-thin ill-sage" pathLength="100" />
			<line x1="191" y1="170" x2="237" y2="174" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Thread to needle -->
			<path d="M 238 174 C 280 182 300 170 318 148" class="ill-s ill-thin ill-sage" pathLength="100" />
			<!-- Needle -->
			<line x1="306" y1="176" x2="352" y2="112" class="ill-s" pathLength="100" />
			<circle cx="348" cy="118" r="4" class="ill-s ill-thin ill-clay" pathLength="100" />
			<!-- Running stitch -->
			<line x1="330" y1="196" x2="346" y2="192" class="ill-s ill-clay" pathLength="100" />
			<line x1="356" y1="189" x2="372" y2="185" class="ill-s ill-clay" pathLength="100" />
			<line x1="382" y1="182" x2="398" y2="178" class="ill-s ill-clay" pathLength="100" />
		</g>
	{/if}

	<!-- Figure caption -->
	<text x="30" y="286" class="ill-f ill-caption">
		FIG. {String(fig).padStart(2, '0')} · {captions[id] ?? title}
	</text>
</svg>

<style>
	.illustration {
		display: block;
		width: 100%;
		height: 100%;
	}

	.ill-corner line {
		stroke: color-mix(in srgb, var(--color-ink) 22%, transparent);
		stroke-width: 1;
	}

	.ill-s {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 74%, transparent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.ill-thin {
		stroke-width: 1.4;
	}

	.ill-clay {
		stroke: var(--color-accent);
	}

	.ill-sage {
		stroke: color-mix(in srgb, var(--color-tension) 88%, var(--color-ink));
	}

	.ill-ghost {
		stroke: color-mix(in srgb, var(--color-ink) 30%, transparent);
		stroke-width: 1.4;
		fill: var(--color-surface);
	}

	.ill-filled {
		fill: var(--color-base);
	}

	.ill-dot {
		fill: var(--color-accent);
	}

	.ill-ink-dot {
		fill: color-mix(in srgb, var(--color-ink) 74%, transparent);
	}

	.ill-spark {
		stroke: var(--color-gold);
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	.ill-caption {
		font-family: var(--font-data);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		fill: color-mix(in srgb, var(--color-ink) 55%, transparent);
	}
</style>
