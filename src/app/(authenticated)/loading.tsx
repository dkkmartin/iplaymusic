import { AudioSpinner } from '@/components/svg/audioSpinner'
import { cn } from '@/lib/utils'

export default function Loading({ className }: { className?: string }) {
	return (
		<div className={cn('h-[calc(100dvh-40px)] w-full flex justify-center items-center', className)}>
			<AudioSpinner></AudioSpinner>
		</div>
	)
}
