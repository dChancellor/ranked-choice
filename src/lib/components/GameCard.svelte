<script lang="ts">
	import type { Game } from 'src/types';

	export let game: Game;
</script>

<div class={`gamecard ${!game.steam_id && 'centered'}`}>
	<h4>
		{game.name}
	</h4>
	{#if game.steam_id}
		<a href="https://store.steampowered.com/app/656350/UnderMine/?snr=1_4_4__43_1">
			<img
				src="https://cdn.akamai.steamstatic.com/steam/apps/{game.steam_id}/header.jpg?t=1641501972"
				alt="{game.name} featured image"
			/>
		</a>
	{/if}
</div>

<style>
	.gamecard {
		width: 400px;
		height: 100px;
		background-color: #3b3a3f;
		border-radius: 18px;
		display: flex;
		flex-flow: row;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		color: rgb(249, 242, 253);
		font-size: 1.4rem;
		align-items: center;
		overflow: hidden;
		font-family: 'Montserrat', sans-serif;
		gap: 8px;
		padding-left: 3rem;
	}
	.centered {
		justify-content: center;
		padding: 0 1.5rem;
	}
	a {
		position: absolute;
		right: 0;
		height: 100%;
	}
	img {
		position: absolute;
		right: 0;
		max-height: 100px;
		border-radius: 18px;
	}
</style>
