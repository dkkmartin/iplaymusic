'use client'

import PageContent from '@/components/pages/pageContent'
import { Root as AlbumDetails, Item } from '@/types/album/album'
import Image from 'next/image'
import { Root as ArtistDetails } from '@/types/artist/details'
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
import { msToTime, sleep } from '@/lib/utils'
import Link from 'next/link'

export default function Album({ params }: { params: { slug: string } }) {
	const slug = params.slug
	const { data: session, status } = useSession()
	const playbackState = usePlaybackStore((state) => state?.playbackState)
	const currentDeviceState = useCurrentDeviceStore((state) => state?.currentDevice)
	const [albumDetails, setAlbumDetails] = useState<AlbumDetails | undefined>()
	const [artistDetails, setArtistDetails] = useState<ArtistDetails | undefined>()

	function handlePause() {
		if (!session?.user.token) return
		pausePlayback(session?.user.token)
	}

	function handlePlay() {
		if (!session?.user.token || !albumDetails?.uri) return

		const token = session.user.token
		const albumUri = albumDetails.uri

		if (!playbackState) {
			if (!currentDeviceState) return
			handleDeviceChange(currentDeviceState, token)
		}

		if (playbackState?.context?.uri !== albumUri) {
			startNewPlaybackContext(token, albumUri, 0)
		} else if (!playbackState?.is_playing) {
			resumePlayback(token)
		} else {
			startNewPlaybackTrack(token, albumUri)
		}
	}

	const getAlbumDetails = useCallback(async (): Promise<AlbumDetails | undefined> => {
		const res = await fetch(`https://api.spotify.com/v1/albums/${slug}`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}, [slug, session])

	const getArtistDetails = useCallback(
		async (id: string): Promise<ArtistDetails | undefined> => {
			const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
				headers: {
					Authorization: `Bearer ${session?.user.token}`,
				},
			})
			const data = await res.json()
			return data
		},
		[session]
	)

	useEffect(() => {
		async function fetchData() {
			const albumData = await getAlbumDetails()
			setAlbumDetails(albumData)

			if (albumData?.artists) {
				const artistData = await getArtistDetails(albumData.artists[0].id)
				setArtistDetails(artistData)
			}
		}

		fetchData()
	}, [getAlbumDetails, getArtistDetails])

	return (
		artistDetails &&
		albumDetails && (
			<PageContent>
				<section className="flex flex-col">
					<Image
						className="shadow-2xl self-center"
						src={albumDetails.images && albumDetails?.images[0]?.url}
						width={300}
						height={300}
						alt={`${albumDetails.name} album cover`}
					></Image>
					<div className="flex justify-between items-center gap-2">
						<div className="flex flex-col gap-2 py-4">
							<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight ">
								{albumDetails?.name}
							</h1>
							<div className="flex flex-col gap-2">
								<Link href={`/artist/${artistDetails.id}`}>
									<div className="flex gap-2 items-center">
										<Image
											className="rounded-full object-cover h-[30px] w-[30px]"
											src={artistDetails.images && artistDetails?.images[2]?.url}
											width={30}
											height={30}
											alt={`${albumDetails.name} album cover`}
										/>
										<p className="text-sm font-semibold leading-none">{artistDetails?.name}</p>
									</div>
								</Link>
								<div className="flex gap-2 items-center">
									<p className="text-sm text-muted-foreground capitalize">
										{albumDetails?.album_type}
									</p>
									<span className="text-muted-foreground">&#9679;</span>
									<p className="text-sm text-muted-foreground">
										{albumDetails?.release_date.slice(0, 4)}
									</p>
								</div>
							</div>
						</div>
						{playbackState?.context &&
						playbackState?.context.uri === albumDetails.uri &&
						playbackState?.is_playing ? (
							<BigPauseButton
								onClick={handlePause}
								className="size-24 px-3 dark:bg-[#111625] dark:border-white border-black border-2 rounded-full"
							></BigPauseButton>
						) : (
							<BigPlayButton
								onClick={handlePlay}
								className="size-24 pl-3 dark:bg-[#111625] dark:border-white border-black border-2 rounded-full"
							></BigPlayButton>
						)}
					</div>
				</section>
				<section>
					<ol className="flex flex-col gap-4">
						{albumDetails?.tracks.items.map((track: Item, index: number) => (
							<NewPlaybackContainer
								key={index}
								token={session?.user.token ?? ''}
								contextUri={albumDetails?.uri}
								position={track.track_number}
							>
								<li className="grid grid-cols-[10px_3fr_0.4fr] gap-4 items-center">
									<p>{index + 1}</p>
									<div>
										<p className="font-semibold leading-none">{track.name}</p>
										<p className="text-sm text-muted-foreground">{track.artists[0].name}</p>
									</div>
									<p className="text-sm text-muted-foreground justify-self-end">
										{msToTime(track.duration_ms)}
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
