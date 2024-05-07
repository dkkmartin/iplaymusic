import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import React, { SVGProps } from 'react'

export function IonIosContrast(props: SVGProps<SVGSVGElement>) {
	const pathname = usePathname()
	const { theme } = useTheme()
	let fillColor

	// My head hurt
	// Check if the current theme is 'dark'
	if (theme === 'dark') {
		// If the theme is 'dark' and the current pathname is not '/playlist'
		if (pathname !== '/playlist') {
			// Set fillColor to 'url(#grad)'
			// This is the color for not selected nav item
			fillColor = 'url(#grad)'
		} else {
			// If the theme is 'dark' and the current pathname is '/playlist'
			// Set fillColor to '#fff'
			// This is the color for selected nav item
			fillColor = '#fff'
		}
	} else {
		// If the theme is not 'dark'
		// And the current pathname is not '/playlist'
		if (pathname !== '/playlist') {
			// Set fillColor to 'url(#grad)'
			// This is the color for not selected nav item
			fillColor = 'url(#grad)'
		} else {
			// If the theme is not 'dark' and the current pathname is '/playlist'
			// Set fillColor to '#000'
			// This is the color for selected nav item
			fillColor = '#000'
		}
	}

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
				d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm127.3 335.3c-34 34-79.2 52.7-127.3 52.7V76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3z"
				fill={fillColor}
			></path>
		</svg>
	)
}
export default IonIosContrast
