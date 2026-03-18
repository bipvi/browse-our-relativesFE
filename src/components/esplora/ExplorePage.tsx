'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Alert } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'
import MyCarousel from './MyCarousel'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function ExplorePage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useUserStore()
  const [item, setItem] = useState<any>({})
  const [isError, setIsError] = useState('')
  const [activeRegno, setActiveRegno] = useState<any>({})
  const [activePhylum, setActivePhylum] = useState<any>({})
  const [activeClasse, setActiveClasse] = useState<any>({})
  const [activeOrdine, setActiveOrdine] = useState<any>({})
  const [activeFamiglia, setActiveFamiglia] = useState<any>({})
  const [activeGenere, setActiveGenere] = useState<any>({})
  const [activeSpecie, setActiveSpecie] = useState<any>({})

  useEffect(() => {
    if (!token) { router.push('/') }
  }, [token])

  useEffect(() => {
    if (!item?.tipo) return
    switch (item.tipo) {
      case 'Phylum': setActiveRegno(item.regno); setActivePhylum(item); break
      case 'Classe': setActiveRegno(item.phylum?.regno); setActivePhylum(item.phylum); setActiveClasse(item); break
      case 'Ordine': setActiveRegno(item.classe?.phylum?.regno); setActivePhylum(item.classe?.phylum); setActiveClasse(item.classe); setActiveOrdine(item); break
      case 'Famiglia': setActiveRegno(item.ordine?.classe?.phylum?.regno); setActivePhylum(item.ordine?.classe?.phylum); setActiveClasse(item.ordine?.classe); setActiveOrdine(item.ordine); setActiveFamiglia(item); break
      case 'Genere': setActiveRegno(item.famiglia?.ordine?.classe?.phylum?.regno); setActivePhylum(item.famiglia?.ordine?.classe?.phylum); setActiveClasse(item.famiglia?.ordine?.classe); setActiveOrdine(item.famiglia?.ordine); setActiveFamiglia(item.famiglia); setActiveGenere(item); break
      case 'Specie': setActiveRegno(item.genere?.famiglia?.ordine?.classe?.phylum?.regno); setActivePhylum(item.genere?.famiglia?.ordine?.classe?.phylum); setActiveClasse(item.genere?.famiglia?.ordine?.classe); setActiveOrdine(item.genere?.famiglia?.ordine); setActiveFamiglia(item.genere?.famiglia); setActiveGenere(item.genere); setActiveSpecie(item); break
    }
  }, [item])

  useEffect(() => {
    if (!params?.itemId) return
    fetch(`${API}/item/${params.itemId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(data => fetch(`${API}/${data.tipo.toLowerCase()}/${data.id}`, { headers: { Authorization: `Bearer ${token}` } }))
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d => { setIsError(''); setItem(d) })
      .catch(e => setIsError(e.message))
  }, [params])

  const levels = [
    { label: 'Phylum', active: activePhylum, setActive: setActivePhylum, prev: activeRegno },
    { label: 'Classe', active: activeClasse, setActive: setActiveClasse, prev: activePhylum },
    { label: 'Ordine', active: activeOrdine, setActive: setActiveOrdine, prev: activeClasse },
    { label: 'Famiglia', active: activeFamiglia, setActive: setActiveFamiglia, prev: activeOrdine },
    { label: 'Genere', active: activeGenere, setActive: setActiveGenere, prev: activeFamiglia },
    { label: 'Specie', active: activeSpecie, setActive: setActiveSpecie, prev: activeGenere },
  ]

  return (
    <>
      {isError && <Alert color="failure">{isError}</Alert>}
      {levels.map(({ label, active, setActive, prev }) => (
        <div key={label} className="container w-screen mt-5">
          <p className="text-3xl text-start px-6 font-semibold">{label}</p>
          <MyCarousel active={active} setActive={setActive} prevItem={prev} key={active?.id} />
        </div>
      ))}
    </>
  )
}
