'use client'

import { ChevronLeft, Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function HeaderNavigation() {
	const router = useRouter()
	const pathname = usePathname()
	let modiefiedPathname

	if (pathname === '/') {
		modiefiedPathname = 'featured'
	} else if (pathname.startsWith('/artist')) {
		modiefiedPathname = 'artist'
	} else {
		modiefiedPathname = pathname.slice(1)
	}

	return (
		<header
			className={`grid grid-cols-3 items-center z-10 rounded-full h-10 w-11/12 px-4 backdrop-blur-lg ${
				pathname.startsWith('/artist') ? 'fixed m-auto left-0 right-0 top-2' : 'sticky top-2 m-auto'
			}`}
		>
			<Button
				aria-label="Go back"
				className="justify-self-start"
				variant={'ghost'}
				size={'icon'}
				onClick={() => router.back()}
			>
				<ChevronLeft className="size-10"></ChevronLeft>
			</Button>

			<h1 className="text-lg font-light justify-self-center col-start-2 uppercase">
				{modiefiedPathname}
			</h1>
			<Link href="/search" className="justify-self-end col-start-3">
				<Button aria-label="Search" variant={'ghost'} size={'icon'}>
					<Search></Search>
				</Button>
			</Link>
		</header>
	)
}
