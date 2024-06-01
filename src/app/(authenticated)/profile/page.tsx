import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'

export default async function Profile() {
	const session = await getServerSession(authOptions)
	const savedTracksData = await getSavedTracks()
	const profileData = await getProfileInfo()

	async function getSavedTracks() {
		try {
			const response = await fetch('https://api.spotify.com/v1/me/tracks', {
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

	async function getProfileInfo() {
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

	return (
		profileData &&
		savedTracksData && (
			<div>
				<h1>{profileData.display_name}</h1>
				<p>{profileData.email}</p>
				<p>{profileData.followers.total} followers</p>
				<h2>Saved Tracks</h2>
				<ul>
					{savedTracksData.items.map((track) => (
						<li key={track.track.id}>
							{track.track.name} by {track.track.artists[0].name}
						</li>
					))}
				</ul>
			</div>
		)
	)
}
