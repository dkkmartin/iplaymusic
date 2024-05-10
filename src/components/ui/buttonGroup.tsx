import React from 'react'
import { Button } from './button'

interface ButtonGroupProps {
	buttonLabels: string[]
}

export default function ButtonGroup({ buttonLabels }: ButtonGroupProps) {
	return (
		<div className="flex rounded">
			{buttonLabels.map((label, index) => {
				const isOdd = (number: number) => number % 2 === 1
				const isEven = (number: number) => number % 2 === 0
				const isFirst = index === 0
				const isLast = index === buttonLabels.length - 1
				let className

				if (buttonLabels.length === 2) {
					className = isFirst
						? 'rounded-tr-none rounded-br-none border-r'
						: 'rounded-tl-none rounded-bl-none'
				} else if (buttonLabels.length > 2 && buttonLabels.length < 5) {
					className = isFirst
						? 'rounded-tr-none rounded-br-none'
						: isLast
						? 'rounded-tl-none rounded-bl-none'
						: isOdd(index)
						? 'rounded-none border-r border-l'
						: isEven(index)
						? 'rounded-none border-r'
						: 'rounded-none'
				} else if (buttonLabels.length > 5) {
					className = isFirst
						? 'rounded-tr-none rounded-br-none border-r'
						: isLast
						? 'rounded-tl-none rounded-bl-none'
						: isOdd(index)
						? 'rounded-none border-r'
						: isEven(index)
						? 'rounded-none border-r'
						: 'rounded-none'
				}

				return (
					<Button aria-label={label} className={className} key={index}>
						{label}
					</Button>
				)
			})}
		</div>
	)
}
