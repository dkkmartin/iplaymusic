import { create } from 'zustand'
import { Root as playbackRoot } from '@/types/spotify/playbackState'
import { Root as deviceRoot } from '@/types/spotify/devices'

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
