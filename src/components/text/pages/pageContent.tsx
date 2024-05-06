import { ReactNode } from 'react'

interface PageContentProps {
	children: ReactNode
	className?: string
}

export default function PageContent({ children, className }: PageContentProps) {
	return <section className={`p-4 ${className}`}>{children}</section>
}
