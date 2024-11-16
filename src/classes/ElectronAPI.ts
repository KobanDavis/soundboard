interface ElectronAPI {
	minimize: () => Promise<void>
	registerKeybind: (keybind: string) => Promise<void>
	unregisterKeybind: (keybind: string) => Promise<void>
	onKeybindTrigger: (callback: (e: never, name: string) => any) => Promise<void>
	offKeybindTrigger: () => void
	getDownloadsPath: () => Promise<void>
	openDownloadsFolder: () => Promise<void>
}

const electronAPI: ElectronAPI = (window as any).electronAPI
export default electronAPI
