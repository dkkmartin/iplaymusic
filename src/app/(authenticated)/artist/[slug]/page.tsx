import PageContent from '@/components/pages/pageContent'
import { authOptions } from '@/lib/authOptions'
import { Root as ArtistRoot, Item } from '@/types/artist/albums'
import { Root as ArtistDetails } from '@/types/artist/details'
import { Root as ArtistTracks, Track } from '@/types/artist/tracks'
import { getServerSession } from 'next-auth'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import NewPlaybackContainer from '@/components/player/newPlaybackContainer'
import GradientText from '@/components/text/gradientHeading'
import Link from 'next/link'

export default async function Artist({ params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions)
	const slug = params.slug

	async function getArtistDetails(): Promise<ArtistDetails | undefined> {
    try {
        const res = await fetch(`https://api.spotify.com/v1/artists/${slug}`, {
            headers: {
                Authorization: `Bearer ${session?.user.token}`,
            },
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Error fetching artist details:', error)
    }
}

async function getArtistAlbums(): Promise<ArtistRoot | undefined> {
    try {
        const res = await fetch(`https://api.spotify.com/v1/artists/${slug}/albums`, {
            headers: {
                Authorization: `Bearer ${session?.user.token}`,
            },
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Error fetching artist albums:', error)
    }
}

async function getArtistTracks(): Promise<ArtistTracks | undefined> {
    try {
        const res = await fetch(`https://api.spotify.com/v1/artists/${slug}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${session?.user.token}`,
            },
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Error fetching artist tracks:', error)
    }
}

	const [artistDetails, artistAlbums, artistTracks] = await Promise.all([
		getArtistDetails(),
		getArtistAlbums(),
		getArtistTracks(),
	])

	return (
		<div className="flex flex-col overflow-hidden">
			{artistDetails?.images[0]?.url && (
				<section
					className="h-[400px] bg-cover bg-center bg-no-repeat flex flex-col justify-end px-6"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${artistDetails?.images[0]?.url})`,
					}}
				>
					<h1
						className={`scroll-m-20 font-extrabold tracking-tight text-white pb-2 ${
							artistDetails?.name.length > 16
								? 'text-3xl'
								: artistDetails?.name.length > 12
								? 'text-4xl'
								: 'text-5xl'
						}`}
					>
						{artistDetails?.name}
					</h1>
				</section>
			)}

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
					<GradientText headingSize="h2">Popular</GradientText>
					<ol className="flex flex-col gap-2 py-2">
						{artistTracks?.tracks.slice(0, 5).map((track: Track, index: number) => (
							<NewPlaybackContainer key={index} token={session?.user.token ?? ''} uri={track.uri}>
								<li className=" flex items-center gap-4">
									<p>{index + 1}</p>
									<Image
										src={track.album.images[2].url}
										width={64}
										height={64}
										alt={`${track.name} ${track.type} cover`}
									></Image>
									<small className="text-base font-semibold leading-none overflow-hidden text-ellipsis text-nowrap">
										{track.name}
									</small>
								</li>
							</NewPlaybackContainer>
						))}
					</ol>
				</section>
				<section className="pt-4">
					<GradientText headingSize="h3">Albums</GradientText>
					<ol className="flex flex-col gap-4 py-2">
						{artistAlbums?.items.map((album: Item, index: number) => (
							<Link key={index} href={`/album/${album.id}`}>
								<li className=" flex items-center gap-4">
									<Image
										className="rounded"
										src={album.images[1].url}
										width={120}
										height={120}
										alt={`${album.name} cover`}
									></Image>
									<div className="flex flex-col">
										<small className="text-base font-semibold leading-none overflow-ellipsis">
											{album.name}
										</small>
										<p className="text-sm text-muted-foreground">
											{album.release_date.slice(0, 4)}
										</p>
									</div>
								</li>
							</Link>
						))}
					</ol>
				</section>
			</PageContent>
		</div>
	)
}
