import type ytdl from '@distube/ytdl-core'
import { ApiYtDeleteRequestBody, ApiYtInfoRequestBody, ApiYtSaveRequestBody, ApiYtStreamRequestBody } from 'types'

class YTApi {
	private static BASE_URL = 'http://localhost:8765'

	public static getSongInfo = async (body: ApiYtInfoRequestBody): Promise<ytdl.videoInfo> => {
		const res = await fetch(`${YTApi.BASE_URL}/api/yt/info`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		return res.json()
	}

	public static getSongBlobUrl = async (body: ApiYtStreamRequestBody): Promise<string> => {
		const res = await fetch(`${YTApi.BASE_URL}/api/yt/stream`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})

		if (res.ok) {
			return URL.createObjectURL(await res.blob())
		} else {
			console.error('Failed to stream audio')
		}
	}

	public static saveSong = async (body: ApiYtSaveRequestBody): Promise<string> => {
		const res = await fetch(`${YTApi.BASE_URL}/api/yt/save`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		return res.text()
	}

	public static deleteSong = async (body: ApiYtDeleteRequestBody): Promise<void> => {
		await fetch(`${YTApi.BASE_URL}/api/yt/delete`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
	}

	public static listSaved = async (): Promise<string[]> => {
		const res = await fetch(`${YTApi.BASE_URL}/api/yt/list`)
		return res.json()
	}
}

export default YTApi
