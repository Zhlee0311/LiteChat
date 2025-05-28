import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendVerifyCode = async (to: string, code: string) => {
    await transporter.sendMail({
        from: `"LiteChat" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: '[LiteChat] 验证码',
        html: `<p>您的验证码是：<b>${code}</b>，有效期 5 分钟。</p>`
    })
}