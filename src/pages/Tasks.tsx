import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { api } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Tasks() {
  const { user } = useAuth()
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [tasks, setTasks] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [moduleId, setModuleId] = useState<string>('')

  const load = async () => {
    if (!user) return
    const [t, m] = await Promise.all([
      api.get(`/tasks/${user.id}`),
      api.get(`/modules/${user.id}`)
    ])
    setTasks(t.filter((x:any) => x.task_date === date))
    setModules(m)
  }
  useEffect(() => { load() }, [user, date])

  const add = async () => {
    if (!user || !title.trim()) return
    await api.post('/tasks', { user_id: user.id, title: title.trim(), module_id: moduleId || null, task_date: date, done: false })
    setTitle(''); load()
  }
  const toggle = async (t: any) => { 
    await api.put(`/tasks/${t.id}`, { done: !t.done })
    load() 
  }
  const remove = async (id: string) => { 
    await api.del(`/tasks/${id}`)
    load() 
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="新增任务…" className="flex-1 min-w-[200px] px-3 py-2 rounded-md border border-slate-200 bg-white/70" onKeyDown={e => e.key === 'Enter' && add()} />
        <select value={moduleId} onChange={e => setModuleId(e.target.value)} className="px-3 py-2 rounded-md border border-slate-200 bg-white/70">
          <option value="">未分类</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button onClick={add} className="px-4 py-2 rounded-md bg-slate-900 text-white">添加</button>
      </div>
      <ul className="space-y-2">
        {tasks.map(t => {
          const m = modules.find(x => x.id === t.module_id)
          return (
            <li key={t.id} className="flex items-center gap-3 rounded-xl bg-white/80 border border-slate-200 px-4 py-3">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
              {m && <span className="px-2 py-0.5 rounded text-xs text-white" style={{ background: m.color }}>{m.name}</span>}
              <span className={t.done ? 'line-through text-slate-400 flex-1' : 'flex-1'}>{t.title}</span>
              <button onClick={() => remove(t.id)} className="text-sm text-rose-600 hover:underline">删除</button>
            </li>
          )
        })}
        {tasks.length === 0 && <li className="text-sm text-slate-400">该日期暂无任务</li>}
      </ul>
    </div>
  )
}
