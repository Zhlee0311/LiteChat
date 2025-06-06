import { Modal, Input, Button, Avatar, Typography, message, Spin, Card, Tooltip, Empty, Form } from 'antd'
import { SearchOutlined, UserAddOutlined, CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'


export default function AddFriend() {
    // 搜索用户的标识信息
    const [identifier, setIdentifier] = useState('')
    // 加载状态
    const [loading, setLoading] = useState(false)
    //搜索到的用户信息
    const [user, setUser] = useState(null
        /*
        ||
        {
        id: 123,
        email: '123@qq.com',
        account: '123',
        nickname: '123',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        status: 'stranger' // stranger, friend, request_sent, request_received
        }
        */
    )
    // 搜索状态：idle, no_result, success
    const [searchStatus, setSearchStatus] = useState('success')
    // 信息提示
    const [messageApi, messageHolder] = message.useMessage()
    // 添加好友时的验证信息内容
    const [content, setContent] = useState('')
    // 添加好友时用户对好友的备注
    const [note, setNote] = useState('')
    // 用于显示模态框
    const [isModalVisible, setIsModalVisible] = useState(false)

    // 获取当前用户信息
    const fetchMe = async () => {
        const res = await fetch('/api/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        const data = await res.json()
        return data.user
    }
    // 处理搜索操作
    const handleSearch = async () => {
        if (!identifier.trim()) {
            messageApi.error('请输入有效的邮箱/账号')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/user/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ identifier })
            })
            const data = await res.json()
            if (data.success && data.user) {
                setUser(data.user)
                setSearchStatus('success')
                messageApi.success(data.message)
            } else {
                setUser(null)
                setSearchStatus('no_result')
                messageApi.error(data.message)
            }
        } catch {
            setUser(null)
            setSearchStatus('idle')
            messageApi.error('搜索失败，请稍后再试')
        }
        setLoading(false)
    }

    // 处理补全好友请求的操作
    const handleRequest = async () => {
        if (!user) return
        //const myNickname = (await fetchMe()).nickname
        const myNickname = '我的昵称' // 这里可以替换为实际获取当前用户昵称的逻辑
        setContent(`你好，我是${myNickname}，很高兴认识你！`) // 默认验证信息
        setNote('') // 清空备注
        setIsModalVisible(true) // 打开模态框
    }

    // 处理提交好友请求的操作
    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/friend/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    toId: user.id,
                    content: content,
                    noteA2B: note
                })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success(data.message)
                setUser({ ...user, status: 'request_sent' })
                setIsModalVisible(false)
            } else {
                messageApi.error(data.message)
            }
        } catch {
            messageApi.error('发送好友请求失败，请稍后再试')
        }
    }

    return (
        <div style={{ padding: 16 }}>
            {messageHolder}
            <Typography.Title level={2}>添加好友</Typography.Title>
            <Input.Search
                placeholder='输入邮箱或账号搜索'
                enterButton={<SearchOutlined />}
                value={identifier}
                onChange={(e) => {
                    setIdentifier(e.target.value)
                    setSearchStatus('idle')
                    setUser(null)
                }}
                onSearch={handleSearch}
                loading={loading}
                size='large'
                style={{ marginTop: 24, maxWidth: 300 }}
            />
            <Modal
                title='发送好友请求'
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText='确认'
                cancelText='取消'
                width={500}
            >
                <Form layout='vertical'>
                    <Form.Item label="填写验证信息">
                        <Input.TextArea
                            rows={3}
                            value={content}
                            placeholder="输入验证信息，让对方更好地了解你"
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="设置对方备注">
                        <Input.TextArea
                            rows={3}
                            value={note}
                            placeholder="输入备注"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Spin spinning={loading}>
                {searchStatus === 'idle' && (
                    <div style={{ marginTop: 40, textAlign: 'center' }}>
                        <Empty description={<Typography.Text type="secondary">搜索你想添加的朋友</Typography.Text>} />
                    </div>
                )}
                {searchStatus === 'no_result' && (
                    <div style={{ marginTop: 40, textAlign: 'center' }}>
                        <Empty description={<Typography.Text type="danger">未找到匹配的用户</Typography.Text>} />
                    </div>
                )}
                {searchStatus === 'success' && user && (
                    <Card style={{ maxWidth: 400, marginTop: 30 }}>
                        <Card.Meta
                            avatar={<Avatar src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpgh'} size={64} style={{ border: '2px solid #1890ff' }} />}
                            title={user.nickname}
                            description={
                                <>
                                    账号：{user.account}<br />
                                    邮箱：{user.email}<br />
                                </>
                            }
                        />
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            {(() => {
                                switch (user.status) {
                                    case 'friend':
                                        return <Button disabled icon={<CheckOutlined />}>已添加</Button>
                                    case 'request_sent':
                                        return <Button disabled icon={< UserAddOutlined />}>已发送好友请求</Button>
                                    case 'request_received':
                                        return (
                                            <Tooltip title='对方向你发送了好友请求，前往好友请求列表中查看'>
                                                <Button disabled type='dashed'>等待处理</Button>
                                            </Tooltip>
                                        )
                                    case 'stranger':
                                    default:
                                        return (
                                            <Button type='primary' icon={<UserAddOutlined />} onClick={handleRequest}>
                                                添加好友
                                            </Button>
                                        )
                                }
                            })()}
                        </div>
                    </Card>
                )}
            </Spin>
        </div >
    )
}

