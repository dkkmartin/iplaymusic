import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { StreamingTextResponse, streamText } from 'ai'

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_AI_API_KEY,
})

const model = google('models/gemini-1.5-flash-latest')

export async function POST(req: Request) {
	const { messages } = await req.json()

	const result = await streamText({
		model: openai('gpt-4-turbo'),
		messages,
	})

	return new StreamingTextResponse(result.toAIStream())
}
