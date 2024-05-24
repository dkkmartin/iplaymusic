export default async function Recommender() {
	const response = await fetch(process.env.NEXTAUTH_URL + '/api/recommend', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userPreferences: ['pop', 'vocals', 'bass', 'danceable', 'high-bpm'] }),
	})

	console.log(response)
	//const data = await response.json()

	//console.log(data)

	return <p>hej</p>
}
