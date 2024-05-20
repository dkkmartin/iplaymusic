'use client'

import PageContent from '@/components/pages/pageContent'
import { Root as AlbumDetails } from '@/types/album/album'
import Image from 'next/image'
import { Root as ArtistDetails } from '@/types/artist/details'
import { BigPlayButton } from '@/components/svg/bigPlayButton'
import { usePlaybackStore } from '@/lib/stores'
import { BigPauseButton } from '@/components/svg/bigPauseButton'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { pausePlayback, resumePlayback, startNewPlaybackContext } from '@/lib/spotify/utils'
import NewPlaybackContainer from '@/components/player/newPlaybackContainer'
import { msToTime } from '@/lib/utils'

export default function Album({ params }: { params: { slug: string } }) {
	const slug = params.slug
	const { data: session, status } = useSession()
	const playbackState = usePlaybackStore((state) => state?.playbackState)
	const [albumDetails, setAlbumDetails] = useState<AlbumDetails | undefined>()
	const [artistDetails, setArtistDetails] = useState<ArtistDetails | undefined>()

	function handlePause() {
		if (!session?.user.token) return
		pausePlayback(session?.user.token)
	}

	function handlePlay() {
		if (!session?.user.token) return
		if (!albumDetails?.uri) return
		if (playbackState?.context?.uri === albumDetails.uri) {
			resumePlayback(session?.user.token)
		} else {
			startNewPlaybackContext(session?.user.token, albumDetails?.uri, 0)
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
	}, [slug, session]) // dependencies

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

			if (albumData) {
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
						{albumDetails?.tracks.items.map((track: any, index: number) => (
							<NewPlaybackContainer key={index} token={session?.user.token ?? ''} uri={track.uri}>
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
