import PageContent from '@/components/pages/pageContent'
import { authOptions } from '@/lib/authOptions'
import { Root as ArtistRoot } from '@/types/artist/albums'
import { Root as ArtistDetails } from '@/types/artist/details'
import { Root as ArtistTracks, Track } from '@/types/artist/tracks'
import { getServerSession } from 'next-auth'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export default async function Artist({ params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions)
	const slug = params.slug

	async function getArtistDetails(): Promise<ArtistDetails | undefined> {
		const res = await fetch(`https://api.spotify.com/v1/artists/${slug}`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}

	async function getArtistAlbums(): Promise<ArtistRoot | undefined> {
		const res = await fetch(`https://api.spotify.com/v1/artists/${slug}/albums`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}

	async function getArtistTracks(): Promise<ArtistTracks | undefined> {
		const res = await fetch(`https://api.spotify.com/v1/artists/${slug}/top-tracks`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`,
			},
		})
		const data = await res.json()
		return data
	}

	const [artistDetails, artistAlbums, artistTracks] = await Promise.all([
		getArtistDetails(),
		getArtistAlbums(),
		getArtistTracks(),
	])

	return (
		<div className="flex flex-col">
			<section
				className="h-[400px] bg-cover bg-center bg-no-repeat flex flex-col justify-end px-6"
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${artistDetails?.images[0]?.url})`,
				}}
			>
				<h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-white pb-2">
					{artistDetails?.name}
				</h1>
			</section>

			<PageContent>
				<div className="flex gap-2 flex-wrap justify-center pb-6">
					{artistDetails &&
						artistDetails.genres.map((genre: string, index: number) => (
							<Badge className="bg-[#FF1168] text-white text-lg" key={index}>
								#{genre}
							</Badge>
						))}
				</div>
				<section>
					<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						Popular
					</h2>
					<ol className="flex flex-col gap-2 py-2">
						{artistTracks?.tracks.slice(0, 5).map((track: Track, index: number) => (
							<li className=" flex items-center gap-4" key={index}>
								<p>{index + 1}</p>
								<Image
									src={track.album.images[2].url}
									width={64}
									height={64}
									alt={`${track.name} ${track.type} cover`}
								></Image>
								<p className="overflow-hidden text-ellipsis text-nowrap">{track.name}</p>
							</li>
						))}
					</ol>
				</section>
			</PageContent>
		</div>
	)
}
