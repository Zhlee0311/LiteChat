import { useState } from 'react'
import LoginByPasswordForm from '../../components/Authorization/LoginByPassword'
import LoginByVerifyCodeForm from '../../components/Authorization/LoginByVerifyCode'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import '../../styles/Auth.css'

export default function Login() {
    const [loginType, setLoginType] = useState('password') // 'password' or 'verifyCode'
    const navigate = useNavigate()

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <>
                    <div className='auth-header'>
                        <h2 className='auth-title'>欢迎使用LiteChat</h2>
                    </div>

                    <div className='auth-tabs'>
                        <Button
                            onClick={() => setLoginType('password')} type={loginType === 'password' ? 'primary' : 'default'}
                            className={`auth-tab-button ${loginType === 'password' ? 'active' : ''}`}
                        >
                            密码登录
                        </Button>
                        <Button onClick={() => setLoginType('verifyCode')} type={loginType === 'verifyCode' ? 'primary' : 'default'}
                            className={`auth-tab-button ${loginType === 'verifyCode' ? 'active' : ''}`}
                        >
                            验证码登录
                        </Button>
                    </div>

                    {loginType === 'password' ? (
                        <LoginByPasswordForm onSuccess={() => navigate('/home')} />
                    ) : (
                        <LoginByVerifyCodeForm onSuccess={() => navigate('/home')} />
                    )}

                    <div className='auth-footer'>
                        <p >
                            还没有账号？
                            <a onClick={() => navigate('/register')}>注册新账号</a>
                        </p>
                    </div>
                </>
            </div>
        </div >
    )
}