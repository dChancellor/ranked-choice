<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';

	/** * @type {import('@sveltejs/kit').Load} */
	export async function load(event: LoadEvent) {
		return {
			props: { user: event.session?.user || false }
		};
	}
</script>

<script lang="ts">
	export let user: any;
</script>

{#if !user}
	<a title="Discord OAuth2" href="api/auth">Authenticate via Discord</a>
{:else}
	<img
		alt="{user.userName} avatar"
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
	/>
	<h1>Hello, {user.username}</h1>
	<a title="Sign out" href="api/logout">Sign Out</a>
{/if}
