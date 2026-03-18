'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Globe, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import AvatarDropdown from './AvatarDropdown'
import BottomQuery from './BottomQuery'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/curiosone', icon: Globe, label: 'Curiosone' },
]

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 nav:hidden">
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-bg/90 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,72,76,0.6)]">
        {navItems.map(({ href, icon: Icon, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            title={label}
            className={cn(
              'flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all',
              pathname === href
                ? 'bg-myP/20 text-myP'
                : 'text-txt/50 hover:text-txt hover:bg-white/5'
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Search */}
        <div className="flex items-center justify-center w-12 h-12">
          <BottomQuery />
        </div>

        {/* Preferiti */}
        <button
          title="Preferiti"
          onClick={() => router.push('/preferiti')}
          className={cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all',
            pathname === '/preferiti' ? 'bg-myP/20 text-myP' : 'text-txt/50 hover:text-txt hover:bg-white/5'
          )}
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Avatar */}
        <div className="flex items-center justify-center w-12 h-12">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  )
}
