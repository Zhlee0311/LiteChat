import { io } from 'socket.io-client'

const socket = io('/', {
    auth: {
        token: localStorage.getItem('token') || ''
    },
    autoConnect: false
})//使用默认命名空间即可

export default socket