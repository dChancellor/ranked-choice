import config from '$lib/config';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
	return {
		headers: { Location: config.oauth.discord.oauth_url },
		status: 302
	};
}
