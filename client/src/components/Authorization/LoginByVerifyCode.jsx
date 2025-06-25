import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { KeyOutlined, MailOutlined } from '@ant-design/icons'

export default function LoginByVerifyCode({ onSuccess }) {
    const [countdown, setCountdown] = useState(0)
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const [form] = Form.useForm()

    const sendVerifyCode = async () => {
        const email = form.getFieldValue('email')
        if (!email) {
            messageApi.error('邮箱不能为空')
            return
        } else if (!email.includes('@')) {
            messageApi.error('请输入有效的邮箱地址')
            return
        }

        setSending(true)
        try {
            const res = await fetch('/api/user/sendVerifyCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success(data.message)
                setCountdown(60)
                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
            } else {
                messageApi.error(data.message)
            }
        } catch {
            messageApi.error('发送验证码失败，请稍后尝试')
        }
        setSending(false)
    }
    const onFinish = (async (values) => {
        const { email, code } = values
        setLoading(true)
        try {
            const res = await fetch('/api/user/login/verifyCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            })
            const data = await res.json()
            if (data.success) {
                localStorage.setItem('token', data.token)
                messageApi.success(data.message)
                onSuccess()
            } else {
                messageApi.error(data.message)
            }
        } catch {
            messageApi.error('登录失败，请稍后尝试')
        }
        setLoading(false)
    })
    return (
        <>
            {contextHolder}
            <Form form={form} onFinish={onFinish} layout='vertical'>
                <Form.Item
                    label='邮箱'
                    name='email'
                    rules={[{ required: true, message: '请输入邮箱' }]}
                >
                    <Input prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                    label='验证码'
                    name='code'
                    rules={[{ required: true, message: '请输入验证码' }]}
                >
                    <Input
                        prefix={<KeyOutlined />}
                        addonAfter={
                            <Button type='link' disabled={countdown > 0 || sending} onClick={sendVerifyCode}>
                                {countdown > 0 ? `${countdown}秒后重新发送` : (sending ? '发送中...' : '获取验证码')}
                            </Button>
                        }
                    />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading} block>
                        {loading ? '登录中...' : '登录'}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}