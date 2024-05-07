'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const InnerAccordion = AccordionPrimitive.Root

const InnerAccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn('text-white', className)} {...props} />
))
InnerAccordionItem.displayName = 'AccordionItem'

const InnerAccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center justify-between py-4 font-light text-lg transition-all hover:underline [&[data-state=open]>svg]:rotate-90 px-4',
				className
			)}
			{...props}
		>
			{children}
			<ChevronRight className="h-6 w-6 shrink-0 transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
))
InnerAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const InnerAccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden px-4 pt-4 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pb-4 pt-0', className)}>
			<ul className="list-disc pl-8">
				<li>{children}</li>
			</ul>
		</div>
	</AccordionPrimitive.Content>
))

InnerAccordionContent.displayName = AccordionPrimitive.Content.displayName

export { InnerAccordion, InnerAccordionItem, InnerAccordionTrigger, InnerAccordionContent }
