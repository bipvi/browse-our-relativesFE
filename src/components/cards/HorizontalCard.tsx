'use client'
import { useState, useEffect } from 'react'
import { Button } from 'flowbite-react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'

export function HorizontalCard({ classe = 'max-w-full', it }: { classe?: string; it: any }) {
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
      <Details open={open} handleOpen={() => setOpen(!open)} closeModal={() => setOpen(false)} item={it} />
      <div className={`${classe} max-h-[21rem] flex flex-row bg-myP shadow-xs hover:shadow-sm rounded-lg overflow-hidden`}>
        <div className="w-2/5 shrink-0 relative">
          <img src={it?.img || 'https://via.placeholder.com/300x200'} alt="card" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 cursor-pointer" onClick={() => isFav ? removeFavourite(it.id) : addFavourite(it.id)}>
            {isFav ? <GoHeartFill className="w-8 h-10 fill-bg" /> : <GoHeart className="w-8 h-10 text-bg" />}
          </div>
        </div>
        <div className="p-6">
          <h4 className="mb-2 text-2xl font-bold text-txt">{it?.nome}</h4>
          <p className="mb-8 font-normal text-txt line-clamp-6">{it?.storia} ...</p>
          <Button variant="text" className="flex text-bg items-center gap-2 hover:border-none hover:shadow-md" onClick={() => setOpen(true)}>
            Dettaglio
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  )
}
