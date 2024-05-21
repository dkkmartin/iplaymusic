'use client'

import PageContent from '@/components/pages/pageContent'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { Root } from '@/types/search/search'
import Image from 'next/image'
import GradientText from '@/components/text/gradientHeading'
import ButtonGroup from '@/components/ui/buttonGroup'
import { useDebounce } from '@uidotdev/usehooks'
import Link from 'next/link'
import { startNewPlaybackTrack } from '@/lib/spotify/utils'

export default function Search() {
	const [query, setQuery] = useState('')
	const [data, setData] = useState<Root | undefined>()
	const [filteredData, setFilteredData] = useState<Root | undefined>()
	const [dataHasFiltered, setDataHasFiltered] = useState(false)
	const debouncedQuery = useDebounce(query, 200)
	const { data: session, status } = useSession()

	function filterData(filter: string) {
		if (!data) return
		setDataHasFiltered(true)
		filter = filter.toLowerCase()
		const filteredData = data[filter]
		filteredData.label = filter
		setFilteredData(filteredData)
	}

	function handleTrackClick(trackUri: string) {
		if (!session?.user?.token) return
		startNewPlaybackTrack(session?.user?.token, trackUri)
	}

	const searchQuery = useCallback(async () => {
		if (!debouncedQuery || !session?.user.token) return
		setDataHasFiltered(false)
		const encodedSearchQuery = encodeURIComponent(debouncedQuery)
		const res = await fetch(`/api/search/${encodedSearchQuery}`, {
			method: 'POST',
			body: JSON.stringify({
				token: session?.user.token,
				filter: 'album%2Cplaylist%2Cartist%2Ctrack',
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		if (!res.ok) {
			const text = await res.text()
			console.error(`Error in searching ${debouncedQuery}: ${text}`)
			return
		}

		const data = await res.json()
		const orderedData = {
			tracks: data.tracks,
			albums: data.albums,
			artists: data.artists,
			playlists: data.playlists,
			shows: data.shows,
			episodes: data.episodes,
			audiobooks: data.audiobooks,
		}
		setData(orderedData)
	}, [debouncedQuery, session])

	useEffect(() => {
		searchQuery()
	}, [searchQuery])

	return (
		<PageContent>
			<Input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="dark:bg-[#111625]"
				type="search"
				placeholder="Search"
			/>
			<div className="flex justify-center py-4">
				<ButtonGroup
					buttonLabels={['Artists', 'Albums', 'Playlists', 'Tracks']}
					callback={(label) => filterData(label)}
				></ButtonGroup>
			</div>
			<section>
				{data && (
					<Link href={`/artist/${data?.artists?.items[0].id}`}>
						<div className="shadow-2xl my-8 overflow-hidden grid grid-cols-2 items-center justify-items-center border rounded-xl dark:border-white dark:bg-[#111625]">
							<h1 className="text-3xl font-bold text-center">{data?.artists?.items[0].name}</h1>
							<Image
								className="w-full"
								src={data?.artists.items[0].images[0]?.url ?? ''}
								width={182}
								height={182}
								alt={`${data?.artists?.items[0].name} cover`}
							/>
						</div>
					</Link>
				)}
				{data && !dataHasFiltered
					? Object.keys(data).map((key) => {
							if (data[key]) {
								return (
									<div key={key} className="py-4">
										<GradientText>{key.toLocaleUpperCase()}</GradientText>
										{key !== 'tracks' ? (
											<div className="grid grid-cols-2 gap-4">
												{data[key].items.map((item: Root, index: number) => (
													<Link key={index} href={`/${item.type}/${item.id}`}>
														<div className="overflow-hidden">
															<Image
																className="rounded-xl object-cover max-h-[182px] min-h-[182px]"
																src={
																	item.album
																		? item.album.images[0]?.url
																		: item.images && item.images.length > 0
																		? item.images[0].url
																		: ''
																}
																width={182}
																height={182}
																alt={`${item.name} ${item.type} cover`}
															/>

															<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight">
																{item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
															</h2>
														</div>
													</Link>
												))}
											</div>
										) : (
											<div className="grid grid-cols-2 gap-4">
												{data[key].items.map((item: any, index: number) => (
													<div
														onClick={() => handleTrackClick(item.uri)}
														key={index}
														className="overflow-hidden"
													>
														<Image
															className="rounded-xl object-cover max-h-[182px] min-h-[182px]"
															src={
																item.album
																	? item.album.images[0]?.url
																	: item.images && item.images.length > 0
																	? item.images[0].url
																	: ''
															}
															width={182}
															height={182}
															alt={`${item.name} ${item.type} cover`}
														/>
														<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight">
															{item.name}
														</h2>
													</div>
												))}
											</div>
										)}
									</div>
								)
							}
					  })
					: filteredData && (
							<>
								<GradientText>{filteredData.label?.toUpperCase() ?? ''}</GradientText>
								<section className="grid grid-cols-2 gap-4">
									{filteredData.items.map((item: any, index: number) =>
										item.type === 'artist' || item.type === 'album' || item.type === 'playlist' ? (
											<Link key={index} href={`/${item.type}/${item.id}`}>
												<div className="overflow-hidden">
													<Image
														className="rounded-xl object-cover max-h-[182px] min-h-[182px]"
														src={
															item.album
																? item.album.images[0]?.url
																: item.images && item.images.length > 0
																? item.images[0].url
																: ''
														}
														width={182}
														height={182}
														alt={`${item.name} ${item.type} cover`}
													/>
													<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight ">
														{item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
													</h2>
												</div>
											</Link>
										) : (
											<div
												onClick={() => handleTrackClick(item.uri)}
												key={index}
												className="overflow-hidden"
											>
												<Image
													className="rounded-xl object-cover max-h-[182px] min-h-[182px]"
													src={
														item.album
															? item.album.images[0]?.url
															: item.images && item.images.length > 0
															? item.images[0].url
															: ''
													}
													width={182}
													height={182}
													alt={`${item.name} ${item.type} cover`}
												/>
												<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight">
													{item.name}
												</h2>
											</div>
										)
									)}
								</section>
							</>
					  )}
			</section>
		</PageContent>
	)
}
