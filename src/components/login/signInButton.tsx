'use client'

import LogosSpotify from '@/components/svg/LogosSpotify'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function SignInButton() {
	return (
		<div className="flex flex-col gap-4 items-center justify-center">
			<LogosSpotify className="w-full size-20"></LogosSpotify>
			<Link href="/api/auth/signin" className="w-full">
				<Button
					onClick={() => signIn('spotify', { callbackUrl: '/' })}
					aria-label="Login"
					variant={'outline'}
					className="w-full h-12 rounded-full bg-green-500 dark:border-white border-2 font-bold text-lg hover:bg-background"
				>
					Log in with Spotify
				</Button>
			</Link>
		</div>
	)
}
