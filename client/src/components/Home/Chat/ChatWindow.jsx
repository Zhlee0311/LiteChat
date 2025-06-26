import { useEffect, useState, useRef } from 'react'
import socket from '../../../../utils/socket'
import { Input, Button, message, Spin, Avatar, Typography } from 'antd'
import { SendOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title, Text } = Typography

export default function ChatWindow({ user }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const messageEndRef = useRef(null)
}