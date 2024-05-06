import GradientText from '@/components/text/gradientHeading'
import Image from 'next/image'

export default function Home() {
	return (
		<article>
			<GradientText>Featured</GradientText>
			<Image
				className="rounded-md"
				src={'https://placehold.co/325x425'}
				width={325}
				height={425}
				alt="Placeholder"
			></Image>
		</article>
	)
}
