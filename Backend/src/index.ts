import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookies from "cookie-parser"
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors({
  credentials: true
}))
app.use(compression())
app.use(cookieParser())
app.use(cookies())
app.use(bodyParser.json())
app.use('/', router())

const server = http.createServer(app)
server.listen(3001, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
const MONGO_URL = process.env.MONGO_URL

mongoose.Promise = Promise
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => { console.log(error) })

const db = mongoose.connection
db.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

db.once('open', () => {
  console.log('Connected to MongoDB')
})

export default app
