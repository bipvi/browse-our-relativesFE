'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import NavbarList from './NavbarList'

export default function MyNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-bg/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_24px_rgba(0,72,76,0.4)]">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0 group">
          <Image
            src="/logo.svg"
            width={36} height={36}
            alt="Logo"
            className="logo-shadow transition-transform group-hover:scale-110 hover:rotate-6"
          />
          <span className="text-lg font-bold text-txt tracking-tight group-hover:text-myP transition-colors hidden xs:block">
            Browse our relatives
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden nav:flex items-center gap-1">
          <NavbarList />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="nav:hidden p-2 rounded-xl text-txt/70 hover:text-txt hover:bg-white/5 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav:hidden bg-bg/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex flex-col gap-1">
          <NavbarList mobile onClose={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  )
}
