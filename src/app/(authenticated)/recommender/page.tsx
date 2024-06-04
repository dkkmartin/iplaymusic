'use client'

import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import { Root, Track } from '@/types/recommender/recommender'
import Image from 'next/image'
import NewPlaybackContainer from '@/components/player/newPlaybackContainer'

export default function Recommender() {
	const [selectedGenres, setSelectedGenres] = useState<string[]>([])
	const [showCommandList, setShowCommandList] = useState(false)
	const [searchInput, setSearchInput] = useState('')
	const [data, setData] = useState<Root | null>(null)
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
			if (selectedGenres.length >= 5) return
			setSelectedGenres([...selectedGenres, genre])
		}
	}
	const resetHandler = () => {
		setSelectedGenres([])
		setData(null)
	}

	const getSongRecommendations = async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				limit: '10',
				seed_genres: selectedGenres.join(','),
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
		<PageContent className="flex flex-col gap-4 items-center">
			<GradientText className=" to-70% pb-2">Recommender</GradientText>
			{!data ? (
				<>
					<h2 className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight first:mt-0">
						Type any genres, moods or tempos!
					</h2>
					<Command className="max-h-[250px]">
						<CommandInput
							value={searchInput}
							onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
							onClick={() => setShowCommandList(true)}
							placeholder="Type anything..."
						/>
						<CommandList className={showCommandList ? '' : 'hidden'}>
							<CommandEmpty onClick={() => toggleGenre(searchInput)}>{searchInput}</CommandEmpty>
							<CommandGroup heading="Genres">
								{availableGenres.map((genre) => (
									<CommandItem
										key={genre}
										onSelect={() => {
											toggleGenre(genre)
										}}
									>
										{genre}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
						</CommandList>
					</Command>
					{selectedGenres.length > 0 && (
						<>
							<GradientText className="pb-1">I want</GradientText>
							<div className="flex flex-wrap gap-2 justify-center">
								{selectedGenres.map((genre) => (
									<div
										key={genre}
										className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
										onClick={() => toggleGenre(genre)}
									>
										{genre}
									</div>
								))}
							</div>
							<Button
								className="text-xl font-semibold w-1/2 dark:text-white text-black bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
								onClick={getSongRecommendations}
								disabled={loading || selectedGenres.length === 0}
							>
								{loading ? 'Loading...' : 'Find songs'}
							</Button>
						</>
					)}
				</>
			) : data.tracks.length > 0 ? (
				<>
					<GradientText headingSize="h2" className="pb-1 text-center text-2xl to-80%">
						Here&apos;s your recommendations for
					</GradientText>
					<div className="flex flex-wrap gap-2 justify-center pb-2">
						{selectedGenres.map((selection) => (
							<div
								key={selection}
								className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
							>
								{selection}
							</div>
						))}
					</div>
					<div className="grid grid-cols-2 gap-4">
						{data.tracks.map((track: Track) => (
							<NewPlaybackContainer
								uri={track.uri}
								token={session?.user?.token ?? ''}
								key={track.id}
							>
								<Image
									src={track.album.images[1].url}
									height={200}
									width={200}
									alt={`${track.name} album cover`}
								/>
								<h3 className="pt-2 scroll-m-20 text-xl font-semibold tracking-tight">
									{track.name}
								</h3>
							</NewPlaybackContainer>
						))}
					</div>
					<Button
						onClick={resetHandler}
						className="text-xl font-semibold w-full dark:text-white text-black bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
					>
						Try again?
					</Button>
				</>
			) : (
				<>
					<GradientText headingSize="h2" className="pb-1 text-center text-2xl to-80%">
						I could not find any songs for your selections
					</GradientText>
					<div className="flex flex-wrap gap-2 justify-center pb-2">
						{selectedGenres.map((selection) => (
							<div
								key={selection}
								className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
							>
								{selection}
							</div>
						))}
					</div>
					<Button
						onClick={resetHandler}
						className="text-xl font-semibold w-full dark:text-white text-black bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
					>
						Try again?
					</Button>
				</>
			)}
		</PageContent>
	)
}
