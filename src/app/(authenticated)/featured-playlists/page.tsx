import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import { authOptions } from '@/lib/authOptions'
import { Root } from '@/types/featured-playlist/playlist'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

export default async function FeaturedPlaylists() {
	const session = await getServerSession(authOptions)
	const playlistData = await getFeaturedPlaylists()

	async function getFeaturedPlaylists(): Promise<Root | undefined> {
		try {
			const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
				headers: {
					Authorization: `Bearer ${session?.user.token}`,
				},
			})
			const data = await response.json()
			return data
		} catch (error) {
			console.log(error)
		}
	}

	return (
		playlistData?.playlists?.items && (
			<PageContent>
				<GradientText headingSize="h1">Featured</GradientText>
				<section className="grid grid-cols-2 gap-4">
					{playlistData?.playlists?.items.map((playlist: any, index: number) => (
						<Link href={`/playlist/${playlist.id}`} key={index}>
							<div key={index}>
								<Image
									src={playlist.images[0].url}
									width={200}
									height={200}
									alt={`${playlist.name} cover`}
								/>
								<h1 className="scroll-m-20 py-4 text-2xl font-semibold tracking-tight">
									{playlist.name}
								</h1>
							</div>
						</Link>
					))}
				</section>
			</PageContent>
		)
	)
}
