import { z } from 'zod'
import { createOpenAI } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText, tool } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const groq = createOpenAI({
	baseURL: 'https://api.groq.com/openai/v1',
	apiKey: process.env.GROQ_API_KEY,
})

const system =
	"This LLM, named iPlayMusic, is integrated with a Spotify-inspired music player and specializes in generating personalized music recommendations based on user input. Its primary tasks include responding to user queries, understanding their preferences, and providing tailored suggestions. Instructions: - Keep responses concise: Ensure that the LLM's responses are brief and to the point, optimizing user engagement. - Utilize Markdown: You have full access to Markdown for formatting responses. - Contextual Information: The LLM has access to users' Spotify top artists and tracks stored in a context store. The context includes information such as Tracks (album name, artist name, genres, popularity), and Artists (followers, genres, popularity). - Avoid recommending songs from the context: In generating recommendations, the LLM should avoid suggesting songs already present in the context store.Additional Recommendations: - Personalization: Strive to tailor recommendations based on user preferences and historical interactions. - Diverse Suggestions: Offer a variety of music genres and artists to cater to different tastes and moods. - Continuous Learning: Continuously update the recommendation model based on user feedback and evolving preferences. - User Interaction: Encourage users to provide feedback on recommendations to improve future suggestions. - Privacy Consideration: Ensure that user data is handled securely and in compliance with privacy regulations.Context Store: - Tracks: Album name, artist name, artist, genres, artist popularity, artist type, track name, track popularity, track type. - Artists: Followers, genres, name, popularity, type."

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const { messages, context } = await req.json()

	const result = await streamText({
		model: groq('llama3-70b-8192'),
		tools: {
			weather: tool({
				description: 'Get the weather in a location',
				parameters: z.object({
					location: z.string().describe('The location to get the weather for'),
				}),
				execute: async ({ location }) => ({
					location,
					temperature: 72 + Math.floor(Math.random() * 21) - 10,
				}),
			}),
		},
		system: system + JSON.stringify(context),
		messages,
	})

	return new StreamingTextResponse(result.toAIStream())
}
