import { useEffect, useState } from 'react'
import {
    List, Avatar, Button, Spin, message, Popconfirm
} from 'antd'
import { DeleteOutlined, Message, MessageOutlined } from '@ant-design/icons'

export default function FriendList() {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const [messageApi, messageHolder] = message.useMessage()

    useEffect(() => {
        const fetchFriendList = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/friend/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                const data = await res.json()
                if (data.success) {
                    setFriends(data.friends)
                } else {
                    messageApi.error('好友列表获取失败')
                }
            } catch (err) {
                console.error('好友列表获取失败:', err)
                messageApi.error('好友列表获取失败')
            }
            setLoading(false)
        }
        fetchFriendList()
    }, [])

    const handleDelete = async (friendId) => {
        try {
            const res = await fetch('/api/friend/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    friendId: friendId
                })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success('好友删除成功')
                setFriends(prev => prev.filter(f => f.id !== friendId))
            } else {
                messageApi.error('好友删除失败')
            }
        } catch (err) {
            console.error('好友删除失败:', err)
            messageApi.error('好友删除失败')
        }
    }

    return (
        <div style={{ padding: '16px' }}>
            {messageHolder}
            <Spin spinning={loading} tip='加载中...'>
                <Typography.Title level={2}>收到的好友请求</Typography.Title>
                <List
                    itemLayout='horizontal'
                    dataSource={friends}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    type='link'
                                    icon={<MessageOutlined />}
                                    onClick={() => { console.log('TODO: 打开聊天窗口', item) }}
                                >
                                    聊天
                                </Button>,
                                <Popconfirm
                                    title='确定删除该好友吗（此操作不可撤销）'
                                    onConfirm={() => handleDelete(item.id)}
                                    okText='确定'
                                    cancelText='取消'
                                >
                                    <Button danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar || 'https://joeschmoe.io/api/v1/random'} />}
                            />
                        </List.Item>
                    )}
                >

                </List>
            </Spin>
        </div>
    )
}