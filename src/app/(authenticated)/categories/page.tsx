import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import CategoriesAccordion from '@/components/ui/categoriesAccordion'
import { authOptions } from '@/lib/authOptions'
import { Root } from '@/types/categories/categories'
import { getServerSession } from 'next-auth'

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

	async function getCategories(): Promise<Root | undefined> {
		if (!session?.user.token) return
		const res = await fetch('https://api.spotify.com/v1/browse/categories?limit=50', {
			headers: {
				Authorization: `Bearer ${session.user.token}`,
			},
		})
		if (!res.ok) {
			const text = await res.text()
			console.error(`Error in getCategories: ${text}`)
			return
		}
		const data = await res.json()
		return data
	}

	function colorFunction(index: number) {
		let colorIndex = index % doubleColors.length
		return doubleColors[colorIndex]
	}

	return (
		<PageContent>
			<GradientText>Categories</GradientText>

			<div className="flex flex-col gap-4">
				{data &&
					data.categories.items.map((category, index) => (
						<CategoriesAccordion
							color={colorFunction(index)}
							title={category.name}
							key={index}
							slug={category.name}
						></CategoriesAccordion>
					))}
			</div>
		</PageContent>
	)
}
