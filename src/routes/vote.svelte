<script context="module" lang="ts">
	import { supabase } from '$lib/dbClient';

	import type { LoadEvent } from '@sveltejs/kit';
	import type { Game, Rankings } from 'src/types';

	/** * @type {import('@sveltejs/kit').Load} */
	export async function load(event: LoadEvent) {
		if (!event.session?.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		try {
			const { data: games, error } = await supabase.from('games').select(`*`);
			if (error) throw error;
			const { data: rankings } = await supabase
				.from<Rankings>('rankings')
				.select(`*`)
				.eq('user', event.session.user.username || '')
				.single();
			return {
				props: { games, user: event.session?.user, rankings: rankings?.ordered_games || [] }
			};
		} catch (error) {
			return { status: 500, body: error };
		}
	}
</script>

<script lang="ts">
	import { sortedGameStore } from '../store/games';
	import SortedGames from '$lib/components/SortedGames.svelte';
	export let user: User;
	export let games: Game[];
	export let rankings: string[];

	sortedGameStore.set(
		games.reduce((arr: Game[], game) => {
			const rank = rankings.findIndex((name) => name === game.name);
			if (rank !== -1) {
				arr.splice(rank, 0, game);
			} else {
				arr.push(game);
			}
			return arr;
		}, [])
	);
</script>

<main>
	<img
		alt="{user.username} avatar"
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
	/>
	<h1>Hello, {user.username}!</h1>
	<h2>Sort your games below</h2>
	<div class={'or'}>or</div>
	<a title="Log out" href="api/logout">Sign out now</a>
	<div class="flex">
		<SortedGames />
	</div>
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
		font-family: 'Montserrat', sans-serif;
		flex-flow: column;
	}
	h1 {
		color: #ffd9d9;
	}
	h2 {
		color: #a0a0a0;
		margin: 0;
	}
	.or {
		color: #525252;
		margin: 0;
	}
	a {
		color: #525252;
		margin: 0;
	}
	img {
		border-radius: 20px;
	}
	.flex {
		display: flex;
		flex-flow: column;
		gap: 15px;
		margin-top: 3rem;
	}
</style>
