import { error } from '@sveltejs/kit';
import { getPost, getPublishedPosts, getAdjacentPosts, getRelatedPosts } from '$lib/blog';

// Each post is prerendered to static HTML for SEO and performance.
export const prerender = true;

// Tell SvelteKit which slugs to crawl when prerendering this dynamic route.
export function entries() {
	return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = getPost(params.slug);
	if (!post) error(404, `Post "${params.slug}" not found`);
	const { prev, next } = getAdjacentPosts(params.slug);
	return { post, prev, next, related: getRelatedPosts(params.slug) };
}
