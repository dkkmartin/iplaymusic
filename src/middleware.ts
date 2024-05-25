// middleware.ts
import { NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { encode, getToken } from 'next-auth/jwt'

// Utility functions
async function refreshAccessToken(token: any) {
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: token.refresh_token as string,
			client_id: process.env.SPOTIFY_CLIENT_ID as string,
			client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
		}),
	})

	const data = await res.json()

	if (data.error) {
		console.error(data.error)
		return null
	}

	token.access_token = data.access_token
	token.expires_at = data.expires_in ? Date.now() / 1000 + data.expires_in : token.expires_at

	return token
}

function isTokenExpired(token: any) {
	return token.expires_at && Date.now() > Number(token.expires_at) * 1000 - 30 * 60 * 1000
}

export const config = {
	matcher: ['/', '/categories', '/playlist', '/search', '/artist', '/featured-playlists'],
}

const sessionCookie = process.env.NEXTAUTH_URL?.startsWith('https://')
	? '__Secure-next-auth.session-token'
	: 'next-auth.session-token'

function signOut(request: NextRequest) {
	const response = NextResponse.redirect(new URL('/api/auth/signin', request.url))

	request.cookies.getAll().forEach((cookie) => {
		if (cookie.name.includes('next-auth')) response.cookies.delete(cookie.name)
	})

	return response
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
	console.log('Executed middleware')

	const session = await getToken({ req: request })

	if (!session) return signOut(request)

	if (isTokenExpired(session)) {
		console.log('Token expired. Refreshing token...')
		const newToken = await refreshAccessToken(session)

		if (!newToken) return signOut(request)

		const newSessionToken = await encode({
			secret: process.env.NEXTAUTH_SECRET || '',
			token: newToken,
			maxAge: 3600,
		})

		const response = NextResponse.next()
		response.cookies.set(sessionCookie, newSessionToken)
		return response
	}

	return NextResponse.next()
}
