import { backgroundSecondaryActive, Button } from '@kobandavis/ui'
import clsx from 'clsx'
import { usePlayer } from '../../providers/Player'
import { FC } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import electronAPI from '../../classes/ElectronAPI'

interface SavedSongsProps {}

const SavedSongs: FC<SavedSongsProps> = ({}) => {
	const { songlist, setSong, setPlayback, selectedSongName, isPlaying } = usePlayer()

	const handleSongDblClick = async (song: string) => {
		await setSong(song)
		setPlayback(true)
	}

	const openDownloadsFolder = () => {
		electronAPI.openDownloadsFolder()
	}

	return (
		<>
			<div className='flex-1 bg-theme-primary/15 p-1 rounded flex flex-wrap overflow-auto place-content-start'>
				{[songlist]
					.flat()
					.filter(Boolean)
					?.map((song) => (
						<div
							onDoubleClick={() => handleSongDblClick(song)}
							key={song}
							className={clsx(
								isPlaying && selectedSongName === song ? 'bg-theme-primary/20' : 'bg-theme-secondary',
								backgroundSecondaryActive,
								'cursor-pointer select-none rounded w-min px-2 py-1 whitespace-nowrap m-1'
							)}
						>
							{song}
						</div>
					))}
			</div>
			<Button onClick={openDownloadsFolder} type='secondary' className='!rounded-full flex bottom-5 transition-all right-5 fixed'>
				<ArrowTopRightOnSquareIcon className='w-4 h-4' type='icon' />
			</Button>
		</>
	)
}

export default SavedSongs
