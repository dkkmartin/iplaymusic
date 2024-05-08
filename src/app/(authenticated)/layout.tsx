import HeaderNavigation from '@/components/header/headerNavigation'
import NavigationContainer from '@/components/navigation/navigationContainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'IPlayMusic',
	description: 'Play music',
}

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<HeaderNavigation />
				{children}
				<NavigationContainer />
			</body>
		</html>
	)
}
