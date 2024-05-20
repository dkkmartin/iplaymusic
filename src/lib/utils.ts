import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const imageLoader = ({ src }: { src: string }) => {
	return `${src}`
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const msToTime = (duration: number) => {
	const minutes = Math.floor(duration / 60000)
	const seconds = Number(((duration % 60000) / 1000).toFixed(0))
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
