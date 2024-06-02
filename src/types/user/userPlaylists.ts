export interface Root {
	href: string
	limit: number
	next: any
	offset: number
	previous: any
	total: number
	items: Item[]
}

export interface Item {
	collaborative: boolean
	description: string
	external_urls: ExternalUrls
	href: string
	id: string
	images: Image[]
	name: string
	owner: Owner
	primary_color?: string
	public: boolean
	snapshot_id: string
	tracks: Tracks
	type: string
	uri: string
}

export interface ExternalUrls {
	spotify: string
}

export interface Image {
	height?: number
	url: string
	width?: number
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
	total: number
}
