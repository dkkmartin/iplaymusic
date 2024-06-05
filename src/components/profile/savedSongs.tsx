'use client'

import { useEffect, useState } from 'react'
import GradientText from '../text/gradientHeading'
import NewPlaybackContainer from '@/components/player/newPlaybackContainer'
import { msToTime } from '@/lib/utils'
import Image from 'next/image'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { Root as savedTracksRoot, Item } from '@/types/user/savedTracks'
import Loading from '@/app/(authenticated)/loading'

export default function SavedSongs({
	tracksData,
	token,
}: {
	tracksData: savedTracksRoot
	token: string
}) {
	const [ref, entry] = useIntersectionObserver({
		threshold: 0,
		root: null,
		rootMargin: '0px',
	})
	const [tracks, setTracks] = useState<savedTracksRoot>(tracksData)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!entry?.isIntersecting) return
		async function getMoreTracks() {
			setLoading(true)
			try {
				const response = await fetch(tracksData.next, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await response.json()
				setTracks((prev) => {
					return { ...prev, items: [...prev.items, ...data.items] }
				})
				setLoading(false)
			} catch (error) {
				console.log('Error fetching saved tracks:', error)
				setLoading(false)
			}
		}
		getMoreTracks()
	}, [entry?.isIntersecting, token, tracksData.next])

	return (
		<section className="w-full">
			<GradientText headingSize="h2" className="text-2xl pb-2">
				Saved songs
			</GradientText>
			<ol className="flex flex-col gap-4">
				{tracks.items &&
					tracks.items.map((track: Item, index: number) => (
						<NewPlaybackContainer key={index} token={token} uri={track.track.uri}>
							<li className="grid grid-cols-[64px_minmax(100px,300px)_1fr] gap-4 items-center">
								<Image
									src={track.track.album.images[2].url}
									width={64}
									height={64}
									alt={`${track.track.type} album cover`}
								/>
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
			<div ref={ref}>{loading ? <Loading className="h-8 items-center my-8"></Loading> : ''}</div>
		</section>
	)
}
