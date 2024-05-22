import { authOptions } from '@/lib/authOptions'
import { Root } from '@/types/featured-playlist/playlist'
import { getServerSession } from 'next-auth'
import Image from 'next/image'

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
			<section>
				{playlistData?.playlists?.items.map((playlist: any, index: number) => (
					<div key={index}>
						<Image
							src={playlist.images[0].url}
							width={300}
							height={300}
							alt={`${playlist.name} cover`}
						/>
						<h1>{playlist.name}</h1>
					</div>
				))}
			</section>
		)
	)
}
