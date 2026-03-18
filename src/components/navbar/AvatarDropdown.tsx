'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ImageIcon, KeyRound, ChevronDown } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import ChangeImg from '@/components/admin/ChangeImg'

export default function AvatarDropdown() {
  const router = useRouter()
  const { username, avatar, logout } = useUserStore()
  const [open, setOpen] = useState(false)
  const [openImg, setOpenImg] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const exit = () => {
    setOpen(false)
    logout()
    router.push('/login')
  }

  return (
    <>
      <ChangeImg open={openImg} close={() => setOpenImg(false)} handler={() => setOpenImg(v => !v)} />

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <img
            src={avatar || 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png'}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-myP/40 group-hover:ring-myP/70 transition-all"
          />
          <ChevronDown className={`h-3.5 w-3.5 text-txt/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-bg/95 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,72,76,0.5)] overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-xs text-txt/40 font-medium">Connesso come</p>
              <p className="text-sm font-semibold text-txt truncate">{username}</p>
            </div>

            {/* Items */}
            <div className="py-1.5">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-txt/70 hover:text-txt hover:bg-white/5 transition-colors">
                <KeyRound className="h-4 w-4" />
                Cambia password
              </button>
              <button
                onClick={() => { setOpenImg(true); setOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-txt/70 hover:text-txt hover:bg-white/5 transition-colors"
              >
                <ImageIcon className="h-4 w-4" />
                Cambia avatar
              </button>
            </div>

            <div className="border-t border-white/5 py-1.5">
              <button
                onClick={exit}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
