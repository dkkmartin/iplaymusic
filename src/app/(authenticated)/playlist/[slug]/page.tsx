'use client'

import PageContent from '@/components/pages/pageContent'
import Image from 'next/image'
import { BigPlayButton } from '@/components/svg/bigPlayButton'
import { useCurrentDeviceStore, usePlaybackStore } from '@/lib/stores'
import { BigPauseButton } from '@/components/svg/bigPauseButton'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import {
	handleDeviceChange,
	pausePlayback,
	resumePlayback,
	startNewPlaybackContext,
	startNewPlaybackTrack,
} from '@/lib/spotify/utils'
import NewPlaybackContainer from '@/components/player/newPlaybackContainer'
import { msToTime } from '@/lib/utils'
import { Root, Item } from '@/types/playlist/playlist'

export default function Album({ params }: { params: { slug: string } }) {
	const slug = params.slug
	const { data: session, status } = useSession()
	const playbackState = usePlaybackStore((state) => state?.playbackState)
	const currentDeviceState = useCurrentDeviceStore((state) => state?.currentDevice)
	const [playlistDetails, setPlaylistDetails] = useState<Root | undefined>()

	function handlePause() {
		if (!session?.user.token) return
		pausePlayback(session?.user.token)
	}

	function handlePlay() {
		if (!session?.user.token || !playlistDetails?.uri) return

		const token = session.user.token
		const playlistUri = playlistDetails?.uri

		if (!playbackState) {
			if (!currentDeviceState) return
			handleDeviceChange(currentDeviceState, token)
		}

		if (playbackState?.context?.uri !== playlistUri) {
			startNewPlaybackContext(token, playlistUri, 0)
		} else if (!playbackState?.is_playing) {
			resumePlayback(token)
		} else {
			startNewPlaybackTrack(token, playlistUri)
		}
	}

	const getPlaylistDetails = useCallback(async (): Promise<Root | undefined> => {
		const res = await fetch(`https://api.spotify.com/v1/playlists/${slug}`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}, [slug, session])

	useEffect(() => {
		async function fetchData() {
			const albumData = await getPlaylistDetails()
			setPlaylistDetails(albumData)
		}

		fetchData()
	}, [getPlaylistDetails])

	return (
		playlistDetails && (
			<PageContent>
				<section className="flex flex-col">
					<Image
						className="shadow-2xl self-center"
						src={playlistDetails.images && playlistDetails?.images[0]?.url}
						width={300}
						height={300}
						alt={`${playlistDetails.type} playlist cover`}
					></Image>
					<div className="flex justify-between items-center gap-2 py-4">
						<div className="flex flex-col gap-2 py-4">
							<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight ">
								{playlistDetails?.name}
							</h1>
						</div>
						{playbackState?.context &&
						playbackState?.context.uri === playlistDetails.uri &&
						playbackState?.is_playing ? (
							<BigPauseButton
								onClick={handlePause}
								className="size-24 px-3 dark:bg-[#111625] dark:border-white border-black border-2 rounded-full min-w-[96px]"
							></BigPauseButton>
						) : (
							<BigPlayButton
								onClick={handlePlay}
								className="size-24 pl-3 dark:bg-[#111625] dark:border-white border-black border-2 rounded-full min-w-[96px]"
							></BigPlayButton>
						)}
					</div>
				</section>
				<section>
					<ol className="flex flex-col gap-4">
						{playlistDetails?.tracks?.items?.map((track: Item, index: number) => (
							<NewPlaybackContainer
								key={index}
								token={session?.user.token ?? ''}
								contextUri={playlistDetails?.uri}
								position={index + 1}
							>
								<li className="grid grid-cols-[20px_minmax(100px,300px)_1fr] gap-4 items-center">
									<p className="justify-self-end">{index + 1}</p>
									<div>
										<p className="font-semibold leading-none">{track.track.name}</p>
										<p className="text-sm text-muted-foreground truncate">
											{track.track.artists.map((artist) => artist.name).join(', ')}
										</p>
									</div>
									<p className="text-sm text-muted-foreground justify-self-end">
										{msToTime(track.track.duration_ms)}
									</p>
								</li>
							</NewPlaybackContainer>
						))}
					</ol>
				</section>
			</PageContent>
		)
	)
}
