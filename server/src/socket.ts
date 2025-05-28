import { Server } from 'socket.io'
import { createServer } from 'http'
import { verifyToken } from './utils/jwt'
import app from './app'

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    }
})

interface ClientData {
    id: number // userId
}

const onlineUsers = new Map<number, string>() // userId -> socketId

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next(new Error('未提供token'))
    }
    // token里的id是用户id
    const decoded = verifyToken(token) as { id: number }
    if (!decoded) {
        next(new Error('无效的token'))
    } else {
        (socket.data as ClientData).id = decoded.id
        next()
    }
})

io.on('connection', (socket) => {
    const userId = (socket.data as ClientData).id
    console.log('用户连接：', userId)
    onlineUsers.set(userId, socket.id)

    socket.on('disconnect', () => {
        console.log('用户断开连接：', userId)
        onlineUsers.delete(userId)
    })

    socket.on('sendMessage', async (data) => {
        const { receiverId, content } = data
        const senderId = userId

        // 消息入库
        const { Message } = await import('./entity/Message')
        const { AppDataSource } = await import('./config/db')
        const messageRepo = AppDataSource.getRepository(Message)
        const message = messageRepo.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            content: content,
        })
        await messageRepo.save(message)

        // 若接收方在线，则推送
        const receiverSocketId = onlineUsers.get(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {
                senderId: senderId,
                content: content,
                time: new Date()
            })
        }
    })

})

export { httpServer }


