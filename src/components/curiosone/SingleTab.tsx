'use client'
import { Breadcrumb } from 'flowbite-react'
import { HiHome } from 'react-icons/hi'

const CHAIN = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

export default function SingleTab({ tipo }: { tipo: string }) {
  const levels = CHAIN.slice(0, CHAIN.indexOf(tipo) + 1)
  return (
    <div className="hidden sm:block">
      <Breadcrumb>
        {levels.map((l, i) => (
          <Breadcrumb.Item key={l} icon={i === 0 ? HiHome : undefined}>
            {l}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  )
}
