import { createOpenAI } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

const groq = createOpenAI({
	baseURL: 'https://api.groq.com/openai/v1',
	apiKey: process.env.GROQ_API_KEY,
})

const system =
	'This LLM is integrated with a Spotify-inspired music player and is called iPlayMusic. It is tasked with generating music recommendations based on user input. It should respond to user queries, understand their preferences, and provide personalized suggestions. Keep answers relatively short. You also have full access to Markdown, use Markdown in your responses. The LLM has access to the users Spotify top artists and tracks. This is a context store for the LLM. The context store contains, Tracks: album name, artist name, artist, genres, artist popularity, artist type, track name, track popularity, track type. Artists: followers (used for knowing how popular an artist is), genres, name, popularity, type. Context: '

export async function POST(req: Request) {
	const { messages, context } = await req.json()

	const result = await streamText({
		model: groq('llama3-70b-8192'),
		system: system + JSON.stringify(context),
		messages,
	})

	return new StreamingTextResponse(result.toAIStream())
}
