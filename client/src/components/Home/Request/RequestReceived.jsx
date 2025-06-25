import { useEffect, useState } from 'react'
import {
    List, Avatar, Typography, Tag, Modal,
    Empty, Spin, Button, message, Input, Space,
    Tooltip
} from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function RequestReceived() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(0)// 用于强制刷新
    const [noteInputVisible, setNoteInputVisible] = useState(false) // 是否显示备注输入框
    const [rejectConfirmVisible, setRejectConfirmVisible] = useState(false) // 是否显示拒绝确认框
    const [currentRequestId, setCurrentRequestId] = useState(null) // 当前正在处理的请求ID
    const [noteB2A, setNoteB2A] = useState('') // 接收方对发送方的备注
    const [messageApi, messageHolder] = message.useMessage()

    /*测试用*/
    const test_data = [
        {
            id: 301,
            status: 'accepted',
            fromUserId: 11,
            fromUserAccount: 'u00011',
            fromUserEmail: 'alice1@example.com',
            fromUserNickname: 'Alice1',
            fromUserAvatar: 'https://randomuser.me/api/portraits/women/11.jpg',
            content: 'Hi，我是Alice1，想加你好友',
            createAt: '2025-06-06T13:01:00Z'
        },
        {
            id: 302,
            status: 'rejected',
            fromUserId: 12,
            fromUserAccount: 'u00012',
            fromUserEmail: 'bob2@example.com',
            fromUserNickname: 'Bob2',
            fromUserAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
            content: '我们是不是在某个群聊见过？',
            createAt: '2025-06-06T13:02:00Z'
        },
        {
            id: 303,
            status: 'pending',
            fromUserId: 13,
            fromUserAccount: 'u00013',
            fromUserEmail: 'carol3@example.com',
            fromUserNickname: 'Carol3',
            fromUserAvatar: 'https://randomuser.me/api/portraits/women/13.jpg',
            content: '你好你好，加个好友可以吗~',
            createAt: '2025-06-06T13:03:00Z'
        },
        {
            id: 304,
            status: 'pending',
            fromUserId: 14,
            fromUserAccount: 'u00014',
            fromUserEmail: 'dan4@example.com',
            fromUserNickname: 'Dan4',
            fromUserAvatar: 'https://randomuser.me/api/portraits/men/14.jpg',
            content: '打游戏认识的我~',
            createAt: '2025-06-06T13:04:00Z'
        },
        {
            id: 305,
            status: 'pending',
            fromUserId: 15,
            fromUserAccount: 'u00015',
            fromUserEmail: 'eva5@example.com',
            fromUserNickname: 'Eva5',
            fromUserAvatar: 'https://randomuser.me/api/portraits/women/15.jpg',
            content: '你是不是也在技术交流群？',
            createAt: '2025-06-06T13:05:00Z'
        },
        {
            id: 306,
            status: 'pending',
            fromUserId: 16,
            fromUserAccount: 'u00016',
            fromUserEmail: 'frank6@example.com',
            fromUserNickname: 'Frank6',
            fromUserAvatar: 'https://randomuser.me/api/portraits/men/16.jpg',
            content: 'LiteChat用起来挺不错，加你玩',
            createAt: '2025-06-06T13:06:00Z'
        },
        {
            id: 307,
            status: 'pending',
            fromUserId: 17,
            fromUserAccount: 'u00017',
            fromUserEmail: 'grace7@example.com',
            fromUserNickname: 'Grace7',
            fromUserAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
            content: 'Hi，我是Grace，想认识你',
            createAt: '2025-06-06T13:07:00Z'
        },
        {
            id: 308,
            status: 'pending',
            fromUserId: 18,
            fromUserAccount: 'u00018',
            fromUserEmail: 'harry8@example.com',
            fromUserNickname: 'Harry8',
            fromUserAvatar: 'https://randomuser.me/api/portraits/men/18.jpg',
            content: '群里推荐的朋友~',
            createAt: '2025-06-06T13:08:00Z'
        },
        {
            id: 309,
            status: 'pending',
            fromUserId: 19,
            fromUserAccount: 'u00019',
            fromUserEmail: 'irene9@example.com',
            fromUserNickname: 'Irene9',
            fromUserAvatar: 'https://randomuser.me/api/portraits/women/19.jpg',
            content: '一起学React吧！',
            createAt: '2025-06-06T13:09:00Z'
        },
        {
            id: 310,
            status: 'pending',
            fromUserId: 20,
            fromUserAccount: 'u00020',
            fromUserEmail: 'jack10@example.com',
            fromUserNickname: 'Jack10',
            fromUserAvatar: 'https://randomuser.me/api/portraits/men/20.jpg',
            content: '我们在项目协作群里聊过',
            createAt: '2025-06-06T13:10:00Z'
        }
    ]
    const DEBUG = true
    const defauktAvatar = 'https://randomuser.me/api/portraits/lego/2.jpg'
    /*测试用*/

    useEffect(() => {
        if (DEBUG) {
            setRequests(test_data)
            return
        }
        const fetchRequests = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/friend/request/received', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                })
                const data = await res.json()
                if (data.success) {
                    setRequests(data.requests)
                } else {
                    messageApi.error(data.message || '获取好友请求失败')
                }
            } catch (err) {
                console.error(err)
                messageApi.error('获取好友请求失败，请稍后重试')
            }
            setLoading(false)
        }
        fetchRequests()
    }, [refresh])


    const handleAcceptClick = async (requestId) => {
        setCurrentRequestId(requestId)
        setNoteInputVisible(true)
    }

    const confirmAccept = async () => {
        try {
            const res = await fetch('/api/friend/request/handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    requestId: currentRequestId,
                    accept: true,
                    noteB2A: noteB2A.trim() || null // 如果备注为空，则传null
                })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success(data.message || '好友请求已接受')
                setNoteInputVisible(false)
                setNoteB2A('') // 清空备注输入
                setRefresh(prev => prev + 1) // 强制刷新列表
            } else {
                messageApi.error(data.message || '好友请求接受失败')
            }
        } catch (err) {
            console.error(err)
            messageApi.error('接受好友请求失败，请稍后重试')
        }
    }

    const handleRejectClick = (requestId) => {
        setCurrentRequestId(requestId)
        setRejectConfirmVisible(true)
    }

    const confirmReject = async () => {
        try {
            const res = await fetch('/api/friend/request/handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    requestId: currentRequestId,
                    accept: false,
                    noteB2A: null // 拒绝时不需要备注
                })
            })
            const data = await res.json()
            if (data.success) {
                messageApi.success(data.message || '好友请求已拒绝')
                setRefresh(prev => prev + 1) // 强制刷新列表
            } else {
                messageApi.error(data.message || '好友请求拒绝失败')
            }
        } catch (err) {
            console.error(err)
            messageApi.error('拒绝好友请求失败，请稍后重试')
        }
    }

    return (
        <div style={{ padding: '16px' }}>
            {messageHolder}
            <Spin spinning={loading} tip='加载中...'>
                <Typography.Title level={2}>收到的好友请求</Typography.Title>
                {requests.length > 0 ? (
                    <List
                        itemLayout='horizontal'
                        dataSource={requests}
                        pagination={{
                            pageSize: 6,
                            showSizeChanger: false,
                            showTotal: total => `共 ${total} 条记录`
                        }}
                        renderItem={(item) => (
                            <List.Item
                                actions={item.status === 'pending' ? [
                                    <Space>
                                        <Tooltip title="接受">
                                            <Button
                                                type="text"
                                                icon={<CheckOutlined style={{ color: 'green' }} />}
                                                onClick={() => handleAcceptClick(item.id)}
                                            />
                                        </Tooltip>
                                        <Tooltip title="拒绝">
                                            <Button
                                                type="text"
                                                icon={<CloseOutlined style={{ color: 'red' }} />}
                                                onClick={() => handleRejectClick(item.id)}
                                            />
                                        </Tooltip>
                                    </Space>
                                ] : [
                                    <Tag color={
                                        item.status === 'accepted' ? 'success' :
                                            item.status === 'rejected' ? 'error' : 'default'
                                    }>
                                        {item.status === 'accepted' ? '已接受' : '已拒绝'}
                                    </Tag>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.fromUserAvatar || defauktAvatar} />}
                                    title={
                                        <Space direction='vertical' size={2}>
                                            <span><strong>账号：</strong>{item.fromUserAccount}</span>
                                            <span><strong>昵称：</strong>{item.fromUserNickname}</span>
                                        </Space>
                                    }
                                    description={
                                        <div><strong>验证信息：</strong> {item.content}</div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description='暂无收到的请求' />
                )}
            </Spin>

            <Modal
                title='接受好友请求'
                open={noteInputVisible}
                onOk={confirmAccept}
                onCancel={() => setNoteInputVisible(false)}
                okText='确认'
                cancelText='取消'
                width={400}
            >
                <p>输入你对好友的备注</p>
                <Input
                    placeholder='输入备注（可选）'
                    value={noteB2A}
                    onChange={(e) => setNoteB2A(e.target.value)}
                />
            </Modal>
            <Modal
                title='拒绝好友请求'
                open={rejectConfirmVisible}
                onOk={confirmAccept}
                onCancel={() => setRejectConfirmVisible(false)}
                okText='确认'
                cancelText='取消'
                width={400}
            >
                <p>是否拒绝此好友请求？（此操作不可撤销！）</p>
            </Modal>
        </div >
    )
}