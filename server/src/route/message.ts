import { Router } from 'express'
import { AppDataSource } from '../config/db'
import { Message } from '../entity/Message'
import { authMiddleware, AuthRequest } from '../middleware/auth'


const router = Router()
const messageRepo = AppDataSource.getRepository(Message)


// 发送消息
// 这里的发送消息实际上是将消息存入数据库，不是实时通信，测试使用
router.post('/send', authMiddleware, async (req: AuthRequest, res) => {
    const senderId = req.user!.id
    const { receiverId, content } = req.body
    if (!content || !receiverId) {
        res.status(400).json({
            success: false,
            message: '内容或接收者不能为空'
        })
        return
    }
    const message = messageRepo.create({
        sender: { id: senderId },
        receiver: { id: receiverId },
        content: content,
    })
    await messageRepo.save(message)
    res.status(200).json({
        success: true,
        message: '消息已发送'
    })
})

// 获取聊天记录
router.get('/history/:friendId', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user!.id
    const friendId = parseInt(req.params.friendId)
    const page = parseInt(req.query.page as string || '1') // 获取页码，默认为1
    const pageSize = 20 // 每页20条消息

    const [messages, total] = await messageRepo.findAndCount({
        where: [
            { sender: { id: userId }, receiver: { id: friendId } },
            { sender: { id: friendId }, receiver: { id: userId } }
        ],
        order: { createAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
    })

    res.status(200).json({
        success: true,
        total: total, // 总消息数
        page: page, // 当前页码
        messages: messages.reverse(),
        message: '聊天记录已获取'
    })
})



export default router