'use client'
import { useState, useEffect } from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import Details from '@/components/detail/Details'
import ButtonMyS from '@/components/buttons/ButtonMyS'
import ButtonOutlineMyS from '@/components/buttons/ButtonOutlineMyS'

export default function HomeCards({ item, change, num }: { item: any; change: (num: string) => void; num: string }) {
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
      <Details item={item} handleOpen={() => setOpen(!open)} closeModal={() => setOpen(false)} open={open} />
      <div className="w-full bg-myP popup shadow-sm border-none rounded-lg">
        <div className="flex justify-end px-4 pt-4">
          <div className="cursor-pointer" onClick={() => isFav ? removeFavourite(item?.id) : addFavourite(item?.id)}>
            {isFav ? <GoHeartFill className="w-8 h-10 fill-bg" /> : <GoHeart className="w-8 h-10 text-bg" />}
          </div>
        </div>
        <div className="flex flex-col items-center pb-10">
          <img alt="item" src={item?.img || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
            className="mb-3 rounded-full shadow-md shadow-gray-800 object-cover h-32 w-32" />
          <h5 className="mb-1 text-xl font-medium text-myS">{item?.nome}</h5>
          <span className="text-sm text-gray-600">{item?.tipo}</span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <ButtonMyS txt="Dettaglio" onclick={() => setOpen(true)} />
            <ButtonOutlineMyS txt="Vedine un altro" onclick={change} num={num} />
          </div>
        </div>
      </div>
    </>
  )
}
