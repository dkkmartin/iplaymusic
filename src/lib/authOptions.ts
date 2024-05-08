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
}
