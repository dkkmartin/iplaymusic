import SignInButton from '@/components/login/signInButton'
import PageContent from '@/components/pages/pageContent'

export default function Login() {
	return (
		<PageContent className="dark:bg-[#FF1168] h-screen mb-0">
			<div className="flex flex-col justify-between h-1/2">
				<h1 className="scroll-m-20 text-4xl font-bold mt-4">Log in</h1>
				<SignInButton></SignInButton>
			</div>
		</PageContent>
	)
}
