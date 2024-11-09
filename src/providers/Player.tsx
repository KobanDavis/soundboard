import { RegisterKeybind } from 'types'
import YTApi from '../classes/YTApi'
import { useLocalState } from '../hooks'
import { useState, useContext, createContext, useRef, useEffect, FC, ReactNode } from 'react'

interface Player {
	outputDevice1: string
	setOutputDevice1: (id: string) => void
	outputDevice2: string
	setOutputDevice2: (id: string) => void
	selectedSongName: string
	setSong: (name: string) => Promise<void>
	setPlayback: (play: boolean) => void
	songlist: string[]
	reloadSonglist: () => Promise<void>
	isPlaying: boolean
	registerNewKeybind: (keybind: RegisterKeybind) => void
	removeKeybind: (keybind: string) => void
	keybinds: Record<string, string>
}

const { electronAPI } = window as any

const registerKeybind = (keybind: string) => electronAPI.registerKeybind(keybind)

const registerKeybinds = (keybinds: Record<string, string>) => {
	Object.keys(keybinds).forEach(registerKeybind)
}

const PlayerProvider: FC<{ children: ReactNode }> = (props) => {
	const [outputDevice1, setOutputDevice1] = useLocalState('outputDevice1', 'default')
	const [outputDevice2, setOutputDevice2] = useLocalState('outputDevice2', 'default')

	const [keybindsString, setKeybindsString] = useLocalState('keybinds', '{}')
	const [selectedSongName, setSelectedSongName] = useState<string>(null)
	const [songlist, setSonglist] = useState<string[]>(null)
	const [isPlaying, setIsPlaying] = useState<boolean>(false)

	const keybinds: Record<string, string> = JSON.parse(keybindsString)

	const audioRef1 = useRef<HTMLAudioElement>(new Audio())
	const audio1 = audioRef1.current

	const audioRef2 = useRef<HTMLAudioElement>(new Audio())
	const audio2 = audioRef2.current

	useEffect(() => {
		reloadSonglist()

		registerKeybinds(keybinds)
	}, [])

	useEffect(() => {
		const handleKeybind = async (_: never, keybind: string) => {
			const song = keybinds[keybind]
			if (song === '__togglePlayback') {
				if (!selectedSongName) return
				setPlayback(!isPlaying)
			} else {
				await setSong(song)
				setPlayback(true)
			}
		}

		electronAPI.onKeybindTrigger(handleKeybind)
		return () => electronAPI.offKeybindTrigger()
	}, [isPlaying, keybinds, selectedSongName])

	useEffect(() => {
		if (audio1) {
			audio1
				.setSinkId(outputDevice1)
				.then(() => console.log(`Audio output set to device: ${outputDevice1}`))
				.catch((error) => console.error('Error setting audio output device:', error))
		}
	}, [audio1, outputDevice1])

	useEffect(() => {
		if (audio2) {
			audio2
				.setSinkId(outputDevice2)
				.then(() => console.log(`Audio output set to device: ${outputDevice2}`))
				.catch((error) => console.error('Error setting audio output device:', error))
		}
	}, [audio2, outputDevice2])

	const setSong = async (name: string) => {
		return (
			!name
				? Promise.resolve()
				: Promise.all([
						new Promise<void>((resolve) => {
							audio1.src = `../../downloads/${name}`
							audio1.oncanplay = () => resolve()
						}),
						new Promise<void>((resolve) => {
							audio2.src = `../../downloads/${name}`
							audio2.oncanplay = () => resolve()
						}),
				  ])
		).then(() => {
			setIsPlaying(false)
			setSelectedSongName(name)
		})
	}

	const setPlayback = async (shouldPlay: boolean) => {
		await Promise.all(shouldPlay ? [audio1.play(), audio2.play()] : [audio1.pause(), audio2.pause()])
		setIsPlaying(shouldPlay)
	}

	const reloadSonglist = async () => {
		const list = await YTApi.listSaved()
		setSonglist(list)
	}

	const registerNewKeybind = ({ keybind, name }: RegisterKeybind) => {
		keybinds[keybind] = name
		setKeybindsString(JSON.stringify(keybinds))
		registerKeybind(keybind)
	}

	const removeKeybind = (keybind: string) => {
		delete keybinds[keybind]
		setKeybindsString(JSON.stringify(keybinds))
		electronAPI.unregisterKeybind(keybind)
	}

	return (
		<>
			<Context.Provider
				value={{
					outputDevice1,
					setOutputDevice1,
					outputDevice2,
					setOutputDevice2,
					selectedSongName,
					setSong,
					setPlayback,
					songlist,
					reloadSonglist,
					isPlaying,
					keybinds,
					registerNewKeybind,
					removeKeybind,
				}}
				{...props}
			/>
		</>
	)
}

const Context = createContext<Player>(null)

const usePlayer = () => useContext(Context)

export { PlayerProvider, usePlayer }
