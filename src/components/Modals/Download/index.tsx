import { FC, useEffect, useState } from 'react'
import { Label, Input, Card, Button, Modal, Loading } from '@kobandavis/ui'
import { useDebounce } from '../../../hooks'
import YTApi from '../../../classes/YTApi'
import type ytdl from '@distube/ytdl-core'
import { createPortal } from 'react-dom'
import { usePlayer } from '../../../providers/Player'

interface DownloadSongProps {
	close: () => void
}

const fileNameFriendly = (s: string) => s.replaceAll(/[^a-zA-Z0-9 ()-_~+]/g, '')

const DownloadSong: FC<DownloadSongProps> = ({ close }) => {
	const { reloadSonglist } = usePlayer()

	const [url, setUrl, underUrl] = useDebounce<string>('')
	const [ytVideo, setYtVideo] = useState<ytdl.videoInfo>(null)
	const [name, setName] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		setYtVideo(null)

		if (url) {
			YTApi.getSongInfo({ url }).then((video) => {
				setYtVideo(video)
				setName(fileNameFriendly(video.videoDetails.title))
			})
		}
	}, [url])

	const download = async () => {
		setLoading(true)
		await YTApi.saveSong({ url, name })
		await reloadSonglist()
		setLoading(false)
		close()
	}

	const tryPaste = async () => {
		const contents = await navigator.clipboard.readText()
		if (contents.startsWith('https://')) {
			setUrl(contents)
		}
	}

	return createPortal(
		<Modal close={close}>
			{() => (
				<Card title='Download Song' className='h-min w-2/3 min-w-[20rem]'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label type='primary'>YT Video URL</Label>
							<Input
								value={underUrl}
								onFocus={tryPaste}
								autoFocus
								className='w-full'
								placeholder='URL'
								onChange={(e) => setUrl(e.target.value)}
							/>
						</div>
						{ytVideo ? (
							<>
								<div className='space-y-2'>
									<Label type='primary'>Video Details</Label>
									<div className=''>{ytVideo.videoDetails.title}</div>
									<img className='rounded' src={ytVideo.videoDetails?.thumbnails?.[4].url} />
								</div>
								<div className='space-y-2'>
									<Label type='primary'>Song</Label>
									<div className='flex items-center'>
										<Input
											placeholder='Enter song name'
											className='w-full mr-2'
											value={name}
											onChange={(e) => setName(fileNameFriendly(e.target.value))}
										/>
										<Button disabled={!name} type='primary' onClick={download}>
											{loading ? <Loading type='primary' /> : 'Download'}
										</Button>
									</div>
								</div>
							</>
						) : null}
					</div>
				</Card>
			)}
		</Modal>,
		document.body
	)
}

export default DownloadSong
