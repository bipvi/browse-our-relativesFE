'use client'
import { Button, Card } from 'flowbite-react'

export function ExCard() {
  return (
    <Card className="bg-myP shadow-xs popup p-3 rounded-xl">
      <div className="relative">
        <img className="min-h-48 mx-auto object-cover rounded-lg shadow-sm"
          src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="card" />
        <h5 className="mb-2 z-40 text-txt relative bottom-10 md:bottom-14 home-text-shadow text-xl font-semibold">UI/UX Review Check</h5>
      </div>
      <p className="font-normal text-xl text-txt">Descrizione Item!! Lorem ipsum dolor sit amet <code>...</code></p>
      <Button size="lg" className="text-bg hover:text-ac hover:border-ac text-xl">Read more</Button>
      <p className="font-normal text-xl text-txt">Storia Item!! Lorem ipsum dolor sit amet <code>...</code></p>
      <Button size="lg" className="text-bg text-xl hover:text-ac pb-3">Read more</Button>
    </Card>
  )
}
