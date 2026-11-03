import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Countdowns() {
  const { profile } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')

  const load = async () => {
    if (!profile) return
    const { data } = await supabase.from('countdowns').select('*').eq('user_id', profile.id).order('sort_order')
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [profile])

  const add = async () => {
    if (!profile || !label.trim() || !date) return
    await supabase.from('countdowns').insert({ user_id: profile.id, label: label.trim(), target_date: date, sort_order: items.length })
    setLabel(''); setDate(''); load()
  }
  const remove = async (id: string) => { await supabase.from('countdowns').delete().eq('id', id); load() }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap gap-3">
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="考试名称，如「考研初试」" className="flex-1 min-w-[180px] px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded-md border border-slate-200 bg-white/70" />
        <button onClick={add} className="px-4 py-2 rounded-md bg-slate-900 text-white">添加</button>
      </div>
      <ul className="space-y-2">
        {items.map(c => (
          <li key={c.id} className="flex items-center gap-3 rounded-xl bg-white/80 border border-slate-200 px-4 py-3">
            <span className="flex-1">{c.label}</span>
            <span className="text-sm text-slate-500">{c.target_date}</span>
            <button onClick={() => remove(c.id)} className="text-sm text-rose-600 hover:underline">删除</button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-slate-400">还没有倒计时</li>}
      </ul>
    </div>
  )
}