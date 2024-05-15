'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Play, Pause, ChevronsLeft, ChevronsRight, Headphones } from 'lucide-react'
import { useSession } from 'next-auth/react'
import PlaybackChanger from './playbackChanger'
import { usePlaybackStore } from '@/lib/stores'
import {
	getRecentlyPlayed,
	handleDeviceChange,
	pausePlayback,
	resumePlayback,
	sleep,
} from '@/lib/spotify/utils'
import { Root } from '@/types/spotify/recentlyPlayed'
import { Button } from '../ui/button'

export const WebPlayback = ({ token }: { token: string }) => {
	const [isPaused, setPaused] = useState<boolean>(true)
	const [player, setPlayer] = useState<Spotify.Player | null>(null)
	const [recentlyPlayed, setRecentlyPlayed] = useState<Root | null>(null)
	const [deviceId, setDeviceId] = useState<string | null>(null)
	const { data: session, status } = useSession()
	const playbackState = usePlaybackStore((state) => state.playbackState)

	async function handleResumePlayback() {
		if (!isPaused) return
		if (!deviceId) return
		if (!session?.user.token) return

		// If current device is the same as the device we want to resume playback on, resume playback
		if (playbackState?.device.id === deviceId) {
			setPaused(false)
			resumePlayback(session?.user.token)
		} else {
			// If current device is not the same as the device we want to resume playback on, change device
			await handleDeviceChange(deviceId, session?.user.token)
			setPaused(false)
			resumePlayback(session?.user.token)
		}
	}

	async function handlePausePlayback() {
		if (isPaused) return
		if (!deviceId) return
		if (!session?.user.token) return

		setPaused(true)
		await pausePlayback(session?.user.token)
	}

	useEffect(() => {
		async function updateRecentlyPlayed() {
			if (status !== 'authenticated') return
			if (!playbackState) {
				const recentlyPlayed = await getRecentlyPlayed(session?.user?.token ?? '')
				setRecentlyPlayed(recentlyPlayed)
			}
		}
		updateRecentlyPlayed()
	}, [session?.user?.token, status, playbackState])

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
	}, [token, session?.user.token])

	if (!player) {
		return null
	} else if (playbackState || recentlyPlayed) {
		return (
			<>
				<section className="dark:bg-[#111625] bg-background p-2 flex gap-2 border-b border-t">
					{playbackState && playbackState?.is_playing ? (
						<Image
							width={50}
							height={50}
							src={playbackState.item.album.images[2].url}
							className="rounded"
							alt={`${playbackState.item.name} ${playbackState.item.type} cover`}
						/>
					) : (
						recentlyPlayed && (
							<Image
								width={50}
								height={50}
								src={recentlyPlayed?.items[0].track.album.images[2].url ?? ''}
								className="rounded"
								alt={`${recentlyPlayed?.items[0].track.name} ${recentlyPlayed?.items[0].track.type} cover`}
							/>
						)
					)}
					<div className="flex flex-col overflow-hidden justify-center">
						{playbackState && playbackState?.is_playing ? (
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
						{playbackState && playbackState?.is_playing ? (
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

						<button
							className="btn-spotify"
							onClick={() => {
								player.previousTrack()
							}}
						>
							<ChevronsLeft></ChevronsLeft>
						</button>
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

						<button
							className="btn-spotify"
							onClick={() => {
								player.nextTrack()
							}}
						>
							<ChevronsRight></ChevronsRight>
						</button>
					</div>
				</section>
			</>
		)
	}
}
