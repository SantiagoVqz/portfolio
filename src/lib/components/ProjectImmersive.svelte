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

<article class="immersive-layout">
	<div class="immersive-wrapper">
		<!-- Full-bleed background image -->
		{#if project.image}
			<div class="immersive-bg">
				<img
					src={project.image}
					alt="{project.title} background"
					loading="lazy"
					class="bg-image"
				/>
				<div class="gradient-overlay"></div>
			</div>
		{/if}

		<!-- Floating content -->
		<div class="immersive-content">
			<div class="content-text">
				<span class="subtitle">{project.subtitle}</span>
				<h3 class="title">{project.title}</h3>
				<p class="description">{project.description}</p>

				<!-- Tags -->
				<div class="tags">
					{#each project.tags as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>

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

			<!-- Floating metrics -->
			{#if project.metrics}
				<div class="floating-metrics">
					{#each project.metrics as metric (metric.label)}
						<div class="floating-metric">
							<span class="metric-value">{metric.value}</span>
							<span class="metric-label">{metric.label}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Year badge -->
		<div class="year-badge">
			<span>{project.year}</span>
		</div>
	</div>
</article>

<style>
	.immersive-layout {
		padding: 2rem 0;
	}

	.immersive-wrapper {
		position: relative;
		border-radius: var(--radius-2xl);
		overflow: hidden;
		min-height: 500px;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: flex-end;
	}

	@media (min-width: 768px) {
		.immersive-wrapper {
			min-height: 600px;
		}
	}

	.immersive-bg {
		position: absolute;
		inset: 0;
	}

	.bg-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--duration-slower) var(--ease-smooth);
	}

	.immersive-layout:hover .bg-image {
		transform: scale(1.05);
	}

	.gradient-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(54, 50, 47, 0.95) 0%,
			rgba(54, 50, 47, 0.7) 40%,
			rgba(54, 50, 47, 0.2) 70%,
			transparent 100%
		);
	}

	.immersive-content {
		position: relative;
		z-index: 2;
		padding: 2rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.immersive-content {
			padding: 3rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
		}
	}

	.content-text {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
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
		font-size: 2.5rem;
		font-weight: 500;
		color: var(--color-base);
		letter-spacing: var(--tracking-tight);
		margin: 0;
	}

	@media (min-width: 1024px) {
		.title {
			font-size: 3rem;
		}
	}

	.description {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--color-base);
		opacity: 0.8;
		margin: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		background: rgba(253, 252, 248, 0.1);
		color: var(--color-base);
		border-radius: var(--radius-full);
		backdrop-filter: blur(4px);
	}

	.floating-metrics {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.floating-metrics {
			align-items: flex-end;
			text-align: right;
		}
	}

	.floating-metric {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: rgba(253, 252, 248, 0.08);
		backdrop-filter: blur(8px);
		border-radius: var(--radius-md);
		border: 1px solid rgba(253, 252, 248, 0.1);
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-accent);
		line-height: 1;
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-base);
		opacity: 0.6;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: transparent;
		border: 1px solid rgba(253, 252, 248, 0.3);
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-smooth);
		width: fit-content;
	}

	.cta-button:hover {
		background: var(--color-base);
		color: var(--color-ink);
		border-color: var(--color-base);
	}

	.cta-arrow {
		transition: transform var(--duration-normal) ease;
	}

	.cta-button:hover .cta-arrow {
		transform: translateX(4px);
	}

	.year-badge {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 3;
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: rgba(54, 50, 47, 0.5);
		backdrop-filter: blur(8px);
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-full);
	}
</style>
