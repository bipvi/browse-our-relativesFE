'use client'
import { useState, useEffect } from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { ArrowRight } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function HorizontalCard({ classe = '', it }: { classe?: string; it: any }) {
  const [open, setOpen] = useState(false)
  const { favourites, addFavourite, removeFavourite } = useUserStore()
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (Array.isArray(favourites)) {
      setIsFav(favourites.some(f => f?.id === it?.id))
    }
  }, [it, favourites])

  return (
    <>
      <Details
        open={open}
        handleOpen={() => setOpen(!open)}
        closeModal={() => setOpen(false)}
        item={it}
      />

      <div
        className={cn(
          "flex flex-row rounded-2xl overflow-hidden",
          "bg-white/5 backdrop-blur-md border border-myP/20",
          "shadow-[0_8px_32px_rgba(0,72,76,0.5)]",
          "hover:shadow-[0_8px_40px_rgba(0,175,107,0.15)] hover:border-myP/40",
          "transition-all duration-300 max-h-80",
          classe
        )}
      >
        {/* Image */}
        <div className="w-2/5 shrink-0 relative">
          <img
            src={it?.img || 'https://via.placeholder.com/300x400'}
            alt={it?.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg/30" />
          <button
            onClick={() => isFav ? removeFavourite(it?.id) : addFavourite(it?.id)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            {isFav
              ? <GoHeartFill className="w-5 h-5 text-myP" />
              : <GoHeart className="w-5 h-5 text-white/80" />
            }
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
          <div>
            <Badge variant="outline" className="mb-3">{it?.tipo}</Badge>
            <h4 className="text-2xl font-bold text-txt mb-3 leading-tight">{it?.nome}</h4>
            <p className="text-txt/70 leading-relaxed line-clamp-4 text-sm">{it?.storia}</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            className="self-start mt-4 text-myP hover:text-txt hover:bg-myP/10 gap-2 px-0"
          >
            Dettaglio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
