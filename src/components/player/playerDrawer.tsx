'use client'

import React, { useEffect, useState } from 'react'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '../ui/button'
import { usePlaybackStore } from '@/lib/stores'
import Image from 'next/image'

export default function PlayerDrawer({
	children,
	className,
	token,
}: {
	children: React.ReactNode
	className?: string
	token: string
}) {
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const [artistImageSrc, setArtistImageSrc] = useState<string>('')
	const [currentSongId, setCurrentSongId] = useState<string>('')

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

		if (playbackState?.item && playbackState.item.id !== currentSongId) {
			getArtistImage(playbackState.item.artists[0].id)
			setCurrentSongId(playbackState.item.id)
		}
	}, [playbackState, token, artistImageSrc, currentSongId])

	return (
		<Drawer>
			<DrawerTrigger className={className}>{children}</DrawerTrigger>
			<DrawerContent
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url(${playbackState?.item?.album?.images[0].url})`,
				}}
				className="h-screen rounded-none bg bg-cover bg-center bg-no-repeat"
			>
				<DrawerHeader>
					<DrawerTitle className="font-light text-lg uppercase">Playing</DrawerTitle>
				</DrawerHeader>
				<div className="w-full flex justify-center">
					<div>
						<div className="rounded-full border-[#FF1168] border-8 border-opacity-30 animation-pulse2">
							<Image
								src={artistImageSrc}
								width={150}
								height={150}
								className="rounded-full border-[#FF1168] border-8 border-opacity-50 animation-pulse1"
								alt="artist"
							></Image>
						</div>
					</div>
				</div>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
