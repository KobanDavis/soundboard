import { backgroundSecondaryActive } from '@kobandavis/ui'
import clsx from 'clsx'
import { usePlayer } from 'providers/Player'
import { FC } from 'react'

interface SavedSongsProps {}

const SavedSongs: FC<SavedSongsProps> = ({}) => {
	const { songlist, setSong } = usePlayer()
	return (
		<div className='bg-theme-primary/15 p-1 rounded flex flex-wrap'>
			{songlist.map((song) => (
				<div
					onClick={() => setSong(song)}
					key={song}
					className={clsx(backgroundSecondaryActive, 'cursor-pointer select-none rounded bg-theme-secondary w-min px-2 py-1 whitespace-nowrap m-1')}
				>
					{song}
				</div>
			))}
		</div>
	)
}

export default SavedSongs
