import { error } from '@sveltejs/kit';
import { getPost, getPublishedPosts } from '$lib/blog';
import { renderOgImage } from '$lib/server/og';

// Prerender one PNG per post so social cards are served as static files.
export const prerender = true;

export function entries() {
	return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function GET({ params }) {
	const post = getPost(params.slug);
	if (!post) error(404, `Post "${params.slug}" not found`);

	const png = await renderOgImage({
		title: post.title,
		date: post.date,
		readingTime: post.readingTime,
		tags: post.keywords
	});

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=604800, immutable'
		}
	});
}
