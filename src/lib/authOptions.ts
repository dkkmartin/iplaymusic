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
				token = Object.assign({}, token, { access_token: account.access_token })
			}
			return token
		},
		async session({ session, token }) {
			if (session) {
				session = Object.assign({}, session, { access_token: token.access_token })
				console.log(session)
			}
			return session
		},
	},
}
