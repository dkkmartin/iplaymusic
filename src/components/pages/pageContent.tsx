import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageContentProps {
	children: ReactNode
	className?: string
	ref?: React.Ref<HTMLDivElement>
}

export default function PageContent({ children, className, ref }: PageContentProps) {
	return <section className={cn('p-6 mb-32', className)}>{children}</section>
}
