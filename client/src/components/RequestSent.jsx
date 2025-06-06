import { Card, List, Avatar, Typography, Empty, Spin } from 'antd'
import { useEffect, useState } from 'react'


export default function RequestSent({ }) {
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        const fetchRequest = async () => {
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
            } finally {
                setLoading(false)
            }
        }
    })


}