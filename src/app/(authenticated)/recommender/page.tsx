'use client'

import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import { Button } from '@/components/ui/button'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
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

export default function Recommender() {
	const [selectedGenres, setSelectedGenres] = useState<string[]>([])
	const [selectedMoods, setSelectedMoods] = useState<string[]>([])
	const [selectedTempos, setSelectedTempos] = useState<string[]>([])
	const [showCommandList, setShowCommandList] = useState(false)
	const [searchInput, setSearchInput] = useState('')
	const [parent, enableAnimations] = useAutoAnimate()
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
	const availableMoods = [
		'Agitated',
		'Amorous',
		'Angry',
		'Anxious',
		'Apathetic',
		'Appreciative',
		'Ardent',
		'Ashamed',
		'Assertive',
		'Alone',
		'Amused',
		'Awestruck',

		'Bemused',
		'Benevolent',
		'Belligerent',
		'Bewildered',
		'Blessed',
		'Bleak',
		'Bored',
		'Bright',
		'Brooding',

		'Calm',
		'Capricious',
		'Cheerful',
		'Chill',
		'Choleric',
		'Confident',
		'Confused',
		'Contented',
		'Crabby',
		'Craving',
		'Creative',
		'Curious',

		'Dark',
		'Dejected',
		'Despondent',
		'Determined',
		'Disgruntled',
		'Dismayed',
		'Doleful',
		'Driven',
		'Drained',

		'Easygoing',
		'Ecstatic',
		'Effervescent',
		'Elated',
		'Emotional',
		'Enthusiastic',
		'Enraged',
		'Exasperated',
		'Exhausted',

		'Famished',
		'Fanciful',
		'Fickle',
		'Forlorn',
		'Fragile',
		'Frazzled',
		'Frustrated',
		'Furious',
		'Funky',

		'Gentle',
		'Giddy',
		'Gloomy',
		'Grateful',
		'Grumpy',
		'Guilty',
		'Gullible',

		'Happy',
		'Halcyon',
		'Haughty',
		'Hopeful',
		'Hungry',
		'Hurt',

		'Imaginative',
		'Impassioned',
		'Indifferent',
		'Indignant',
		'Insecure',
		'Inspired',
		'Intrigued',
		'Inquisitive',
		'Irritated',
		'Isolated',
		'Innovative',

		'Jaded',
		'Jazzy',
		'Jittery',
		'Joyful',
		'Jubilant',
		'Jovial',

		'Laid-back',
		'Languid',
		'Lighthearted',
		'Listless',
		'Livid',
		'Lonely',
		'Lovestruck',
		'Loving',

		'Maudlin',
		'Mellow',
		'Melancholy',
		'Mirthful',
		'Morose',
		'Motivated',

		'Nauseous',
		'Nervous',
		'Nonchalant',
		'Nostalgic',
		'Numb',

		'Obstinate',
		'Optimistic',
		'Outraged',
		'Overwhelmed',

		'Passionate',
		'Peaceful',
		'Pensive',
		'Perplexed',
		'Perturbed',
		'Petulant',
		'Peppy',
		'Playful',
		'Positive',
		'Powerful',
		'Puzzled',

		'Queasy',
		'Quiet',
		'Quizzical',
		'Quixotic',

		'Relaxing',
		'Reflective',
		'Regretful',
		'Remorseful',
		'Reminiscent',
		'Resentful',
		'Restless',
		'Relieved',
		'Romantic',

		'Sad',
		'Sanguine',
		'Sentimental',
		'Serene',
		'Serious',
		'Silly',
		'Sleepy',
		'Smitten',
		'Smooth',
		'Soft',
		'Solitary',
		'Somber',
		'Starving',
		'Stressed',
		'Strong',
		'Sullen',

		'Tender',
		'Thankful',
		'Tired',
		'Tranquil',
		'Thrilled',
		'Tense',

		'Uncertain',
		'Uneasy',
		'Uninterested',
		'Unnerved',
		'Upbeat',
		'Uplifted',
		'Upset',

		'Vexed',
		'Vibrant',
		'Victorious',
		'Vulnerable',
		'Vigorous',

		'Wondering',
		'Worried',
		'Weary',
		'Wistful',
		'Whimsical',
		'Woeful',

		'Xenial',
		'Yearning',
		'Yielding',
		'Youthful',

		'Zealous',
		'Zany',
		'Zestful',
		'Zen',
	]
	const availableTempos = [
		'High-BPM',
		'Slow Jam',
		'Mid-Tempo',
		'Upbeat',
		'Frenetic',
		'Downtempo',
		'Hypnotic',
		'Chillwave',
		'Breakbeat',
		'Four-on-the-Floor',
		'Bouncy',
		'Driving',
		'Laid-Back',
		'Intense',
		'Sparse',
		'Stomping',
	]

	const toggleGenre = (genre: string) => {
		if (selectedGenres.includes(genre)) {
			setSelectedGenres(selectedGenres.filter((g) => g !== genre))
		} else {
			if (selectedGenres.length + selectedMoods.length + selectedTempos.length >= 5) return
			setSelectedGenres([...selectedGenres, genre])
		}
	}
	const toggleMood = (mood: string) => {
		if (selectedMoods.includes(mood)) {
			setSelectedMoods(selectedMoods.filter((m) => m !== mood))
		} else {
			if (selectedGenres.length + selectedMoods.length + selectedTempos.length >= 5) return
			setSelectedMoods([...selectedMoods, mood])
		}
	}
	const toggleTempo = (tempo: string) => {
		if (selectedTempos.includes(tempo)) {
			setSelectedTempos(selectedTempos.filter((t) => t !== tempo))
		} else {
			if (selectedGenres.length + selectedMoods.length + selectedTempos.length >= 5) return
			setSelectedTempos([...selectedTempos, tempo])
		}
	}

	const resetHandler = () => {
		setSelectedGenres([])
		setSelectedMoods([])
		setSelectedTempos([])
		setData(null)
	}

	const getJsonData = async () => {
		setLoading(true)
		const allSelected = [...selectedGenres, ...selectedMoods, ...selectedTempos]
		try {
			const response = await fetch('/api/recommend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userPreferences: allSelected,
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
		<PageContent ref={parent} className="flex flex-col gap-4 items-center">
			<GradientText className=" to-70% pb-2">AI recommender</GradientText>
			{!data ? (
				<>
					<h2 className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight first:mt-0">
						Type any genres, moods or tempos!
					</h2>
					<Command className="max-h-[200px]">
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
							<CommandGroup heading="Moods">
								{availableMoods.map((mood) => (
									<CommandItem key={mood} onSelect={() => toggleMood(mood)}>
										{mood}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandGroup heading="Tempos">
								{availableTempos.map((tempo) => (
									<CommandItem key={tempo} onSelect={() => toggleTempo(tempo)}>
										{tempo}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
						</CommandList>
					</Command>
					{selectedGenres.length + selectedMoods.length + selectedTempos.length > 0 && (
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
								{selectedMoods.map((mood) => (
									<div
										key={mood}
										className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
										onClick={() => toggleMood(mood)}
									>
										{mood}
									</div>
								))}
								{selectedTempos.map((tempo) => (
									<div
										key={tempo}
										className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
										onClick={() => toggleTempo(tempo)}
									>
										{tempo}
									</div>
								))}
							</div>
							<Button
								className="text-xl font-semibold w-1/2 dark:text-white text-black bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-80%"
								onClick={getJsonData}
								disabled={loading || selectedGenres.length === 0}
							>
								{loading ? 'Loading...' : 'Find songs'}
							</Button>
						</>
					)}
				</>
			) : data.tracks.length !== 0 ? (
				<>
					<GradientText headingSize="h2" className="pb-1 text-center text-2xl to-80%">
						Here&apos;s your recommendations for
					</GradientText>
					<div className="flex flex-wrap gap-2 justify-center pb-2">
						{[...selectedGenres, ...selectedMoods, ...selectedTempos].map((selection) => (
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
							<div key={track.id} className="">
								<div>
									<Image
										src={track.album.images[1].url}
										height={200}
										width={200}
										alt={`${track.name} album cover`}
									/>
									<h3 className="pt-2 scroll-m-20 text-xl font-semibold tracking-tight">
										{track.name} - {track.artists[0].name}
									</h3>
								</div>
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
			) : (
				<>
					<GradientText headingSize="h2" className="pb-1 text-center text-2xl to-80%">
						I could not find any songs for your selections
					</GradientText>
					<div className="flex flex-wrap gap-2 justify-center pb-2">
						{[...selectedGenres, ...selectedMoods, ...selectedTempos].map((selection) => (
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
