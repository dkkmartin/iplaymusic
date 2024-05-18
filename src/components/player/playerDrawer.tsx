'use client'

import React, { useEffect, useState } from 'react'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '../ui/button'
import { SkipBack, SkipForward, ChevronDown, Headphones, FastForward, Rewind } from 'lucide-react'
import { BigPlayButton } from '../svg/bigPlayButton'
import { usePlaybackStore } from '@/lib/stores'
import Image from 'next/image'
import PageContent from '../pages/pageContent'
import { getAudioAnalysis, playbackSeeker } from '@/lib/spotify/utils'
import { BigPauseButton } from '../svg/bigPauseButton'
import PlayerSeeker from './playerSeeker'
import { Root as Analysis } from '@/types/spotify/analysis'
import PlaybackChanger from './playbackChanger'
import { Root as RecentlyPlayed } from '@/types/spotify/recentlyPlayed'

export default function PlayerDrawer({
	children,
	className,
	token,
	deviceId,
	player,
	isPaused,
	setPaused,
	recentlyPlayed,
	handleResumePlayback,
	handlePausePlayback,
	handleNextTrack,
	handlePreviousTrack,
}: {
	children: React.ReactNode
	className?: string
	token: string
	deviceId?: string
	player: Spotify.Player
	isPaused: boolean
	setPaused: (newState: boolean) => void
	recentlyPlayed?: RecentlyPlayed | undefined
	handleResumePlayback: () => void
	handlePausePlayback: () => void
	handleNextTrack: () => void
	handlePreviousTrack: () => void
}) {
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const [artistImageSrc, setArtistImageSrc] = useState<string>('')
	const [currentSongId, setCurrentSongId] = useState<string>('')
	const [audioAnalysis, setAudioAnalysis] = useState<Analysis | undefined>()

	function handleFastForward() {
		const currentTime = playbackState?.progress_ms ?? 0
		const duration = playbackState?.item?.duration_ms ?? 0
		const newTime = currentTime + 10000
		if (newTime > duration) return
		playbackSeeker(token, newTime)
	}

	function handleRewind() {
		const currentTime = playbackState?.progress_ms ?? 0
		const newTime = currentTime - 10000
		if (newTime < 0) return
		playbackSeeker(token, newTime)
	}

	// For getting audio analysis
	// useEffect(() => {
	// 	async function getAnalysis() {
	// 		if (!playbackState?.item?.id) return
	// 		if (playbackState?.item && playbackState?.item?.id !== currentSongId) {
	// 			const data = await getAudioAnalysis(token, playbackState?.item?.id)
	// 			setAudioAnalysis(data)
	// 		}
	// 	}
	// 	getAnalysis()
	// }, [currentSongId, token, playbackState])

	useEffect(() => {
		async function getArtistImage(artistId: string) {
			const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()
			setArtistImageSrc(data.images[0].url)
		}

		if (playbackState?.item && playbackState?.item?.id !== currentSongId) {
			getArtistImage(playbackState.item.artists[0].id)
			setCurrentSongId(playbackState.item.id)
		}
	}, [playbackState, token, artistImageSrc, currentSongId, recentlyPlayed])

	return (
		<Drawer>
			<DrawerTrigger className={className}>{children}</DrawerTrigger>
			<DrawerContent
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)), url(${
						recentlyPlayed?.items[0]?.track?.album?.images[0]?.url ??
						playbackState?.item?.album?.images[0].url
					})`,
				}}
				className="h-screen rounded-none bg bg-cover bg-center bg-no-repeat text-white"
			>
				<DrawerHeader className="grid grid-cols-3 w-11/12 mx-auto">
					<DrawerClose className="justify-self-start">
						<Button variant="ghost" size={'icon'}>
							<ChevronDown className="size-10"></ChevronDown>
						</Button>
					</DrawerClose>
					<DrawerTitle className="font-light text-lg uppercase">Playing</DrawerTitle>
				</DrawerHeader>
				<PageContent className="mb-0 flex flex-col justify-around h-full">
					<section className="w-full flex justify-center">
						{playbackState && (
							<Image
								src={artistImageSrc}
								width={200}
								height={200}
								className="rounded-full object-cover max-h-[200px] shadow-xl"
								alt={`${playbackState?.item?.artists[0]?.name} ${playbackState?.item?.artists[0]?.type} cover`}
							></Image>
						)}
					</section>
					{playbackState ? (
						<section className="flex flex-col justify-center items-center text-center">
							<h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-tight first:mt-0">
								{playbackState?.item?.name}
							</h2>
							<h3 className="scroll-m-20 text-xl font-light tracking-tight">
								{playbackState?.item?.artists[0]?.name}
							</h3>
						</section>
					) : recentlyPlayed ? (
						<section className="flex flex-col justify-center items-center text-center">
							<h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-tight first:mt-0">
								{recentlyPlayed?.items[0].track.name}
							</h2>
							<h3 className="scroll-m-20 text-xl font-light tracking-tight">
								{recentlyPlayed?.items[0].track.artists[0]?.name}
							</h3>
						</section>
					) : null}

					<section>
						<PlayerSeeker token={token}></PlayerSeeker>
					</section>
				</PageContent>
				<section className="flex px-6 gap-2 items-center">
					<PlaybackChanger
						className={playbackState?.device.id === deviceId ? 'text-green-600' : ''}
					></PlaybackChanger>
					{playbackState ? (
						<div className="flex gap-1 items-center">
							<Headphones className="size-3 text-green-600"></Headphones>
							<p className="text-sm text-green-600">{playbackState.device.name}</p>
						</div>
					) : null}
				</section>

				<DrawerFooter className="flex-row gap-4 justify-center items-center">
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
					<Button onClick={handleRewind} variant="ghost" size={'icon'}>
						<Rewind className="size-8"></Rewind>
					</Button>

					{isPaused ? (
						<Button
							className="size-32"
							size={'icon'}
							variant={'ghost'}
							onClick={() => {
								handleResumePlayback()
							}}
						>
							<BigPlayButton className="size-32"></BigPlayButton>
						</Button>
					) : (
						<Button
							className="size-32"
							size={'icon'}
							variant={'ghost'}
							onClick={() => {
								handlePausePlayback()
							}}
						>
							<BigPauseButton className="size-32"></BigPauseButton>
						</Button>
					)}
					<Button onClick={handleFastForward} variant="ghost" size={'icon'}>
						<FastForward className="size-8"></FastForward>
					</Button>
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
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
