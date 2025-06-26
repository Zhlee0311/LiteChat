import { Space, List, Tag, Avatar, Typography, Empty, Spin } from 'antd'
import { useEffect, useState } from 'react'
import '../../../styles/request.css'

export default function RequestSent({ }) {
    // 加载状态和已加载状态
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    // 已发出的好友请求列表
    const [requests, setRequests] = useState([])

    /* 测试用 */
    const DEBUG = true
    const test_data = Array.from({ length: 35 }, (_, i) => {
        const statusList = ['pending', 'accepted', 'rejected']
        const status = statusList[i % 3]
        return {
            id: i + 1,
            status: status,
            toUserId: 1000 + i,
            toUserAccount: `test_user_${i + 1}`,
            toUserEmail: `user${i + 1}@example.com`,
            toUserNickname: `测试用户${i + 1}`,
            toUserAvatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`,
            content: `你好，我是测试用户${i + 1}，想加你好友！`,
            note: `备注${i + 1}`,
            createAt: new Date(Date.now() - i * 3600 * 1000).toISOString()
        }
    })
    const defaultAvatar = 'https://randomuser.me/api/portraits/lego/1.jpg'
    /* 测试用 */

    // 在组件加载时获取已发出的好友请求
    useEffect(() => {
        if (DEBUG) {
            setLoading(true)
            setTimeout(() => {
                setRequests(test_data)
                setLoading(false)
                setLoaded(true)
            }, 500)
            return
        }
        const fetchRequests = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/friend/request/sent', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                const data = await res.json()
                if (data.success) {
                    setRequests(data.requests)
                    console.log(data.message)
                }
            } catch (err) {
                console.error('获取已发出的好友请求失败:', err)
            }
            setLoading(false)
            setLoaded(true)
        }
        fetchRequests()
    }, [])

    // 获取发出请求的状态
    const getStatusTag = (status) => {
        switch (status) {
            case 'pending':
                return <Tag color='processing'>等待处理</Tag>
            case 'accepted':
                return <Tag color='success'>已通过</Tag>
            case 'rejected':
                return <Tag color='error'>已拒绝</Tag>
            default:
                return <Tag color='default'>未知状态</Tag>
        }
    }

    return (
        <div style={{ padding: '16px' }}>
            <Spin spinning={loading} tip='加载中...'>
                <Typography.Title level={2}>发出的好友请求</Typography.Title>
                <List
                    itemLayout='horizontal'
                    className='request-list'
                    dataSource={requests}
                    locale={{
                        emptyText: loaded ? <Empty description='暂无发出的好友请求' /> : ' '
                    }}
                    pagination={{
                        pageSize: 4,
                        showSizeChanger: false,
                        showTotal: total => `共 ${total} 条记录`
                    }}
                    renderItem={(item) => (
                        <List.Item
                            className='request-list-item'
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.toUserAvatar || defaultAvatar}
                                        className='ant-avatar'
                                    />}
                                title={
                                    <Space direction='vertical' size={2}>
                                        <div><strong>账号：</strong>{item.toUserAccount}</div>
                                        <div><strong>昵称：</strong>{item.toUserNickname}</div>
                                    </Space>
                                }
                                description={
                                    <div>
                                        <div><strong>验证信息：</strong>{item.content}</div>
                                        <div><strong>备注：</strong>{item.note || '无'}</div>
                                        <div style={{ marginTop: 8 }}>{getStatusTag(item.status)}</div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                >
                </List>
            </Spin>
        </div>
    )
}