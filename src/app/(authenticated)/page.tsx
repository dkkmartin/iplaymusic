import GradientText from '@/components/text/gradientHeading'
import PageContent from '@/components/pages/pageContent'
import ImageCardWithOverlay from '@/components/cards/ImageCardWithOverlay'
import { spotifyFetch } from '@/lib/utils'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { type Root } from '@/types/album/albumNewReleases'

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
	const data = await getAlbums()

	async function getAlbums(): Promise<Root | undefined> {
		if (!session?.user.token) return
		const res = await spotifyFetch(
			'https://api.spotify.com/v1/browse/new-releases?limit=10',
			session?.user.token
		)
		const data = await res.json()
		return data
	}

	return (
		<PageContent>
			<GradientText>Featured</GradientText>
			<div className="flex flex-col items-center gap-8">
				{data &&
					data.albums.items.map((item, index) => (
						<ImageCardWithOverlay
							key={index}
							imgSrc={item.images[0].url}
							imageAlt={item.name}
							text={item.name}
							subText={item.album_type}
						></ImageCardWithOverlay>
					))}
			</div>
		</PageContent>
	)
}
