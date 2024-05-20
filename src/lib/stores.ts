import { create } from 'zustand'
import { Root as playbackRoot } from '@/types/player/playbackState'
import { Root as deviceRoot } from '@/types/player/devices'

type playbackStore = {
	playbackState: playbackRoot | undefined
	setPlaybackState: (newState: playbackRoot) => void
}

export const usePlaybackStore = create<playbackStore>((set) => ({
	playbackState: undefined,
	setPlaybackState: (newState) => set(() => ({ playbackState: newState })),
}))

type deviceStore = {
	devicesState: deviceRoot | undefined
	setDevicesState: (newState: deviceRoot) => void
}

export const useDeviceStore = create<deviceStore>((set) => ({
	devicesState: undefined,
	setDevicesState: (newState) => set(() => ({ devicesState: newState })),
}))

type currentDeviceStore = {
	currentDevice: string | undefined
	setCurrentDevice: (newState: string) => void
}

export const useCurrentDeviceStore = create<currentDeviceStore>((set) => ({
	currentDevice: undefined,
	setCurrentDevice: (newState) => set(() => ({ currentDevice: newState })),
}))
