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
						'streaming user-top-read user-read-playback-state user-read-email user-modify-playback-state user-read-recently-played user-read-currently-playing',
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
				return {
					...token,
					access_token: account.access_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at,
				}
			}
			return token
		},
		async session({ session, token }) {
			if (session) {
				session.user = {
					...session.user,
					token: token.access_token as string,
					refresh_token: token.refresh_token as string,
					expires_at: token.expires_at as number,
				}
			}
			return session
		},
	},
}
