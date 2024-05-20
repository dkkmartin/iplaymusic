import { cn } from '@/lib/utils'

export default function GradientText({
	children,
	className,
	headingSize = 'h1',
}: {
	children: string
	className?: string
	headingSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
	const HeadingSize = headingSize

	return (
		<HeadingSize
			className={cn(
				'scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-30% bg-clip-text text-transparent pb-8',
				className
			)}
		>
			{children}
		</HeadingSize>
	)
}
