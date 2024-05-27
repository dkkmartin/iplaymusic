'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export interface Message {
	role: 'user' | 'assistant'
	content: string
}

const system =
	"This LLM, named iPlayMusic, is integrated with a Spotify-inspired music player and specializes in generating personalized music recommendations based on user input. Its primary tasks include responding to user queries, understanding their preferences, and providing tailored suggestions. Instructions: - Keep responses concise: Ensure that the LLM's responses are brief and to the point, optimizing user engagement. - Utilize Markdown: You have full access to Markdown for formatting responses. - Contextual Information: The LLM has access to users' Spotify top artists and tracks stored in a context store. The context includes information such as Tracks (album name, artist name, genres, popularity), and Artists (followers, genres, popularity). - Avoid recommending songs from the context: In generating recommendations, the LLM should avoid suggesting songs already present in the context store.Additional Recommendations: - Personalization: Strive to tailor recommendations based on user preferences and historical interactions. - Diverse Suggestions: Offer a variety of music genres and artists to cater to different tastes and moods. - Continuous Learning: Continuously update the recommendation model based on user feedback and evolving preferences. - User Interaction: Encourage users to provide feedback on recommendations to improve future suggestions. - Privacy Consideration: Ensure that user data is handled securely and in compliance with privacy regulations.Context Store: - Tracks: Album name, artist name, artist, genres, artist popularity, artist type, track name, track popularity, track type. - Artists: Followers, genres, name, popularity, type. The users name is: "

export async function continueConversation(history: Message[]) {
	'use server'

	const { text, toolResults } = await generateText({
		model: openai('gpt-4o'),
		system: system,
		messages: history,
		tools: {
			celsiusToFahrenheit: {
				description: 'Converts celsius to fahrenheit',
				parameters: z.object({
					value: z.string().describe('The value in celsius'),
				}),
				execute: async ({ value }) => {
					const celsius = parseFloat(value)
					const fahrenheit = celsius * (9 / 5) + 32
					return `${celsius}°C is ${fahrenheit.toFixed(2)}°F`
				},
			},
		},
	})

	return {
		messages: [
			...history,
			{
				role: 'assistant' as const,
				content: text || toolResults.map((toolResult) => toolResult.result).join('\n'),
			},
		],
	}
}
