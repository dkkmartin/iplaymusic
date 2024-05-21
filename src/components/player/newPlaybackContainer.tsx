'use client'

import {
	handleDeviceChange,
	startNewPlaybackContext,
	startNewPlaybackTrack,
} from '@/lib/spotify/utils'
import { useCurrentDeviceStore, usePlaybackStore } from '@/lib/stores'
import { cn } from '@/lib/utils'

interface NewPlaybackProps {
	children: React.ReactNode
	className?: string
	token: string
	uri?: string
	contextUri?: string
	position?: number
}

export default function NewPlaybackContainer({
	children,
	className,
	token,
	uri,
	contextUri,
	position,
}: NewPlaybackProps) {
	const playbackState = usePlaybackStore((state) => state?.playbackState)
	const currentDeviceState = useCurrentDeviceStore((state) => state?.currentDevice)

	function handleClick() {
		if (uri) handlePlayTrack()
		if (contextUri) handlePlayContext()
	}

	async function handlePlayTrack() {
		if (!uri) return
		if (!playbackState) {
			if (!currentDeviceState) return
			await handleDeviceChange(currentDeviceState, token)
			startNewPlaybackTrack(token, uri)
		} else {
			startNewPlaybackTrack(token, uri)
		}
	}

	function handlePlayContext() {
		if (!contextUri || !position || !currentDeviceState) return
		handleDeviceChange(currentDeviceState, token)
		startNewPlaybackContext(token, contextUri, position)
	}

	// Single track playback
	// If the playback state uri is the same as the uri prop, color it green
	return !playbackState ? (
		<div onClick={handleClick} className={className}>
			{children}
		</div>
	) : playbackState.item?.uri === uri ? (
		<div onClick={handleClick} className={cn('text-green-600', className)}>
			{children}
		</div>
	) : // Album playback
	// If the playback state album uri is the same as the contextUri prop
	// and the playback state track number is the same as the position prop, color it green
	playbackState.item?.album?.uri === contextUri && playbackState.item?.track_number === position ? (
		<div onClick={handleClick} className={cn('text-green-600', className)}>
			{children}
		</div>
	) : (
		<div onClick={handleClick} className={className}>
			{children}
		</div>
	)
}
