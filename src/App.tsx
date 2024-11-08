import { Label } from '@kobandavis/ui'
import { FC, useEffect, useState } from 'react'
import { Modals } from './components'
import { Cog6ToothIcon, MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'

const { electronAPI } = window as any

enum Tab {
	SAVED_SONGS,
	KEYBINDS,
}

const Home: FC = () => {
	const [showSettings, setShowSettings] = useState<boolean>(false)
	const [showDownload, setShowDownload] = useState<boolean>(false)
	const [selectedTab, setSelectedTab] = useState<Tab>(Tab.SAVED_SONGS)

	return (
		<div className='space-y-2 p-2 flex flex-col w-screen h-screen overflow-auto'>
			<div className='flex w-full drag items-center'>
				<span className='text-2xl mx-1 font-extrabold select-none'>soundboard.mp3</span>
				<div className='flex w-max ml-auto no-drag'>
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
					<Label type='primary'>Saved Songs</Label>
					<Label type='secondary'>Keybinds</Label>
				</div>
			</div>
		</div>
	)
}

export default Home
