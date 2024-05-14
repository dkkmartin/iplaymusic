import { SVGProps } from 'react'

export function SpotfiyPlayback(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<path d="M0 21h24"></path>
				<rect width="15" height="13" x="4" y="3" rx="2"></rect>
			</g>
		</svg>
	)
}
