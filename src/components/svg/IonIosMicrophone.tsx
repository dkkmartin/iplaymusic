import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { SVGProps, useEffect, useState } from 'react'

export function IonIosMicrophone(props: SVGProps<SVGSVGElement>) {
	const pathname = usePathname()
	const { theme } = useTheme()
	const [fillColor, setFillColor] = useState<string>('')

	useEffect(() => {
		// My head hurt
		// Check if the current theme is 'dark'
		if (theme === 'dark') {
			// If the theme is 'dark' and the current pathname is not '/'
			if (pathname !== '/') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('url(#grad)')
			} else {
				// If the theme is 'dark' and the current pathname is '/'
				// Set fillColor to '#fff'
				// This is the color for selected nav item
				setFillColor('#fff')
			}
		} else {
			// If the theme is not 'dark'
			// And the current pathname is not '/'
			if (pathname !== '/') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('url(#grad)')
			} else {
				// If the theme is not 'dark' and the current pathname is '/'
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
				d="M315 204h72.6c6.6 0 12.3-5.2 12.4-11.8.1-6.7-5.3-12.2-12-12.2h-73c-6.7 0-12.1-5.5-12-12.2.1-6.6 5.8-11.8 12.4-11.8h76.5c4.5 0 8.2-3.7 8-8.2-1.7-47.5-31.2-88.1-72.7-106-5.3-2.3-11.2 1.6-11.2 7.3v35.5c0 6.6-5.2 12.3-11.8 12.4-6.7.1-12.2-5.3-12.2-12V44c0-6.6-5.4-12-12-12s-12 5.4-12 12v56.6c0 6.6-5.2 12.3-11.8 12.4-6.7.1-12.2-5.3-12.2-12V44c0-6.6-5.4-12-12-12s-12 5.4-12 12v40.6c0 6.6-5.2 12.3-11.8 12.4-6.7.1-12.2-5.3-12.2-12V49.1c0-5.8-5.9-9.6-11.2-7.3-41.5 17.9-71.1 58.6-72.7 106-.2 4.5 3.5 8.2 8 8.2h76.5c6.6 0 12.3 5.2 12.4 11.8.1 6.7-5.3 12.2-12 12.2h-72.6c-6.6 0-12.3 5.2-12.4 11.8-.1 6.7 5.3 12.2 12 12.2h72.6c6.6 0 12.3 5.2 12.4 11.8.1 6.7-5.3 12.2-12 12.2h-72.6c-6.6 0-12.3 5.2-12.4 11.8-.1 6.7 5.3 12.2 12 12.2h72.6c6.6 0 12.3 5.2 12.4 11.8.1 6.7-5.3 12.2-12 12.2h-76.9c-4.5 0-8.2 3.7-8 8.2.5 13.6 3.3 26.7 7.9 38.8 1.2 3.1 4.2 5 7.4 5h257.1c3.3 0 6.3-2 7.4-5 4.7-12.1 7.5-25.2 7.9-38.8.2-4.5-3.5-8.2-8-8.2h-76.5c-6.6 0-12.3-5.2-12.4-11.8-.1-6.7 5.3-12.2 12-12.2h72.6c6.6 0 12.3-5.2 12.4-11.8.1-6.7-5.3-12.2-12-12.2h-72.6c-6.6 0-12.3-5.2-12.4-11.8 0-6.7 5.4-12.2 12.1-12.2z"
				fill={fillColor}
			></path>
			<path
				d="M141.5 358.6c19 22 45.2 37.2 75.4 40.8 4 .5 7.1 3.9 7.1 7.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32v-40.7c0-4.1 3.1-7.5 7.1-7.9 30.3-3.5 56.4-18.7 75.4-40.8 2.2-2.6.3-6.6-3.1-6.6H144.5c-3.4 0-5.2 4-3 6.6z"
				fill={fillColor}
			></path>
		</svg>
	)
}
export default IonIosMicrophone
