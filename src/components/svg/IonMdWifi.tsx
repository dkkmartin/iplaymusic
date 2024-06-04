'use client'

import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import React, { SVGProps, useEffect, useState } from 'react'

export function IonMdWifi(props: SVGProps<SVGSVGElement>) {
	const pathname = usePathname()
	const { theme } = useTheme()
	const [fillColor, setFillColor] = useState<string>('')

	useEffect(() => {
		// My head hurt
		// Check if the current theme is 'dark'
		if (theme === 'dark') {
			// If the theme is 'dark' and the current pathname is not '/recommender'
			if (pathname !== '/recommender') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('#000')
			} else {
				// If the theme is 'dark' and the current pathname is '/recommender'
				// Set fillColor to '#fff'
				// This is the color for selected nav item
				setFillColor('#fff')
			}
		} else {
			// If the theme is not 'dark'
			// And the current pathname is not '/recommender'
			if (pathname !== '/recommender') {
				// Set fillColor to 'url(#grad)'
				// This is the color for not selected nav item
				setFillColor('#fff')
			} else {
				// If the theme is not 'dark' and the current pathname is '/recommender'
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
			<defs></defs>
			<path
				d="M256 228.719c-22.879 0-41.597 18.529-41.597 41.18 0 22.652 18.718 41.182 41.597 41.182 22.878 0 41.597-18.529 41.597-41.182 0-22.651-18.719-41.18-41.597-41.18zm124.8 41.179c0-67.946-56.163-123.539-124.8-123.539s-124.8 55.593-124.8 123.539c0 45.303 24.961 85.447 62.396 107.072l20.807-36.032c-24.972-14.417-41.604-40.153-41.604-71.04 0-45.295 37.433-82.358 83.201-82.358 45.771 0 83.201 37.063 83.201 82.358 0 30.887-16.633 56.623-41.604 71.04l20.807 36.032c37.433-21.624 62.396-61.769 62.396-107.072zM256 64C141.597 64 48 156.654 48 269.898 48 346.085 89.592 411.968 152 448l20.799-36.032c-49.919-28.824-83.207-81.324-83.207-142.069 0-90.593 74.891-164.718 166.408-164.718 91.517 0 166.406 74.125 166.406 164.718 0 60.745-33.284 114.271-83.205 142.069L360 448c62.406-36.032 104-101.915 104-178.102C464 156.654 370.403 64 256 64z"
				fill={fillColor}
			></path>
		</svg>
	)
}
export default IonMdWifi
