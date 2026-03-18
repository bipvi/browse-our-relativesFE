'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import HomeCards from '@/components/cards/HomeCards'
import { FaFire } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function MyHero() {
  const router = useRouter()
  const { token, fetchMe, fetchFavourites, setTokenFromStorage } = useUserStore()
  const [item1, setItem1] = useState<any>(null)
  const [item2, setItem2] = useState<any>(null)
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

  const refresh = async (which: string) => {
    if (which === 'item1') await getRand(setItem1)
    if (which === 'item2') await getRand(setItem2)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-7rem)]">

      {/* Hero header */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-14 px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          <span className="text-txt/40 home-text-shadow">Benvenuto in </span>
          <span className="text-myP text-hover home-text-shadow">Browse our relatives</span>
        </h1>
        <p className="text-lg text-txt/60 mb-10 max-w-lg home-text-shadow">
          Scopri tutte le specie del mondo animale.
        </p>
        <Button
          onClick={() => router.push('/curiosone')}
          className="bg-myP text-myS font-bold hover:bg-myP/80 rounded-2xl px-8 h-12 text-base gap-2 shadow-[0_4px_24px_rgba(0,175,107,0.35)]"
        >
          <FaFire className="h-5 w-5" />
          Vai al Curiosone
        </Button>
      </section>

      {/* Cards */}
      <section className="container mx-auto pb-20 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {loading ? (
            <>
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </>
          ) : (
            <>
              <HomeCards item={item1} change={refresh} num="item1" />
              <HomeCards item={item2} change={refresh} num="item2" />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
