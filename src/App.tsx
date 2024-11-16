import { Label } from '@kobandavis/ui'
import { FC, useState } from 'react'
import { Keybinds, Modals, SavedSongs } from './components'
import { Cog6ToothIcon, MinusIcon, PauseIcon, PlayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { usePlayer } from './providers/Player'
import clsx from 'clsx'
import { useLocalState } from './hooks'
import electronAPI from './classes/ElectronAPI'

enum Tab {
	SAVED_SONGS,
	KEYBINDS,
}

const Home: FC = () => {
	const [showSettings, setShowSettings] = useState<boolean>(false)
	const [showDownload, setShowDownload] = useState<boolean>(false)
	const [selectedTabString, setSelectedTabString] = useLocalState('tab', Tab.SAVED_SONGS.toString())
	const selectedTab = Number(selectedTabString)
	const { setPlayback, isPlaying, selectedSongName } = usePlayer()
	return (
		<div className='space-y-2 p-2 flex flex-col w-screen h-screen overflow-auto'>
			<div className='flex w-full drag items-center'>
				<span className='text-2xl mx-1 font-extrabold select-none'>soundboard.mp3</span>
				<div className='flex w-full no-drag space-x-1 overflow-hidden'>
					<div className='flex w-full drag items-center overflow-hidden whitespace-nowrap'>
						<div className='w-full marquee'>
							<span>{selectedSongName}</span>
						</div>
					</div>
					<div
						onClick={() => setPlayback(!isPlaying)}
						className={clsx(
							selectedSongName === null && 'grayscale pointer-events-none',
							'flex cursor-pointer bg-theme-primary/20 rounded-full p-1.5'
						)}
					>
						{isPlaying ? <PauseIcon className='h-5 w-5' /> : <PlayIcon className='h-5 w-5' />}
					</div>
					<div className='flex bg-theme-primary/20 rounded-full px-2 py-1 space-x-1'>
						<PlusIcon className='h-6 w-6 cursor-pointer' onClick={() => setShowDownload(true)} />
						<Cog6ToothIcon className='h-6 w-6 cursor-pointer transition-transform hover:rotate-45' onClick={() => setShowSettings(true)} />
					</div>
					<div className='flex px-2 py-1 space-x-1'>
						<MinusIcon className='h-6 w-6 cursor-pointer' onClick={() => electronAPI.minimize()} />
						<XMarkIcon className='h-6 w-6 cursor-pointer' onClick={() => window.close()} />
					</div>
				</div>
			</div>
			{showSettings ? <Modals.Settings close={() => setShowSettings(false)} /> : null}
			{showDownload ? <Modals.Download close={() => setShowDownload(false)} /> : null}
			<div className='space-y-2'>
				<div className='flex space-x-1'>
					<Label
						className='cursor-pointer select-none'
						onClick={() => setSelectedTabString(Tab.SAVED_SONGS.toString())}
						type={selectedTab === Tab.SAVED_SONGS ? 'primary' : 'secondary'}
					>
						Saved Songs
					</Label>
					<Label
						className='cursor-pointer select-none'
						onClick={() => setSelectedTabString(Tab.KEYBINDS.toString())}
						type={selectedTab === Tab.KEYBINDS ? 'primary' : 'secondary'}
					>
						Keybinds
					</Label>
				</div>
			</div>
			{selectedTab === Tab.SAVED_SONGS ? <SavedSongs /> : <Keybinds />}
		</div>
	)
}

export default Home
