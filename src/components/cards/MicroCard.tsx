'use client'
import { useState, useEffect } from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function MicroCard({ classe = '', item }: { classe?: string; item: any }) {
  const [open, setOpen] = useState(false)
  const { favourites, addFavourite, removeFavourite } = useUserStore()
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (Array.isArray(favourites)) {
      setIsFav(favourites.some(f => f?.id === item?.id))
    }
  }, [item, favourites])

  return (
    <>
      <Details
        open={open}
        handleOpen={() => setOpen(!open)}
        closeModal={() => setOpen(false)}
        item={item}
      />

      <div
        className={cn(
          "rounded-xl overflow-hidden flex flex-col",
          "bg-white/5 backdrop-blur-md border border-myP/20",
          "shadow-[0_4px_16px_rgba(0,72,76,0.4)]",
          "hover:shadow-[0_4px_24px_rgba(0,175,107,0.15)] hover:border-myP/40",
          "transition-all duration-300",
          classe
        )}
      >
        {/* Text section */}
        <div className="px-3 pt-3 pb-2">
          <h3 className="text-sm font-bold text-txt truncate">{item?.nome}</h3>
          <p className="text-xs text-txt/50 mt-0.5 line-clamp-2">
            {item?.descrizione?.slice(0, 60) || ''}
          </p>
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="mt-2 w-full bg-myP/10 text-myP border border-myP/20 hover:bg-myP hover:text-myS rounded-lg text-xs h-7"
          >
            Dettagli
          </Button>
        </div>

        {/* Image section */}
        <div className="relative mt-1">
          <img
            src={item?.img || ''}
            alt={item?.nome}
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
          <button
            onClick={() => isFav ? removeFavourite(item?.id) : addFavourite(item?.id)}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            {isFav
              ? <GoHeartFill className="w-4 h-4 text-myP" />
              : <GoHeart className="w-4 h-4 text-white/80" />
            }
          </button>
        </div>
      </div>
    </>
  )
}
