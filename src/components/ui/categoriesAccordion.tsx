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
import { useEffect, useState } from 'react'
import { imageLoader } from '@/lib/utils'

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

	const handleClick = () => {
		setIsOpen(!isOpen)
	}

	useEffect(() => {
		if (!session?.user.token) return
		async function getPlaylists(slug: string): Promise<Root | undefined> {
			const encodedSlug = encodeURIComponent(slug)
			const res = await fetch(`/api/search/${encodedSlug}`, {
				method: 'POST',
				body: JSON.stringify({ token: session?.user.token }),
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
		}

		if (status === 'authenticated' && isOpen) {
			getPlaylists(slug)
		}
	}, [slug, session?.user.token, status, isOpen])

	return (
		<Accordion className="rounded-md" style={{ backgroundColor: color }} type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger onClick={handleClick} className="capitalize">
					{title}
				</AccordionTrigger>
				<AccordionContent className="p-2 gap-4 flex flex-col items-center">
					<ButtonGroup buttonLabels={['Albums', 'Artists', 'Playlists', 'Tracks']}></ButtonGroup>
					{data &&
						data.playlists &&
						data?.playlists.items.map((item, index) => (
							<div key={index}>
								<Image
									loader={imageLoader}
									className="rounded-xl dark:border-white"
									src={item.images[0].url}
									width={364}
									height={364}
									alt={item.type + ' cover'}
								/>
								<h2 className="scroll-m-20 border-b py-4 text-3xl font-semibold tracking-tight first:mt-0">
									{item.name}
								</h2>
							</div>
						))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
