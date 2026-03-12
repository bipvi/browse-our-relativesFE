'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import ButtonMyP from '@/components/buttons/ButtonMyP'
import Sections from './Sections'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function MyHero() {
  const router = useRouter()
  const { token, fetchMe, fetchFavourites, setTokenFromStorage } = useUserStore()
  const [item1, setItem1] = useState<any>({})
  const [item2, setItem2] = useState<any>({})
  const [whatItem, setWhatItem] = useState<string | null>(null)

  const getRand = async (setter: (d: any) => void) => {
    try {
      const resp = await fetch(`${API}/item/exploreRandomly`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) setter(await resp.json())
      else router.push('/login')
    } catch { router.push('/login') }
  }

  useEffect(() => {
    if (token) {
      fetchMe(token)
      fetchFavourites()
      getRand(setItem1)
      getRand(setItem2)
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
    <>
      <div className="flex items-center justify-center my-14 md:my-16 mx-20 bg-gradient-to-r text-txt text-wrap">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl text-myP home-text-shadow text-hover font-bold mb-4">
            Benvenuto in Browse our relatives
          </h1>
          <p className="text-lg mb-8 home-text-shadow">
            Scopri tutte le funzionalità che abbiamo da offrire e inizia a utilizzare la nostra applicazione oggi stesso.
          </p>
          <ButtonMyP onClick={() => router.push('/curiosone')} txt="Vai al curiosone" />
        </div>
      </div>
      <Sections item1={item1} item2={item2} change={setWhatItem} />
    </>
  )
}
