export default function GradientText({ children }: { children: string }) {
	return (
		<h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-[#FF6A00] from-10% to-[#EE0979] to-30% bg-clip-text text-transparent pb-8">
			{children}
		</h1>
	)
}
