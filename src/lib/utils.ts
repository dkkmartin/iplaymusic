import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function spotifyFetch(url: string, token: string) {
	return fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}
