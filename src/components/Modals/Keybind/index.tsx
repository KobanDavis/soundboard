import { FC, useState } from 'react'
import { Button, Card, Dropdown, Input, Label, Modal } from '@kobandavis/ui'
import { createPortal } from 'react-dom'
import { usePlayer } from '../../../providers/Player'
import { webKeypressToBind, webKeypressToReadable } from '../../../utils'

interface KeybindProps {
	close(): void
}

const Keybind: FC<KeybindProps> = ({ close }) => {
	const { songlist, registerNewKeybind, keybinds } = usePlayer()
	const [selectedSong, setSelectedSong] = useState<string>('')
	const [keybind, setKeybind] = useState<React.KeyboardEvent<HTMLInputElement>>(null)

	const handleSave = () => {
		// this is super hacky
		const bind = webKeypressToBind(keybind)
		localStorage.setItem(bind, webKeypressToReadable(keybind))

		registerNewKeybind({ name: selectedSong, keybind: bind })
		close()
	}

	const alreadyBoundSongs = Object.values(keybinds)
	const items = songlist.filter((song) => !alreadyBoundSongs.includes(song)).map((song) => ({ id: song, label: song }))
	if (!alreadyBoundSongs.includes('__togglePlayback')) {
		items.unshift({ id: '__togglePlayback', label: 'Playback Toggle' })
	}

	return createPortal(
		<Modal close={close}>
			{() => (
				<Card className='h-min w-2/3 min-w-[20rem]' title='Keybind'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label type='secondary'>Song</Label>
							<Dropdown className='max-w-full overflow-hidden truncate' onChange={setSelectedSong} selectedItemId={selectedSong} items={items} />
						</div>
						<div className='space-y-2'>
							<Label type='secondary'>Keybind</Label>
							<Input className='w-full' onKeyDown={(e) => setKeybind(e)} value={webKeypressToReadable(keybind)} />
						</div>
						<Button disabled={!selectedSong || !keybind} type='primary' onClick={handleSave}>
							Save
						</Button>
					</div>
				</Card>
			)}
		</Modal>,
		document.body
	)
}

export default Keybind
