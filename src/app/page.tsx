import GradientText from '@/components/text/gradientHeading'
import PageContent from '@/components/text/pages/pageContent'
import Image from 'next/image'

export default function Home() {
	return (
		<PageContent className="">
			<GradientText>Featured</GradientText>
			<Image
				className="rounded-md"
				src={'https://placehold.co/325x425'}
				width={325}
				height={425}
				alt="Placeholder"
			></Image>
		</PageContent>
	)
}
