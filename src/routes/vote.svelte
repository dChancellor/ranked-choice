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
			console.log(rankings);

			return {
				props: { games, user: event.session?.user, rankings }
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
	export let rankings: Rankings;

	const sortedGames = games.reduce((arr: Game[], game) => {
		if (!rankings.ordered_games) {
			arr.push(game);
		}

		const rank = rankings.ordered_games?.findIndex((name) => name === game.name);
		if (rank !== -1) {
			arr[rank] = game;
		} else {
			arr.push(game);
		}
		return arr;
	}, []);
	sortedGameStore.set(sortedGames);
	const saveVotes = async () => {
		const vote = $sortedGameStore.reduce((arr: string[], game: Game) => {
			arr.push(game.name);
			return arr;
		}, []);
		const upsert: Rankings = { ...rankings, ordered_games: vote };
		let { error } = await supabase.from('rankings').upsert(upsert, {
			returning: 'minimal'
		});
		if (error) return console.log(error);
		saved = true;
		setTimeout(() => {
			saved = false;
		}, 5000);
	};

	let saved = false;
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
	{#if $sortedGameStore}
		<div class="flex">
			<SortedGames />
		</div>
	{/if}
	<button on:click={saveVotes}>Save your votes</button>
	{#if saved}
		<h5>Your votes have been cast</h5>
	{/if}
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
	h1,
	h5 {
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
	button {
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
		max-width: 300px;
		margin-top: 2rem;
	}
	button:hover:not(:active, .disabled) {
		filter: brightness(130%);
		padding-inline: 2.3rem;
	}

	button:focus-visible {
		padding-inline: 2.3rem;
		outline-offset: 5px;
		outline: 3px var(--focusRingColor) solid;
	}
	button:active:not(.disabled) {
		filter: brightness(80%);
		box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
		padding-inline: 2.3rem;
	}
</style>
