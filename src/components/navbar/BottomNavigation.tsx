'use client'
import { useRouter } from 'next/navigation'
import { GiWorld } from 'react-icons/gi'
import { AiFillFire } from 'react-icons/ai'
import { RiContactsFill } from 'react-icons/ri'
import AvatarDropdown from './AvatarDropdown'
import BottomQuery from './BottomQuery'

export default function BottomNavigation() {
  const router = useRouter()

  return (
    <div className="fixed z-50 nav:hidden w-98% h-16 max-w-lg -translate-x-1/2 bg-myP border border-bg shadow-sm rounded-full bottom-3 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <button onClick={() => router.push('/')} type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <svg className="w-5 h-5 mb-1 text-txt group-hover:text-bg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="sr-only">Home</span>
        </button>

        <button type="button" onClick={() => router.push('/curiosone')}
          className="inline-flex flex-col items-center justify-center relative px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <div className="badge absolute top-2 end-4 bg-transparent border-none">
            <AiFillFire className="w-6 h-6 text-bg" />
          </div>
          <GiWorld className="w-8 h-8" />
          <span className="sr-only">Curiosone</span>
        </button>

        <div className="flex items-center justify-center">
          <BottomQuery />
          <span className="sr-only">Search</span>
        </div>

        <button type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <RiContactsFill className="w-8 h-8" />
          <span className="sr-only">Contatti</span>
        </button>

        <div className="flex items-center justify-center px-2">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  )
}
