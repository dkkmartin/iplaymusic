import { SVGProps } from 'react'

export function BigPauseButton(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<g
				fill="none"
				stroke="url(#grad)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" style={{ stopColor: 'rgb(255,106,0)', stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: 'rgb(238,9,121)', stopOpacity: 1 }} />
					</linearGradient>
				</defs>
				<rect width="4" height="16" x="14" y="4" rx="1"></rect>
				<rect width="4" height="16" x="6" y="4" rx="1"></rect>
			</g>
		</svg>
	)
}
