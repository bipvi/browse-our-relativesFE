'use client'
import { useEffect, useState } from 'react'
import HomeCards from '@/components/cards/HomeCards'
import { Skeleton } from '@/components/ui/skeleton'

export default function Sections({
  item1,
  item2,
  change,
  loading = false,
}: {
  item1: any
  item2: any
  change: (num: string) => void
  loading?: boolean
}) {
  const [item11, setItem11] = useState<any>()
  const [item22, setItem22] = useState<any>()

  useEffect(() => { setItem11(item1); setItem22(item2) }, [item1, item2])

  return (
    <section className="container mx-auto pb-20 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {loading ? (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </>
        ) : (
          <>
            <HomeCards item={item11} change={change} num="item1" key={1} />
            <HomeCards item={item22} change={change} num="item2" key={2} />
          </>
        )}
      </div>
    </section>
  )
}
