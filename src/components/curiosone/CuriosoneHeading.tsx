'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { HorizontalCard } from '@/components/cards/HorizontalCard'
import MicroCard from '@/components/cards/MicroCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function CuriosoneHeading() {
  const router = useRouter()
  const { token } = useUserStore()
  const [item, setItem] = useState<any>(undefined)
  const [other, setOther] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isWrong, setIsWrong] = useState(false)

  const getRandomSpecie = async (setter: (d: any) => void) => {
    try {
      const resp = await fetch(`${API}/specie/getRandomly`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (resp.ok) { setter(await resp.json()); setIsWrong(false) }
      else throw new Error()
    } catch { setIsWrong(true) }
  }

  useEffect(() => {
    if (token) {
      setIsLoading(true)
      Promise.all([getRandomSpecie(setItem), getRandomSpecie(setOther)]).finally(() =>
        setIsLoading(false)
      )
    }
  }, [token])

  useEffect(() => {
    if (!token) router.push('/')
  }, [token])

  const handleRefresh = async () => {
    setIsLoading(true)
    await Promise.all([getRandomSpecie(setItem), getRandomSpecie(setOther)])
    setIsLoading(false)
  }

  const taxonomy = item
    ? [
        item.genere,
        item.genere?.famiglia,
        item.genere?.famiglia?.ordine,
        item.genere?.famiglia?.ordine?.classe,
        item.genere?.famiglia?.ordine?.classe?.phylum,
        item.genere?.famiglia?.ordine?.classe?.phylum?.regno,
      ].filter(Boolean)
    : []

  const otherItems = other
    ? [
        other,
        other.genere,
        other.genere?.famiglia?.ordine,
        other.genere?.famiglia?.ordine?.classe?.phylum,
      ].filter(Boolean)
    : []

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="min-w-0">
          {isLoading ? (
            <Skeleton className="h-9 w-64" />
          ) : (
            <h2 className="text-3xl font-bold text-txt truncate">{item?.nome}</h2>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex-shrink-0 bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl gap-2 px-5 h-10"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Vedi altro
        </Button>
      </div>

      {/* Error */}
      {isWrong && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Errore nel caricamento. Riprova.</span>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Left: main card + taxonomy */}
        <div className="md:col-span-3 lg:col-span-4 space-y-6">
          {isLoading ? (
            <Skeleton className="h-80" />
          ) : (
            <HorizontalCard it={item} />
          )}

          {/* Taxonomy chain */}
          {!isLoading && taxonomy.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-txt/50 uppercase tracking-widest mb-3">
                Gerarchia tassonomica
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                {taxonomy.map((subItem: any, i: number) => (
                  <MicroCard key={i} item={subItem} />
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar: other species */}
        <div className="hidden md:flex md:flex-col gap-4 md:col-span-1">
          <h3 className="text-xs font-semibold text-txt/50 uppercase tracking-widest">
            Altre specie
          </h3>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))
            : otherItems.map((subItem: any, i: number) => (
                <MicroCard key={i} item={subItem} classe={i > 1 ? 'hideLastCard' : ''} />
              ))}
        </div>
      </div>
    </div>
  )
}
