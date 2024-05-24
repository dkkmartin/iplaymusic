'use client'

import PageContent from '@/components/pages/pageContent'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Recommender() {
	const [selectedGenres, setSelectedGenres] = useState<string[]>([])
	const [data, setData] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const { data: session, status } = useSession()

	const availableGenres = [
		'acoustic',
		'afrobeat',
		'alt-rock',
		'alternative',
		'ambient',
		'anime',
		'black-metal',
		'bluegrass',
		'blues',
		'bossanova',
		'brazil',
		'breakbeat',
		'british',
		'cantopop',
		'chicago-house',
		'children',
		'chill',
		'classical',
		'club',
		'comedy',
		'country',
		'dance',
		'dancehall',
		'death-metal',
		'deep-house',
		'detroit-techno',
		'disco',
		'disney',
		'drum-and-bass',
		'dub',
		'dubstep',
		'edm',
		'electro',
		'electronic',
		'emo',
		'folk',
		'forro',
		'french',
		'funk',
		'garage',
		'german',
		'gospel',
		'goth',
		'grindcore',
		'groove',
		'grunge',
		'guitar',
		'happy',
		'hard-rock',
		'hardcore',
		'hardstyle',
		'heavy-metal',
		'hip-hop',
		'holidays',
		'honky-tonk',
		'house',
		'idm',
		'indian',
		'indie',
		'indie-pop',
		'industrial',
		'iranian',
		'j-dance',
		'j-idol',
		'j-pop',
		'j-rock',
		'jazz',
		'k-pop',
		'kids',
		'latin',
		'latino',
		'malay',
		'mandopop',
		'metal',
		'metal-misc',
		'metalcore',
		'minimal-techno',
		'movies',
		'mpb',
		'new-age',
		'new-release',
		'opera',
		'pagode',
		'party',
		'philippines-opm',
		'piano',
		'pop',
		'pop-film',
		'post-dubstep',
		'power-pop',
		'progressive-house',
		'psych-rock',
		'punk',
		'punk-rock',
		'r-n-b',
		'rainy-day',
		'reggae',
		'reggaeton',
		'road-trip',
		'rock',
		'rock-n-roll',
		'rockabilly',
		'romance',
		'sad',
		'salsa',
		'samba',
		'sertanejo',
		'show-tunes',
		'singer-songwriter',
		'ska',
		'sleep',
		'songwriter',
		'soul',
		'soundtracks',
		'spanish',
		'study',
		'summer',
		'swedish',
		'synth-pop',
		'tango',
		'techno',
		'trance',
		'trip-hop',
		'turkish',
		'work-out',
		'world-music',
	]

	const toggleGenre = (genre: string) => {
		if (selectedGenres.includes(genre)) {
			setSelectedGenres(selectedGenres.filter((g) => g !== genre))
		} else {
			setSelectedGenres([...selectedGenres, genre])
		}
	}

	const getJsonData = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/recommend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userPreferences: selectedGenres,
				}),
			})
			const data = await response.json()
			await getSongRecommendations(data)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const getSongRecommendations = async (jsonData: {
		request: string[]
		json: { [key: string]: any }
	}) => {
		try {
			const params = new URLSearchParams({
				limit: '5',
				seed_genres: jsonData.request.join(','),
				...Object.fromEntries(
					Object.entries(jsonData.json).map(([key, value]) => [key, value.toString()])
				),
			})

			const url = `https://api.spotify.com/v1/recommendations?${params.toString()}`
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session?.user.token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Network response was not ok')
			}

			const recommendations = await response.json()
			setData(recommendations)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageContent>
			<div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md">
				<div className="mb-4">
					<h2 className="text-xl font-semibold mb-2">Select Genres:</h2>
					<div className="flex flex-wrap">
						{availableGenres.map((genre) => (
							<div
								key={genre}
								className={`cursor-pointer border px-4 py-2 rounded-full m-1 ${
									selectedGenres.includes(genre) ? 'bg-green-500 text-white' : 'bg-white text-black'
								}`}
								onClick={() => toggleGenre(genre)}
							>
								{genre}
							</div>
						))}
					</div>
				</div>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-md"
					onClick={getJsonData}
					disabled={loading || selectedGenres.length === 0}
				>
					{loading ? 'Loading...' : 'Get Recommendations'}
				</button>
				<div className="mt-4">
					{data && (
						<div>
							<h2 className="text-xl font-semibold mb-2">Recommendations:</h2>
							{data.tracks.map((track: any) => (
								<div key={track.id} className="mb-2">
									<span className="font-semibold">{track.name}</span> by{' '}
									{track.artists.map((artist: any) => artist.name).join(', ')}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</PageContent>
	)
}
