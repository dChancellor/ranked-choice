/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
	return {
		headers: {
			'set-cookie': [
				`access_token=deleted; Path=/; Max-Age=-1`,
				`refresh_token=deleted; Path=/; Max-Age=-1`
			],
			Location: '/'
		},
		status: 302
	};
}
