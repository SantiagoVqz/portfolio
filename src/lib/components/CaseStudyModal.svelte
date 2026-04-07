<script lang="ts">
	import { browser } from '$app/environment';
	import type { Project } from '$lib/constants/profile';
	import ImageCarousel from './ImageCarousel.svelte';

	interface Props {
		project: Project | null;
		open: boolean;
		onClose: () => void;
	}

	let { project, open, onClose }: Props = $props();

	let dialogRef = $state<HTMLDialogElement>();
	let contentRef = $state<HTMLDivElement>();
	let hadCustomCursor = false;

	$effect(() => {
		if (!dialogRef) return;
		if (open && project) {
			dialogRef.showModal();
			document.body.style.overflow = 'hidden';
			hadCustomCursor = document.body.classList.contains('custom-cursor-active');
			if (hadCustomCursor) {
				document.body.classList.remove('custom-cursor-active');
			}
			animateIn();
		} else {
			document.body.style.overflow = '';
			if (hadCustomCursor) {
				document.body.classList.add('custom-cursor-active');
			}
			if (dialogRef.open) {
				dialogRef.close();
			}
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogRef) {
			onClose();
		}
	}

	async function animateIn() {
		if (!browser || !contentRef) return;
		const { gsap } = await import('gsap');
		gsap.fromTo(
			contentRef,
			{ y: 40, opacity: 0, scale: 0.97 },
			{ y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
		);
	}
</script>

<dialog
	bind:this={dialogRef}
	class="modal-dialog"
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
	aria-modal="true"
	aria-label="{project?.title ?? 'Case Study'} case study"
>
	{#if project}
		<div class="modal-content" bind:this={contentRef} role="document">
			<!-- Grain texture overlay -->
			<div class="grain-overlay"></div>

			<!-- Close button -->
			<button
				class="close-button"
				onclick={onClose}
				aria-label="Close case study"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>

			<!-- Split layout -->
			<div class="modal-split">
				<!-- Left panel: case study content -->
				<div class="modal-left">
					<!-- Header -->
					<header class="modal-header">
						<span class="modal-subtitle">{project.subtitle} · {project.year}</span>
						<h2 class="modal-title">{project.title}</h2>
						<div class="modal-tags">
							{#each project.tags as tag (tag)}
								<span class="modal-tag">{tag}</span>
							{/each}
						</div>
					</header>

					<!-- Metrics -->
					{#if project.metrics}
						<div class="modal-metrics">
							{#each project.metrics as metric (metric.label)}
								<div class="metric-card">
									<span class="metric-value">{metric.value}</span>
									<span class="metric-label">{metric.label}</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Case study sections -->
					<div class="case-study-body">
						<section class="case-section">
							<div class="section-label">
								<span class="label-number">01</span>
								<span>The Problem</span>
							</div>
							<p>{project.caseStudy.problem}</p>
						</section>

						<section class="case-section">
							<div class="section-label">
								<span class="label-number">02</span>
								<span>The Approach</span>
							</div>
							<p>{project.caseStudy.approach}</p>
						</section>

						<section class="case-section">
							<div class="section-label">
								<span class="label-number">03</span>
								<span>The Solution</span>
							</div>
							<p>{project.caseStudy.solution}</p>
						</section>

						<section class="case-section">
							<div class="section-label">
								<span class="label-number">04</span>
								<span>The Outcome</span>
							</div>
							<p>{project.caseStudy.outcome}</p>
						</section>
					</div>

					<!-- Project link -->
					{#if project.href}
						<a
							href={project.href}
							target="_blank"
							rel="noopener noreferrer"
							class="modal-link"
						>
							<span>View Project</span>
							<span>↗</span>
						</a>
					{/if}
				</div>

				<!-- Right panel: image gallery -->
				<div class="modal-right">
					{#if project.images && project.images.length > 1}
						<ImageCarousel
							images={project.images}
							alt="{project.title} screenshot"
							accentColor={project.color}
						/>
					{:else if project.image}
						<div class="single-image">
							<img src={project.image} alt={project.title} loading="lazy" />
						</div>
					{:else}
						<!-- No image fallback -->
						<div class="no-image">
							<span class="no-image-label">No preview available</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</dialog>

<style>
	/* ══════════════════════════════════════════
	   DIALOG SHELL
	   ══════════════════════════════════════════ */
	.modal-dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		z-index: 1000;
		display: none;
		pointer-events: none;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.modal-dialog[open] {
		display: flex;
		pointer-events: auto;
	}

	.modal-dialog::backdrop {
		background: rgba(54, 50, 47, 0.55);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	/* ══════════════════════════════════════════
	   GLASS CARD
	   ══════════════════════════════════════════ */
	.modal-content {
		position: relative;
		max-width: 1100px;
		width: 92vw;
		max-height: 85vh;
		border-radius: var(--radius-2xl, 1.5rem);
		background: color-mix(in srgb, var(--color-base) 88%, transparent);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		box-shadow:
			0 25px 50px -12px rgba(54, 50, 47, 0.25),
			0 0 0 1px rgba(253, 252, 248, 0.1) inset;
		overflow: hidden;
		padding: 0;
	}

	/* Grain texture */
	.grain-overlay {
		position: absolute;
		inset: 0;
		background-image: var(--glass-grain);
		background-repeat: repeat;
		opacity: 0.15;
		pointer-events: none;
		z-index: 5;
		border-radius: inherit;
	}

	/* ══════════════════════════════════════════
	   CLOSE BUTTON
	   ══════════════════════════════════════════ */
	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--color-base) 90%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
		border-radius: 50%;
		color: var(--color-ink);
		cursor: pointer;
		z-index: 10;
		transition: all 200ms ease;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.close-button:hover {
		background: var(--color-ink);
		color: var(--color-base);
		border-color: var(--color-ink);
	}

	/* ══════════════════════════════════════════
	   SPLIT LAYOUT
	   ══════════════════════════════════════════ */
	.modal-split {
		display: grid;
		grid-template-columns: 1fr;
		height: 100%;
		max-height: 85vh;
	}

	@media (min-width: 768px) {
		.modal-split {
			grid-template-columns: 1.1fr 1fr;
		}
	}

	/* ── Left panel: content ── */
	.modal-left {
		overflow-y: auto;
		padding: 2.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--color-ink) 15%, transparent) transparent;
	}

	@media (min-width: 768px) {
		.modal-left {
			padding: 3rem;
		}
	}

	.modal-left::-webkit-scrollbar {
		width: 4px;
	}

	.modal-left::-webkit-scrollbar-track {
		background: transparent;
	}

	.modal-left::-webkit-scrollbar-thumb {
		background: color-mix(in srgb, var(--color-ink) 15%, transparent);
		border-radius: 2px;
	}

	/* ── Right panel: images ── */
	.modal-right {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-surface);
		overflow: hidden;
		min-height: 280px;
		order: -1;
	}

	@media (min-width: 768px) {
		.modal-right {
			order: 0;
			border-left: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
			min-height: unset;
		}
	}

	/* Single image */
	.single-image {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 1.5rem;
	}

	.single-image img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: var(--radius-md, 8px);
		display: block;
	}

	/* No image fallback */
	.no-image {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 2rem;
	}

	.no-image-label {
		font-family: var(--font-data);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.25;
	}

	/* ══════════════════════════════════════════
	   HEADER
	   ══════════════════════════════════════════ */
	.modal-header {
		padding-top: 0.5rem;
	}

	.modal-subtitle {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-accent);
		display: block;
		margin-bottom: 0.75rem;
	}

	.modal-title {
		font-family: var(--font-headline);
		font-size: 2rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: var(--tracking-tight);
		margin: 0 0 1rem;
		line-height: 1.1;
	}

	@media (min-width: 768px) {
		.modal-title {
			font-size: 2.5rem;
		}
	}

	.modal-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.modal-tag {
		font-family: var(--font-data);
		font-size: 9px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.3rem 0.625rem;
		background: color-mix(in srgb, var(--color-tension) 12%, var(--color-surface));
		color: var(--color-tension);
		border-radius: var(--radius-full);
	}

	/* ══════════════════════════════════════════
	   METRICS
	   ══════════════════════════════════════════ */
	.modal-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.875rem 1rem;
		background: color-mix(in srgb, var(--color-surface) 70%, transparent);
		border-radius: var(--radius-md, 8px);
		border: 1px solid color-mix(in srgb, var(--color-ink) 6%, transparent);
	}

	.metric-value {
		font-family: var(--font-headline);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-accent);
		line-height: 1;
	}

	.metric-label {
		font-family: var(--font-data);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		opacity: 0.5;
	}

	/* ══════════════════════════════════════════
	   CASE STUDY BODY
	   ══════════════════════════════════════════ */
	.case-study-body {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.case-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.label-number {
		color: var(--color-accent);
		font-weight: 600;
	}

	.case-section p {
		font-family: var(--font-data);
		font-size: 0.875rem;
		line-height: 1.75;
		color: var(--color-ink);
		opacity: 0.75;
		margin: 0;
	}

	/* ══════════════════════════════════════════
	   PROJECT LINK
	   ══════════════════════════════════════════ */
	.modal-link {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		font-family: var(--font-data);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-base);
		background: var(--color-ink);
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-full);
		text-decoration: none;
		cursor: pointer;
		transition: background 200ms ease;
		width: fit-content;
	}

	.modal-link:hover {
		background: var(--color-accent);
	}
</style>
