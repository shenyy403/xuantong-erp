import { useState } from 'react'
import { api } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Watermark from '../components/Watermark'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { user } = useAuth()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    try {
      if (mode === 'login') {
        const userData = await api.post('/login', { email, password: pw })
        localStorage.setItem('xuantong_user', JSON.stringify(userData))
        window.location.href = '/'
      } else {
        await api.post('/register', { email, password: pw, nickname: name })
        alert('注册成功，请登录')
        setMode('login')
      }
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Watermark />
      <form onSubmit={submit} className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold tracking-widest text-center">玄同</h1>
        <p className="text-center text-sm text-slate-500 mt-1 mb-6">
          {mode === 'login' ? '登录你的学习台' : '创建学生账号'}
        </p>
        {mode === 'signup' && (
          <input value={name} onChange={e => setName(e.target.value)} required
            placeholder="你的昵称" className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        )}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
          placeholder="邮箱" className="w-full mb-3 px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} required
          placeholder="密码" className="w-full mb-4 px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
        <button className="w-full py-2 rounded-md bg-slate-900 text-white hover:opacity-90">
          {mode === 'login' ? '登录' : '注册'}
        </button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full mt-3 text-sm text-slate-500 hover:text-slate-900">
          {mode === 'login' ? '没有账号？注册' : '已有账号？去登录'}
        </button>
      </form>
    </div>
  )
}
