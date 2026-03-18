'use client'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { HorizontalCard } from '@/components/cards/HorizontalCard'
import MicroCard from '@/components/cards/MicroCard'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function MyCarousel({ prevItem, setActive, active }: { prevItem: any; setActive: (item: any) => void; active: any }) {
  const { token } = useUserStore()
  const router = useRouter()
  const [list, setList] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!prevItem?.id) return
    const urlMap: Record<string, string> = {
      regno: `regno/${prevItem.id}/getPhylums`,
      phylum: `phylum/${prevItem.id}/getClassi`,
      classe: `classe/${prevItem.id}/getOrdini`,
      ordine: `ordine/${prevItem.id}/getFamiglie`,
      famiglia: `famiglia/${prevItem.id}/getGeneri`,
      genere: `genere/${prevItem.id}/getSpecie`,
    }
    const path = urlMap[prevItem.tipo?.toLowerCase()]
    if (!path) { setError('Tipo non valido'); return }

    fetch(`${API}/${path}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.ok) return r.json(); throw new Error('Errore fetch') })
      .then(data => { setList(data); setError(null) })
      .catch(() => setError('Errore nel caricamento dei dati.'))
  }, [prevItem])

  return (
    <div className="my-6 w-screen">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Swiper spaceBetween={10} slidesPerView="auto" centeredSlides={false} loop freeMode modules={[]}>
          {list.map((it, index) => (
            <SwiperSlide key={index} className="wauto" onClick={() => router.push(`/${it.id}`)}>
              <HorizontalCard it={it}
                classe={active?.id === it.id ? 'shadow-sm shadow-black grower hidden md:flex max-w-[45rem]' : 'smaller hidden md:flex shadow-xs max-w-[45rem]'} />
              <MicroCard item={it}
                classe={active?.id === it.id ? 'shadow-sm md:hidden w-[28rem] h-[28rem] shadow-black grower' : 'smaller md:hidden w-[28rem] h-[28rem] shadow-xs'} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
