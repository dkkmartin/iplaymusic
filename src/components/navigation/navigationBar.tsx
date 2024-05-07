'use client'

import IonIosContrast from '../svg/IonIosContrast'
import IonIosMicrophone from '../svg/IonIosMicrophone'
import IonMdPulse from '../svg/IonMdPulse'
import IonMdWifi from '../svg/IonMdWifi'
import { Button } from '../ui/button'
import SettingsButton from './settings'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function NavigationBar() {
	const { theme } = useTheme()
	return (
		<nav
			className={
				'h-[65px] w-full flex items-center justify-evenly fixed bottom-0 shadow-[0px_0px_20px_5px_#00000024] max-w-md ' +
				(theme === 'dark' ? 'bg-[#111625]' : 'bg-background')
			}
		>
			<Link href={'/categories'}>
				<Button variant="ghost" className="p-0">
					<IonMdPulse className="size-7" />
				</Button>
			</Link>
			<Link href={'/'}>
				<Button variant="ghost">
					<IonIosMicrophone className="size-7" />
				</Button>
			</Link>
			<div className="size-11 flex justify-center items-center relative bg-gradient-to-r from-[#EE0979] from-10% to-[#FF6A00] to-90% z-0 rounded-full">
				<Button variant="ghost">
					<IonMdWifi className="relative size-8 z-10" />
				</Button>
			</div>
			<Link href={'/playlist'}>
				<Button variant="ghost">
					<IonIosContrast className="size-7" />
				</Button>
			</Link>
			<SettingsButton></SettingsButton>
		</nav>
	)
}
