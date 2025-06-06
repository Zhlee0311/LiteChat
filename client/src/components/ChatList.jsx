import { List, Avatar, Typography } from 'antd'

const testData = [
    {
        id: 1,
        name: '小明',
        lastMessage: '今天下班一起吃饭？',
        avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    {
        id: 2,
        name: '小红',
        lastMessage: '等下视频哦',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
        id: 3,
        name: 'LiteChat 官方',
        lastMessage: '欢迎使用 LiteChat！',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
    }
]

export default function ChatList() {
    return (
        <div style={{ padding: '16px' }}>
            <Typography.Title>最近会话</Typography.Title>
            <List
                itemLayout='horizontal'
                dataSource={testData}
                renderItem={item => (
                    <List.Item style={{ cursor: 'pointer' }}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item.name}
                            description={item.lastMessage}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}