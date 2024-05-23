import { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET as string,
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			authorization: {
				params: {
					scope:
						'streaming user-read-playback-state user-read-email user-modify-playback-state user-read-recently-played user-read-currently-playing',
				},
			},
		}),
	],
	pages: {
		signIn: '/signIn',
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				// Save the access token and refresh token in the JWT on the initial login, as well as the user details
				return {
					access_token: account.access_token,
					expires_at: account.expires_at,
					refresh_token: account.refresh_token,
					user: token,
				}
			} else if (Date.now() < token.expires_at * 1000) {
				// If the access token has not expired yet, return it
				return token
			} else {
				if (!token.refresh_token) throw new Error('Missing refresh token')

				// If the access token has expired, try to refresh it
				try {
					// We need the `token_endpoint`.
					const response = await fetch('https://accounts.spotify.com/api/token', {
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body: new URLSearchParams({
							client_id: process.env.SPOTIFY_CLIENT_ID!,
							client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
							grant_type: 'refresh_token',
							refresh_token: token.refresh_token,
						}),
						method: 'POST',
					})

					const tokens = await response.json()

					if (!response.ok) throw tokens

					return {
						...token, // Keep the previous token properties
						access_token: tokens.access_token,
						expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
						// Fall back to old refresh token, but note that
						// many providers may only allow using a refresh token once.
						refresh_token: tokens.refresh_token ?? token.refresh_token,
					}
				} catch (error) {
					console.error('Error refreshing access token', error)
					// The error property will be used client-side to handle the refresh token error
					return { ...token, error: 'RefreshAccessTokenError' as const }
				}
			}
		},
		async session({ session, token }) {
			session.error = token.error
			return {
				...session,
				...token,
			}
		},
	},
}
