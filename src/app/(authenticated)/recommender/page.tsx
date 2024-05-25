'use client'

import PageContent from '@/components/pages/pageContent'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/stores'
import { useChat } from 'ai/react'
import { useEffect } from 'react'

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat()
	const chatMessagesStore = useChatStore((state) => state.chatMessages)
	const setChatMessagesStore = useChatStore((state) => state.setChatMessages)

	// Load messages from store if messages are empty
	useEffect(() => {
		if (messages.length === 0 && chatMessagesStore && chatMessagesStore.length > 0) {
			//@ts-ignore
			setMessages(chatMessagesStore)
		}
	}, [setMessages, chatMessagesStore, messages.length])

	// Persist messages to the store
	useEffect(() => {
		if (messages.length > 0) {
			setChatMessagesStore(messages)
		}
	}, [setChatMessagesStore, messages])

	return (
		<PageContent className="h-[calc(100dvh-133px)] mb-0">
			<div className="flex flex-col justify-between h-full">
				<div className="overflow-scroll h-full pb-4">
					{messages.map((m) => (
						<div key={m.id} className={'chat ' + (m.role === 'user' ? ' chat-start' : 'chat-end')}>
							<div className="chat-bubble dark:bg-[#111625] text-white bg-black">{m.content}</div>
						</div>
					))}
				</div>
				<form onSubmit={handleSubmit}>
					<Input
						className="p-2 mb-8 border dark:border-gray-300 border-black rounded shadow-xl"
						value={input}
						placeholder="Say something..."
						onChange={handleInputChange}
					/>
				</form>
			</div>
		</PageContent>
	)
}
