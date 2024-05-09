import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import CategoriesAccordion from '@/components/ui/categoriesAccordion'
import { authOptions } from '@/lib/authOptions'
import { spotifyFetch } from '@/lib/utils'
import { getServerSession } from 'next-auth'

interface Genres {
	genres: string[]
}

const colors = [
	'#f72585',
	'#b5179e',
	'#7209b7',
	'#560bad',
	'#480ca8',
	'#3a0ca3',
	'#3f37c9',
	'#4361ee',
	'#4895ef',
	'#4cc9f0',
]

const doubleColors = [...colors, ...colors.reverse()]

export default async function Categories() {
	const session = await getServerSession(authOptions)
	const data = await getCategories()

	async function getCategories(): Promise<Genres | undefined> {
		if (!session?.user.token) return
		const res = await spotifyFetch(
			'https://api.spotify.com/v1/recommendations/available-genre-seeds',
			session.user.token
		)
		const data = await res.json()
		return data
	}

	return (
		<PageContent>
			<GradientText>Categories</GradientText>
			<div className="flex flex-col gap-4">
				{data &&
					data.genres.map((category, index) => (
						<CategoriesAccordion
							color={() => {
								let colorIndex = index % doubleColors.length
								return doubleColors[colorIndex]
							}}
							title={category}
							key={index}
							slug={category}
						></CategoriesAccordion>
					))}
			</div>
		</PageContent>
	)
}
