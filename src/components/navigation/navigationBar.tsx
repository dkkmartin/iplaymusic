import IonIosContrast from '../svg/IonIosContrast'
import IonIosMicrophone from '../svg/IonIosMicrophone'
import IonMdPulse from '../svg/IonMdPulse'
import IonMdWifi from '../svg/IonMdWifi'
import { Button } from '../ui/button'
import SettingsButton from './settings'

export default function NavigationBar() {
	return (
		<nav className="h-[65px] w-full flex items-center justify-evenly absolute bottom-0 shadow-md">
			<Button variant="ghost" className="p-0">
				<IonMdPulse className="size-7" />
			</Button>
			<Button variant="ghost">
				<IonIosMicrophone className="size-7" />
			</Button>
			<div className="size-11 flex justify-center items-center relative bg-gradient-to-r from-[#EE0979] from-10% to-[#FF6A00] to-90% z-0 rounded-full">
				<Button variant="ghost">
					<IonMdWifi className="relative size-8 z-10" />
				</Button>
			</div>
			<Button variant="ghost">
				<IonIosContrast className="size-7" />
			</Button>
			<SettingsButton></SettingsButton>
		</nav>
	)
}
