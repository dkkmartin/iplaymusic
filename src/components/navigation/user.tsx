import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Separator } from '@/components/ui/separator'

export default async function User() {
	const session = await getServerSession(authOptions)
	console.log(session)
	if (session) {
		return (
			<Dialog>
				<DialogTrigger>
					<Button className="w-full dark:bg-[#111625] dark:border-white" variant={'outline'}>
						Profile
					</Button>
				</DialogTrigger>
				<DialogContent className="dark:bg-[#111625] dark:border-white w-11/12 rounded-lg">
					<DialogHeader className="grid grid-cols-[1fr_2fr_1fr] justify-items-center items-center">
						<Avatar className="justify-self-start">
							<AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
							<AvatarFallback>{(session?.user?.name ?? '').slice(0, 1)}</AvatarFallback>{' '}
						</Avatar>
						<DialogTitle className="">
							<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-wrap">
								{session?.user?.name}
							</h1>
						</DialogTitle>
					</DialogHeader>
					<Separator className="dark:bg-white" />
					<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Email:</h4>
					<p className="leading-7">{session?.user?.email}</p>
				</DialogContent>
			</Dialog>
		)
	}
}