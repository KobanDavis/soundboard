// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from 'electron'

let cb: any // should only be one
contextBridge.exposeInMainWorld('electronAPI', {
	minimize: () => ipcRenderer.invoke('minimize'),
	registerKeybind: (keybind: string) => ipcRenderer.invoke('registerKeybind', keybind),
	unregisterKeybind: (keybind: string) => ipcRenderer.invoke('unregisterKeybind', keybind),
	onKeybindTrigger: (callback: (e: never, name: string) => void) => {
		cb = callback
		ipcRenderer.on('keybindTrigger', callback)
	},
	offKeybindTrigger: () => ipcRenderer.off('keybindTrigger', cb),
	getDownloadsPath: () => ipcRenderer.invoke('getDownloadsPath'),
	openDownloadsFolder: () => ipcRenderer.invoke('openDownloadsFolder'),
})
