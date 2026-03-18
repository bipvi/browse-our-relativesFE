'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Flame, Heart } from 'lucide-react'
import AvatarDropdown from './AvatarDropdown'
import SelectDropdown from './SelectDropdown'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Curiosone', href: '/curiosone', icon: <Flame className="h-3.5 w-3.5 text-myP" /> },
  { label: 'Preferiti', href: '/preferiti', icon: <Heart className="h-3.5 w-3.5" /> },
]

export default function NavbarList({
  mobile = false,
  onClose,
}: {
  mobile?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNav = (href: string) => {
    router.push(href)
    onClose?.()
  }

  if (mobile) {
    return (
      <>
        {links.map(link => (
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className={cn(
              'flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left',
              pathname === link.href
                ? 'bg-myP/20 text-myP'
                : 'text-txt/70 hover:text-txt hover:bg-white/5'
            )}
          >
            {link.label}
            {link.icon}
          </button>
        ))}
        <div className="px-4 py-3 border-t border-white/5 mt-1">
          <AvatarDropdown />
        </div>
      </>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {links.map(link => (
        <button
          key={link.href}
          onClick={() => router.push(link.href)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            pathname === link.href
              ? 'bg-myP/15 text-myP'
              : 'text-txt/60 hover:text-txt hover:bg-white/5'
          )}
        >
          {link.label}
          {link.icon}
        </button>
      ))}

      <div className="w-px h-5 bg-white/10 mx-2" />

      <SelectDropdown />

      <div className="ml-1">
        <AvatarDropdown />
      </div>
    </div>
  )
}
