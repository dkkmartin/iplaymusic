'use client'

import {
	handleDeviceChange,
	startNewPlaybackContext,
	startNewPlaybackTrack,
} from '@/lib/spotify/utils'
import { useCurrentDeviceStore, usePlaybackStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import React from 'react'

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

	function handlePlayTrack() {
		if (!uri) return
		if (!playbackState) {
			if (!currentDeviceState) return
			handleDeviceChange(currentDeviceState, token)
			startNewPlaybackTrack(token, uri)
		} else {
			startNewPlaybackTrack(token, uri)
		}
	}

	function handlePlayContext() {
		if (!contextUri || !position || !currentDeviceState) return
		if (!playbackState) {
			if (!currentDeviceState) return
			handleDeviceChange(currentDeviceState, token)
			startNewPlaybackContext(token, contextUri, position)
		} else {
			startNewPlaybackContext(token, contextUri, position)
		}
	}

	// Recursive function to check if a given element or its children contain the track name
	// Spotfiy API for playback state doesn't specify which track number is playing in a playlist
	// So we have to check if the track name is contained in the children
	function containsTrackName(element: React.ReactNode): boolean {
		if (React.isValidElement(element)) {
			if (
				typeof element.props.children === 'string' &&
				element.props.children.includes(playbackState?.item?.name)
			) {
				return true
			}

			if (Array.isArray(element.props.children)) {
				return element.props.children.some(containsTrackName)
			}

			if (React.isValidElement(element.props.children)) {
				return containsTrackName(element.props.children)
			}
		}
		return false
	}

	// Check if children contains the name of the currently playing track
	const isPlaying = React.Children.toArray(children).some(containsTrackName)

	// Single track playback
	// If the playback state uri is the same as the uri prop, color it green
	return !playbackState ? (
		<div onClick={handleClick} className={className}>
			{children}
		</div>
	) : playbackState.item?.uri === uri || isPlaying ? (
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
