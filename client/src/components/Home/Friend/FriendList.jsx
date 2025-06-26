import { useEffect, useState, useMemo } from 'react'
import {
    List, Avatar, Button, Spin,
    message, Popconfirm, Typography,
    Empty, Input, Space
} from 'antd'
import { DeleteOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'
import '../../../styles/FriendList.css'

export default function FriendList() {
    // 当前用户的好友
    const [friends, setFriends] = useState([])
    // 好友列表加载状态
    const [loading, setLoading] = useState(false)
    // 好友列表是否已加载
    const [loaded, setLoaded] = useState(false)
    // Ant Design 的消息提示组件
    const [messageApi, messageHolder] = message.useMessage()
    // 搜索文本
    const [searchText, setSearchText] = useState('')

    /*测试用*/
    const DEBUG = true
    const defaultAvatar = 'https://randomuser.me/api/portraits/lego/2.jpg'
    const test_data = Array.from({ length: 50 }, (_, i) => ({
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
            setLoading(true)
            setTimeout(() => {
                setFriends(test_data)
                setLoading(false)
                setLoaded(true)
            }, 50)
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
            setLoaded(true)
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

    const filteredFriends = useMemo(() => {
        if (!searchText) return friends
        return friends.filter(f => {
            const target = (f.nickname + f.email + f.account + f.note).toLowerCase()
            return target.includes(searchText)
        })
    }, [friends, searchText])

    return (
        <div style={{ padding: '16px 0px 16px 16px' }}>
            {messageHolder}
            {<Typography.Title level={2}>好友列表</Typography.Title>}
            <Input
                size='large'
                value={searchText}
                prefix={<SearchOutlined />}
                placeholder='搜索好友（账号 / 昵称 / 邮箱 / 备注）'
                onChange={(e) => setSearchText(e.target.value.trim().toLowerCase())}
                style={{ marginTop: 8, marginBottom: 20, maxWidth: 340 }}
            />
            <div className='friend-list-scroll'>
                <Spin spinning={loading} tip='加载中...'>
                    <List
                        split={true}
                        className='friend-list'
                        itemLayout='vertical'
                        dataSource={filteredFriends}
                        locale={{
                            emptyText: loaded ? (
                                friends.length ?
                                    <Empty description='未搜索到相关用户' />
                                    : <Empty description='暂无好友' />
                            ) : ' '
                        }}
                        renderItem={(item) => (
                            <List.Item
                                className='friend-list-item'
                                actions={[
                                    <Button
                                        type='link'
                                        icon={<MessageOutlined />}
                                        onClick={() => console.log('TODO: 打开聊天窗口', item)}
                                    >
                                        聊天
                                    </Button>,
                                    <Popconfirm
                                        title='确认是否删除此好友（此操作不可撤销）'
                                        onConfirm={() => handleDelete(item.id)}
                                        okText='确定'
                                        cancelText='取消'
                                    >
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            type='link'
                                        >
                                            删除
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <List.Item.Meta
                                    className='metadata'
                                    avatar={
                                        <Avatar
                                            className='ant-avatar'
                                            src={item.avatar || defaultAvatar}
                                        />
                                    }
                                    title={
                                        <Space direction='vertical' size={2}>
                                            {item.note ? `${item.note} (${item.nickname})` : item.nickname}
                                        </Space>
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
                </Spin>
            </div>
        </div>
    )
}