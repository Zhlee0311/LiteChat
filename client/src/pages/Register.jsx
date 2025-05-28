import RegisterForm from '../components/Register'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function Register() {
    const navigate = useNavigate()
    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h2 className='auth-title'>欢迎使用LiteChat</h2>
                </div>
                <RegisterForm
                    onSuccess={() => navigate('/afterRegister')}
                />
                <div className='auth-footer'>
                    <p>
                        已有账号？
                        <a onClick={() => navigate('/login')}>立即登录</a>
                    </p>
                </div>
            </div>
        </div>
    )
}