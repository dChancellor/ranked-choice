<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';

	/** * @type {import('@sveltejs/kit').Load} */
	export async function load(event: LoadEvent) {
		if (event.session.user) {
			return {
				redirect: '/vote',
				status: 302
			};
		}
		return;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	const reload = () => {
		goto('/vote');
	};
</script>

<main>
	<a title="Discord OAuth2" href="api/auth">Login with Discord</a>
</main>

<style>
	main {
		background-color: #242424;
		min-height: 100vh;
		width: 100vw;
		overflow-x: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	a {
		font-family: 'Montserrat', sans-serif;
		outline: none;
		border: none;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
		isolation: isolate;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 8px;
		font-weight: 700;
		height: max-content;
		cursor: pointer;
		background: linear-gradient(180deg, #e068fe 0%, #903bae 100%);
		transition: all 0.5s;
		color: #f7cdff;
		gap: 5px;
		padding: 1rem 1rem;
		text-decoration: none;
		max-width: 200px;
	}
	a:hover:not(:active, .disabled) {
		filter: brightness(130%);
		padding-inline: 2.3rem;
	}

	a:focus-visible {
		padding-inline: 2.3rem;
		outline-offset: 5px;
		outline: 3px var(--focusRingColor) solid;
	}
	a:active:not(.disabled) {
		filter: brightness(80%);
		box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
		padding-inline: 2.3rem;
	}
</style>
