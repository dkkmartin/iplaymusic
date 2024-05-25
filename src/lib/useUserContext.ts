import { useEffect, useState } from 'react'
import { Root as TracksRoot, Item as TrackItem } from '@/types/user/topTracks'
import { Root as ArtistsRoot, Item as ArtistItem } from '@/types/user/topArtists'

type UserContextType = {
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
	artists?: {
		followers: number
		genres: string[]
		name: string
		popularity: number
		type: string
	}[]
}

export function useUserContext(token: string) {
	const [userContext, setUserContext] = useState<UserContextType>({})

	useEffect(() => {
		if (token) {
			const fetchData = async () => {
				try {
					await getTracks(token)
					await getArtists(token)
				} catch (error) {
					console.error('Error fetching data:', error)
				}
			}

			fetchData()
		}
	}, [token])

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

			// Fetch genres and artist popularity concurrently
			await Promise.all(
				filteredTracks.map(async (track) => {
					try {
						const artistRes = await fetch(`https://api.spotify.com/v1/artists/${track.artistId}`, {
							headers: { Authorization: `Bearer ${token}` },
						})

						if (!artistRes.ok) {
							throw new Error(`Failed to fetch artist data for artistId: ${track.artistId}`)
						}

						const artistData: ArtistItem = await artistRes.json()
						track.genres = artistData.genres
						track.artistPopularity = artistData.popularity
					} catch (error) {
						console.error(`Error fetching artist data for ${track.artistId}:`, error)
					}
				})
			)

			setUserContext((prevContext) => ({ ...prevContext, tracks: filteredTracks }))
		} catch (error) {
			console.error('Error fetching top tracks:', error)
		}
	}

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

			setUserContext((prevContext) => ({ ...prevContext, artists: filteredArtists }))
		} catch (error) {
			console.error('Error fetching top artists:', error)
		}
	}

	return { userContext }
}
