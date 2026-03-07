<script lang="ts">
	import type { Project } from '$lib/constants/profile';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		project: Project;
		index: number;
		onViewCaseStudy: () => void;
	}

	let { project, index, onViewCaseStudy }: Props = $props();
</script>

<article class="data-layout" style="--accent: {project.color}">
	<div class="data-grid">
		<!-- Metrics displayed prominently -->
		<div class="data-metrics-panel">
			<div class="panel-header">
				<span class="subtitle">{project.subtitle}</span>
				<h3 class="title">{project.title}</h3>
				<span class="year-badge">{project.year}</span>
			</div>

			{#if project.metrics}
				<div class="large-metrics">
					{#each project.metrics as metric (metric.label)}
						<div class="large-metric">
							<span class="metric-number">{metric.value}</span>
							<span class="metric-label">{metric.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Tech tags row -->
			<div class="tech-chips">
				{#each project.tags as tag (tag)}
					<span class="chip">{tag}</span>
				{/each}
			</div>
		</div>

		<!-- Image area -->
		<div class="data-image-area">
			{#if project.image}
				<div class="image-frame">
					<img
						src={project.image}
						alt="{project.title} screenshot"
						loading="lazy"
						class="image"
					/>
				</div>
			{/if}

			<!-- Description -->
			<p class="description">{project.description}</p>

			<!-- CTA -->
			<button
				class="cta-button"
				onclick={onViewCaseStudy}
				use:magnetic={{ strength: 0.2, duration: 0.4 }}
				data-cursor-hover
			>
				<span>View Case Study</span>
				<span class="cta-arrow">→</span>
			</button>
		</div>
	</div>
</article>

<style>
	.data-layout {
		padding: 2rem 0;
	}

	.data-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.data-grid {
			grid-template-columns: 1fr 1fr;
			gap: 3rem;
			align-items: start;
		}
	}

	.data-metrics-panel {
		background: var(--color-surface);
		border-radius: var(--radius-xl);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.panel-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.subtitle {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.title {
		font-family: var(--font-headline);
		font-size: 2rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: var(--tracking-tight);
		margin: 0;
	}

	@media (min-width: 1024px) {
		.title {
			font-size: 2.5rem;
		}
	}

	.year-badge {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		color: var(--color-ink);
		opacity: 0.4;
	}

	.large-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem;
	}

	.large-metric {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 1rem;
		background: var(--color-base);
		border-radius: var(--radius-md);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
	}

	.metric-number {
		font-family: var(--font-headline);
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-accent);
		line-height: 1;
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
	}

	.tech-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		background: var(--color-base);
		color: var(--color-ink);
		opacity: 0.7;
		border-radius: var(--radius-full);
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
	}

	.data-image-area {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.image-frame {
		border-radius: var(--radius-lg);
		overflow: hidden;
		aspect-ratio: 16 / 10;
		background: var(--color-surface);
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-slow) var(--ease-smooth);
	}

	.data-layout:hover .image {
		transform: scale(1.02);
	}

	.description {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--color-ink);
		opacity: 0.7;
		margin: 0;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--color-ink) 20%, transparent);
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-full);
		cursor: none;
		transition: all var(--duration-normal) var(--ease-smooth);
		width: fit-content;
	}

	.cta-button:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	.cta-arrow {
		transition: transform var(--duration-normal) ease;
	}

	.cta-button:hover .cta-arrow {
		transform: translateX(4px);
	}
</style>
