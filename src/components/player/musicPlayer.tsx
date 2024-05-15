'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, ChevronsLeft, ChevronsRight, Headphones } from 'lucide-react'
import PlaybackChanger from './playbackChanger'
import { usePlaybackStore } from '@/lib/stores'
import {
	getPlaybackState,
	getRecentlyPlayed,
	handleDeviceChange,
	pausePlayback,
	playNextTrack,
	playPreviousTrack,
	resumePlayback,
} from '@/lib/spotify/utils'
import { Root } from '@/types/spotify/recentlyPlayed'
import { Button } from '../ui/button'

export const WebPlayback = ({ token }: { token: string }) => {
	const [isPaused, setPaused] = useState<boolean>(true)
	const [player, setPlayer] = useState<Spotify.Player | null>(null)
	const [recentlyPlayed, setRecentlyPlayed] = useState<Root | null>(null)
	const [deviceId, setDeviceId] = useState<string | null>(null)
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

	async function handleResumePlayback() {
		if (!deviceId) return

		// If current device is the same as the device, resume playback on this device
		if (playbackState?.device.id === deviceId) {
			resumePlayback(token)
			setPaused(false)
		} else if (playbackState?.is_playing) {
			// If a device is playing, resume playback on that device
			resumePlayback(token)
			setPaused(false)
		} else {
			// If no device is playing, change device to this and resume playback
			await handleDeviceChange(deviceId, token)
			resumePlayback(token)
			setPaused(false)
		}
	}

	function handlePausePlayback() {
		pausePlayback(token)
		setPaused(true)
	}

	function handleNextTrack() {
		if (!deviceId) return
		playNextTrack(token, deviceId)
	}

	function handlePreviousTrack() {
		if (!deviceId) return
		playPreviousTrack(token, deviceId)
	}

	useEffect(() => {
		if (isPaused) console.log('paused')
		if (!isPaused) console.log('playing')
	}, [isPaused])

	// useEffect for watching the is_playing value
	// This will get the playback state of any device playing for the first render
	// If is_playing is true,
	// the playbutton will be set to the paused icon as in to pause the player
	useEffect(() => {
		if (playbackState?.is_playing) setPaused(false)
		if (!playbackState?.is_playing) setPaused(true)
	}, [playbackState?.is_playing])

	// useEffects for polling the playback state once and then every 5 seconds
	useEffect(() => {
		getPlaybackState(token)
	}, [token])

	// useEffect for handling polling time
	// If response is 204 the polling will switch to a polling time of 4000ms
	// If response is 200 the polling will switch to a polling time of 2000ms
	// If response is 429 the polling will stop as it has exceeded its rate limits
	// This is to decrease the number of requests to the server if there is not playback
	useEffect(() => {
		const pollPlaybackState = async () => {
			try {
				const res = await getPlaybackState(token)
				if (res === 204) {
					if (intervalIdRef.current) {
						clearInterval(intervalIdRef.current)
					}
					intervalIdRef.current = setInterval(pollPlaybackState, 4000)
					console.warn('Polling slowed: playback state is not available or active')
				} else if (res === 429) {
					console.warn('Polling stopped: Polling rate limit exceeded')
					if (intervalIdRef.current) {
						clearInterval(intervalIdRef.current)
					}
				} else if (res === 200) {
					if (intervalIdRef.current) {
						clearInterval(intervalIdRef.current)
					}
					intervalIdRef.current = setInterval(pollPlaybackState, 2000)
				}
			} catch (error) {
				console.error('Error getting playback state:', error)
			}
		}

		intervalIdRef.current = setInterval(pollPlaybackState, 2000)

		return () => {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current)
			}
		}
	}, [token, isPaused])

	// useEffect for getting recently played information in the player
	useEffect(() => {
		async function updateRecentlyPlayed() {
			if (!playbackState) {
				const recentlyPlayed = await getRecentlyPlayed(token)
				setRecentlyPlayed(recentlyPlayed)
			}
		}
		updateRecentlyPlayed()
	}, [token, playbackState])

	// useEffect for handling music streaming and device creation
	useEffect(() => {
		if (document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) return

		const script = document.createElement('script')
		script.src = 'https://sdk.scdn.co/spotify-player.js'
		script.async = true

		document.body.appendChild(script)

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: 'iPlayMusic web player',
				getOAuthToken: (cb) => {
					cb(token)
				},
				volume: 0.5,
			})

			setPlayer(player)

			player.addListener('ready', ({ device_id }) => {
				setDeviceId(device_id)
				console.log('Ready with Device ID', device_id)
			})

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id)
			})

			player.setName('iPlayMusic web player')

			player.connect()

			return () => {
				player.disconnect()
			}
		}
	}, [token])

	if (!player) {
		return null
	} else if (playbackState || recentlyPlayed) {
		return (
			<>
				<section className="dark:bg-[#111625] bg-background p-2 flex gap-2 border-b border-t">
					{playbackState ? (
						<Image
							width={50}
							height={50}
							src={playbackState?.item?.album?.images[2].url}
							className="rounded"
							alt={`${playbackState.item.name} ${playbackState.item.type} cover`}
						/>
					) : recentlyPlayed ? (
						<Image
							width={50}
							height={50}
							src={recentlyPlayed?.items[0].track.album.images[2].url ?? ''}
							className="rounded"
							alt={`${recentlyPlayed?.items[0].track.name} ${recentlyPlayed?.items[0].track.type} cover`}
						/>
					) : null}

					<div className="flex flex-col overflow-hidden justify-center">
						{playbackState ? (
							<Marquee speed={30} className="shadow-inner">
								<div className="flex gap-2">
									<p className="font-bold">{playbackState.item.name}</p>
									<span>&#9679;</span>
									<p className="font-bold">{playbackState.item.artists[0].name}</p>
								</div>
								<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</Marquee>
						) : (
							<Marquee speed={30} className="shadow-inner">
								<div className="flex gap-2">
									<p className="font-bold">{recentlyPlayed?.items[0].track.name}</p>
									<span>&#9679;</span>
									<p className="font-bold">{recentlyPlayed?.items[0].track.artists[0].name}</p>
								</div>
								<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</Marquee>
						)}
						{playbackState ? (
							<div className="flex gap-1 items-center">
								<Headphones className="size-3 text-green-600"></Headphones>
								<p className="text-sm text-green-600">{playbackState.device.name}</p>
							</div>
						) : null}
					</div>
					<div className="now-playing__side flex gap-2 items-center">
						<PlaybackChanger
							className={playbackState?.device.id === deviceId ? 'text-green-600' : ''}
						></PlaybackChanger>
						{playbackState?.device.id === deviceId ? (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									player.previousTrack()
								}}
							>
								<ChevronsLeft></ChevronsLeft>
							</Button>
						) : (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									handlePreviousTrack()
								}}
							>
								<ChevronsLeft></ChevronsLeft>
							</Button>
						)}

						{isPaused ? (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									handleResumePlayback()
								}}
							>
								<Play></Play>
							</Button>
						) : (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									handlePausePlayback()
								}}
							>
								<Pause></Pause>
							</Button>
						)}
						{playbackState?.device.id === deviceId ? (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									player.nextTrack()
								}}
							>
								<ChevronsRight></ChevronsRight>
							</Button>
						) : (
							<Button
								size={'icon'}
								variant={'ghost'}
								className="btn-spotify"
								onClick={() => {
									handleNextTrack()
								}}
							>
								<ChevronsRight></ChevronsRight>
							</Button>
						)}
					</div>
				</section>
			</>
		)
	}
}
