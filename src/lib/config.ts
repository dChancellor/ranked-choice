const config = {
	port: 5174,
	host: import.meta.env.VITE_HOST,
	db: {
		url: import.meta.env.VITE_SUPABASE_URL,
		key: import.meta.env.VITE_SUPABASE_ANON_KEY
	},
	oauth: {
		discord: {
			clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
			clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
			redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
			oauth_url: import.meta.env.VITE_DISCORD_OAUTH_URL
		}
	}
};

export default config;
