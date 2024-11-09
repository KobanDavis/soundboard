import fs from 'fs'
import path from 'path'
import ytdl from '@distube/ytdl-core'
import { Router } from 'express'
import { ApiYtInfoRequestBody, ApiYtSaveRequestBody, ApiYtStreamRequestBody } from 'types'

const apiRouter = Router()

apiRouter.post('/info', async (req, res) => {
	const body: ApiYtInfoRequestBody = req.body
	const info = await ytdl.getBasicInfo(body.url).catch((e) => console.error(e))
	res.status(200).json(info ?? null)
})

apiRouter.post('/stream', (req, res) => {
	const body: ApiYtStreamRequestBody = req.body
	try {
		const stream = ytdl(body.url, { filter: 'audioonly' })

		res.setHeader('Content-Type', 'audio/mpeg')
		res.setHeader('Transfer-Encoding', 'chunked')

		stream.pipe(res)

		stream.on('error', (error) => {
			console.error('Stream error:', error)
			res.status(500).end('Error streaming audio')
		})

		// stream.on('end', () => {
		// 	res.end()
		// })
	} catch (error) {
		console.error('Error fetching stream:', error)
		res.status(500).end('Error fetching audio stream')
	}
})

apiRouter.post('/save', (req, res) => {
	const body: ApiYtSaveRequestBody = req.body
	const filePath = path.resolve('downloads', `${body.name}.mp3`)

	try {
		const stream = ytdl(body.url, { filter: 'audioonly' })
		const fileStream = fs.createWriteStream(filePath)

		stream.pipe(fileStream)

		stream.on('error', (error) => {
			console.error('Stream error:', error)
			res.status(500).end('Error streaming audio')
		})

		fileStream.on('finish', () => {
			console.log(`Audio saved to ${filePath}`)
			res.send(filePath).end()
		})
	} catch (error) {
		console.error('Error fetching stream:', error)
		res.status(500).end('Error fetching audio stream')
	}
})

apiRouter.post('/delete', (req, res) => {
	const body: ApiYtSaveRequestBody = req.body
	const filePath = path.resolve('downloads', body.name)

	fs.unlinkSync(filePath)
	res.status(204).end()
})

apiRouter.get('/list', (_, res) => {
	const downloads = path.resolve('downloads')
	const files = fs.readdirSync(downloads)
	res.json(files)
})

export default apiRouter
