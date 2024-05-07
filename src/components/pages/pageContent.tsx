import { ReactNode } from 'react'

interface PageContentProps {
	children: ReactNode
	className?: string
}

export default function PageContent({ children, className }: PageContentProps) {
	return <section className={`p-6 mb-16 ${className}`}>{children}</section>
}
