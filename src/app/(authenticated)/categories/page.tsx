import PageContent from '@/components/pages/pageContent'
import GradientText from '@/components/text/gradientHeading'
import CombinedAccordion from '@/components/ui/combinedAccordion'
import { spotifyFetch } from '@/lib/utils'
import { type Root } from '@/types/categories/categories'
import { getServerSession } from 'next-auth'

const colors = [
	'#D70060',
	'#E54028',
	'#F18D05',
	'#f2bc06',
	'#5EB11C',
	'#3A7634',
	'#0ABEBE',
	'#00A1CB',
	'#115793',
]
const mockup = [
	{
		color: colors[0],
		title: 'Alternative',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[1],
		title: 'Blues',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[2],
		title: 'Classical',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[3],
		title: 'Country',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[4],
		title: 'Dance',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[5],
		title: 'Electronic',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[6],
		title: 'Folk',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[7],
		title: 'Funk',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
	{
		color: colors[8],
		title: 'Hip Hop',
		inners: 7,
		innerTitles: [
			'Acoustic Blues',
			'Blues Rock',
			'Canadian Blues',
			'Jazz Blues',
			'Piano Blues',
			'Soul Blues',
			'Swamp Blues',
		],
		innerContent: ['hej', 'hej', 'hej', 'hej', 'hej', 'hej', 'hej'],
	},
]

export default async function Categories() {
	const session = await getServerSession()

	async function getCategories(): Promise<Root | undefined> {
		if (!session?.user.token) return
		const res = await spotifyFetch(
			'https://api.spotify.com/v1/browse/categories?limit=50',
			session.user.token
		)

		const data = await res.json()
		return data
	}
	return (
		<PageContent>
			<GradientText>Categories</GradientText>
			<div className="flex flex-col gap-4">
				{mockup.map((item, index) => (
					<CombinedAccordion
						color={item.color}
						title={item.title}
						inners={item.inners}
						innerTitles={item.innerTitles}
						innerContent={item.innerContent}
						key={index}
					></CombinedAccordion>
				))}
			</div>
		</PageContent>
	)
}
