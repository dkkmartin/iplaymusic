'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SpotfiyPlayback } from '../svg/spotifyPlayback'
import { Smartphone, Tv2, Headphones } from 'lucide-react'
import { Device } from '@/types/spotify/devices'
import { getDevices, getPlaybackState, handleDeviceChange, sleep } from '@/lib/spotify/utils'
import { useSession } from 'next-auth/react'
import { useDeviceStore } from '@/lib/stores'
import { cn } from '@/lib/utils'

export default function PlaybackChanger({ className }: { className?: string }) {
	const { data: session, status } = useSession()
	const devicesState = useDeviceStore((state) => state.devicesState)

	function handleMenuClick() {
		if (status === 'authenticated') {
			getDevices(session?.user?.token ?? '')
			getPlaybackState(session?.user?.token ?? '')
		}
	}

	if (status === 'authenticated') {
		return (
			<DropdownMenu onOpenChange={handleMenuClick}>
				<DropdownMenuTrigger>
					<SpotfiyPlayback className={cn('size-5', className)}></SpotfiyPlayback>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="dark:bg-[#111625]">
					<DropdownMenuLabel className="text-center">Devices</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{devicesState &&
						devicesState?.devices?.map((device: Device) => (
							<DropdownMenuItem
								className={`flex gap-1 ${device.is_active ? 'text-green-600' : ''}`}
								onClick={() => {
									handleDeviceChange(device.id, session?.user.token ?? '')
									handleMenuClick()
								}}
								key={device.id}
							>
								{device.type === 'Smartphone' ? (
									<Smartphone
										className={`size-4 ${device.is_active ? 'text-green-600' : ''}`}
									></Smartphone>
								) : device.type === 'Computer' ? (
									<Tv2 className={`size-4 ${device.is_active ? 'text-green-600' : ''}`}></Tv2>
								) : (
									<Headphones className="size-3 text-green-600"></Headphones>
								)}
								{device.name}
							</DropdownMenuItem>
						))}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}
