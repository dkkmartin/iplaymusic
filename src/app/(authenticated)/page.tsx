import GradientText from '@/components/text/gradientHeading'
import PageContent from '@/components/pages/pageContent'
import ImageCardWithOverlay from '@/components/cards/ImageCardWithOverlay'
import { spotifyFetch } from '@/lib/utils'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'

const mockup = [
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
]

export default async function Home() {
	const session = await getServerSession(authOptions)

	async function getAlbums() {
		const res = await spotifyFetch(
			'https://api.spotify.com/v1/browse/new-releases?limit=10',
			session?.access_token
		)
		const data = await res.json()
		console.log(data)
		// return data.items
	}

	getAlbums()

	return (
		<PageContent>
			<GradientText>Featured</GradientText>
			<div className="flex flex-col items-center gap-8">
				{mockup.map((item, index) => (
					<ImageCardWithOverlay
						key={index}
						imgSrc={item.src}
						imageAlt={item.alt}
						text={item.text}
						subText={item.sub_text}
					></ImageCardWithOverlay>
				))}
			</div>
		</PageContent>
	)
}
