import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import MyNavbar from '@/components/navbar/MyNavbar'
import MyFooter from '@/components/footer/MyFooter'
import MySpeedDial from '@/components/buttons/MySpeedDial'
import BottomNavigation from '@/components/navbar/BottomNavigation'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Browse Our Relatives',
  description: 'Scopri tutte le specie del mondo animale',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${geist.className} pb-20 nav:pb-0`}>
        <header>
          <MyNavbar />
        </header>
        <main className="mt-28">
          {children}
        </main>
        <footer>
          <MyFooter />
          <MySpeedDial />
          <BottomNavigation />
        </footer>
      </body>
    </html>
  )
}