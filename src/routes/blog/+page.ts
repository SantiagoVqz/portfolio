import { getPublishedPosts } from '$lib/blog';

// Prerender the index to static HTML for fast loads and reliable indexing.
export const prerender = true;

export function load() {
	return { posts: getPublishedPosts() };
}
