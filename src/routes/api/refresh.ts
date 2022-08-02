import config from '$lib/config';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET(event: RequestEvent) {
	const refresh_token = event.url.searchParams.get('code');
	if (!refresh_token) {
		return {
			body: JSON.stringify({ error: 'No refresh token found' }),
			status: 500
		};
	}

	const data = {
		client_id: config.oauth.discord.clientId,
		client_secret: config.oauth.discord.clientSecret,
		grant_type: 'authorization_code',
		redirect_uri: config.oauth.discord.redirect_uri,
		code: refresh_token,
		scope: 'identify'
	};

	// get the tokens from discord to send eventually send back
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) {
		return {
			body: JSON.stringify({ error: response.error }),
			status: 500
		};
	}

	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	return {
		headers: {
			'set-cookie': [
				`access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}`,
				`refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`
			]
		},
		status: 200,
		body: JSON.stringify({ access_token: response.access_token })
	};
}
