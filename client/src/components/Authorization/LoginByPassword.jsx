import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    EyeInvisibleOutlined, EyeTwoTone,
    LockOutlined, UserOutlined
} from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import '../../styles/Auth.css'

export default function LoginByPassword({ onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        const { identifier, password } = values
        setLoading(true)
        try {
            const res = await fetch('/api/user/login/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
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
    }
    return (
        <>
            {contextHolder}
            <Form onFinish={onFinish} layout='vertical'>
                <Form.Item
                    label='账号/邮箱'
                    name='identifier'
                    rules={[{ required: true, message: '请输入账号或邮箱' }]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    label='密码'
                    name='password'
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <div className='auth-password'>
                    <a
                        onClick={() => navigate('/auth', {
                            state: {
                                from: '/login',
                                redirect: '/setPassword'
                            }
                        })}
                    >
                        忘记密码？
                    </a>
                </div>

                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading} block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}