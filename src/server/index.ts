import express from 'express'
import cors from 'cors'
import apiRouter from './routers/api'

const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

app.use('/api/yt', apiRouter)

app.get('*', (req, res) => {
	console.log('Unhandled request: ', req.url)
	res.status(404).send('Path not defined.')
})

export default app
