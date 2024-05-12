'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { type Root } from '@/types/search/search'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ButtonGroup from './buttonGroup'
import { useCallback, useEffect, useState } from 'react'
import { imageLoader } from '@/lib/utils'
import Loading from '@/app/(authenticated)/loading'

export default function CategoriesAccordion({
	color,
	title,
	slug,
}: {
	color: string
	title: string
	slug: string
}) {
	const { data: session, status } = useSession()
	const [data, setData] = useState<Root | undefined>()
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleClick = useCallback(() => {
		setIsOpen(!isOpen)
	}, [isOpen])

	const fetchData = useCallback(
		async (filter: string) => {
			setIsLoading(true)
			if (filter === 'playlists') filter = 'playlist'
			if (filter === 'artists') filter = 'artist'
			if (filter === 'albums') filter = 'album'
			if (filter === 'tracks') filter = 'track'
			const encodedSlug = encodeURIComponent(slug)
			const res = await fetch(`/api/search/${encodedSlug}`, {
				method: 'POST',
				body: JSON.stringify({ token: session?.user.token, filter }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (!res.ok) {
				const text = await res.text()
				console.error(`Error in getPlaylists: ${text}`)
				return
			}

			const data = await res.json()
			setData(data)
			setIsLoading(false)
		},
		[session?.user.token, slug]
	)

	async function buttonGroupCallback(label: string) {
		if (['Playlists', 'Tracks', 'Artists', 'Albums'].includes(label)) {
			await fetchData(label.toLowerCase())
		}
	}

	useEffect(() => {
		async function getPlaylists(slug: string): Promise<Root | undefined> {
			if (!session?.user.token) return

			await fetchData('playlist')
		}

		if (status === 'authenticated' && isOpen) {
			getPlaylists(slug)
			setIsLoading(true)
		}
	}, [fetchData, isOpen, status, slug, session?.user.token])

	return (
		<Accordion className="rounded-md" style={{ backgroundColor: color }} type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger onClick={handleClick} className="capitalize">
					{title}
				</AccordionTrigger>
				<AccordionContent className="p-2 gap-4 flex flex-col items-center">
					{isLoading ? (
						<Loading className="h-auto pt-4"></Loading>
					) : (
						<>
							<ButtonGroup
								callback={buttonGroupCallback}
								buttonLabels={['Albums', 'Artists', 'Playlists', 'Tracks']}
							></ButtonGroup>
							{data &&
								(data.playlists || data.tracks || data.artists || data.albums) &&
								Object.keys(data).map((key) => {
									return data[key].items.map((item: any, index: number) => (
										<div key={index}>
											<Image
												loader={imageLoader}
												className="rounded-xl dark:border-white"
												src={item.album ? item.album.images[0].url : item.images[0].url}
												width={364}
												height={364}
												alt={item.type + ' cover'}
											/>
											<h2 className="scroll-m-20 border-b py-4 text-3xl font-semibold tracking-tight first:mt-0">
												{item.name}
											</h2>
										</div>
									))
								})}
						</>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
