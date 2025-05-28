import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './route/user'
import friendRoutes from './route/friend'
import messageRoutes from './route/message'
import { AppDataSource } from './config/db'
import { redisClient } from './config/redis'
dotenv.config()

const app = express()

app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(express.json())

// <<< REST API Routes >>>
app.use('/api/user', userRoutes)
app.use('/api/friend', friendRoutes)
app.use('/api/message', messageRoutes)
// <<< REST API Routes >>>


AppDataSource.initialize().then(() => {
    console.log('MySQL connected')
    redisClient.connect().then(() => {
        console.log('Redis connected')
    })
})

export default app