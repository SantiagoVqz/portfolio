<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { timelineData } from '$lib/constants';

	gsap.registerPlugin(ScrollTrigger);

	let timelineRef = $state<HTMLElement>();
	let lineRef = $state<HTMLElement>();

	onMount(() => {
		if (!timelineRef || !lineRef) return;

		const ctx = gsap.context(() => {
			// Animate the vertical line
			gsap.fromTo(lineRef, 
				{ scaleY: 0, transformOrigin: "top" },
				{
					scaleY: 1,
					ease: "none",
					scrollTrigger: {
						trigger: timelineRef,
						start: "top 70%",
						end: "bottom 70%",
						scrub: true
					}
				}
			);

			// Animate items
			const items = gsap.utils.toArray('.timeline-item');
			items.forEach((item: any) => {
				gsap.fromTo(item,
					{ opacity: 0, y: 50 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						scrollTrigger: {
							trigger: item,
							start: "top 85%",
							toggleActions: "play none none reverse"
						}
					}
				);
			});
		}, timelineRef);

		return () => ctx.revert();
	});
</script>

<div class="timeline-container relative max-w-5xl mx-auto py-24 px-6 md:px-12" bind:this={timelineRef}>
	<!-- Central Line -->
	<div class="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[--color-ink]/10 transform md:-translate-x-1/2">
		<div class="w-full h-full bg-[--color-accent] origin-top scale-y-0" bind:this={lineRef}></div>
	</div>

	<div class="space-y-16 md:space-y-32">
		{#each timelineData as item, i (item.year + item.company)}
			<div class="timeline-item relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 {i % 2 === 0 ? 'md:flex-row-reverse' : ''}">
				
				<!-- Dot -->
				<div class="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[--color-base] border-2 border-[--color-accent] transform -translate-x-1/2 md:translate-x-[-50%] z-10 mt-1.5 md:mt-0 shadow-[0_0_0_4px_var(--color-base)]"></div>

				<!-- Content Spacer (for alternating layout) -->
				<div class="hidden md:block flex-1"></div>

				<!-- Content Card -->
				<div class="flex-1 pl-12 md:pl-0 w-full text-left {i % 2 === 0 ? 'md:text-right' : ''}">
					<div class="relative group">
						<span class="inline-block px-3 py-1 rounded-full bg-[--color-accent]/10 text-[--color-accent] text-xs font-mono font-bold tracking-widest mb-3">
							{item.year}
						</span>
						<h3 class="font-serif text-2xl text-[--color-ink] mb-1">{item.title}</h3>
						<div class="text-sm font-mono text-[--color-ink]/60 uppercase tracking-wide mb-4">{item.company}</div>
						<p class="text-[--color-ink]/70 text-base leading-relaxed max-w-md {i % 2 === 0 ? 'md:ml-auto' : ''}">
							{item.description}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
