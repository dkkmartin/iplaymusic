import { authOptions } from '@/lib/authOptions'
import { Root as userRoot } from '@/types/user/user'
import { Root as savedTracksRoot } from '@/types/user/savedTracks'
import { Root as userPlaylistsRoot } from '@/types/user/userPlaylists'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import PageContent from '@/components/pages/pageContent'
import { Badge } from '@/components/ui/badge'
import GradientText from '@/components/text/gradientHeading'
import Link from 'next/link'
import SavedSongs from '@/components/profile/savedSongs'

export default async function Profile() {
	const session = await getServerSession(authOptions)
	const savedTracksData = await getSavedTracks()
	const profileData = await getProfileInfo()
	const userPlaylists = await getUserPlaylists()

	async function getSavedTracks(): Promise<savedTracksRoot | undefined> {
		try {
			const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session?.user?.token}`,
				},
			})
			return await response.json()
		} catch (error) {
			console.log('Error fetching saved tracks:', error)
		}
	}

	async function getProfileInfo(): Promise<userRoot | undefined> {
		try {
			const response = await fetch('https://api.spotify.com/v1/me', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session?.user?.token}`,
				},
			})
			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}

	async function getUserPlaylists(): Promise<userPlaylistsRoot | undefined> {
		try {
			const response = await fetch('https://api.spotify.com/v1/me/playlists', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session?.user?.token}`,
				},
			})
			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		session?.user &&
		profileData &&
		savedTracksData &&
		userPlaylists && (
			<PageContent className="flex flex-col items-center pt-16 ">
				<section className="flex flex-col gap-2 pb-8">
					<Image
						className="rounded-full shadow-md border"
						src={profileData?.images[1]?.url}
						height={200}
						width={200}
						alt={`${profileData.display_name} profile image`}
					></Image>
					<h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
						{profileData.display_name}
					</h1>
					<div className="flex justify-between items-center">
						<p className="text-sm font-semibold leading-none">
							<span className="font-bold text-lg">{profileData.followers.total}</span> followers
						</p>
						{profileData.product === 'premium' ? (
							<Badge className="bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-70% text-white font-bold capitalize">
								{profileData.product}
							</Badge>
						) : (
							<Badge>{profileData.product}</Badge>
						)}
					</div>
				</section>
				<section className="w-full pb-4">
					<GradientText headingSize="h2" className="text-2xl pb-2">
						Playlists
					</GradientText>
					<ul className="flex gap-2 overflow-scroll">
						{userPlaylists.items.map((playlist) => (
							<Link
								className="min-w-28"
								key={playlist.id}
								href={`/${playlist.type}/${playlist.id}`}
							>
								<li>
									<Image
										src={playlist.images[0]?.url}
										height={100}
										width={100}
										alt={`${playlist.name} playlist cover`}
									></Image>
									<p className="truncate">{playlist.name}</p>
								</li>
							</Link>
						))}
					</ul>
				</section>
				<SavedSongs tracksData={savedTracksData} token={session?.user.token!}></SavedSongs>
			</PageContent>
		)
	)
}
