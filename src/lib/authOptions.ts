import { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET as string,
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: '/signIn',
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token = Object.assign({}, token, {
					access_token: account.access_token,
					refresh_token: account.refresh_token, // store the refresh_token
					expires_in: account.expires_in, // store the expiry time
					token_received_at: Date.now(), // store the time when the token was received
				})
			}

			// check if the token has expired
			if (
				token.expires_in &&
				typeof token.token_received_at === 'number' &&
				Date.now() - token.token_received_at > Number(token.expires_in) * 1000
			) {
				const res = await fetch('https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						grant_type: 'refresh_token',
						refresh_token: token.refresh_token as string, // ensure refresh_token is of type string
						client_id: process.env.CLIENT_ID as string,
						client_secret: process.env.CLIENT_SECRET as string,
					}),
				})

				const data = await res.json()

				if (data.error) {
					console.error(data.error)
				} else {
					token = Object.assign({}, token, {
						access_token: data.access_token,
						expires_in: data.expires_in,
						token_received_at: Date.now(),
					})
				}
			}

			return token
		},
		async session({ session, token }) {
			if (session) {
				session.user = Object.assign({}, session.user, { token: token.access_token })
			}
			return session
		},
	},
}
