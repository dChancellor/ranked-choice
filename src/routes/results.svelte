<script context="module" lang="ts">
	import { supabase } from '$lib/dbClient';

	import type { LoadEvent } from '@sveltejs/kit';
	import type { Game, Rankings, WinnerMap } from 'src/types';

	/** * @type {import('@sveltejs/kit').Load} */
	export async function load(event: LoadEvent) {
		if (!event.session?.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		try {
			const { data: voters } = await supabase.from<Rankings>('rankings').select(`*`);

			if (!voters) throw Error('Something went wrong when getting the results...');
			const votes = voters.reduce((arr: Array<string[]>, voter) => {
				if (voter.ordered_games.length === 0) return arr;
				arr.push(voter.ordered_games);
				return arr;
			}, []);

			let voteMap: WinnerMap = {};
			const losers: string[] = [];

			let winner: string = 'OOPS';

			const calculateTheVote = (games: string[], losers: string[], index = 0) => {
				if (losers.includes(games[index])) calculateTheVote(games, losers, (index += 1));
				voteMap[games[index]] = voteMap[games[index]] ? (voteMap[games[index]] += 1) : 1;
			};

			const findTheWinner = () => {
				votes.forEach((vote) => {
					calculateTheVote(vote, losers);
				});
				const sorted = Object.entries(voteMap).sort(([_, value], [__, value2]) => {
					return value2 - value;
				});
				const winnerVoteCount = sorted[0][1];
				if (winnerVoteCount <= voters.length / 2) {
					losers.push(sorted[sorted.length - 1][0]);
					findTheWinner();
				} else {
					winner = sorted[0][0];
				}
			};
			findTheWinner();
			return {
				props: { user: event.session?.user, winner }
			};
		} catch (error) {
			return { status: 500, body: error };
		}
	}
</script>

<script lang="ts">
	import { sortedGameStore } from '../store/games';
	export let user: User;
	export let winner: string;

	const saveVotes = async () => {};
</script>

<main>
	<img
		alt="{user.username} avatar"
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
	/>
	<h1 style="margin-bottom: .5rem;">Hello, {user.username}!</h1>
	<a title="Log out" href="api/logout" style="margin-top: 0;">Sign out now</a>
	<h1 style="margin-top: 2rem;">The winner is...</h1>
	<h1 style="font-size: 4rem; margin-top: 0rem;">{winner}</h1>
	<a class="return-button" title="Return to vote" href="vote">Return to vote</a>
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
	.return-button {
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
	.return-button:hover:not(:active, .disabled) {
		filter: brightness(130%);
		padding-inline: 2.3rem;
	}

	.return-button:focus-visible {
		padding-inline: 2.3rem;
		outline-offset: 5px;
		outline: 3px var(--focusRingColor) solid;
	}
	.return-button:active:not(.disabled) {
		filter: brightness(80%);
		box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
		padding-inline: 2.3rem;
	}
</style>
