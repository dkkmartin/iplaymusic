import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import NavigationBar from '@/components/navigation/navigationBar'
import HeaderNavigation from '@/components/header/headerNavigation'

const poppins = Poppins({
	style: 'normal',
	weight: '400',
	subsets: ['latin'],
	variable: '--font-poppins',
})

export const revalidate = 3600

export const metadata: Metadata = {
	title: 'IPlayMusic',
	description: 'Play music',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn('min-h-screen font-poppins antialiased')}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<HeaderNavigation></HeaderNavigation>
					{children}
					<NavigationBar />
				</ThemeProvider>
			</body>
		</html>
	)
}
