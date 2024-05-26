// middleware.ts
import { NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { encode, getToken } from 'next-auth/jwt'

export const config = {
	matcher: ['/', '/categories', '/playlist', '/search', '/artist', '/featured-playlists'],
}

// Utility functions
async function refreshAccessToken(session: any) {
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: session.refresh_token as string,
			client_id: process.env.SPOTIFY_CLIENT_ID as string,
			client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
		}),
	})

	const data = await res.json()

	if (data.error) {
		console.error(data.error)
		return null
	}

	session.access_token = data.access_token
	session.expires_at = data.expires_in ? Date.now() / 1000 + data.expires_in : session.expires_at

	return session
}

function isTokenExpired(token: any) {
	return new Date(Number(token.expires_at) * 1000).getTime() <= Date.now()
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
