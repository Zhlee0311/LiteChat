import { Router } from 'express'
import bcrypt from 'bcrypt'
import { redisClient } from '../config/redis'
import { AppDataSource } from '../config/db'
import { sendVerifyCode } from '../utils/mailer'
import { signToken } from '../utils/jwt'
import { User } from '../entity/User'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const userRepo = AppDataSource.getRepository(User)


// 发送验证码
router.post('/sendVerifyCode', async (req, res) => {
    const { email } = req.body
    // 生成 6 位随机验证码，并存入 Redis，设置 5 分钟过期
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await redisClient.set(`verify:${email}`, code, { EX: 300 }) // 5 分钟过期
    try {
        await sendVerifyCode(email, code)
        res.status(200).json({
            success: true,
            message: '验证码已发送'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: '验证码发送失败'
        })
    }
})

// 利用验证码鉴权
router.post('/auth', async (req, res) => {
    const { email, code } = req.body
    const user = await userRepo.findOneBy({ email })
    if (!user) {
        res.status(404).json({
            success: false,
            message: '用户不存在'
        })
        return
    }
    const savedCode = await redisClient.get(`verify:${email}`)
    if (savedCode !== code) {
        res.status(400).json({
            success: false,
            message: '验证码错误或已过期'
        })
        return
    }
    // 校验成功后删除验证码
    await redisClient.del(`verify:${email}`)

    // 生成 token
    const token = signToken({
        id: user!.id,
        email: user!.email,
        account: user!.account
    })
    res.status(200).json({
        success: true,
        token: token,
        message: '身份认证成功'
    })
})


// 注册(实际上是注册并登录，因为返回了token)
router.post('/register', async (req, res) => {
    const { email, code } = req.body
    // 检验邮箱是否已注册
    const exist = await userRepo.findOneBy({ email })
    if (exist) {
        res.status(400).json({
            success: false,
            message: '此邮箱已注册'
        })
        return
    }

    // 验证码校验
    const savedCode = await redisClient.get(`verify:${email}`)
    if (savedCode !== code) {
        res.status(400).json({
            success: false,
            message: '验证码错误或已过期'
        })
        return
    }

    // 生成唯一账号
    const generateAccount = async () => {
        let account: string
        let exist: User | null
        do {
            account = Math.random().toString().slice(2, 10)
            exist = await userRepo.findOneBy({ account })
        } while (exist !== null)
        return account
    }
    const account = await generateAccount()

    // 创建用户
    const user = userRepo.create({ email, account })
    await userRepo.save(user)

    // 校验成功后删除验证码
    await redisClient.del(`verify:${email}`)

    // 生成 token
    const token = signToken({
        id: user.id,
        email: user.email,
        account: user.account
    })

    res.status(201).json({
        success: true,
        token: token,
        message: '注册成功'
    })
})

// 邮箱 + 验证码登录
router.post('/login/verifyCode', async (req, res) => {
    const { email, code } = req.body
    const user = await userRepo.findOneBy({ email })
    if (!user) {
        // 如果用户不存在，返回错误404
        res.status(404).json({
            success: false,
            message: '用户不存在'
        })
        return
    }
    // 验证码校验
    const savedCode = await redisClient.get(`verify:${email}`)
    if (savedCode !== code) {
        res.status(400).json({
            success: false,
            message: '验证码错误或已过期'
        })
        return
    }
    // 校验成功后删除验证码
    await redisClient.del(`verify:${email}`)

    // 生成 token
    const token = signToken({
        id: user.id,
        email: user.email,
        account: user.account
    })
    res.status(200).json({
        success: true,
        token: token,
        message: '登录成功',
    })
})

// 邮箱/账号 + 密码登录
router.post('/login/password', async (req, res) => {
    const { identifier, password } = req.body
    const user = await userRepo.createQueryBuilder('user')
        .where('user.email = :identifier OR user.account = :identifier', { identifier })
        .getOne()

    if (!user) {
        res.status(404).json({
            success: false,
            message: '用户不存在'
        })
        return
    } else if (!user.password) {
        res.status(400).json({
            success: false,
            message: '密码错误或未设置'
        })
        return
    } else {
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.status(400).json({
                success: false,
                message: '密码错误或未设置'
            })
            return
        }
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        account: user.account
    })
    res.status(200).json({
        success: true,
        token: token,
        message: '登录成功',
    })
})

// 修改/设置 密码
router.post('/setPassword', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user!.id
    const { inputPassword } = req.body
    const user = await userRepo.findOneBy({ id: userId })
    if (!user) {
        res.status(404).json({
            success: false,
            message: '用户不存在'
        })
        return
    }
    if (user.password && user.password == inputPassword) {
        res.status(400).json({
            success: false,
            message: '新密码与旧密码相同'
        })
        return
    }
    // 根据是否存在密码判断是设置还是修改
    let modifyType = (user.password ? '修改' : '设置')
    const hashedPassword = await bcrypt.hash(inputPassword, 10)
    user.password = hashedPassword
    await userRepo.save(user)
    res.status(200).json({
        success: true,
        message: `${modifyType}密码成功`
    })
})


// 搜索用户-TODO
router.post('/search', authMiddleware, async (req: AuthRequest, res) => {

})



export default router
