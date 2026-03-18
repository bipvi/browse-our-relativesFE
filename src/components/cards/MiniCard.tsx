'use client'
import { Button } from '@/components/ui/button'
import { HiOutlinePencil } from 'react-icons/hi2'

export default function MiniCard({ classe }: { classe?: string }) {
  return (
    <div className={`${classe} overflow-hidden bg-myP shadow-sm popup rounded-lg`}>
      <div className="relative m-0 rounded-none max-h-fit">
        <img className="object-cover w-full" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="card" />
        <h5 className="z-40 text-txt relative bottom-10 md:bottom-14 home-text-shadow text-xl font-semibold px-4">UI/UX Review Check</h5>
      </div>
      <div className="p-4">
        <p className="font-normal text-txt">Because it&apos;s about motivating the doers. <code>...</code></p>
      </div>
      <div className="flex items-center justify-between p-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2 text-bg">
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Button>
        <HiOutlinePencil className="h-8 w-8 text-bg" />
      </div>
    </div>
  )
}
