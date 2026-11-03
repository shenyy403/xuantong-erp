import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, differenceInCalendarDays } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { profile } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [countdowns, setCountdowns] = useState<any[]>([])
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    if (!profile) return
    supabase.from('tasks').select('*').eq('user_id', profile.id).eq('task_date', today).then(({ data }) => setTasks(data ?? []))
    supabase.from('modules').select('*').eq('user_id', profile.id).order('sort_order').then(({ data }) => setModules(data ?? []))
    supabase.from('countdowns').select('*').eq('user_id', profile.id).order('sort_order').then(({ data }) => setCountdowns(data ?? []))
  }, [profile])

  const doneCount = tasks.filter(t => t.done).length
  const moduleMap = useMemo(() => Object.fromEntries(modules.map(m => [m.id, m])), [modules])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <section className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 shadow">
          <div className="text-sm opacity-80">{format(new Date(), 'M月d日 EEEE')} · 玄同</div>
          <div className="mt-2 text-3xl font-semibold tracking-wider">
            {tasks.length === 0 ? '今天还没有安排任务' : `今日 ${tasks.length} 项任务`}
          </div>
          <div className="mt-1 text-sm opacity-80">已完成 {doneCount} 项</div>
        </section>

        <section className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200">
          <h2 className="font-semibold mb-3">今日任务</h2>
          {tasks.length === 0 && <div className="text-sm text-slate-400">去「任务」页添加今天的安排</div>}
          <ul className="space-y-2">
            {tasks.map(t => {
              const m = t.module_id ? moduleMap[t.module_id] : null
              return (
                <li key={t.id} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: m?.color ?? '#94a3b8' }} />
                  <span className="px-2 py-0.5 rounded text-xs text-white" style={{ background: m?.color ?? '#64748b' }}>
                    {m?.name ?? '未分类'}
                  </span>
                  <span className={t.done ? 'line-through text-slate-400' : ''}>{t.title}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="space-y-5">
        {countdowns.map(c => {
          const d = differenceInCalendarDays(new Date(c.target_date), new Date())
          return (
            <div key={c.id} className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">距 {c.label}</div>
              <div className="text-4xl font-semibold text-rose-500">
                {d >= 0 ? d : Math.abs(d)}<span className="text-base ml-1 text-slate-400">{d >= 0 ? '天' : '天前'}</span>
              </div>
            </div>
          )
        })}
        {countdowns.length === 0 && (
          <Link to="/countdowns" className="block rounded-2xl bg-white/60 p-5 border border-dashed border-slate-300 text-sm text-slate-400 text-center">
            添加你的第一个倒计时
          </Link>
        )}
      </div>
    </div>
  )
}