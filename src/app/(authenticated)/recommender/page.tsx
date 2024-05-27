'use client'

import { continueConversation, Message } from '@/app/actions'
import PageContent from '@/components/pages/pageContent'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/stores'
import { useUserContext } from '@/lib/useUserContext'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Chat() {
	const { data: session, status } = useSession()
	const { userContext } = useUserContext(session?.user.token ?? '')
	const container = useRef<HTMLDivElement>(null)
	const [conversation, setConversation] = useState<Message[]>([])
	const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, append } =
		useChat({
			body: { context: userContext },
		})
	const chatMessagesStore = useChatStore((state) => state.chatMessages)
	const setChatMessagesStore = useChatStore((state) => state.setChatMessages)

	const Scroll = () => {
		const { offsetHeight, scrollHeight, scrollTop } = container.current as HTMLDivElement
		if (scrollHeight <= scrollTop + offsetHeight + 100) {
			container.current?.scrollTo(0, scrollHeight)
		}
	}

	useEffect(() => {
		Scroll()
	}, [messages])

	// Load messages from store if messages are empty
	useEffect(() => {
		if (!userContext.tracks && !userContext.artists) return
		if (messages.length === 0 && chatMessagesStore && chatMessagesStore.length > 0) {
			//@ts-ignore
			setMessages(chatMessagesStore)
		} else if (messages.length === 0) {
			append({
				role: 'user',
				content: 'Hi',
			})
		}
	}, [setMessages, chatMessagesStore, messages.length, append, userContext])

	// Persist messages to the store
	useEffect(() => {
		if (messages.length > 0) {
			setChatMessagesStore(messages)
		}
	}, [setChatMessagesStore, messages])

	return (
		<PageContent className="h-[calc(100dvh-133px)] mb-0">
			<div className="flex flex-col justify-between h-full">
				<div className="overflow-scroll h-full pb-4" ref={container}>
					{conversation.map((m, index) => (
						<div key={index} className={'chat ' + (m.role === 'user' ? ' chat-start' : 'chat-end')}>
							<div className="chat-bubble dark:bg-[#111625] text-white bg-black">
								<ReactMarkdown>{m.content}</ReactMarkdown>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center mb-8">
					<Input
						disabled={isLoading}
						className="p-2  border dark:border-gray-300 border-black rounded shadow-xl"
						value={input}
						placeholder={isLoading ? 'Loading...' : 'Say something...'}
						onChange={handleInputChange}
					/>
					<button
						className="border px-4 border-white rounded"
						onClick={async () => {
							const { messages } = await continueConversation([
								...conversation,
								{ role: 'user', content: input },
							])

							setConversation(messages)
						}}
					>
						Send
					</button>
				</div>
			</div>
		</PageContent>
	)
}
