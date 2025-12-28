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
			gsap.fromTo(
				lineRef!,
				{ scaleY: 0, transformOrigin: 'top' },
				{
					scaleY: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: timelineRef,
						start: 'top 70%',
						end: 'bottom 70%',
						scrub: true
					}
				}
			);

			// Animate items
			const items = gsap.utils.toArray('.timeline-item', timelineRef) as HTMLElement[];
			items.forEach((item) => {
				gsap.fromTo(
					item,
					{ opacity: 0, y: 50 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						scrollTrigger: {
							trigger: item,
							start: 'top 85%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			});
		}, timelineRef);

		return () => ctx.revert();
	});
</script>

<div
	class="timeline-container relative mx-auto max-w-5xl px-6 py-24 md:px-12"
	bind:this={timelineRef}
>
	<!-- Central Line -->
	<div
		class="absolute top-0 bottom-0 left-6 w-0.5 transform bg-[--color-ink]/10 md:left-1/2 md:-translate-x-1/2"
	>
		<div class="h-full w-full origin-top scale-y-0 bg-[--color-accent]" bind:this={lineRef}></div>
	</div>

	<div class="space-y-16 md:space-y-32">
		{#each timelineData as item, i (item.year + item.company)}
			<div
				class="timeline-item relative flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-16 {i %
					2 ===
				0
					? 'md:flex-row-reverse'
					: ''}"
			>
				<!-- Dot -->
				<div
					class="absolute left-6 z-10 mt-1.5 h-4 w-4 -translate-x-1/2 transform rounded-full border-2 border-[--color-accent] bg-[--color-base] shadow-[0_0_0_4px_var(--color-base)] md:left-1/2 md:mt-0 md:translate-x-[-50%]"
				></div>

				<!-- Content Spacer (for alternating layout) -->
				<div class="hidden flex-1 md:block"></div>

				<!-- Content Card -->
				<div class="w-full flex-1 pl-12 text-left md:pl-0 {i % 2 === 0 ? 'md:text-right' : ''}">
					<div class="group relative">
						<span
							class="mb-3 inline-block rounded-full bg-[--color-accent]/10 px-3 py-1 font-mono text-xs font-bold tracking-widest text-[--color-accent]"
						>
							{item.year}
						</span>
						<h3 class="mb-1 font-serif text-2xl text-[--color-ink]">{item.title}</h3>
						<div class="mb-4 font-mono text-sm tracking-wide text-[--color-ink]/60 uppercase">
							{item.company}
						</div>
						<p
							class="max-w-md leading-relaxed text-[--color-ink]/70 text-base {i % 2 === 0
								? 'md:ml-auto'
								: ''}"
						>
							{item.description}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
