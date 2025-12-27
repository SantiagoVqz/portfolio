// Theme tokens
export { theme, cssVariables, type Theme } from './theme';

// Actions
export { magnetic } from './actions/magnetic';
export { reveal, revealBatch, cardSettle } from './actions/reveal';

// Stores (Svelte 5 runes-based state)
export { scrollState, cursorState } from './stores/scroll.svelte';

// Components
export { default as CustomCursor } from './components/CustomCursor.svelte';
export { default as ProjectCard } from './components/ProjectCard.svelte';
export { default as Navbar } from './components/Navbar.svelte';
export { default as SmoothScroll } from './components/SmoothScroll.svelte';
export { default as ProjectSheet } from './components/ProjectSheet.svelte';
export { default as MagneticButton } from './components/MagneticButton.svelte';
export { default as AnimatedAvatar } from './components/AnimatedAvatar.svelte';
