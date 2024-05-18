import { SVGProps } from 'react'

export function BigPlayButton(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 512 512"
			{...props}
		>
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style={{ stopColor: 'rgb(255,106,0)', stopOpacity: 1 }} />
					<stop offset="100%" style={{ stopColor: 'rgb(238,9,121)', stopOpacity: 1 }} />
				</linearGradient>
			</defs>
			<path
				d="M128 104.3v303.4c0 6.4 6.5 10.4 11.7 7.2l240.5-151.7c5.1-3.2 5.1-11.1 0-14.3L139.7 97.2c-5.2-3.3-11.7.7-11.7 7.1z"
				fill="url(#grad)"
			></path>
		</svg>
	)
}
