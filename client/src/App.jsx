import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AfterRegister from './pages/AfterRegister'
import SetPassword from './pages/SetPassword'
import Auth from './pages/Auth'


function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to='/register' replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/afterRegister'
          element={
            //<RequireAuth>
              < AfterRegister />
            //</RequireAuth>
          }
        />
        <Route
          path='/setPassword'
          element={
            //<RequireAuth>
              <SetPassword />
            //</RequireAuth>
          }
        />
        <Route path='*' element={<Register />} />
      </Routes>
    </BrowserRouter >
  )
}