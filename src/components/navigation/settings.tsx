import { ThemeSwitcher } from './theme-switcher'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import IonSettingsSharp from '../svg/IonSettingsSharp'
import User from './user'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function SettingsButton({ className }: { className?: string }) {
	return (
		<Sheet>
			<SheetTrigger className={'px-4 ' + className}>
				<IonSettingsSharp className="size-7" />
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-4 dark:bg-[#111625]">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<Separator className="dark:bg-white" />
				</SheetHeader>
				<ThemeSwitcher></ThemeSwitcher>
				<User></User>
				<Link href="/api/auth/signout">
					<Button className="dark:bg-[#111625] border-red-700 w-full" variant={'outline'}>
						Logout
					</Button>
				</Link>
			</SheetContent>
		</Sheet>
	)
}
