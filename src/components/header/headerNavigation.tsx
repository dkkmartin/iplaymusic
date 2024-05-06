'use client'

import { ChevronLeft, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'

export default function HeaderNavigation() {
	const router = useRouter()
	const pathname = usePathname()
	const modiefiedPathname = pathname === '/' ? 'featured' : pathname
	return (
		<header className="flex justify-between items-center h-20 px-4">
			<Button variant={'ghost'} size={'icon'} onClick={() => router.back()}>
				<ChevronLeft className="size-8"></ChevronLeft>
			</Button>
			<h1 className="text-lg font-light">{modiefiedPathname.toUpperCase()}</h1>
			<Button variant={'ghost'} size={'icon'}>
				<Search></Search>
			</Button>
		</header>
	)
}
