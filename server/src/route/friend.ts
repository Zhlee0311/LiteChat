import { Router } from 'express'
import { AppDataSource } from '../config/db'
import { Friend } from '../entity/Friend'
import { FriendRequest } from '../entity/FriendRequest'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const requestRepo = AppDataSource.getRepository(FriendRequest)
const friendRepo = AppDataSource.getRepository(Friend)


// 发起好友请求
router.post('/request', authMiddleware, async (req: AuthRequest, res) => {
    const fromId = req.user!.id
    const { toId } = req.body
    if (fromId === toId) {
        res.status(400).json({
            success: false,
            message: '无法添加自己为好友'
        })
        return
    }
    const exist = await requestRepo.findOne({
        where: {
            fromUser: { id: fromId },
            toUser: { id: toId }
        }
    })
    if (exist) {
        res.status(400).json({
            success: false,
            message: '重复的好友请求，请等待对方处理'
        })
        return
    }
    const request = requestRepo.create({
        fromUser: { id: fromId },
        toUser: { id: toId },
        status: 'pending'
    })
    await requestRepo.save(request)
    res.status(200).json({
        success: true,
        message: '好友请求已发送'
    })
})

// 处理好友请求
router.post('/respond', authMiddleware, async (req: AuthRequest, res) => {
    const { requestId, accept } = req.body
    const request = await requestRepo.findOne({
        where: { id: requestId },
        relations: ['fromUser', 'toUser']
    })
    if (!request || request.status !== 'pending') {
        res.status(400).json({
            success: false,
            message: '无效的好友请求'
        })
        return
    }
    request.status = accept ? 'accepted' : 'rejected'
    await requestRepo.save(request)
    if (accept) {
        const friend = friendRepo.create({
            userA: request.fromUser,
            userB: request.toUser
        })
        await friendRepo.save(friend)
    }
    res.status(200).json({
        success: true,
        message: accept ? '好友请求已接受' : '好友请求已拒绝'
    })
})

// 获取好友列表
router.get('/list', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user!.id
    const friends = await friendRepo
        .createQueryBuilder('friend')
        .where('friend.userA = :id OR friend.userB = :id', { id: userId })
        .leftJoinAndSelect('friend.userA', 'userA')
        .leftJoinAndSelect('friend.userB', 'userB')
        .getMany()
    const result = friends.map(f => {
        const other = f.userA.id === userId ? f.userB : f.userA
        return {
            id: other.id,
            email: other.email,
            account: other.account,
            nickname: other.nickname,
            avatar: other.avatar
        }
    })
    res.status(200).json({
        success: true,
        friends: result,
        message: '好友列表获取成功'
    })
})

// 获取好友请求列表-TODO
// router.get('/getRequests')


// 删除好友
router.post('/delete', authMiddleware, async (req: AuthRequest, res) => {
    const { friendId } = req.body
    const userId = req.user!.id
    await friendRepo
        .createQueryBuilder()
        .delete()
        .where('(userA = :a AND userB = :b) OR (userA = :b AND userB = :a)', { a: userId, b: friendId })
        .execute()
    res.status(200).json({
        success: true,
        message: '好友已删除'
    })
})

export default router