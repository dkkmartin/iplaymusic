'use client'

import { ThemeSwitcher } from './theme-switcher'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import IonSettingsSharp from '../svg/IonSettingsSharp'
import { useTheme } from 'next-themes'

export default function SettingsButton() {
	const { theme } = useTheme()
	return (
		<Sheet>
			<SheetTrigger>
				<IonSettingsSharp className="size-7" />
			</SheetTrigger>
			<SheetContent
				className={'flex flex-col gap-4 ' + (theme === 'dark' ? 'bg-[#111625]' : 'bg-background')}
			>
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<Separator />
				</SheetHeader>
				<ThemeSwitcher></ThemeSwitcher>
			</SheetContent>
		</Sheet>
	)
}
