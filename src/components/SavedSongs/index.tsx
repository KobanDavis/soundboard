import { backgroundSecondaryActive, Button } from '@kobandavis/ui'
import clsx from 'clsx'
import { usePlayer } from '../../providers/Player'
import { FC, useState } from 'react'
import YTApi from '../../classes/YTApi'

interface SavedSongsProps {}

const SavedSongs: FC<SavedSongsProps> = ({}) => {
	const { songlist, setSong, reloadSonglist, setPlayback } = usePlayer()
	const [selectedSong, setSelectedSong] = useState<string>(null)

	const handleSongClick = async (song: string) => {
		setSelectedSong(song)
		await setSong(song)
	}

	const handleSongDblClick = async (song: string) => {
		await handleSongClick(song)
		setPlayback(true)
	}

	const handleDelete = async () => {
		await YTApi.deleteSong({ name: selectedSong })
		await setSong(null)
		await reloadSonglist()
	}

	return (
		<>
			<div className='flex-1 bg-theme-primary/15 p-1 rounded flex flex-wrap overflow-auto place-content-start' onClick={() => setSelectedSong(null)}>
				{[songlist]
					.flat()
					.filter(Boolean)
					?.map((song) => (
						<div
							onDoubleClick={(e) => (e.stopPropagation(), handleSongDblClick(song))}
							onClick={(e) => (e.stopPropagation(), handleSongClick(song))}
							key={song}
							className={clsx(
								selectedSong === song ? 'bg-theme-primary/20' : 'bg-theme-secondary',
								backgroundSecondaryActive,
								'cursor-pointer select-none rounded w-min px-2 py-1 whitespace-nowrap m-1'
							)}
						>
							{song}
						</div>
					))}
			</div>
			<Button
				className={clsx(!selectedSong ? '-bottom-12' : 'bottom-12', 'transition-all self-end translate-y-full right-5 fixed')}
				disabled={!selectedSong}
				type='primary'
				onClick={handleDelete}
			>
				Delete Song
			</Button>
		</>
	)
}

export default SavedSongs
