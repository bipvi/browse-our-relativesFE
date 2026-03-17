import type { Metadata } from 'next'
import './globals.css'
import MyNavbar from '@/components/navbar/MyNavbar'
import MyFooter from '@/components/footer/MyFooter'
import MySpeedDial from '@/components/buttons/MySpeedDial'
import BottomNavigation from '@/components/navbar/BottomNavigation'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html
      lang="it"
      className={cn("font-sans", geist.variable)}
      style={{ backgroundColor: '#00484c' }}
    >
      <body
        className="pb-20 nav:pb-0"
        style={{
          backgroundColor: '#00484c',
          backgroundImage: [
            'radial-gradient(ellipse 90% 55% at 10% 0%, rgba(0,175,107,0.28) 0%, transparent 58%)',
            'radial-gradient(ellipse 75% 65% at 88% 100%, rgba(22,134,156,0.22) 0%, transparent 55%)',
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,72,76,0.5) 0%, transparent 80%)',
          ].join(','),
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      >
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