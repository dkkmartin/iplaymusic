import Image from 'next/image'

export default function ImageCardWithOverlay({
	imgSrc,
	imageAlt,
	text,
	subText,
}: {
	imgSrc: string
	imageAlt: string
	text: string
	subText: string
}) {
	return (
		<article className="min-h-[450px] w-full relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 max-w-sm mx-auto">
			<Image className="rounded-md object-cover" src={imgSrc} alt={imageAlt} fill={true}></Image>
			<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
			<h3 className="z-10 mt-3 text-3xl font-bold text-white">{text}</h3>
			<div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">{subText}</div>
		</article>
	)
}
