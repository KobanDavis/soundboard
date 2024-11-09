import { GlobalKeyboardListener } from 'node-global-key-listener'

const keyboardListener = new GlobalKeyboardListener()

keyboardListener.addListener((e, down) => {
	const ctrl = down['LEFT CTRL'] || down['RIGHT CTRL']
	const alt = down['LEFT ALT'] || down['RIGHT ALT']
	const shift = down['LEFT SHIFT'] || down['RIGHT SHIFT']

	const key = e.name

	const bind: string[] = []
	if (ctrl) bind.push('CTRL')
	if (alt) bind.push('ALT')
	if (shift) bind.push('SHIFT')
	bind.push(e.rawKey?.name!)

	if (e.state === 'DOWN') {
		console.log(bind.join(' + '))
		console.log(e.vKey)
	}
})
