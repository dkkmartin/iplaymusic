export { default } from 'next-auth/middleware'

export const config = { matcher: ['/', '/categories', '/playlist', '/search', '/artist'] }
