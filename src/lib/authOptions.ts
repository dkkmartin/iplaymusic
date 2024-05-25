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
			return token
		},
		async session({ session, token }) {
			if (session) {
				session.user = {
					...session.user,
					token: token.access_token as string,
					expires_at: token.expires_at as number,
				}
			}
			return session
		},
	},
}
