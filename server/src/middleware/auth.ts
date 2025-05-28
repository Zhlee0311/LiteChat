import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

// 对请求拓展，附加一个 user 属性
export interface AuthRequest extends Request {
    user?: {
        id: number,
        email: string,
        account: string
    }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
        res.status(401).json({
            success: false,
            message: '未提供token'
        })
        return
    }
    const decoded = verifyToken(token)
    if (!decoded) {
        res.status(401).json({
            success: false,
            message: 'token无效'
        })
        return
    } else {
        req.user = {
            id: (decoded as any).id,
            email: (decoded as any).email,
            account: (decoded as any).account
        }
        next()
    }
}