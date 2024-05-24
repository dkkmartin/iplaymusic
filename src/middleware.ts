import { NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { encode, getToken } from 'next-auth/jwt'

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

function shouldUpdateToken(token: string) {
	// Check the token expiration date or whatever logic you need
	return true
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
	console.log('Executed middleware')

	const session = await getToken({ req: request })

	if (!session) return signOut(request)

	const response = NextResponse.next()

	if (shouldUpdateToken(session.accessToken as string)) {
		// Here yoy retrieve the new access token from your custom backend
		const newAccessToken = 'Session updated server side!!'

		const newSessionToken = await encode({
			secret: process.env.NEXTAUTH_SECRET || '',
			token: {
				...session,
				accessToken: newAccessToken,
			},
			maxAge: 30 * 24 * 60 * 60, // 30 days, or get the previous token's exp
		})

		// Update session token with new access token
		response.cookies.set(sessionCookie, newSessionToken)
	}

	return response
}
