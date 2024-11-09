export interface ApiYtInfoRequestBody {
	url: string
}

export interface ApiYtStreamRequestBody {
	url: string
}

export interface ApiYtSaveRequestBody {
	url: string
	name: string
}

export interface ApiYtDeleteRequestBody {
	name: string
}

export interface Keybind {
	key: string
	ctrl: boolean
	alt: boolean
	shift: boolean
}

export interface RegisterKeybind {
	keybind: string
	name: string
}
