import { createOpenAI } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

const groq = createOpenAI({
	baseURL: 'https://api.groq.com/openai/v1',
	apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
	const { messages } = await req.json()

	const result = await streamText({
		model: groq('llama3-70b-8192'),
		system:
			'This LLM is integrated with a Spotify-inspired music player and is called iPlayMusic also i is tasked with generating music recommendations based on user input. It should respond to user queries, understand their preferences, and provide personalized suggestions.',
		messages,
	})

	return new StreamingTextResponse(result.toAIStream())
}
