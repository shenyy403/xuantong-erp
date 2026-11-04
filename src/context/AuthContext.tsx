import { createContext, useContext, useEffect, useState } from 'react'

interface AuthCtx {
  user: any
  loading: boolean
  signOut: () => void
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, signOut: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('xuantong_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem('xuantong_user')
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, signOut }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
