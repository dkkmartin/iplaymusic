import { usePlaybackStore, useDeviceStore } from '@/lib/stores'
import { Root } from '@/types/player/recentlyPlayed'

const setPlaybackState = usePlaybackStore.getState().setPlaybackState
const setDevicesState = useDeviceStore.getState().setDevicesState

export async function getPlaybackState(token: string) {
	try {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.status === 204) {
			return response.status
		} else if (response.status === 429) {
			return response.status
		} else {
			const data = await response.json()
			// Set playback state in store
			setPlaybackState(data)
			return response.status
		}
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
		console.error('Error: ', error)
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
		getDevices(token)
	} catch (error) {
		console.error('Error: ', error)
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
		console.error('Error: ', error)
	}
}

export async function resumePlaybackRecentlyPlayed(token: string, deviceId: string) {
	try {
		const recentlyPlayed: Root = await getRecentlyPlayed(token)
		const startTime = usePlaybackStore.getState().playbackState?.progress_ms
		const trackUri = recentlyPlayed.items[0].track.uri

		await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
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
	} catch (error) {
		console.error('Error: ', error)
	}
}

export async function resumePlayback(token: string) {
	try {
		await fetch('https://api.spotify.com/v1/me/player/play', {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error: ', error)
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
	} catch (error) {
		console.error('Error: ', error)
	}
}

export function startNewPlayback(token: string) {}

export async function playNextTrack(token: string) {
	try {
		await fetch('https://api.spotify.com/v1/me/player/next', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.log('Error: ' + error)
	}
}

export async function playPreviousTrack(token: string) {
	try {
		await fetch('https://api.spotify.com/v1/me/player/previous', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.log('Error: ' + error)
	}
}

export async function togglePlaybackShuffle(token: string, bool: boolean) {
	try {
		await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${bool}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.log('Error: ' + error)
	}
}

export async function playbackSeeker(token: string, position: number) {
	try {
		await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.log('Error: ' + error)
	}
}

export async function getAudioAnalysis(token: string, trackId: string) {
	try {
		const response = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error: ', error)
	}
}
