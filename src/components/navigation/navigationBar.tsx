'use client'

import IonIosContrast from '../svg/IonIosContrast'
import IonIosMicrophone from '../svg/IonIosMicrophone'
import IonMdPulse from '../svg/IonMdPulse'
import IonMdWifi from '../svg/IonMdWifi'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function NavigationBar({ className }: { className?: string }) {
	return (
		<nav className={'flex items-center gap-4 justify-evenly ' + className}>
			<Link href={'/categories'}>
				<Button variant="ghost">
					<IonMdPulse className="size-7" />
				</Button>
			</Link>
			<Link href={'/'}>
				<Button variant="ghost">
					<IonIosMicrophone className="size-7" />
				</Button>
			</Link>
			<Link href={'/recommender'}>
				<div className="size-11 flex justify-center items-center relative bg-gradient-to-r from-[#EE0979] from-10% to-[#FF6A00] to-90% z-0 rounded-full">
					<Button variant="ghost" className="p-0">
						<IonMdWifi className="relative size-8 z-10" />
					</Button>
				</div>
			</Link>
			<Link href={'/featured-playlists'}>
				<Button variant="ghost">
					<IonIosContrast className="size-7" />
				</Button>
			</Link>
		</nav>
	)
}
