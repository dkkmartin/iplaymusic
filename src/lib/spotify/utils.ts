import { usePlaybackStore, useDeviceStore } from '@/lib/stores'
import { Root } from '@/types/spotify/recentlyPlayed'

export const sleep = (milliseconds: number) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const setPlaybackState = usePlaybackStore.getState().setPlaybackState
const setDevicesState = useDeviceStore.getState().setDevicesState

export async function getPlaybackState(token: string) {
	await sleep(1000)
	try {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await response.json()
		console.log('data', data)
		// Set playback state in store
		setPlaybackState(data)
	} catch (error) {
		console.log('Error: ' + error)
	}
}

export async function getDevices(token: string) {
	try {
		const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await response.json()
		// Set devices state in store
		setDevicesState(data)
	} catch (error) {
		console.error('Error:', error)
	}
}

export async function handleDeviceChange(deviceId: string, token: string) {
	try {
		await fetch('https://api.spotify.com/v1/me/player', {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				device_ids: [deviceId],
			}),
		})
		await getPlaybackState(token)
		await getDevices(token)
		return true
	} catch (error) {
		console.error('Error:', error)
		return false
	}
}

export async function getRecentlyPlayed(token: string) {
	try {
		const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error:', error)
	}
}

export async function resumePlayback(token: string) {
	try {
		const recentlyPlayed: Root = await getRecentlyPlayed(token)
		const startTime = usePlaybackStore.getState().playbackState?.progress_ms
		const trackUri = recentlyPlayed.items[0].track.uri

		const response = await fetch('https://api.spotify.com/v1/me/player/play', {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				uris: [trackUri],
				position_ms: startTime,
			}),
		})
		return true
	} catch (error) {
		console.error('Error:', error)
		return false
	}
}
export async function pausePlayback(token: string) {
	try {
		await fetch('https://api.spotify.com/v1/me/player/pause', {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
		await getPlaybackState(token)
		return true
	} catch (error) {
		console.error('Error:', error)
		return false
	}
}

export function startNewPlayback(token: string) {}
