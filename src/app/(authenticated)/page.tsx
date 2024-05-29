import GradientText from '@/components/text/gradientHeading'
import PageContent from '@/components/pages/pageContent'
import ImageCardWithOverlay from '@/components/cards/ImageCardWithOverlay'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { Root } from '@/types/album/albumNewReleases'
import Link from 'next/link'

export default async function Home() {
	const session = await getServerSession(authOptions)
	const data = await getAlbums()

	async function getAlbums(): Promise<Root | undefined> {
		if (!session?.user.token) return
		const res = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=10', {
			headers: {
				Authorization: `Bearer ${session.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}

	return (
		<PageContent>
			<GradientText>Featured</GradientText>
			<div className="flex flex-col items-center gap-8">
				{data &&
					data?.albums?.items.map((item, index) => (
						<Link className="w-full" key={index} href={`/${item.type}/${item.id}`}>
							<ImageCardWithOverlay
								imgSrc={item.images[0].url}
								imageAlt={item.name}
								text={item.name}
								subText={item.album_type}
							></ImageCardWithOverlay>
						</Link>
					))}
			</div>
		</PageContent>
	)
}
