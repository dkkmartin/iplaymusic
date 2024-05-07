'use client'

import { ChevronLeft, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'

export default function HeaderNavigation() {
	const router = useRouter()
	const pathname = usePathname()
	const modiefiedPathname = pathname === '/' ? 'featured' : pathname.slice(1)

	return (
		<header className="flex sticky top-2 z-10 justify-between m-auto rounded-full items-center h-10 w-11/12 px-4 backdrop-blur-lg">
			<Button variant={'ghost'} size={'icon'} onClick={() => router.back()}>
				<ChevronLeft className="size-10"></ChevronLeft>
			</Button>
			<h1 className="text-lg font-light">{modiefiedPathname.toUpperCase()}</h1>
			<Button variant={'ghost'} size={'icon'}>
				<Search></Search>
			</Button>
		</header>
	)
}
