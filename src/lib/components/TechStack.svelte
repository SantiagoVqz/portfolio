<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Skill } from '$lib/constants/profile';

	// GSAP types for dynamic imports
	type GSAPInstance = typeof import('gsap').gsap;
	let gsapInstance: GSAPInstance | null = null;

	interface Props {
		skills: Skill[];
	}

	let { skills }: Props = $props();

	let containerRef = $state<HTMLElement>();
	let playgroundRef = $state<HTMLElement>();
	let isPlayground = $state(false);
	let hasDiscoveredPlayground = $state(false);

	// Group skills by category
	const groupedSkills = $derived.by(() => {
		const groups: Record<string, Skill[]> = {};
		skills.forEach((skill) => {
			if (!groups[skill.category]) {
				groups[skill.category] = [];
			}
			groups[skill.category].push(skill);
		});
		return groups;
	});

	const categories = $derived(Object.keys(groupedSkills));

	// Category icons and colors
	const categoryMeta: Record<string, { icon: string; color: string }> = {
		Framework: { icon: '⚡', color: '#cc8b65' },
		Language: { icon: '✎', color: '#7d9c8b' },
		Cloud: { icon: '☁', color: '#8b9cc7' },
		Backend: { icon: '⚙', color: '#c78b8b' },
		Mobile: { icon: '📱', color: '#8bc7a8' },
		Testing: { icon: '🎭', color: '#c7b88b' },
		Motion: { icon: '◐', color: '#b88bc7' },
		DevOps: { icon: '⛭', color: '#8bc7c7' },
		Database: { icon: '◉', color: '#c7a88b' }
	};

	// Skill icons
	const skillIcons: Record<string, string> = {
		SvelteKit: '⚡',
		'Next.js': '▲',
		TypeScript: 'TS',
		AWS: '☁',
		FastAPI: '⚙',
		'React Native': '📱',
		Playwright: '🎭',
		GSAP: '◐'
	};

	// Physics state for playground mode
	interface PhysicsNode {
		id: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		skill: Skill;
		color: string;
		icon: string;
	}

	let physicsNodes = $state<PhysicsNode[]>([]);
	let draggedNode = $state<string | null>(null);
	let dragOffset = $state({ x: 0, y: 0 });
	let animationFrame: number;

	// Initialize physics nodes when entering playground
	function initPlayground() {
		if (!playgroundRef) return;

		const rect = playgroundRef.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const nodes: PhysicsNode[] = [];

		// Distribute nodes across the canvas like floating on water
		const cols = 4;
		const rows = Math.ceil(skills.length / cols);
		const cellWidth = width / (cols + 1);
		const cellHeight = height / (rows + 1);

		skills.forEach((skill, i) => {
			// Size based on proficiency: large = 55, medium = 42, small = 32
			const radius = skill.size === 'large' ? 55 : skill.size === 'medium' ? 42 : 32;
			const meta = categoryMeta[skill.category] || { icon: '◆', color: '#cc8b65' };

			// Distribute in a loose grid with randomness
			const col = i % cols;
			const row = Math.floor(i / cols);
			const baseX = cellWidth * (col + 1);
			const baseY = cellHeight * (row + 1);

			// Add randomness to position
			const x = baseX + (Math.random() - 0.5) * cellWidth * 0.5;
			const y = baseY + (Math.random() - 0.5) * cellHeight * 0.5;

			nodes.push({
				id: skill.name,
				x: Math.max(radius, Math.min(width - radius, x)),
				y: Math.max(radius, Math.min(height - radius, y)),
				vx: 0,
				vy: 0,
				radius,
				skill,
				color: meta.color,
				icon: skillIcons[skill.name] || meta.icon
			});
		});

		physicsNodes = nodes;
		startPhysics();
	}

	// Physics simulation - floating on water (no gravity, just drift)
	function startPhysics() {
		if (!playgroundRef) return;

		const friction = 0.97; // Smooth slowdown like water resistance
		const bounce = 0.6; // Soft bounce off walls
		const floatStrength = 0.0105; // Gentle ambient floating

		function update() {
			if (!isPlayground || !playgroundRef) return;

			const rect = playgroundRef.getBoundingClientRect();
			const width = rect.width;
			const height = rect.height;
			const time = Date.now() * 0.001; // Time for gentle floating

			physicsNodes = physicsNodes.map((node, index) => {
				if (draggedNode === node.id) return node;

				let { x, y, vx, vy, radius } = node;

				// Gentle ambient floating like on water (unique per node)
				const floatOffsetX = Math.sin(time * 0.5 + index * 1.5) * floatStrength;
				const floatOffsetY = Math.cos(time * 0.4 + index * 1.2) * floatStrength;

				vx += floatOffsetX;
				vy += floatOffsetY;

				// Apply water-like friction (slows down smoothly)
				vx *= friction;
				vy *= friction;

				// Stop very small movements
				if (Math.abs(vx) < 0.01) vx = 0;
				if (Math.abs(vy) < 0.01) vy = 0;

				// Update position
				x += vx;
				y += vy;

				// Soft bounce off walls
				if (x - radius < 0) {
					x = radius;
					vx = -vx * bounce;
				}
				if (x + radius > width) {
					x = width - radius;
					vx = -vx * bounce;
				}
				if (y - radius < 0) {
					y = radius;
					vy = -vy * bounce;
				}
				if (y + radius > height) {
					y = height - radius;
					vy = -vy * bounce;
				}

				return { ...node, x, y, vx, vy };
			});

			// Node-to-node collision (gentle push apart)
			for (let i = 0; i < physicsNodes.length; i++) {
				for (let j = i + 1; j < physicsNodes.length; j++) {
					const a = physicsNodes[i];
					const b = physicsNodes[j];

					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const minDist = a.radius + b.radius + 4; // Small gap between bubbles

					if (dist < minDist && dist > 0) {
						const nx = dx / dist;
						const ny = dy / dist;
						const overlap = minDist - dist;

						// Gently separate nodes
						const separationX = (overlap / 2) * nx * 0.5;
						const separationY = (overlap / 2) * ny * 0.5;

						if (draggedNode !== a.id) {
							a.x -= separationX;
							a.y -= separationY;
							a.vx -= separationX * 0.1;
							a.vy -= separationY * 0.1;
						}
						if (draggedNode !== b.id) {
							b.x += separationX;
							b.y += separationY;
							b.vx += separationX * 0.1;
							b.vy += separationY * 0.1;
						}
					}
				}
			}

			animationFrame = requestAnimationFrame(update);
		}

		animationFrame = requestAnimationFrame(update);
	}

	function stopPhysics() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	}

	// Drag handlers
	function handlePointerDown(e: PointerEvent, nodeId: string) {
		const node = physicsNodes.find((n) => n.id === nodeId);
		if (!node || !playgroundRef) return;

		const rect = playgroundRef.getBoundingClientRect();
		draggedNode = nodeId;
		dragOffset = {
			x: e.clientX - rect.left - node.x,
			y: e.clientY - rect.top - node.y
		};

		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!draggedNode || !playgroundRef) return;

		const rect = playgroundRef.getBoundingClientRect();
		const newX = e.clientX - rect.left - dragOffset.x;
		const newY = e.clientY - rect.top - dragOffset.y;

		physicsNodes = physicsNodes.map((node) => {
			if (node.id === draggedNode) {
				// Calculate velocity from movement for gentle throwing
				const vx = (newX - node.x) * 0.4;
				const vy = (newY - node.y) * 0.4;
				return { ...node, x: newX, y: newY, vx, vy };
			}
			return node;
		});
	}

	function handlePointerUp() {
		draggedNode = null;
	}

	// Toggle playground mode
	function togglePlayground() {
		isPlayground = !isPlayground;
		hasDiscoveredPlayground = true;

		if (isPlayground) {
			setTimeout(() => initPlayground(), 100);
		} else {
			stopPhysics();
		}
	}

	onMount(() => {
		if (!containerRef || !browser) return;

		let ctx: gsap.Context | null = null;

		const initGSAP = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			gsapInstance = gsap;

			ctx = gsap.context(() => {
				gsap.fromTo(
					'.category-group',
					{ opacity: 0, y: 20 },
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						stagger: 0.08,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: containerRef,
							start: 'top 80%'
						}
					}
				);
			}, containerRef);
		};

		initGSAP();

		return () => {
			ctx?.revert();
			stopPhysics();
		};
	});
