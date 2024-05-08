import { create } from 'zustand'

type Store = {
	firstTime: boolean
	setFirstTime: (value: boolean) => void
}

export const firstTimeStore = create<Store>((set) => ({
	firstTime: true,
	setFirstTime: (value: boolean) => set({ firstTime: value }),
}))
