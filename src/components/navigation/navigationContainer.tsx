import { authOptions } from '@/lib/authOptions'
import NavigationBar from './navigationBar'
import SettingsButton from './settings'
import { getServerSession } from 'next-auth'
import { WebPlayback } from '../player/musicPlayer'

export default async function NavigationContainer() {
	const session = await getServerSession(authOptions)
	return (
		<div className="fixed bottom-0  w-full">
			{session?.user.token ? <WebPlayback token={session?.user.token}></WebPlayback> : null}

			<div className="grid grid-cols-10 items-center justify-center h-[65px] shadow-[0px_0px_20px_5px_#00000024] max-w-md bg-background dark:bg-[#111625]">
				<NavigationBar className="col-start-1 col-end-9 max-w-[340px]"></NavigationBar>
				<SettingsButton className="col-start-9 justify-self-center ml-8"></SettingsButton>
			</div>
		</div>
	)
}
