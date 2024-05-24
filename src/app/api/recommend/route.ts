import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const MODEL_NAME = 'gemini-1.5-flash-latest'
const API_KEY = process.env.GEMINI_API_KEY!

const generationConfig = {
	temperature: 0.9,
	topK: 0,
	topP: 1,
	maxOutputTokens: 8192,
}

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
]

export async function POST(req: Request) {
	try {
		const requestBody = await req.json()
		const userPreferences: string[] = requestBody.userPreferences

		if (!Array.isArray(userPreferences) || userPreferences.length === 0) {
			return Response.json({ status: 400, error: 'Invalid user preferences' }, { status: 400 })
		}

		const genAI = new GoogleGenerativeAI(API_KEY)
		const model = genAI.getGenerativeModel({ model: MODEL_NAME })
		const parts = [
			{
				text: "You are\n a spotify song recommender. A user selects preferences in genre, \nmood and tempo and more etc. You will calculate the users preferences to a json \nobject containing key features of the song (Only return the object, \ndon't type ```json). You will follow this reference:\n\nmin_acousticnessnumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_acousticnessnumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_acousticnessnumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_danceabilitynumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_danceabilitynumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_danceabilitynumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_duration_msinteger For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.max_duration_msinteger For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.target_duration_msinteger Target duration of the \ntrack (ms)min_energynumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_energynumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_energynumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_instrumentalnessnumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_instrumentalnessnumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_instrumentalnessnumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_keyinteger For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 11max_keyinteger For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 11target_keyinteger For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 11min_livenessnumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_livenessnumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_livenessnumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_loudnessnumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.max_loudnessnumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.target_loudnessnumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.min_modeinteger For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_modeinteger For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_modeinteger For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_popularityinteger For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 100max_popularityinteger For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 100target_popularityinteger For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 100min_speechinessnumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_speechinessnumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_speechinessnumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1min_temponumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.max_temponumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.target_temponumber Target tempo \n(BPM)min_time_signatureinteger For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Maximum value: 11max_time_signatureinteger For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.target_time_signatureinteger For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.min_valencenumber For\n each tunable track attribute, a hard floor on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, min_tempo=140 would \nrestrict results to only those tracks with a tempo of greater than 140 \nbeats per minute.Range: 0 - 1max_valencenumber For\n each tunable track attribute, a hard ceiling on the selected track \nattribute’s value can be provided. See tunable track attributes below \nfor the list of available options. For example, \nmax_instrumentalness=0.35 would filter out most tracks that are likely \nto be instrumental.Range: 0 - 1target_valencenumber For\n each of the tunable track attributes (below) a target value may be \nprovided. Tracks with the attribute values nearest to the target values \nwill be preferred. For example, you might request target_energy=0.6 and \ntarget_danceability=0.8. All target values will be weighed equally in \nranking results.Range: 0 - 1",
			},
			{ text: 'input: ["techno", "trance", "vocals", "high-bpm"]' },
			{
				text: 'output: {\n  "min_acousticness": 0,\n  "max_acousticness": 0.3,\n  "target_acousticness": 0.15,\n  "min_danceability": 0.6,\n  "max_danceability": 0.9,\n  "target_danceability": 0.75,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.7,\n  "max_energy": 0.9,\n  "target_energy": 0.8,\n  "min_instrumentalness": 0.3,\n  "max_instrumentalness": 0.9,\n  "target_instrumentalness": 0.6,\n  "min_liveness": 0.1,\n  "max_liveness": 0.5,\n  "target_liveness": 0.3,\n  "min_loudness": -8,\n  "max_loudness": -2,\n  "target_loudness": -5,\n  "min_speechiness": 0.1,\n  "max_speechiness": 0.5,\n  "target_speechiness": 0.3,\n  "min_tempo": 120,\n  "max_tempo": 150,\n  "target_tempo": 135,\n  "min_valence": 0.4,\n  "max_valence": 0.8,\n  "target_valence": 0.6\n}',
			},
			{ text: 'input: ["vocal", "guitar", "sommer"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.3,\n  "max_acousticness": 0.8,\n  "target_acousticness": 0.55,\n  "min_danceability": 0.4,\n  "max_danceability": 0.7,\n  "target_danceability": 0.55,\n  "min_duration_ms": 120000,\n  "max_duration_ms": 240000,\n  "target_duration_ms": 180000,\n  "min_energy": 0.5,\n  "max_energy": 0.8,\n  "target_energy": 0.65,\n  "min_instrumentalness": 0.1,\n  "max_instrumentalness": 0.5,\n  "target_instrumentalness": 0.3,\n  "min_liveness": 0.2,\n  "max_liveness": 0.7,\n  "target_liveness": 0.45,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 90,\n  "max_tempo": 140,\n  "target_tempo": 115,\n  "min_valence": 0.3,\n  "max_valence": 0.7,\n  "target_valence": 0.5\n}',
			},
			{ text: 'input: ["folk", "acoustic", "storytelling", "campfire"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.6,\n  "max_acousticness": 0.9,\n  "target_acousticness": 0.75,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.3,\n  "max_energy": 0.6,\n  "target_energy": 0.45,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.4,\n  "max_liveness": 0.8,\n  "target_liveness": 0.6,\n  "min_loudness": -12,\n  "max_loudness": -6,\n  "target_loudness": -9,\n  "min_speechiness": 0.1,\n  "max_speechiness": 0.5,\n  "target_speechiness": 0.3,\n  "min_tempo": 70,\n  "max_tempo": 120,\n  "target_tempo": 95,\n  "min_valence": 0.3,\n  "max_valence": 0.7,\n  "target_valence": 0.5\n}',
			},
			{ text: 'input: ["lo-fi", "chillhop", "study", "beats"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.5,\n  "max_acousticness": 0.9,\n  "target_acousticness": 0.7,\n  "min_danceability": 0.4,\n  "max_danceability": 0.7,\n  "target_danceability": 0.55,\n  "min_duration_ms": 120000,\n  "max_duration_ms": 240000,\n  "target_duration_ms": 180000,\n  "min_energy": 0.2,\n  "max_energy": 0.6,\n  "target_energy": 0.4,\n  "min_instrumentalness": 0.6,\n  "max_instrumentalness": 0.9,\n  "target_instrumentalness": 0.75,\n  "min_liveness": 0.1,\n  "max_liveness": 0.4,\n  "target_liveness": 0.25,\n  "min_loudness": -15,\n  "max_loudness": -8,\n  "target_loudness": -11.5,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 60,\n  "max_tempo": 100,\n  "target_tempo": 80,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["jazz", "improvisation", "saxophone", "lounge"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.4,\n  "max_acousticness": 0.8,\n  "target_acousticness": 0.6,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 480000,\n  "target_duration_ms": 330000,\n  "min_energy": 0.3,\n  "max_energy": 0.7,\n  "target_energy": 0.5,\n  "min_instrumentalness": 0.5,\n  "max_instrumentalness": 0.9,\n  "target_instrumentalness": 0.7,\n  "min_liveness": 0.2,\n  "max_liveness": 0.7,\n  "target_liveness": 0.45,\n  "min_loudness": -12,\n  "max_loudness": -6,\n  "target_loudness": -9,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 80,\n  "max_tempo": 130,\n  "target_tempo": 105,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["metal", "shredding", "double bass", "headbanging"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.1,\n  "max_acousticness": 0.4,\n  "target_acousticness": 0.25,\n  "min_danceability": 0.2,\n  "max_danceability": 0.5,\n  "target_danceability": 0.35,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 480000,\n  "target_duration_ms": 330000,\n  "min_energy": 0.7,\n  "max_energy": 0.9,\n  "target_energy": 0.8,\n  "min_instrumentalness": 0.4,\n  "max_instrumentalness": 0.8,\n  "target_instrumentalness": 0.6,\n  "min_liveness": 0.3,\n  "max_liveness": 0.8,\n  "target_liveness": 0.55,\n  "min_loudness": -6,\n  "max_loudness": -1,\n  "target_loudness": -3.5,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 100,\n  "max_tempo": 160,\n  "target_tempo": 130,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["punk", "mosh pit", "DIY", "rebellion"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.1,\n  "max_acousticness": 0.4,\n  "target_acousticness": 0.25,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 120000,\n  "max_duration_ms": 240000,\n  "target_duration_ms": 180000,\n  "min_energy": 0.6,\n  "max_energy": 0.9,\n  "target_energy": 0.75,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.4,\n  "max_liveness": 0.9,\n  "target_liveness": 0.65,\n  "min_loudness": -8,\n  "max_loudness": -2,\n  "target_loudness": -5,\n  "min_speechiness": 0.2,\n  "max_speechiness": 0.6,\n  "target_speechiness": 0.4,\n  "min_tempo": 100,\n  "max_tempo": 160,\n  "target_tempo": 130,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["gospel", "choir", "uplifting", "praise"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.2,\n  "max_acousticness": 0.6,\n  "target_acousticness": 0.4,\n  "min_danceability": 0.5,\n  "max_danceability": 0.8,\n  "target_danceability": 0.65,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.5,\n  "max_energy": 0.9,\n  "target_energy": 0.7,\n  "min_instrumentalness": 0.1,\n  "max_instrumentalness": 0.4,\n  "target_instrumentalness": 0.25,\n  "min_liveness": 0.3,\n  "max_liveness": 0.8,\n  "target_liveness": 0.55,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 90,\n  "max_tempo": 140,\n  "target_tempo": 115,\n  "min_valence": 0.5,\n  "max_valence": 0.9,\n  "target_valence": 0.7\n}',
			},
			{ text: 'input: ["blues", "soulful", "guitar solos", "whiskey"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.3,\n  "max_acousticness": 0.7,\n  "target_acousticness": 0.5,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.4,\n  "max_energy": 0.8,\n  "target_energy": 0.6,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.3,\n  "max_liveness": 0.8,\n  "target_liveness": 0.55,\n  "min_loudness": -12,\n  "max_loudness": -6,\n  "target_loudness": -9,\n  "min_speechiness": 0.1,\n  "max_speechiness": 0.4,\n  "target_speechiness": 0.25,\n  "min_tempo": 70,\n  "max_tempo": 120,\n  "target_tempo": 95,\n  "min_valence": 0.3,\n  "max_valence": 0.7,\n  "target_valence": 0.5\n}',
			},
			{ text: 'input: ["classical", "orchestral", "elegant", "timeless"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.6,\n  "max_acousticness": 0.9,\n  "target_acousticness": 0.75,\n  "min_danceability": 0.2,\n  "max_danceability": 0.5,\n  "target_danceability": 0.35,\n  "min_duration_ms": 240000,\n  "max_duration_ms": 600000,\n  "target_duration_ms": 420000,\n  "min_energy": 0.2,\n  "max_energy": 0.6,\n  "target_energy": 0.4,\n  "min_instrumentalness": 0.7,\n  "max_instrumentalness": 1,\n  "target_instrumentalness": 0.85,\n  "min_liveness": 0.1,\n  "max_liveness": 0.5,\n  "target_liveness": 0.3,\n  "min_loudness": -15,\n  "max_loudness": -8,\n  "target_loudness": -11.5,\n  "min_speechiness": 0,\n  "max_speechiness": 0.1,\n  "target_speechiness": 0.05,\n  "min_tempo": 60,\n  "max_tempo": 120,\n  "target_tempo": 90,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["industrial", "dark", "electronic", "machinery"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.1,\n  "max_acousticness": 0.4,\n  "target_acousticness": 0.25,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.6,\n  "max_energy": 0.9,\n  "target_energy": 0.75,\n  "min_instrumentalness": 0.4,\n  "max_instrumentalness": 0.8,\n  "target_instrumentalness": 0.6,\n  "min_liveness": 0.1,\n  "max_liveness": 0.5,\n  "target_liveness": 0.3,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 90,\n  "max_tempo": 140,\n  "target_tempo": 115,\n  "min_valence": 0.1,\n  "max_valence": 0.5,\n  "target_valence": 0.3\n}',
			},
			{ text: 'input: ["hip hop", "beats", "rhymes", "urban"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.1,\n  "max_acousticness": 0.4,\n  "target_acousticness": 0.25,\n  "min_danceability": 0.5,\n  "max_danceability": 0.8,\n  "target_danceability": 0.65,\n  "min_duration_ms": 120000,\n  "max_duration_ms": 240000,\n  "target_duration_ms": 180000,\n  "min_energy": 0.5,\n  "max_energy": 0.9,\n  "target_energy": 0.7,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.2,\n  "max_liveness": 0.6,\n  "target_liveness": 0.4,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.2,\n  "max_speechiness": 0.7,\n  "target_speechiness": 0.45,\n  "min_tempo": 80,\n  "max_tempo": 130,\n  "target_tempo": 105,\n  "min_valence": 0.3,\n  "max_valence": 0.7,\n  "target_valence": 0.5\n}',
			},
			{ text: 'input: ["funk", "groove", "bassline", "dance"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.2,\n  "max_acousticness": 0.6,\n  "target_acousticness": 0.4,\n  "min_danceability": 0.6,\n  "max_danceability": 0.9,\n  "target_danceability": 0.75,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.6,\n  "max_energy": 0.9,\n  "target_energy": 0.75,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.3,\n  "max_liveness": 0.8,\n  "target_liveness": 0.55,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.1,\n  "max_speechiness": 0.4,\n  "target_speechiness": 0.25,\n  "min_tempo": 100,\n  "max_tempo": 140,\n  "target_tempo": 120,\n  "min_valence": 0.4,\n  "max_valence": 0.8,\n  "target_valence": 0.6\n}',
			},
			{ text: 'input: ["dream pop", "ethereal", "shoegaze", "reverbed vocals"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.2,\n  "max_acousticness": 0.6,\n  "target_acousticness": 0.4,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.3,\n  "max_energy": 0.7,\n  "target_energy": 0.5,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.1,\n  "max_liveness": 0.5,\n  "target_liveness": 0.3,\n  "min_loudness": -12,\n  "max_loudness": -6,\n  "target_loudness": -9,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 80,\n  "max_tempo": 130,\n  "target_tempo": 105,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["ambient", "atmospheric", "soundscapes", "chillwave"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.2,\n  "max_acousticness": 0.7,\n  "target_acousticness": 0.45,\n  "min_danceability": 0.2,\n  "max_danceability": 0.5,\n  "target_danceability": 0.35,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 480000,\n  "target_duration_ms": 330000,\n  "min_energy": 0.1,\n  "max_energy": 0.4,\n  "target_energy": 0.25,\n  "min_instrumentalness": 0.6,\n  "max_instrumentalness": 0.9,\n  "target_instrumentalness": 0.75,\n  "min_liveness": 0.1,\n  "max_liveness": 0.4,\n  "target_liveness": 0.25,\n  "min_loudness": -20,\n  "max_loudness": -10,\n  "target_loudness": -15,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.2,\n  "target_speechiness": 0.125,\n  "min_tempo": 60,\n  "max_tempo": 100,\n  "target_tempo": 80,\n  "min_valence": 0.1,\n  "max_valence": 0.4,\n  "target_valence": 0.25\n}',
			},
			{ text: 'input: ["world music", "fusion", "cultural", "diverse"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.3,\n  "max_acousticness": 0.7,\n  "target_acousticness": 0.5,\n  "min_danceability": 0.4,\n  "max_danceability": 0.7,\n  "target_danceability": 0.55,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 360000,\n  "target_duration_ms": 270000,\n  "min_energy": 0.4,\n  "max_energy": 0.8,\n  "target_energy": 0.6,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.7,\n  "target_instrumentalness": 0.45,\n  "min_liveness": 0.3,\n  "max_liveness": 0.8,\n  "target_liveness": 0.55,\n  "min_loudness": -10,\n  "max_loudness": -4,\n  "target_loudness": -7,\n  "min_speechiness": 0.1,\n  "max_speechiness": 0.5,\n  "target_speechiness": 0.3,\n  "min_tempo": 90,\n  "max_tempo": 140,\n  "target_tempo": 115,\n  "min_valence": 0.3,\n  "max_valence": 0.7,\n  "target_valence": 0.5\n}',
			},
			{ text: 'input: ["soundtrack", "cinematic", "orchestral", "emotional"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.2,\n  "max_acousticness": 0.7,\n  "target_acousticness": 0.45,\n  "min_danceability": 0.3,\n  "max_danceability": 0.6,\n  "target_danceability": 0.45,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 600000,\n  "target_duration_ms": 390000,\n  "min_energy": 0.3,\n  "max_energy": 0.7,\n  "target_energy": 0.5,\n  "min_instrumentalness": 0.6,\n  "max_instrumentalness": 0.9,\n  "target_instrumentalness": 0.75,\n  "min_liveness": 0.1,\n  "max_liveness": 0.5,\n  "target_liveness": 0.3,\n  "min_loudness": -15,\n  "max_loudness": -8,\n  "target_loudness": -11.5,\n  "min_speechiness": 0.05,\n  "max_speechiness": 0.3,\n  "target_speechiness": 0.175,\n  "min_tempo": 80,\n  "max_tempo": 130,\n  "target_tempo": 105,\n  "min_valence": 0.2,\n  "max_valence": 0.6,\n  "target_valence": 0.4\n}',
			},
			{ text: 'input: ["dancehall", "reggae fusion", "Caribbean", "bass-heavy"]' },
			{
				text: 'output: {\n  "min_acousticness": 0.1,\n  "max_acousticness": 0.4,\n  "target_acousticness": 0.25,\n  "min_danceability": 0.6,\n  "max_danceability": 0.9,\n  "target_danceability": 0.75,\n  "min_duration_ms": 180000,\n  "max_duration_ms": 300000,\n  "target_duration_ms": 240000,\n  "min_energy": 0.6,\n  "max_energy": 0.9,\n  "target_energy": 0.75,\n  "min_instrumentalness": 0.2,\n  "max_instrumentalness": 0.6,\n  "target_instrumentalness": 0.4,\n  "min_liveness": 0.2,\n  "max_liveness": 0.6,\n  "target_liveness": 0.4,\n  "min_loudness": -8,\n  "max_loudness": -2,\n  "target_loudness": -5,\n  "min_speechiness": 0.2,\n  "max_speechiness": 0.6,\n  "target_speechiness": 0.4,\n  "min_tempo": 90,\n  "max_tempo": 140,\n  "target_tempo": 115,\n  "min_valence": 0.4,\n  "max_valence": 0.8,\n  "target_valence": 0.6\n}',
			},
			{ text: 'input: ' },
			{ text: 'output: ' },
		]

		const result = await model.generateContent({
			contents: [{ role: 'user', parts }],
			generationConfig,
			safetySettings,
		})

		const response = result.response
		const songPreferences = JSON.parse(response.text().trim())

		return Response.json({ request: userPreferences, json: songPreferences })
	} catch (error) {
		console.error('Error generating song preferences:', error)
		return Response.json(
			{ status: 500, error: 'Error generating song preferences' },
			{ status: 500 }
		)
	}
}
