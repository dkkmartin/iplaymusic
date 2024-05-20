'use client'

import {
	handleDeviceChange,
	startNewPlaybackContext,
	startNewPlaybackTrack,
} from '@/lib/spotify/utils'
import { useCurrentDeviceStore, usePlaybackStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

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
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const currentDeviceState = useCurrentDeviceStore((state) => state.currentDevice)

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
		if (!contextUri || !position) return
		startNewPlaybackContext(token, contextUri, position)
	}

	return playbackState?.item.uri === uri ? (
		<div onClick={handleClick} className={cn('text-green-600', className)}>
			{children}
		</div>
	) : (
		<div onClick={handleClick} className={className}>
			{children}
		</div>
	)
}
