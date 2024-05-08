import GradientText from '@/components/text/gradientHeading'
import PageContent from '@/components/pages/pageContent'
import ImageCardWithOverlay from '@/components/cards/ImageCardWithOverlay'

const mockup = [
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
	{
		src: '/stock.jpg',
		alt: 'Placeholder',
		text: 'The greatest showman',
		sub_text: 'Soundtrack',
	},
]

export default function Home() {
	return (
		<PageContent>
			<GradientText>Featured</GradientText>
			<div className="flex flex-col items-center gap-8">
				{mockup.map((item, index) => (
					<ImageCardWithOverlay
						key={index}
						imgSrc={item.src}
						imageAlt={item.alt}
						text={item.text}
						subText={item.sub_text}
					></ImageCardWithOverlay>
				))}
			</div>
		</PageContent>
	)
}
