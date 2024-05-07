import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	InnerAccordion,
	InnerAccordionContent,
	InnerAccordionItem,
	InnerAccordionTrigger,
} from '@/components/ui/innerAccordion'

export default function CombinedAccordion({
	color,
	title,
	inners,
	innerTitles,
	innerContent,
}: {
	color: string
	title: string
	inners: number
	innerTitles: string[]
	innerContent: string[]
}) {
	return (
		<Accordion className="rounded-md" style={{ backgroundColor: color }} type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger>{title}</AccordionTrigger>
				<AccordionContent>
					<InnerAccordion className="text-black" type="single" collapsible>
						{Array.from({ length: inners }, (_, i) => (
							<InnerAccordionItem key={i} value={`item-${i + 1}`}>
								<InnerAccordionTrigger>{innerTitles[i]}</InnerAccordionTrigger>
								<InnerAccordionContent>{innerContent[i]}</InnerAccordionContent>
							</InnerAccordionItem>
						))}
					</InnerAccordion>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
