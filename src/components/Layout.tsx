import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Watermark from './Watermark'

const navItems = [
  { to: '/', label: '总览' },
  { to: '/tasks', label: '任务' },
  { to: '/modules', label: '目标模块' },
  { to: '/countdowns', label: '倒计时' },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const nav = useNavigate()

  return (
    <div className="relative min-h-screen">
      <Watermark />
      <div className="relative z-10">
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-20">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-semibold tracking-widest text-lg">玄同</span>
              <nav className="flex gap-1 text-sm">
                {navItems.map(i => (
                  <NavLink key={i.to} to={i.to} end
                    className={({isActive}) => `px-3 py-1.5 rounded-md ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                    {i.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">{profile?.display_name || '加载中'} </span>
              <button onClick={async () => { await signOut(); nav('/login') }}
                className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100">退出</button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}