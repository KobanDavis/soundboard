import { FC, useEffect, useState } from 'react'
import { Card, Dropdown, Label, LoadingScreen, Modal } from '@kobandavis/ui'
import { ThemeButtons } from '../..'
import { createPortal } from 'react-dom'
import { usePlayer } from '../../../providers/Player'

interface SettingsProps {
	close(): void
}

const getDevices = async () => {
	const devices = await navigator.mediaDevices.enumerateDevices()
	return devices.filter((device) => device.kind === 'audiooutput')
}

const Settings: FC<SettingsProps> = ({ close }) => {
	const { outputDevice1, setOutputDevice1, setOutputDevice2, outputDevice2 } = usePlayer()
	const [devices, setDevices] = useState<MediaDeviceInfo[]>()

	useEffect(() => {
		getDevices().then(setDevices)
	}, [])

	return createPortal(
		<Modal close={close}>
			{() => (
				<Card className='h-min w-2/3 min-w-[20rem]' title='Settings'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label type='secondary'>Output Device 1</Label>
							<Dropdown
								loading={!devices}
								placeholder='Select output device'
								className='w-full truncate'
								onChange={setOutputDevice1}
								selectedItemId={outputDevice1}
								items={devices?.map((device) => ({ label: device.label, id: device.deviceId }))}
							/>
						</div>
						<div className='space-y-2'>
							<Label type='secondary'>Output Device 2</Label>
							<Dropdown
								loading={!devices}
								placeholder='Select output device'
								className='w-full truncate'
								onChange={setOutputDevice2}
								selectedItemId={outputDevice2}
								items={devices?.map((device) => ({ label: device.label, id: device.deviceId }))}
							/>
						</div>
						<div className='space-y-2'>
							<Label type='secondary'>Theme</Label>
							<ThemeButtons />
						</div>
					</div>
				</Card>
			)}
		</Modal>,
		document.body
	)
}

export default Settings
