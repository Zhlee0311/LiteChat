import { Layout, Menu, Avatar, Typography } from 'antd'
import { useState } from 'react'
import {
    MessageOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    SendOutlined,
    UserAddOutlined,
    IdcardOutlined,
    NotificationOutlined,
    ContactsOutlined,
} from '@ant-design/icons'
import '../styles/Home.css'
import ChatList from '../components/ChatList.jsx'
import AddFriend from '../components/AddFriend.jsx'


const { Header, Content, Footer, Sider } = Layout
const { Text, Title } = Typography

const items = [
    {
        key: 'chat',
        label: '聊天',
        icon: <MessageOutlined />,
    },
    {
        key: 'friend',
        label: '好友',
        icon: < UserOutlined />,
        children: [
            {
                key: 'friendList',
                label: '好友列表',
                icon: <ContactsOutlined />
            },
            {
                key: 'addFriend',
                label: '添加好友',
                icon: <UserAddOutlined />
            },
            {
                key: 'friendRequest',
                label: '好友请求',
                icon: <NotificationOutlined />,
                children: [
                    {
                        key: 'sent',
                        label: '发出',
                        icon: <SendOutlined />
                    },
                    {
                        key: 'received',
                        label: '收到',
                        icon: <SendOutlined rotate={180} />
                    }
                ]
            }
        ]
    },
    {
        key: 'general',
        label: '通用',
        icon: <SettingOutlined />,
        children: [
            {
                key: 'profile',
                label: '个人资料',
                icon: <IdcardOutlined />
            },
            {
                key: 'logout',
                label: '退出登录',
                icon: <LogoutOutlined />,
                danger: true
            }
        ]
    }
]

export default function Home() {
    const [selectedKey, setSelectedKey] = useState('chat')
    const renderContent = () => {
        switch (selectedKey) {
            case 'chat':
                return <ChatList />
            case 'addFriend':
                return <AddFriend />
            default:
                return (
                    <div className='welcome-card'>
                        <Title level={3}>今天过得怎么样？</Title>
                    </div>
                )
        }
    }

    return (
        <Layout className='home-layout'>
            <Sider width={280} className='home-sider'>
                <div className='user-profile'>
                    <Avatar size={120} src='https://randomuser.me/api/portraits/men/32.jpg' />
                    <Title level={4} className='user-name'>LiteChat_User</Title>
                    <Text type='success'>● 在线</Text>
                </div>
                <Menu
                    mode='inline'
                    defaultSelectedKeys={['chat']}
                    selectedKeys={[selectedKey]}
                    className='home-menu'
                    items={items}
                    onClick={({ key }) => {
                        setSelectedKey(key)
                    }}
                />
            </Sider>
            <Layout>
                <Header className='home-header'>
                    <div className='header-content'>
                        <Title level={4} style={{ margin: 0 }}>LiteChat，轻快畅聊</Title>
                    </div>
                </Header>
                <Content className='home-content'>
                    <div className='content-container'>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}