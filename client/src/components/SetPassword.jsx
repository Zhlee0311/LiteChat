import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons'

export default function SetPassword(onSuccess) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()

    const onFinish = async (values) => {
        const { password } = values
        setLoading(true)
        try {
            const res = await fetch('/api/user/setPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    inputPassword: password
                })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success(data.message)
                onSuccess()
            } else {
                messageApi.error(data.message)
            }
        } catch {
            messageApi.error('设置密码失败，请稍后尝试')
        }
        setLoading(false)
    }
    return (
        <Form form={form} onFinish={onFinish} layout='vertical'>
            {contextHolder}
            <Form.Item
                label='新密码'
                name='password'
                rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码长度至少6位' },
                ]}
                hasFeedback
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='请输入新密码'
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Form.Item>

            <Form.Item
                label='确认密码'
                name='confirmPassword'
                dependencies={['password']}
                hasFeedback
                rules={[
                    { required: true, message: '请再次输入新密码' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject(new Error('两次输入的密码不一致'))
                        }
                    })
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='请再次输入新密码'
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={loading} block>
                    保存
                </Button>
            </Form.Item>
        </Form>
    )
}