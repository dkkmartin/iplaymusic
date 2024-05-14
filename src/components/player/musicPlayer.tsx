'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, ChevronsLeft, ChevronsRight, Headphones, Smartphone, Tv2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { SpotfiyPlayback } from '../svg/spotifyPlayback'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Device, Root } from '@/types/player/devices'

export const WebPlayback = ({ token }: { token: string }) => {
	const [is_paused, setPaused] = useState<boolean>(false)
	const [player, setPlayer] = useState<Spotify.Player | null>(null)
	const [playerDevices, setPlayerDevices] = useState<Root | undefined>(undefined)
	const [current_track, setTrack] = useState<Spotify.Track | null>(null)
	const { data: session, status } = useSession()

	const sleep = (milliseconds: number) => {
		return new Promise((resolve) => setTimeout(resolve, milliseconds))
	}

	async function handleDeviceChange(deviceId: string) {
		try {
			const response = await fetch('https://api.spotify.com/v1/me/player', {
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + session?.user.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					device_ids: [deviceId],
				}),
			})

			const data = await response.json()

			getDevices()
			return data
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const getDevices = useCallback(async () => {
		try {
			const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + session?.user.token,
				},
			})
			const data = await response.json()
			setPlayerDevices(data)
		} catch (error) {
			console.error('Error:', error)
		}
	}, [session?.user.token])

	useEffect(() => {
		if (session?.user?.token) {
			getDevices()
		}
	}, [session?.user?.token, getDevices])

	useEffect(() => {
		if (document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) return

		const script = document.createElement('script')
		script.src = 'https://sdk.scdn.co/spotify-player.js'
		script.async = true

		document.body.appendChild(script)

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: (cb) => {
					cb(token)
				},
				volume: 0.5,
			})

			setPlayer(player)

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id)
			})

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id)
			})

			player.setName('iPlayMusic web player')

			player.addListener('player_state_changed', (state) => {
				if (!state) {
					return
				}

				setTrack(state.track_window.current_track)
				setPaused(state.paused)
			})

			player.connect()

			return () => {
				player.disconnect()
			}
		}
	}, [token, session?.user.token])

	if (!player) {
		return (
			<>
				<div className="container">
					<div className="main-wrapper">
						<b>Spotify Player is null</b>
					</div>
				</div>
			</>
		)
	} else {
		return (
			<>
				<section className="dark:bg-[#111625] p-2 flex gap-2 border-b border-t">
					{current_track && current_track.album.images[0].url ? (
						<Image
							width={50}
							height={50}
							src={current_track.album.images[0].url}
							className="rounded"
							alt=""
						/>
					) : null}
					<div className="flex flex-col overflow-hidden justify-center">
						<Marquee speed={30} className="shadow-inner">
							<div className="flex gap-2">
								<p className="font-bold">{current_track?.name}</p>
								<span>&#9679;</span>
								<p className="font-bold">{current_track?.artists[0].name}</p>
							</div>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</Marquee>
						{playerDevices?.devices?.find((device) => device.is_active) ? (
							<div className="flex gap-1 items-center">
								<Headphones className="size-3 text-green-600"></Headphones>
								<p className="text-sm text-green-600">
									{playerDevices?.devices?.find((device) => device.is_active)?.name}
								</p>
							</div>
						) : null}
					</div>
					<div className="now-playing__side flex gap-2 items-center">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<SpotfiyPlayback className="size-5 text-green-600"></SpotfiyPlayback>
							</DropdownMenuTrigger>
							<DropdownMenuContent onFocus={getDevices} className="dark:bg-[#111625]">
								<DropdownMenuLabel className="text-center">Devices</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{playerDevices &&
									playerDevices?.devices?.map((device: Device) => (
										<DropdownMenuItem
											className={`flex gap-1 ${device.is_active ? 'text-green-600' : ''}`}
											onClick={() => {
												handleDeviceChange(device.id)
												sleep(1000).then(() => {
													getDevices()
												})
											}}
											key={device.id}
										>
											{device.type === 'Smartphone' ? (
												<Smartphone
													className={`size-4 ${device.is_active ? 'text-green-600' : ''}`}
												></Smartphone>
											) : device.type === 'Computer' ? (
												<Tv2 className={`size-4 ${device.is_active ? 'text-green-600' : ''}`}></Tv2>
											) : (
												<Headphones className="size-3 text-green-600"></Headphones>
											)}
											{device.name}
										</DropdownMenuItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>

						<button
							className="btn-spotify"
							onClick={() => {
								player.previousTrack()
							}}
						>
							<ChevronsLeft></ChevronsLeft>
						</button>
						<button
							className="btn-spotify"
							onClick={() => {
								player.togglePlay()
							}}
						>
							{is_paused ? <Play></Play> : <Pause></Pause>}
						</button>

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
