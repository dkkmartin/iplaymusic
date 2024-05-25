import { create } from 'zustand'
import { Root as playbackRoot } from '@/types/player/playbackState'
import { Root as deviceRoot } from '@/types/player/devices'
import { Root as userTopArtistsRoot } from '@/types/user/topArtists'
import { Root as userTopTracksRoot } from '@/types/user/topTracks'

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

type userTopItemsStore = {
	topTracks: userTopTracksRoot | undefined
	setTopTracks: (newState: userTopTracksRoot) => void
	topArtists: userTopArtistsRoot | undefined
	setTopArtists: (newState: userTopArtistsRoot) => void
}

export const useUserTopItemsStore = create<userTopItemsStore>((set) => ({
	topTracks: undefined,
	setTopTracks: (newState) => set(() => ({ topTracks: newState })),
	topArtists: undefined,
	setTopArtists: (newState) => set(() => ({ topArtists: newState })),
}))

type Message = {
	id: string
	role: string
	content: string
}

type chatStore = {
	chatMessages: Message[] | undefined
	setChatMessages: (newState: Message[]) => void
}

export const useChatStore = create<chatStore>((set) => ({
	chatMessages: undefined,
	setChatMessages: (newState) => set(() => ({ chatMessages: newState })),
}))
