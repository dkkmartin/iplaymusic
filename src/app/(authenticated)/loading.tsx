import { AudioSpinner } from '@/components/svg/audioSpinner'

export default function Loading() {
	return (
		<div className="h-full w-full flex justify-center items-center">
			<AudioSpinner></AudioSpinner>
		</div>
	)
}
