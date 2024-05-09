import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { authOptions } from '@/lib/authOptions'
import { spotifyFetch } from '@/lib/utils'
import { type Root } from '@/types/search/search'
import { getServerSession } from 'next-auth'
import Image from 'next/image'

export default async function CategoriesAccordion({
	color,
	title,
	slug,
}: {
	color: () => string
	title: string
	slug: string
}) {
	const session = await getServerSession(authOptions)
	const backgroundColor = color()
	const data = await getPlaylists(slug)

	async function getPlaylists(query: string): Promise<Root | undefined> {
		if (!session?.user.token) return
		const res = await spotifyFetch(
			`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=10`,
			session.user.token
		)
		const data = await res.json()
		return data
	}

	return (
		<Accordion className="rounded-md" style={{ backgroundColor }} type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger className="capitalize">{title}</AccordionTrigger>
				<AccordionContent className="p-2 gap-4 flex flex-col">
					{data &&
						data.playlists &&
						data?.playlists.items.map((item, index) => (
							<Image
								className="rounded-xl dark:border-white"
								key={index}
								src={item.images[0].url}
								width={364}
								height={364}
								alt={item.type + ' cover'}
							/>
						))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
