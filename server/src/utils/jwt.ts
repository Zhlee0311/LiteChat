import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.JWT_SECRET as string

export const signToken = (payload: object, expiresIn = 3600) => {
    return jwt.sign(payload, secret, { expiresIn })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret)
    } catch {
        return null
    }
}