</script>

<div class="techstack-container" bind:this={containerRef}>
	<!-- Header with hidden playground toggle -->
	<div class="stack-header">
		<div class="header-line"></div>
		<button
			class="header-badge"
			class:discovered={hasDiscoveredPlayground}
			class:active={isPlayground}
			onclick={togglePlayground}
			title="Toggle playground mode"
		>
			{#if isPlayground}
				<span class="badge-icon">✕</span>
				<span>EXIT PLAYGROUND</span>
			{:else}
				<span class="badge-icon">⚡</span>
				<span>TECH STACK</span>
			{/if}
		</button>
		<div class="header-line"></div>
	</div>

	<!-- Organized View -->
	{#if !isPlayground}
		<div class="organized-view">
			{#each categories as category (category)}
				{@const meta = categoryMeta[category] || { icon: '◆', color: '#cc8b65' }}
				{@const categorySkills = groupedSkills[category]}

				<div class="category-group" style="--category-color: {meta.color}">
					<div class="category-header">
						<span class="category-icon">{meta.icon}</span>
						<span class="category-name">{category}</span>
						<span class="category-count">{categorySkills.length}</span>
					</div>

					<div class="category-skills">
						{#each categorySkills as skill (skill.name)}
							{@const icon = skillIcons[skill.name] || meta.icon}
							<div
								class="skill-tag"
								class:primary={skill.size === 'large'}
								class:medium={skill.size === 'medium'}
							>
								<span class="tag-icon">{icon}</span>
								<span class="tag-name">{skill.name}</span>
								{#if skill.size === 'large'}
									<span class="tag-badge">Expert</span>
								{:else if skill.size === 'medium'}
									<span class="tag-badge secondary">Proficient</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Hint to discover playground -->
		<div class="playground-hint">
			<span class="hint-arrow">↑</span>
			<span class="hint-text">Click the badge to play</span>
		</div>
	{:else}
		<!-- Playground Mode -->
		<div
			class="playground-view"
			bind:this={playgroundRef}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointerleave={handlePointerUp}
			role="application"
			aria-label="Interactive skill playground"
		>
			<!-- Background with water-like ripples -->
			<div class="playground-water"></div>

			<!-- Physics nodes -->
			{#each physicsNodes as node (node.id)}
				<div
					class="physics-node"
					class:dragging={draggedNode === node.id}
					class:large={node.skill.size === 'large'}
					class:medium={node.skill.size === 'medium'}
					style="
						left: {node.x}px;
						top: {node.y}px;
						width: {node.radius * 2}px;
						height: {node.radius * 2}px;
						--node-color: {node.color};
					"
					onpointerdown={(e) => handlePointerDown(e, node.id)}
					role="button"
					tabindex="0"
				>
					<span class="node-icon">{node.icon}</span>
					<span class="node-label">{node.skill.name}</span>
				</div>
			{/each}

			<!-- Playground instructions -->
			<div class="playground-instructions">
				<span>Drag & push the bubbles around ✦ They float like on water</span>
			</div>

			<!-- Size legend -->
			<div class="size-legend">
				<div class="legend-item">
					<span class="legend-bubble large"></span>
					<span>Expert</span>
				</div>
				<div class="legend-item">
					<span class="legend-bubble medium"></span>
					<span>Proficient</span>
				</div>
				<div class="legend-item">
					<span class="legend-bubble small"></span>
					<span>Familiar</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.techstack-container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	/* Header */
	.stack-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.header-line {
		flex: 1;
		max-width: 120px;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--color-ink) 20%, transparent),
			transparent
		);
	}

	.header-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.15em;
		color: var(--color-ink);
		opacity: 0.5;
		padding: 0.625rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--color-ink) 15%, transparent);
		border-radius: 100px;
		background: transparent;
		cursor: none;
		transition: all 0.3s ease;
	}

	.header-badge:hover {
		opacity: 1;
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 8%, transparent);
	}

	.header-badge.active {
		opacity: 1;
		border-color: var(--color-tension);
		background: color-mix(in srgb, var(--color-tension) 10%, transparent);
		color: var(--color-tension);
	}

	.badge-icon {
		font-size: 12px;
	}

	/* Organized View - Multi Column */
	.organized-view {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.category-group {
		background: var(--color-base);
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		border-radius: var(--radius-md);
		padding: 1rem 1.25rem;
		transition: all var(--duration-normal) var(--ease-smooth);
	}

	.category-group:hover {
		border-color: color-mix(in srgb, var(--category-color) 40%, transparent);
		box-shadow: var(--shadow-diffused);
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.875rem;
	}

	.category-icon {
		font-size: 1rem;
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--category-color) 15%, transparent);
		border-radius: 6px;
	}

	.category-name {
		font-family: var(--font-headline);
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: -0.01em;
	}

	.category-count {
		margin-left: auto;
		font-family: var(--font-data);
		font-size: 10px;
		color: var(--color-ink);
		opacity: 0.4;
		padding: 0.125rem 0.5rem;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		border-radius: 100px;
	}

	.category-skills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		background: var(--color-surface);
		border-radius: var(--radius-full);
		transition: all var(--duration-fast) var(--ease-smooth);
	}

	.skill-tag:hover {
		background: color-mix(in srgb, var(--category-color) 12%, var(--color-surface));
		transform: translateY(-1px);
	}

	.skill-tag.primary {
		background: color-mix(in srgb, var(--category-color) 12%, var(--color-base));
		border: 1.5px solid color-mix(in srgb, var(--category-color) 35%, transparent);
		padding: 0.625rem 1rem;
	}

	.skill-tag.medium {
		background: color-mix(in srgb, var(--category-color) 8%, var(--color-base));
		border: 1px solid color-mix(in srgb, var(--category-color) 20%, transparent);
	}

	.tag-icon {
		font-size: 0.8rem;
	}

	.skill-tag.primary .tag-icon {
		font-size: 0.9rem;
	}

	.tag-name {
		font-family: var(--font-data);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-ink);
	}

	.skill-tag.primary .tag-name {
		font-size: 12px;
		font-weight: 600;
	}

	.tag-badge {
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.125rem 0.375rem;
		background: var(--category-color);
		color: var(--color-base);
		border-radius: 3px;
	}

	.tag-badge.secondary {
		background: color-mix(in srgb, var(--category-color) 70%, transparent);
	}

	/* Playground Hint */
	.playground-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		opacity: 0.4;
		animation: pulse-hint 2s ease-in-out infinite;
	}

	.hint-arrow {
		animation: bounce-up 1s ease-in-out infinite;
	}

	.hint-text {
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.05em;
		color: var(--color-ink);
	}

	@keyframes pulse-hint {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.6;
		}
	}

	@keyframes bounce-up {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	/* Playground View */
	.playground-view {
		position: relative;
		width: 100%;
		height: 500px;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-surface) 60%, var(--color-base)) 0%,
			var(--color-base) 100%
		);
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
		border-radius: var(--radius-2xl);
		overflow: hidden;
		touch-action: none;
	}

	/* Water-like background */
	.playground-water {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				ellipse at 20% 30%,
				color-mix(in srgb, var(--color-accent) 4%, transparent) 0%,
				transparent 40%
			),
			radial-gradient(
				ellipse at 80% 70%,
				color-mix(in srgb, var(--color-tension) 3%, transparent) 0%,
				transparent 40%
			),
			radial-gradient(
				ellipse at 50% 50%,
				color-mix(in srgb, var(--color-ink) 2%, transparent) 0%,
				transparent 60%
			);
		pointer-events: none;
		animation: water-shimmer 8s ease-in-out infinite;
	}

	@keyframes water-shimmer {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}

	/* Physics nodes */
	.physics-node {
		position: absolute;
		transform: translate(-50%, -50%);
		border-radius: var(--radius-full);
		background: linear-gradient(
			135deg,
			var(--color-base) 0%,
			color-mix(in srgb, var(--node-color) 20%, var(--color-surface)) 100%
		);
		border: 2px solid color-mix(in srgb, var(--node-color) 50%, transparent);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: none;
		user-select: none;
		box-shadow:
			0 4px 16px -4px color-mix(in srgb, var(--node-color) 25%, transparent),
			inset 0 -2px 8px color-mix(in srgb, var(--node-color) 10%, transparent);
		transition:
			box-shadow var(--duration-fast) ease,
			border-color var(--duration-fast) ease;
		z-index: 10;
	}

	.physics-node:hover {
		border-color: var(--node-color);
		box-shadow:
			0 8px 24px -4px color-mix(in srgb, var(--node-color) 40%, transparent),
			inset 0 -2px 8px color-mix(in srgb, var(--node-color) 15%, transparent);
		z-index: 15;
	}

	.physics-node.dragging {
		cursor: none;
		z-index: 100;
		border-color: var(--node-color);
		box-shadow:
			0 16px 40px -4px color-mix(in srgb, var(--node-color) 50%, transparent),
			inset 0 -2px 8px color-mix(in srgb, var(--node-color) 20%, transparent);
	}

	.physics-node.large {
		border-width: 3px;
	}

	.physics-node.medium {
		border-width: 2.5px;
	}

	.node-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.physics-node.large .node-icon {
		font-size: 1.5rem;
	}

	.physics-node.medium .node-icon {
		font-size: 1.125rem;
	}

	.node-label {
		font-family: var(--font-data);
		font-size: 9px;
		font-weight: 500;
		color: var(--color-ink);
		opacity: 0.7;
		margin-top: 3px;
		text-align: center;
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.physics-node.large .node-label {
		font-size: 10px;
	}

	/* Playground instructions */
	.playground-instructions {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-data);
		font-size: 10px;
		letter-spacing: 0.03em;
		color: var(--color-ink);
		opacity: 0.4;
		padding: 0.5rem 1rem;
		background: color-mix(in srgb, var(--color-base) 90%, transparent);
		backdrop-filter: blur(4px);
		border-radius: 100px;
		pointer-events: none;
	}

	/* Size legend */
	.size-legend {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		background: color-mix(in srgb, var(--color-base) 90%, transparent);
		backdrop-filter: blur(4px);
		border-radius: 10px;
		border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-data);
		font-size: 9px;
		color: var(--color-ink);
		opacity: 0.6;
	}

	.legend-bubble {
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-accent) 20%, var(--color-surface));
		border: 1.5px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
	}

	.legend-bubble.large {
		width: 16px;
		height: 16px;
	}

	.legend-bubble.medium {
		width: 12px;
		height: 12px;
	}

	.legend-bubble.small {
		width: 8px;
		height: 8px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.techstack-container {
			padding: 1rem;
		}

		.organized-view {
			grid-template-columns: 1fr;
		}

		.category-group {
			padding: 0.875rem 1rem;
		}

		.skill-tag {
			padding: 0.375rem 0.75rem;
		}

		.playground-view {
			height: 400px;
			border-radius: 16px;
		}

		.size-legend {
			top: 0.5rem;
			right: 0.5rem;
			padding: 0.5rem;
		}
	}
</style>
