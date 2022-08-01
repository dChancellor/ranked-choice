import config from '$lib/config';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(event: RequestEvent) {
	const returnCode = event.url.searchParams.get('code');
	if (!returnCode) return { status: 500 };
	const dataObject = {
		client_id: config.oauth.discord.clientId,
		client_secret: config.oauth.discord.clientSecret,
		grant_type: 'authorization_code',
		redirect_uri: config.oauth.discord.redirect_uri,
		code: returnCode,
		scope: 'identify'
	};

	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	// redirect to front page in case of error
	if (response.error) {
		console.log('redirect to / due error');
		return {
			headers: { Location: '/' },
			status: 302
		};
	}

	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	return {
		headers: {
			'set-cookie': [
				`access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}`,
				`refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`
			],
			Location: '/'
		},
		status: 302
	};
}
