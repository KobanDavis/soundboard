import { IGlobalKeyDownMap, IGlobalKeyEvent, IGlobalKeyListener } from 'node-global-key-listener'
import { Keybind } from './types'

export const webKeypressToBind = (event: React.KeyboardEvent<HTMLInputElement>) => {
	if (!event) return
	const bind = []
	if (event.ctrlKey) bind.push('CTRL')
	if (event.altKey) bind.push('ALT')
	if (event.shiftKey) bind.push('SHIFT')
	bind.push(event.keyCode)

	return bind.join(',')
}

export const nativeKeypressToBind = (e: IGlobalKeyEvent, down: IGlobalKeyDownMap): string | void => {
	const ctrl = down['LEFT CTRL'] || down['RIGHT CTRL']
	const alt = down['LEFT ALT'] || down['RIGHT ALT']
	const shift = down['LEFT SHIFT'] || down['RIGHT SHIFT']

	const bind: string[] = []
	if (ctrl) bind.push('CTRL')
	if (alt) bind.push('ALT')
	if (shift) bind.push('SHIFT')
	bind.push(e.vKey.toString())

	if (e.state === 'DOWN') {
		return bind.join(',')
	}
}

export const webKeypressToReadable = (event: React.KeyboardEvent<HTMLInputElement>) => {
	if (!event) return
	const bind = []
	if (event.ctrlKey) bind.push('CTRL')
	if (event.altKey) bind.push('ALT')
	if (event.shiftKey) bind.push('SHIFT')
	bind.push(event.code)

	return bind.join(' + ')
}
