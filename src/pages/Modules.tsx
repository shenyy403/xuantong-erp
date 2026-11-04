import { useEffect, useState } from 'react'
import { api } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Modules() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#10b981')

  const load = async () => {
    if (!user) return
    const data = await api.get(`/modules/${user.id}`)
    setItems(data)
  }
  useEffect(() => { load() }, [user])

  const add = async () => {
    if (!user || !name.trim()) return
    await api.post('/modules', { user_id: user.id, name: name.trim(), color, sort_order: 0 })
    setName(''); load()
  }
  const remove = async (id: string) => { 
    await api.del(`/modules/${id}`)
    load() 
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex gap-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="目标/科目，如「考研政治」" className="flex-1 px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded-md border border-slate-200" />
        <button onClick={add} className="px-4 py-2 rounded-md bg-slate-900 text-white">添加</button>
      </div>
      <ul className="space-y-2">
        {items.map(m => (
          <li key={m.id} className="flex items-center gap-3 rounded-xl bg-white/80 border border-slate-200 px-4 py-3">
            <span className="w-3 h-3 rounded-full" style={{ background: m.color }} />
            <span className="flex-1">{m.name}</span>
            <button onClick={() => remove(m.id)} className="text-sm text-rose-600 hover:underline">删除</button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-slate-400">还没有目标模块，先添加一个</li>}
      </ul>
    </div>
  )
}
