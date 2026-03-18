'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import Sections from './Sections'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function MyHero() {
  const router = useRouter()
  const { token, fetchMe, fetchFavourites, setTokenFromStorage } = useUserStore()
  const [item1, setItem1] = useState<any>({})
  const [item2, setItem2] = useState<any>({})
  const [whatItem, setWhatItem] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getRand = async (setter: (d: any) => void) => {
    try {
      const resp = await fetch(`${API}/item/exploreRandomly`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (resp.ok) setter(await resp.json())
      else router.push('/login')
    } catch {
      router.push('/login')
    }
  }

  useEffect(() => {
    if (token) {
      fetchMe(token)
      fetchFavourites()
      setLoading(true)
      Promise.all([getRand(setItem1), getRand(setItem2)]).finally(() => setLoading(false))
    } else {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('tokenKey') : null
      if (!stored) router.push('/login')
      else setTokenFromStorage(stored)
    }
  }, [token])

  useEffect(() => {
    if (whatItem === 'item1') getRand(setItem1)
    if (whatItem === 'item2') getRand(setItem2)
    setWhatItem(null)
  }, [whatItem])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-14 px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-txt/40 home-text-shadow mb-3 leading-tight">
          Benvenuto in{' '}
          <span className="text-myP text-hover">Browse our relatives</span>
        </h1>
        <p className="text-lg text-txt/60 mb-10 max-w-xl home-text-shadow">
          Scopri tutte le specie del mondo animale.
        </p>
        <Button
          onClick={() => router.push('/curiosone')}
          size="lg"
          className="bg-myP text-myS font-bold hover:bg-myP/80 rounded-2xl px-8 h-12 text-base gap-2 shadow-[0_4px_24px_rgba(0,175,107,0.35)]"
        >
          <Flame className="h-5 w-5" />
          Vai al Curiosone
        </Button>
      </section>

      {/* Cards */}
      <Sections item1={item1} item2={item2} change={setWhatItem} loading={loading} />
    </div>
  )
}
