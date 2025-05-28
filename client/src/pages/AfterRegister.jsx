import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function AfterRegister() {
    const navigate = useNavigate()
    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h2 className='auth-title'>注册成功🎉</h2>
                    <p>是否现在设置登录密码</p>
                </div>
                <div className='auth-button-group'>
                    <Button onClick={() => navigate('/home')}>
                        跳过，进入首页
                    </Button>
                    <Button type='primary' onClick={() => navigate('/setPassword')}>
                        设置密码
                    </Button>
                </div>
            </div>
        </div>
    )
}