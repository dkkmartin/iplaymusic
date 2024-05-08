'use client'

import { ChevronLeft, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'

export default function HeaderNavigation() {
	const router = useRouter()
	const pathname = usePathname()
	const modiefiedPathname = pathname === '/' ? 'featured' : pathname.slice(1)

	return (
		<header className="grid grid-cols-3 items-center sticky top-2 z-10 m-auto rounded-full h-10 w-11/12 px-4 backdrop-blur-lg">
			<Button
				className="justify-self-start"
				variant={'ghost'}
				size={'icon'}
				onClick={() => router.back()}
			>
				<ChevronLeft className="size-10"></ChevronLeft>
			</Button>

			<h1 className="text-lg font-light justify-self-center col-start-2">
				{modiefiedPathname.toUpperCase()}
			</h1>
			<Button className="justify-self-end col-start-3" variant={'ghost'} size={'icon'}>
				<Search></Search>
			</Button>
		</header>
	)
}
