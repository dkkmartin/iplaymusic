export interface Root {
	collaborative: boolean
	description: string
	external_urls: ExternalUrls
	followers: Followers
	href: string
	id: string
	images: Image[]
	name: string
	owner: Owner
	primary_color: any
	public: boolean
	snapshot_id: string
	tracks: Tracks
	type: string
	uri: string
}

export interface ExternalUrls {
	spotify: string
}

export interface Followers {
	href: any
	total: number
}

export interface Image {
	height: any
	url: string
	width: any
}

export interface Owner {
	display_name: string
	external_urls: ExternalUrls2
	href: string
	id: string
	type: string
	uri: string
}

export interface ExternalUrls2 {
	spotify: string
}

export interface Tracks {
	href: string
	items: Item[]
	limit: number
	next: any
	offset: number
	previous: any
	total: number
}

export interface Item {
	added_at: string
	added_by: AddedBy
	is_local: boolean
	primary_color: any
	track: Track
	video_thumbnail: VideoThumbnail
}

export interface AddedBy {
	external_urls: ExternalUrls3
	href: string
	id: string
	type: string
	uri: string
}

export interface ExternalUrls3 {
	spotify: string
}

export interface Track {
	preview_url: string
	available_markets: string[]
	explicit: boolean
	type: string
	episode: boolean
	track: boolean
	album: Album
	artists: Artist2[]
	disc_number: number
	track_number: number
	duration_ms: number
	external_ids: ExternalIds
	external_urls: ExternalUrls7
	href: string
	id: string
	name: string
	popularity: number
	uri: string
	is_local: boolean
}

export interface Album {
	available_markets: string[]
	type: string
	album_type: string
	href: string
	id: string
	images: Image2[]
	name: string
	release_date: string
	release_date_precision: string
	uri: string
	artists: Artist[]
	external_urls: ExternalUrls5
	total_tracks: number
}

export interface Image2 {
	url: string
	width: number
	height: number
}

export interface Artist {
	external_urls: ExternalUrls4
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface ExternalUrls4 {
	spotify: string
}

export interface ExternalUrls5 {
	spotify: string
}

export interface Artist2 {
	external_urls: ExternalUrls6
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface ExternalUrls6 {
	spotify: string
}

export interface ExternalIds {
	isrc: string
}

export interface ExternalUrls7 {
	spotify: string
}

export interface VideoThumbnail {
	url: any
}
