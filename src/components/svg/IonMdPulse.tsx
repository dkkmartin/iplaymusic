'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { SVGProps, useEffect, useState } from 'react'

export function IonMdPulse(props: SVGProps<SVGSVGElement>) {
	const pathname = usePathname()
	const { theme } = useTheme()
	const [fillColor, setFillColor] = useState<string>('')

	useEffect(() => {
		// My head hurt
		// Check if the current theme is 'dark'
		if (theme === 'dark') {
			// If the theme is 'dark' and the current pathname is not '/categories'
			if (pathname !== '/categories') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('url(#grad)')
			} else {
				// If the theme is 'dark' and the current pathname is '/categories'
				// Set fillColor to '#fff'
				// This is the color for selected nav item
				setFillColor('#fff')
			}
		} else {
			// If the theme is not 'dark'
			// And the current pathname is not '/categories'
			if (pathname !== '/categories') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('url(#grad)')
			} else {
				// If the theme is not 'dark' and the current pathname is '/categories'
				// Set fillColor to '#000'
				// This is the color for selected nav item
				setFillColor('#000')
			}
		}
	}, [pathname, theme])

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
				d="M428 269c-21.5 0-40.6 13.1-48.4 33h-41.2L307 221.3c-2.7-8.2-10.3-13.7-19-13.7h-.4c-8.8.2-16.4 6-18.8 14.5l-33.6 135.4-55.5-291.8C178 55.6 169.6 48 160 48c-9.5 0-16.9 6.2-19.4 16.2L90.3 302H32v40h74c9.2 0 17.2-6.2 19.4-15.2l30.7-160.6 54.1 282.1c1.5 8.8 8.9 15.1 18.6 15.7h1.2c9.3 0 16.9-5.3 19.2-13.5l40.2-162.9 15.5 40.7c2.7 8.2 10.3 13.7 19 13.7h56.4c8.3 19 27.1 31 47.6 31 13.9 0 26.9-5.6 36.8-15.8 9.8-10.1 15.2-23.3 15.2-37.2.1-28.6-22.7-51-51.9-51z"
				fill={fillColor}
			></path>
		</svg>
	)
}
export default IonMdPulse
