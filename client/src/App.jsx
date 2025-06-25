import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Portal/Login'
import Register from './pages/Portal/Register'
import AfterRegister from './pages/Portal/AfterRegister'
import SetPassword from './pages/Misc/SetPassword'
import Auth from './pages/Misc/Auth'
import Home from './pages/Home/Home'


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
        <Route path='/home' element={<Home />} />
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