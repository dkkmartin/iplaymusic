import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import SessionWrapper from '@/components/sessionWrapper'

const poppins = Poppins({
	style: 'normal',
	weight: '400',
	subsets: ['latin'],
	variable: '--font-poppins',
})

export const revalidate = 3600
export const fetchCache = 'force-cache'

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
		<SessionWrapper>
			<html lang="en" suppressHydrationWarning>
				<body className={cn('min-h-screen font-poppins antialiased max-w-md m-auto')}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</SessionWrapper>
	)
}
