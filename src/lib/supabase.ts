const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'

export const api = {
  async post(path: string, body: any) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error((await res.json()).error || '请求失败')
    return res.json()
  },
  async get(path: string) {
    const res = await fetch(`${API_BASE}${path}`)
    return res.json()
  },
  async put(path: string, body: any) {
    await fetch(`${API_BASE}${path}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
  },
  async del(path: string) {
    await fetch(`${API_BASE}${path}`, { method: 'DELETE' })
  }
}
