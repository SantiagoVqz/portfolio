<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Section {
		id: string;
		label: string;
	}

	const sections: Section[] = [
		{ id: 'hero', label: 'Hero' },
		{ id: 'artifacts', label: 'Work' },
		{ id: 'process', label: 'Stack' },
		{ id: 'archive', label: 'Journey' },
		{ id: 'contact', label: 'Contact' }
	];

	let activeSection = $state('hero');
	let isMobile = $state(false);

	function navigateToSection(id: string) {
		const el = document.getElementById(id);
		el?.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		if (!browser) return;

		isMobile = window.innerWidth < 1024;

		const observers: IntersectionObserver[] = [];

		sections.forEach((section) => {
			const el = document.getElementById(section.id);
			if (!el) return;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
							activeSection = section.id;
						}
					});
				},
				{ threshold: [0.3, 0.5] }
			);

			observer.observe(el);
			observers.push(observer);
		});

		const handleResize = () => {
			isMobile = window.innerWidth < 1024;
		};
		window.addEventListener('resize', handleResize);

		return () => {
			observers.forEach((o) => o.disconnect());
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

{#if !isMobile}
	<nav
		class="section-indicators"
		aria-label="Section navigation"
	>
		{#each sections as section (section.id)}
			{@const isActive = activeSection === section.id}
			<button
				class="indicator"
				class:active={isActive}
				onclick={() => navigateToSection(section.id)}
				aria-label="Go to {section.label}"
				aria-current={isActive ? 'true' : undefined}
				data-cursor-hover
			>
				<span class="dot"></span>
				{#if isActive}
					<span class="label">{section.label}</span>
				{/if}
			</button>
		{/each}
	</nav>
{/if}

<style>
	.section-indicators {
		position: fixed;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: none;
		padding: 0.25rem;
		cursor: none;
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-ink);
		opacity: 0.15;
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.indicator:hover .dot {
		opacity: 0.4;
		transform: scale(1.3);
	}

	.indicator.active .dot {
		opacity: 1;
		background: var(--color-accent);
		transform: scale(1.3);
		box-shadow: 0 0 8px rgba(204, 139, 101, 0.3);
	}

	.label {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-accent);
		animation: labelIn 0.2s ease forwards;
	}

	@keyframes labelIn {
		from { opacity: 0; transform: translateX(4px); }
		to { opacity: 1; transform: translateX(0); }
	}
</style>
