import cookie from 'cookie';
import config from '$lib/config';
import type { RequestEvent } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
	event,
	resolve
}: {
	event: RequestEvent;
	resolve: (arg0: RequestEvent) => MaybePromise<Response>;
}) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookies.refresh_token && !cookies.access_token) {
		const discordRequest = await fetch(`${config.host}/api/refresh?code=${cookies.refresh_token}`);
		const discordResponse = await discordRequest.json();

		if (discordResponse.access_token) {
			const request: Response = await fetch(`https://discordapp.com/api/users/@me`, {
				headers: { Authorization: `Bearer ${discordResponse.access_token}` }
			});
			const response = await request.json();
			event.locals.user = { ...response };
		}
	}

	if (cookies.access_token) {
		const request = await fetch(`https://discordapp.com/api/users/@me`, {
			headers: { Authorization: `Bearer ${cookies.access_token}` }
		});

		const response = await request.json();
		event.locals.user = { ...response };
	}

	const response = await resolve(event);
	return response;
}

// /** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(event: RequestEvent) {
	return {
		user: event.locals.user
	};
}
