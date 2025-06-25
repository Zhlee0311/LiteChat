import { useEffect, useState } from 'react'
import {
    List, Avatar, Button, Spin, message, Popconfirm
} from 'antd'
import { DeleteOutlined, Message } from '@ant-design/icons'

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
}