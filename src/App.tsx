import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Modules from './pages/Modules'
import Countdowns from './pages/Countdowns'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()  // 把 session 改成 user
  if (loading) return <div className="p-10 text-center">加载中...</div>
  if (!user) return <Navigate to="/login" replace />  // 这里也改成 user
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="modules" element={<Modules />} />
            <Route path="countdowns" element={<Countdowns />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
