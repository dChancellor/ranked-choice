export interface Game {
	id: number;
	created_at: string;
	name: string;
	steam_id: string;
	picture: string;
}

export interface Rankings {
	created_at: string;
	id: number;
	ordered_games: string[];
	user: string;
}
