import { useEffect, useState } from 'react'
import { Root as ArtistsRoot, Item as ArtistItem } from '@/types/user/topArtists'
import { Root as TracksRoot, Item as TrackItem } from '@/types/user/topTracks'

type UserContextType = {
	artists?: {
		followers: number
		genres: string[]
		name: string
		popularity: number
		type: string
	}[]
	tracks?: {
		album: string
		artist: string
		artistId: string
		genres: string[]
		artistPopularity: number
		artistType: string
		track: string
		trackPopularity: number
		trackType: string
	}[]
}

export function useUserContext(token: string) {
	const [userContext, setUserContext] = useState<UserContextType>({})

	useEffect(() => {
		console.log(userContext)
	}, [userContext])

	useEffect(() => {
		if (token && !userContext.artists && !userContext.tracks) {
			// Check if no data exists
			const fetchData = async () => {
				try {
					const artists = await getArtists(token)
					const tracks = await getTracks(token)
					setUserContext({ artists, tracks })
				} catch (error) {
					console.error('Error fetching data:', error)
				}
			}

			fetchData()
		}
	}, [token, userContext.artists, userContext.tracks])

	async function getArtists(token: string) {
		try {
			const res = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term', {
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!res.ok) {
				throw new Error('Failed to fetch top artists')
			}

			const data: ArtistsRoot = await res.json()

			const filteredArtists = data.items.map((artist: ArtistItem) => ({
				followers: artist.followers.total,
				genres: artist.genres,
				name: artist.name,
				popularity: artist.popularity,
				type: artist.type,
			}))

			return filteredArtists
		} catch (error) {
			console.error('Error fetching top artists:', error)
			return []
		}
	}

	async function getTracks(token: string) {
		try {
			const res = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term', {
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!res.ok) {
				throw new Error('Failed to fetch top tracks')
			}

			const data: TracksRoot = await res.json()

			const filteredTracks = data.items.map((track: TrackItem) => ({
				album: track.album.name,
				artist: track.artists[0].name,
				artistId: track.artists[0].id,
				genres: [] as string[], // Explicitly type genres as string[]
				artistPopularity: 0, // Placeholder, fetched later
				artistType: track.artists[0].type,
				track: track.name,
				trackPopularity: track.popularity,
				trackType: track.type,
			}))

			return filteredTracks
		} catch (error) {
			console.error('Error fetching top tracks:', error)
			return []
		}
	}

	return { userContext }
}
