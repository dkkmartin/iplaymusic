import HeaderNavigation from '@/components/header/headerNavigation'
import NavigationContainer from '@/components/navigation/navigationContainer'

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
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
