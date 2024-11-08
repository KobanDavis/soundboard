import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray } from 'electron'
import path from 'path'
import fs from 'fs'
import http from 'http'
import expressApp from './server'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit()
}

app.setLoginItemSettings({ openAtLogin: true })

const iconPath = path.join(app.getAppPath(), './resources/assets/switch.ico')
const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 600,
		height: 300,
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

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
	return mainWindow
}

const createTray = () => {
	const icon = nativeImage.createFromPath(iconPath)
	const tray = new Tray(icon)
	const menu = Menu.buildFromTemplate([{ label: 'Close', type: 'normal', click: () => app.exit() }])
	tray.setContextMenu(menu)
	tray.setToolTip('Audio Switcher')
}

app.on('ready', () => {
	const window = createWindow()
	createTray()

	const port = 8765
	const server = http.createServer(expressApp)

	server.listen(port, () => console.log(`Listening on port ${port}`))
	app.on('will-quit', () => server.close())

	ipcMain.handle('minimize', () => {
		window.minimize()
	})

	if (!fs.existsSync(path.resolve('downloads'))) {
		fs.mkdirSync(path.resolve('downloads'))
	}
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
