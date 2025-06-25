import { Space, List, Tag, Avatar, Typography, Empty, Spin } from 'antd'
import { useEffect, useState } from 'react'


export default function RequestSent({ }) {
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState([])

    /* 测试用 */
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
    const DEBUG = true
    /* 测试用 */

    // 在组件加载时获取已发出的好友请求
    useEffect(() => {
        if (DEBUG) {
            setRequests(test_data)
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
                {requests.length > 0 ? (
                    <List
                        itemLayout='horizontal'
                        dataSource={requests}
                        pagination={{
                            pageSize: 4,
                            showSizeChanger: false,
                            showTotal: total => `共 ${total} 条记录`
                        }}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.toUserAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} />}
                                    title={
                                        <Space direction='vertical' size={2}>
                                            <span><strong>账号：</strong>{item.toUserAccount}</span>
                                            <span><strong>昵称：</strong>{item.toUserNickname}</span>
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
                ) : (
                    <Empty description='暂无发出的好友请求' style={{ marginTop: 40 }} />
                )}
            </Spin>
        </div>
    )

}