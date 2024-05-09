export interface Root {
	categories: Categories
}

export interface Categories {
	href: string
	items: Item[]
	limit: number
	next: string
	offset: number
	previous: any
	total: number
}

export interface Item {
	href: string
	id: string
	icons: Icon[]
	name: string
}

export interface Icon {
	height: number
	url: string
	width: number
}
