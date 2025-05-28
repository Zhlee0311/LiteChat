import SetPasswordForm from '../components/SetPassword'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function SetPassword() {
    const navigate = useNavigate()
    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h2 className='auth-title'>设置新密码</h2>
                </div>
                <SetPasswordForm
                    onSuccess={() => navigate('/home')}
                />
            </div>
        </div>
    )
}