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
    const { toId, content, noteA2B } = req.body
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
            toUser: { id: toId },
            status: 'pending'
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
        content: content,
        note: noteA2B,
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
    const { requestId, accept, noteB2A } = req.body
    const request = await requestRepo.findOne({
        where: { id: requestId, status: 'pending' },
        relations: ['fromUser', 'toUser'],
    })
    if (!request) {
        res.status(400).json({
            success: false,
            message: '无效的好友请求'
        })
        return
    }
    request.status = accept ? 'accepted' : 'rejected'
    await requestRepo.save(request) // 更新请求状态
    if (accept) {
        const friend = friendRepo.create({
            userA: request.fromUser,
            userB: request.toUser,
            noteA2B: request.note, // 请求方对被请求方的备注
            noteB2A: noteB2A // 被请求方对请求方的备注
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

// 发出的好友请求列表
router.get('/request/sent', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.id
    const requests = await requestRepo.find({
        where: { fromUser: { id: userId } },
        relations: ['toUser'],
        order: { createAt: 'DESC' }
    })
    const result = requests.map(req => ({
        id: req.id, // 发出的请求的ID
        status: req.status, // 请求状态
        toUserId: req.toUser.id, // 被请求方的用户ID
        toUserAccount: req.toUser.account, // 被请求方的账号
        toUserEmail: req.toUser.email, // 被请求方的邮箱
        toUserNickname: req.toUser.nickname, // 被请求方的昵称
        toUserAvatar: req.toUser.avatar, // 被请求方的头像
        content: req.content, // 请求方发给被请求方的验证信息
        note: req.note, // 请求方对被请求方的备注
        createAt: req.createAt // 请求创建时间
    }))
    res.status(200).json({
        success: true,
        requests: result,
        message: '发出的好友请求列表获取成功'
    })
})


// 收到的好友请求列表
router.get('/request/received', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.id
    const requests = await requestRepo.find({
        where: { toUser: { id: userId } },
        relations: ['fromUser'],
        order: { createAt: 'DESC' }
    })
    const result = requests.map(req => ({
        id: req.id, // 收到的请求的ID
        status: req.status, // 请求状态
        fromUserId: req.fromUser.id, // 请求方的用户ID
        fromUserAccount: req.fromUser.account, // 请求方的账号
        fromUserEmail: req.fromUser.email, // 请求方的邮箱
        fromUserNickname: req.fromUser.nickname, // 请求方的昵称
        fromUserAvatar: req.fromUser.avatar, // 请求方的头像
        content: req.content, // 请求方发给被请求方的验证信息
        //note: req.note, // 请求方对被请求方的备注
        createAt: req.createAt // 请求创建时间
    }))
    res.status(200).json({
        success: true,
        requests: result,
        message: '收到的好友请求列表获取成功'
    })
})


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