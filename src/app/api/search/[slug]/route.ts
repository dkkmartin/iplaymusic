export const fetchCache = 'force-cache'
export const revalidate = 3600

export async function POST(request: Request, { params }: { params: { slug: string } }) {
	const query = params.slug.toLowerCase()
	const requestBody = await request.json()
	if (!requestBody.token) {
		return Response.json({ status: 400, text: 'No token provided' })
	}
	const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=5`, {
		headers: {
			Authorization: `Bearer ${requestBody.token}`,
		},
	})
	if (!res.ok) {
		const text = await res.text()
		console.error(`Error in fetching ${query}: ${text}`)
		return
	}
	const data = await res.json()

	return Response.json(data)
}
