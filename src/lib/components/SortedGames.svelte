<script lang="ts">
	// @ts-nocheck
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { sortedGameStore } from '../../store/games';
	import GameCard from './GameCard.svelte';

	interface Event {
		preventDefault: any;
		target: { dataset: { index: any }; parentNode: any };
		dataTransfer: { getData: any; setData: (arg0: string, arg1: any) => void };
	}

	let isOver = false;
	// TODO - Explore the capabilities of adding touch to this
	const getDraggedParent = (node: { dataset: { index: any }; parentNode: any }) =>
		node.dataset && node.dataset.index ? node.dataset : getDraggedParent(node.parentNode);
	const start = (ev: Event) => {
		let dragged = getDraggedParent(ev.target);
		ev.dataTransfer.setData('source', dragged.index);
	};
	const over = (ev: Event) => {
		ev.preventDefault();
		let dragged = getDraggedParent(ev.target);
		console.log(dragged);
		if (isOver !== dragged.index) isOver = JSON.parse(dragged.index);
	};
	const leave = (ev: Event) => {
		let dragged = getDraggedParent(ev.target);
		if (isOver === dragged.index) isOver = false;
	};
	const drop = (ev: Event) => {
		isOver = false;
		ev.preventDefault();
		let dragged = getDraggedParent(ev.target);
		let from = ev.dataTransfer.getData('source');
		let to = dragged.index;
		reorder({ from, to });
	};
	const reorder = ({ from, to }) => {
		let newList = $sortedGameStore;
		newList[from] = [newList[to], (newList[to] = newList[from])][0];
		sortedGameStore.set(newList);
	};
</script>

{#each $sortedGameStore as game, index (game.name)}
	<div
		class="chapter-draggable-container"
		on:dragover={over}
		on:dragleave={leave}
		on:drop={drop}
		animate:flip={{ duration: 500 }}
		data-index={index}
		class:over={index === isOver}
	>
		<h1 class="number">{index + 1}</h1>
		<div
			draggable={true}
			on:dragstart={start}
			on:dragover={over}
			on:dragleave={leave}
			on:drop={drop}
			transition:fly={{ x: 40, duration: 500 }}
			class="dots-container"
		>
			<svg
				transition:fade={{ duration: 150 }}
				xmlns="http://www.w3.org/2000/svg"
				class="dots"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1}
					d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
				/>
			</svg>
		</div>
		<GameCard {game} />
	</div>
{/each}

<style>
	.number {
		color: white;
		position: absolute;
		left: -2rem;
	}
	.chapter-draggable-container {
		position: relative;
		display: flex;
		align-items: center;
	}
	.over {
		margin-left: 1rem;
		filter: brightness(70%);
	}
	.dots-container {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.dots {
		fill: hsl(180, 19%, 20%);
		stroke: hsl(180, 19%, 20%);
		stroke-width: 2px;
		height: 2.5rem;
		cursor: pointer;
		z-index: 1;
	}
	.dots:hover {
		filter: brightness(150%);
	}
</style>
