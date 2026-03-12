'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, Button, Spinner } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'
import { HorizontalCard } from '@/components/cards/HorizontalCard'
import MicroCard from '@/components/cards/MicroCard'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function CuriosoneHeading() {
  const router = useRouter()
  const { token } = useUserStore()
  const [item, setItem] = useState<any>(undefined)
  const [other, setOther] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isWrong, setIsWrong] = useState(false)

  const getRandomSpecie = async (setter: (d: any) => void) => {
    try {
      const resp = await fetch(`${API}/specie/getRandomly`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) { setter(await resp.json()); setIsWrong(false) }
      else throw new Error()
    } catch { setIsWrong(true); alert('Errore nel caricamento') }
  }

  useEffect(() => {
    getRandomSpecie(setItem)
    getRandomSpecie(setOther)
  }, [])

  useEffect(() => {
    if (!token) router.push('/')
  }, [token])

  const handleRefresh = async () => {
    setIsLoading(true)
    await getRandomSpecie(setItem)
    await getRandomSpecie(setOther)
    setIsLoading(false)
  }

  return (
    <>
      {isWrong && <Alert color="warning">Sorry, something went wrong please try again.</Alert>}

      <div className="lg:flex lg:items-center lg:justify-evenly my-7 mx-auto px-8 sm:px-14 md:px-4 lg:px-16 w-screen">
        <div className="min-w-0 flex-1 flex-nowrap">
          <div className="flex items-center justify-between sm:me-6 lg:me-0">
            <h2 className="text-2xl/7 font-bold text-start text-txt sm:truncate sm:text-3xl sm:tracking-tight">
              {item?.nome}
            </h2>
            <Button size="lg" className="flex items-center gap-2 text-tx bg-myP popup" onClick={handleRefresh}>
              Vedi altro
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 mx-auto py-3 px-8 sm:px-14 md:px-4 lg:px-16 w-screen gap-11">
        <div className="lg:col-span-4 col-span-3">
          {isLoading ? <Spinner className="h-12 w-12" /> : <HorizontalCard it={item} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 min-w-full gap-4 mt-6">
            {!isLoading && item && [
              item.genere,
              item.genere?.famiglia,
              item.genere?.famiglia?.ordine,
              item.genere?.famiglia?.ordine?.classe,
              item.genere?.famiglia?.ordine?.classe?.phylum,
              item.genere?.famiglia?.ordine?.classe?.phylum?.regno,
            ].filter(Boolean).map((subItem: any, i: number) => (
              <MicroCard key={i} item={subItem} />
            ))}
            {isLoading && <Spinner className="h-12 w-12" />}
          </div>
        </div>

        <div className="lg:col-span-1 hidden md:contents">
          <div className="flex flex-col items-center gap-7">
            <h2 className="self-start text-lg font-semibold text-txt">Altre specie:</h2>
            {!isLoading && other && [
              other,
              other.genere,
              other.genere?.famiglia?.ordine,
              other.genere?.famiglia?.ordine?.classe?.phylum,
            ].filter(Boolean).map((subItem: any, i: number) => (
              <MicroCard key={i} item={subItem} classe={i > 1 ? 'hideLastCard' : ''} />
            ))}
            {isLoading && <Spinner className="h-12 w-12" />}
          </div>
        </div>
      </div>
    </>
  )
}
