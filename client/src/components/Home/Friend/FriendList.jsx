import { useEffect, useState, useMemo } from 'react'
import {
    List, Avatar, Button, Spin,
    message, Popconfirm, Typography,
    Empty, Input
} from 'antd'
import { DeleteOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'

export default function FriendList() {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(false)
    const [messageApi, messageHolder] = message.useMessage()
    const [searchText, setSearchText] = useState('')

    /*测试用*/
    const DEBUG = true
    const defaultAvatar = 'https://randomuser.me/api/portraits/lego/2.jpg'
    const test_data = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        account: `user${i + 1}`,
        nickname: `昵称${i + 1}`,
        avatar: defaultAvatar,
        note: i % 3 === 0 ? `备注${i + 1}` : ''
    }))

    /*测试用*/

    useEffect(() => {
        if (DEBUG) {
            setFriends(test_data)
            return
        }
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
            {<Typography.Title level={2}>好友列表</Typography.Title>}
            <div style={{ marginBottom: '16px' }}>
                <Input.Search
                    size='large'
                    value={searchText}
                    enterButton={<SearchOutlined />}
                    placeholder='搜索好友（账号 / 昵称 / 邮箱 / 备注）'
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginTop: 8, maxWidth: 350 }}
                />
            </div>
            <Spin spinning={loading} tip='加载中...'>
                {friends.length > 0 ? (
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                        <List
                            itemLayout='vertical'
                            dataSource={friends}
                            renderItem={(item) => (
                                <List.Item
                                    style={{
                                        background: '#fff',
                                        borderRadius: 12,
                                        padding: 16,
                                        marginBottom: 16,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                    actions={[
                                        <Button
                                            type='link'
                                            icon={<MessageOutlined />}
                                            onClick={() => console.log('TODO: 打开聊天窗口', item)}
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
                                        </Popconfirm>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                size={64}
                                                src={item.avatar || defaultAvatar}
                                                style={{ border: '2px solid #eee' }}
                                            />
                                        }
                                        title={
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                {item.note ? `${item.note} (${item.nickname})` : item.nickname}
                                            </Typography.Title>
                                        }
                                        description={
                                            <Typography.Text type='secondary'>
                                                <strong>邮箱：</strong> {item.email} <br />
                                                <strong>账号：{item.account}</strong>
                                            </Typography.Text>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                ) : (
                    <Empty description={<Typography.Text type='secondary'>找呀找呀找朋友，找到一个好朋友</Typography.Text>} />
                )}
            </Spin>
        </div>
    )
}