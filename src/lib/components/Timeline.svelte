<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { timelineData } from '$lib/constants';

	let timelineRef = $state<HTMLElement>();
	let lineRef = $state<HTMLElement>();

	onMount(() => {
		if (!timelineRef || !lineRef || !browser) return;

		let ctx: gsap.Context | null = null;

		const initGSAP = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
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
		};

		initGSAP();

		return () => ctx?.revert();
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

				<!-- Content Card -->
				<div class="ml-12 w-full md:ml-0 md:w-[calc(50%-3rem)]">
					<div
						class="rounded-2xl border border-[--color-ink]/5 bg-[--color-surface] p-6 shadow-[--shadow-diffused] transition-shadow hover:shadow-[--shadow-deep]"
					>
						<!-- Year badge -->
						<span
							class="inline-block rounded-full bg-[--color-accent]/10 px-3 py-1 font-mono text-xs text-[--color-accent]"
						>
							{item.year}
						</span>

						<h4
							class="mt-3 font-serif text-lg font-medium text-[--color-ink]"
							style="font-family: var(--font-headline)"
						>
							{item.title}
						</h4>

						<p class="text-sm text-[--color-ink]/60">
							{item.company}
						</p>

						<p class="mt-3 text-sm leading-relaxed text-[--color-ink]/70">
							{item.description}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
