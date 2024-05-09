import { AudioSpinner } from '@/components/svg/audioSpinner'

export default function Loading() {
	return (
		<div className="h-[calc(100dvh-40px)] w-full flex justify-center items-center">
			<AudioSpinner></AudioSpinner>
		</div>
	)
}
