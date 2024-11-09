import { PlusIcon } from '@heroicons/react/24/solid'
import { backgroundSecondaryActive, Button } from '@kobandavis/ui'
import { Modals } from '../'
import { FC, useState } from 'react'
import { usePlayer } from '../../providers/Player'
import clsx from 'clsx'

interface KeybindsProps {}

const Keybinds: FC<KeybindsProps> = ({}) => {
	const { keybinds, removeKeybind } = usePlayer()
	const [showKeybind, setShowKeybind] = useState<boolean>(false)
	const [selectedKeybind, setSelectedKeybind] = useState<string>(null)

	const keybindEntries = Object.entries(keybinds)
	return (
		<>
			{keybindEntries.length ? (
				<div onClick={() => setSelectedKeybind(null)} className='flex-1 bg-theme-primary/15 p-2 rounded flex flex-col'>
					{keybindEntries.map(([keybind, name]) => (
						<div
							onClick={(e) => (e.stopPropagation(), setSelectedKeybind(keybind))}
							key={keybind}
							className={clsx(
								selectedKeybind === keybind ? 'bg-theme-primary/20' : 'bg-theme-secondary',
								backgroundSecondaryActive,
								'flex w-full select-none rounded mb-2 last:mb-0'
							)}
						>
							<span title={name} className='px-2 py-1 w-1/2 truncate border-r-4 border-r-theme-primary/20'>
								{name}
							</span>
							<div className='px-2 py-1 text-end w-1/2 truncate'>{localStorage.getItem(keybind)}</div>
						</div>
					))}
				</div>
			) : null}
			<div className='space-x-2 self-end'>
				<Button disabled={!selectedKeybind} type='secondary' onClick={() => removeKeybind(selectedKeybind)}>
					Delete Keybind
				</Button>
				<Button type='primary' onClick={() => setShowKeybind(true)}>
					<div className='flex'>
						<span className='mr-2'>New Keybind</span>
						<PlusIcon className='w-4 h-4' />
					</div>
				</Button>
			</div>
			{showKeybind ? <Modals.Keybind close={() => setShowKeybind(false)} /> : null}
		</>
	)
}

export default Keybinds
