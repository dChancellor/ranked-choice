interface User {
	id?: string;
	username?: string;
	discriminator?: string;
	avatar?: string;
	verified?: true;
	flags?: number;
	banner?: string;
	accent_color?: number;
	premium_type?: number;
	public_flags?: number;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: User;
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface Session {
		user: User;
	}
	// interface Stuff {}
}
