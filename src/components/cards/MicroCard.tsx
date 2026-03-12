'use client'
import { useState, useEffect } from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'

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
      <Details open={open} handleOpen={() => setOpen(!open)} closeModal={() => setOpen(false)} item={item} />
      <div className={`${classe} bg-myP rounded-lg shadow-lg popup`}>
        <div className="px-4 py-2 h-20">
          <h1 className="text-xl font-bold text-txt">{item?.nome || ''}</h1>
          <p className="mt-1 text-sm text-txt">{item?.descrizione?.slice(0, 58) || ''}...</p>
          <button className="btn relative -bottom-12 z-[48] btn-success text-txt border shadow-xs hover:shadow-sm hover:bg-bg hover:text-txt" onClick={() => setOpen(true)}>
            Dettagli
          </button>
        </div>
        <div className="relative">
          <img className="object-cover overflow-hidden w-full h-60 rounded-t-none rounded-b-lg" src={item?.img || ''} alt="animal" />
          <div className="absolute top-2 right-2 cursor-pointer" onClick={() => isFav ? removeFavourite(item?.id) : addFavourite(item?.id)}>
            {isFav ? <GoHeartFill className="w-8 h-10 fill-myP" /> : <GoHeart className="w-8 h-10 text-myP" />}
          </div>
        </div>
      </div>
    </>
  )
}
