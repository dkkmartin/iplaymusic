'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Headphones, SkipForward, SkipBack } from 'lucide-react'
import PlaybackChanger from './playbackChanger'
import PlayerDrawer from './playerDrawer'
import { usePlaybackStore } from '@/lib/stores'
import {
	getPlaybackState,
	getRecentlyPlayed,
	handleDeviceChange,
	pausePlayback,
	playNextTrack,
	playPreviousTrack,
	resumePlaybackRecentlyPlayed,
	resumePlayback,
	togglePlaybackShuffle,
} from '@/lib/spotify/utils'
import { Root } from '@/types/player/recentlyPlayed'
import { Button } from '../ui/button'

export const WebPlayback = ({ token }: { token: string }) => {
	const [isPaused, setPaused] = useState<boolean>(true)
	const [player, setPlayer] = useState<Spotify.Player | null>(null)
	const [recentlyPlayed, setRecentlyPlayed] = useState<Root | null>(null)
	const [deviceId, setDeviceId] = useState<string | null>(null)
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

	async function handleResumePlayback() {
		// If current device is the same as this device, resume playback on this device
		if (playbackState?.device.id === deviceId) {
			resumePlayback(token)
			setPaused(false)
		} else if (playbackState && playbackState?.device.id !== deviceId) {
			// If player is another device, resume playback on that device
			resumePlayback(token)
			setPaused(false)
		} else {
			// If no device is playing, change device to this and resume playback from last played track
			await handleDeviceChange(deviceId!, token)
			resumePlaybackRecentlyPlayed(token, deviceId!)
			setPaused(false)
		}
	}

	function handlePausePlayback() {
		pausePlayback(token)
		setPaused(true)
	}

	function handleNextTrack() {
		if (!deviceId) return
		playNextTrack(token)
	}

	function handlePreviousTrack() {
		if (!deviceId) return
		playPreviousTrack(token)
	}

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
					intervalIdRef.current = setInterval(pollPlaybackState, 1000)
				}
			} catch (error) {
				console.error('Error getting playback state:', error)
			}
		}

		intervalIdRef.current = setInterval(pollPlaybackState, 1000)

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
		// To not make duplicate scripts
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
				<section className="p-2 flex gap-2 border-b border-t">
					<PlayerDrawer
						handleResumePlayback={handleResumePlayback}
						handlePausePlayback={handlePausePlayback}
						handleNextTrack={handleNextTrack}
						handlePreviousTrack={handlePreviousTrack}
						recentlyPlayed={recentlyPlayed ?? undefined}
						isPaused={isPaused}
						player={player}
						deviceId={deviceId ?? ''}
						token={token}
						className="flex gap-2"
					>
						{playbackState ? (
							<Image
								width={50}
								height={50}
								src={playbackState?.item?.album?.images[2].url}
								className="rounded"
								alt={`${playbackState?.item?.name} ${playbackState?.item?.type} cover`}
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

						<div className="flex flex-col overflow-hidden max-w-[250px] justify-center">
							{playbackState ? (
								<Marquee speed={30}>
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
					</PlayerDrawer>

					<div className="flex gap-2 items-center">
						<PlaybackChanger
							className={playbackState?.device.id === deviceId ? 'text-green-600' : ''}
						></PlaybackChanger>
						{playbackState?.device.id === deviceId ? (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									player.previousTrack()
								}}
							>
								<SkipBack></SkipBack>
							</Button>
						) : (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									handlePreviousTrack()
								}}
							>
								<SkipBack></SkipBack>
							</Button>
						)}

						{isPaused ? (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									handleResumePlayback()
								}}
							>
								<Play></Play>
							</Button>
						) : (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									handlePausePlayback()
								}}
							>
								<Pause></Pause>
							</Button>
						)}
						{playbackState?.device.id === deviceId ? (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									player.nextTrack()
								}}
							>
								<SkipForward></SkipForward>
							</Button>
						) : (
							<Button
								className="w-6"
								size={'icon'}
								variant={'ghost'}
								onClick={() => {
									handleNextTrack()
								}}
							>
								<SkipForward></SkipForward>
							</Button>
						)}
					</div>
				</section>
			</>
		)
	}
}
