import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { Root } from '@/types/album/albumNewReleases'
import Image from 'next/image'

export async function Featured() {
	const session = await getServerSession(authOptions)
	const res = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
		headers: {
			Authorization: `Bearer ${session?.user.token}`,
		},
	})
	const data: Root = await res.json()
	return (
		<div>
			{data.albums.items.map((item, index) => (
				<div key={index}>
					<Image src={item.images[0].url} width={200} height={200} alt={`${item.name} cover`} />
					<p>{item.name}</p>
				</div>
			))}
		</div>
	)
}
