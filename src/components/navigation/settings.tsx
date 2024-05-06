import { ThemeSwitcher } from './theme-switcher'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import IonSettingsSharp from '../svg/IonSettingsSharp'

export default function SettingsButton() {
	return (
		<Sheet>
			<SheetTrigger>
				<IonSettingsSharp className="size-7" />
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-4">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<Separator />
				</SheetHeader>
				<ThemeSwitcher></ThemeSwitcher>
			</SheetContent>
		</Sheet>
	)
}
