'use client'
import { useEffect, useState } from 'react'
import HomeCards from '@/components/cards/HomeCards'

export default function Sections({ item1, item2, change }: { item1: any; item2: any; change: (num: string) => void }) {
  const [item11, setItem11] = useState<any>()
  const [item22, setItem22] = useState<any>()

  useEffect(() => { setItem11(item1); setItem22(item2) }, [item1, item2])

  return (
    <div className="container mx-auto pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-10 py-8 px-6 2xl:px-14">
        <HomeCards item={item11} change={change} num="item1" key={1} />
        <HomeCards item={item22} change={change} num="item2" key={2} />
      </div>
    </div>
  )
}
