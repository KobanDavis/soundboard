import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray, protocol } from 'electron'
import { GlobalKeyboardListener } from 'node-global-key-listener'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { nativeKeypressToBind } from './utils'
import expressApp from './server'
import started from 'electron-squirrel-startup'

const logFile = fs.createWriteStream('main-process-log.txt', { flags: 'a' })
const logStdout = process.stdout

console.log = (message: any, ...optionalParams: any[]) => {
	logFile.write(message + '\n')
	logStdout.write(message + '\n')
}

console.error = console.log // Redirect errors too

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit()
}

const keybinds = new Set<string>()

const iconPath = path.join(app.getAppPath(), './resources/assets/switch.ico')
const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 600,
		minWidth: 480,
		height: 300,
		minHeight: 300,
		frame: false,
		show: true,
		icon: iconPath,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
	}

	return mainWindow
}

app.on('ready', () => {
	const window = createWindow()

	const keyboardListener = new GlobalKeyboardListener(
		app.isPackaged
			? {
					windows: {
						serverPath: path.resolve('resources/WinKeyServer.exe'),
					},
			  }
			: {}
	)
	const port = 8765
	const server = http.createServer(expressApp)
	server.listen(port, () => console.log(`Listening on port ${port}`))

	ipcMain.handle('minimize', () => {
		window.minimize()
	})

	ipcMain.handle('registerKeybind', (_, keybind: string) => {
		keybinds.add(keybind)
	})

	ipcMain.handle('unregisterKeybind', (_, keybind: string) => {
		keybinds.delete(keybind)
	})

	ipcMain.handle('getDownloadsPath', () => {
		return app.isPackaged ? path.resolve('downloads') : '..\\..\\downloads'
	})

	keyboardListener.addListener((e, down) => {
		const nativeKeybind = nativeKeypressToBind(e, down)
		if (nativeKeybind && keybinds.has(nativeKeybind)) {
			window.webContents.send('keybindTrigger', nativeKeybind)
		}
	})

	if (!fs.existsSync(path.resolve('downloads'))) {
		fs.mkdirSync(path.resolve('downloads'))
	}

	app.on('will-quit', () => {
		keyboardListener.kill()
		server.close()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
