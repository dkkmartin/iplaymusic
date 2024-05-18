import { useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { playbackSeeker } from '@/lib/spotify/utils'
import { usePlaybackStore } from '@/lib/stores'

export default function PlayerSeeker({ token }: { token: string }) {
	const playbackState = usePlaybackStore((state) => state.playbackState)
	const [sliderValue, setSliderValue] = useState(playbackState?.progress_ms || 0)

	useEffect(() => {
		if (playbackState?.progress_ms) {
			setSliderValue(playbackState?.progress_ms)
		}
	}, [playbackState])

	const msToTime = (duration: number) => {
		const minutes = Math.floor(duration / 60000)
		const seconds = Number(((duration % 60000) / 1000).toFixed(0))
		return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
	}

	return (
		<>
			<Slider
				className="dark:text-[#111625]"
				defaultValue={[0]}
				max={playbackState?.item?.duration_ms || 0}
				value={[sliderValue]}
				step={1}
				onValueChange={(value) => setSliderValue(value[0])}
				onValueCommit={(value) => playbackSeeker(token, value[0])}
			/>
			<div className="w-full flex justify-between">
				<div className="text-sm text-muted-foreground">{msToTime(sliderValue)}</div>
				<div className="text-sm text-muted-foreground">
					{msToTime(playbackState?.item?.duration_ms || 0)}
				</div>
			</div>
		</>
	)
}
