import PageContent from '@/components/pages/pageContent'
import { Input } from '@/components/ui/input'

export default function Search() {
	return (
		<PageContent>
			<Input className="dark:bg-[#111625]" type="search" placeholder="Search" />
		</PageContent>
	)
}
