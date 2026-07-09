<script lang="ts">
	import type { Project } from '$lib/constants/profile';
	import ProjectCompact from './ProjectCompact.svelte';

	interface Props {
		projects: Project[];
		onViewCaseStudy: (project: Project) => void;
	}

	let { projects, onViewCaseStudy }: Props = $props();

	let track: HTMLDivElement | undefined = $state();
	let atStart = $state(true);
	let atEnd = $state(false);

	function updateEdges() {
		if (!track) return;
		const { scrollLeft, scrollWidth, clientWidth } = track;
		atStart = scrollLeft <= 1;
		atEnd = scrollLeft + clientWidth >= scrollWidth - 1;
	}

	function scrollByCard(direction: 1 | -1) {
		if (!track) return;
		// Scroll by roughly one card (first slide width + gap), falling back to 80% viewport.
		const slide = track.querySelector<HTMLElement>('.carousel-slide');
		const amount = slide ? slide.offsetWidth + 24 : track.clientWidth * 0.8;
		track.scrollBy({ left: amount * direction, behavior: 'smooth' });
	}

	$effect(() => {
		const el = track;
		if (!el) return;
		updateEdges();
		el.addEventListener('scroll', updateEdges, { passive: true });
		window.addEventListener('resize', updateEdges);
		return () => {
			el.removeEventListener('scroll', updateEdges);
			window.removeEventListener('resize', updateEdges);
		};
	});
</script>

<div class="carousel">
	<div class="carousel-track" bind:this={track} role="list">
		{#each projects as project, i (project.id)}
			<div class="carousel-slide" role="listitem">
				<ProjectCompact {project} index={i} onViewCaseStudy={() => onViewCaseStudy(project)} />
			</div>
		{/each}
	</div>

	<div class="carousel-controls">
		<button
			class="carousel-btn"
			onclick={() => scrollByCard(-1)}
			disabled={atStart}
			aria-label="Previous projects"
			data-cursor-hover
		>
			<span aria-hidden="true">←</span>
		</button>
		<button
			class="carousel-btn"
			onclick={() => scrollByCard(1)}
			disabled={atEnd}
			aria-label="Next projects"
			data-cursor-hover
		>
			<span aria-hidden="true">→</span>
		</button>
	</div>
</div>

<style>
	.carousel {
		position: relative;
	}

	.carousel-track {
		display: flex;
		gap: 1.5rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-left: 0;
		padding-bottom: 0.5rem;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	.carousel-slide {
		flex: 0 0 85%;
		scroll-snap-align: start;
		min-width: 0;
	}

	@media (min-width: 640px) {
		.carousel-slide {
			flex-basis: 48%;
		}
	}

	@media (min-width: 1024px) {
		.carousel-slide {
			flex-basis: 32%;
		}
	}

	/* ── Controls ── */
	.carousel-controls {
		display: flex;
		justify-content: flex-end;
		gap: 0.625rem;
		margin-top: 1.5rem;
	}

	.carousel-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--color-ink) 18%, transparent);
		background: transparent;
		color: var(--color-ink);
		font-family: var(--font-data);
		font-size: 1rem;
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.carousel-btn:hover:not(:disabled) {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.carousel-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
