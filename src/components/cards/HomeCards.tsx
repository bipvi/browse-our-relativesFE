'use client'
import { useState, useEffect } from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function HomeCards({
  item,
  change,
  num,
}: {
  item: any
  change: (num: string) => void
  num: string
}) {
  const [open, setOpen] = useState(false)
  const { favourites, addFavourite, removeFavourite } = useUserStore()
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (Array.isArray(favourites)) setIsFav(favourites.some(f => f?.id === item?.id))
  }, [item, favourites])

  return (
    <>
      <Details item={item} handleOpen={() => setOpen(!open)} closeModal={() => setOpen(false)} open={open} />

      <div className={cn(
        'w-full rounded-2xl flex flex-col',
        'bg-white/5 backdrop-blur-md border border-myP/20',
        'shadow-[0_8px_32px_rgba(0,72,76,0.5)]',
        'hover:shadow-[0_8px_40px_rgba(0,175,107,0.15)] hover:border-myP/40',
        'transition-all duration-300'
      )}>
        {/* Top: badge + heart */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <Badge variant="outline">{item?.tipo || '—'}</Badge>
          <button
            onClick={() => isFav ? removeFavourite(item?.id) : addFavourite(item?.id)}
            className="p-1.5 rounded-full hover:bg-myP/10 transition-colors"
          >
            {isFav
              ? <GoHeartFill className="w-5 h-5 text-myP" />
              : <GoHeart className="w-5 h-5 text-txt/40 hover:text-myP transition-colors" />
            }
          </button>
        </div>

        {/* Image */}
        <div className="flex justify-center py-7">
          <img
            src={item?.img || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
            alt={item?.nome}
            className="w-28 h-28 rounded-full object-cover ring-2 ring-myP/40 shadow-lg"
          />
        </div>

        {/* Name */}
        <div className="text-center px-5 pb-6">
          <h5 className="text-xl font-bold text-txt mb-1">{item?.nome}</h5>
          <span className="text-sm text-myP/60">{item?.tipo}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-4 pb-5 mt-auto">
          <Button
            onClick={() => setOpen(true)}
            className="flex-1 bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl h-10"
          >
            Dettaglio
          </Button>
          <Button
            onClick={() => change(num)}
            variant="outline"
            className="flex-1 border-myP/30 text-txt hover:bg-myP/10 hover:border-myP/50 rounded-xl h-10"
          >
            Vedine un altro
          </Button>
        </div>
      </div>
    </>
  )
}
