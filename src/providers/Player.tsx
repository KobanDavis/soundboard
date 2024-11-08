import YTApi from '../classes/YTApi'
import { useLocalState } from '../hooks'
import { useState, useContext, createContext, useRef, useEffect, FC, ReactNode } from 'react'

interface Player {
	outputDevice: string
	setOutputDevice: (id: string) => void
	selectedSongName: string
	setSong: (name: string) => Promise<void>
	setPlayback: (play: boolean) => void
	songlist: string[]
	reloadSonglist: () => Promise<void>
}

const PlayerProvider: FC<{ children: ReactNode }> = (props) => {
	const [outputDevice, setOutputDevice] = useLocalState('outputDevice', 'default')
	const [selectedSongName, setSelectedSongName] = useState<string>(null)
	const [songlist, setSonglist] = useState<string[]>(null)
	const audioRef = useRef<HTMLAudioElement>(new Audio())
	const audio = audioRef.current

	useEffect(() => {
		reloadSonglist()
	}, [])

	useEffect(() => {
		if (audio) {
			audio
				.setSinkId(outputDevice)
				.then(() => console.log(`Audio output set to device: ${outputDevice}`))
				.catch((error) => console.error('Error setting audio output device:', error))
		}
	}, [audio, outputDevice])

	const setSong = async (name: string) => {
		return new Promise<void>((resolve) => {
			audio.src = `../../downloads/${name}`
			audio.oncanplay = () => resolve()
		})
	}

	const setPlayback = (shouldPlay: boolean) => (shouldPlay ? audio.play() : audio.pause())

	const reloadSonglist = async () => {
		const list = await YTApi.listSaved()
		setSonglist(list)
	}

	return (
		<>
			<Context.Provider
				value={{
					outputDevice,
					setOutputDevice,
					selectedSongName,
					setSong,
					setPlayback,
					songlist,
					reloadSonglist,
				}}
				{...props}
			/>
		</>
	)
}

const Context = createContext<Player>(null)

const usePlayer = () => useContext(Context)

export { PlayerProvider, usePlayer }
