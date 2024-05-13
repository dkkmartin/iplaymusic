'use client'

import PageContent from '@/components/pages/pageContent'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { Albums, Root } from '@/types/search/search'
import Image from 'next/image'
import GradientText from '@/components/text/gradientHeading'
import ButtonGroup from '@/components/ui/buttonGroup'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useDebounce } from '@uidotdev/usehooks'

export default function Search() {
	const [query, setQuery] = useState('')
	const [data, setData] = useState<Root | undefined>()
	const [filteredData, setFilteredData] = useState<Albums | undefined>()
	const [dataHasFiltered, setDataHasFiltered] = useState(false)
	const [parent, enableAnimations] = useAutoAnimate()
	const debouncedQuery = useDebounce(query, 200)
	const { data: session, status } = useSession()

	function filterData(filter: string) {
		if (!data) return
		setDataHasFiltered(true)
		filter = filter.toLowerCase()
		const filteredData = data[filter]
		console.log(filteredData)
		setFilteredData(filteredData as Root[typeof filter])
	}

	const searchQuery = useCallback(async () => {
		if (!debouncedQuery || !session?.user.token) return

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
					<div className="my-8 overflow-hidden grid grid-cols-2 items-center justify-items-center border rounded-md dark:border-white dark:bg-[#111625]">
						<h1 className="text-3xl font-bold text-center">{data?.artists?.items[0].name}</h1>
						<Image
							className="w-full"
							src={data?.artists.items[0].images[0]?.url ?? ''}
							width={182}
							height={182}
							alt={`${data?.artists?.items[0].name} cover`}
						/>
					</div>
				)}
				{data && !dataHasFiltered
					? Object.keys(data).map((key) => {
							if (data[key]) {
								return (
									<div key={key} className="py-4">
										<GradientText>{key}</GradientText>
										<div className="grid grid-cols-2 gap-4" ref={parent}>
											{data[key].items.map((item: any, index: number) => (
												<div key={index} className="overflow-hidden">
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

													<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight first:mt-0">
														{item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
													</h2>
												</div>
											))}
										</div>
									</div>
								)
							}
					  })
					: filteredData &&
					  filteredData?.items?.map((item, index) => (
							<div key={index} className="overflow-hidden">
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

								<h2 className="scroll-m-20 py-4 text-3xl font-semibold tracking-tight first:mt-0">
									{item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
								</h2>
							</div>
					  ))}
			</section>
		</PageContent>
	)
}
