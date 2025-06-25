import AuthForm from '../../components/Authorization/AuthByVerifyCode'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import '../../styles/Auth.css'

export default function Auth() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state?.from) {
            navigate('/register')
        }
    }, [location, navigate])

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div class='auth-header'>
                    <h2 className='auth-title'>身份认证</h2>
                </div>
                <AuthForm
                    onSuccess={() => navigate(location.state?.redirect || '/')}
                />
                <div className='auth-footer'>
                    <p>
                        <a onClick={() => navigate('/register')}>返回账号注册界面</a>
                    </p>
                </div>
            </div>
        </div>
    )
}