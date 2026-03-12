'use client'
import { Tabs } from 'flowbite-react'
import SingleTab from './SingleTab'

export default function CuriosoneTabs() {
  const tipi = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']
  return (
    <Tabs aria-label="Tabs with icons" variant="underline" className="w-screen">
      {tipi.map(tipo => (
        <Tabs.Item key={tipo} title={tipo}>
          <SingleTab tipo={tipo} />
        </Tabs.Item>
      ))}
    </Tabs>
  )
}
