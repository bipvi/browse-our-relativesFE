'use client'
import { useState } from 'react'
import { Modal, Button, Avatar } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'
import CommentArea from './CommentArea'
import ModalMod from '@/components/admin/ModalMod'

interface DetailsProps {
  open: boolean
  handleOpen: () => void
  closeModal: () => void
  item: any
}

export default function Details({ open, handleOpen, closeModal, item }: DetailsProps) {
  const { ruolo } = useUserStore()
  const [openSubDialog, setOpenSubDialog] = useState(false)
  const [nextItem, setNextItem] = useState<any>(null)
  const [openAdmin, setOpenAdmin] = useState(false)

  const getHierarchy = () => {
    if (!item) return []
    switch (item.tipo?.toLowerCase()) {
      case 'specie': return [item.genere, item.genere?.famiglia, item.genere?.famiglia?.ordine, item.genere?.famiglia?.ordine?.classe, item.genere?.famiglia?.ordine?.classe?.phylum, item.genere?.famiglia?.ordine?.classe?.phylum?.regno]
      case 'genere': return [item.famiglia, item.famiglia?.ordine, item.famiglia?.ordine?.classe, item.famiglia?.ordine?.classe?.phylum, item.famiglia?.ordine?.classe?.phylum?.regno]
      case 'famiglia': return [item.ordine, item.ordine?.classe, item.ordine?.classe?.phylum, item.ordine?.classe?.phylum?.regno]
      case 'ordine': return [item.classe, item.classe?.phylum, item.classe?.phylum?.regno]
      case 'classe': return [item.phylum, item.phylum?.regno]
      case 'phylum': return [item.regno]
      default: return []
    }
  }

  return (
    <>
      {nextItem && (
        <Details open={openSubDialog} handleOpen={() => setOpenSubDialog(!openSubDialog)} closeModal={() => setOpenSubDialog(false)} item={nextItem} />
      )}

      <Modal show={open} onClose={handleOpen} size="7xl" className="bg-custom-gradient">
        <Modal.Header>Browse our relatives</Modal.Header>
        <Modal.Body className="overflow-y-scroll max-h-[80vh]">
          <div className="p-6 flex flex-col-reverse md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img src={item?.img} alt={item?.nome || 'Elemento'} className="w-full md:w-96 h-auto object-cover rounded-lg shadow-md" />
              <div className="mt-4">
                {getHierarchy().filter(Boolean).map((level: any, i: number) => (
                  <div key={i} onClick={() => { setNextItem(level); setOpenSubDialog(true) }}
                    className="flex justify-start items-center gap-3 hover:border p-2 cursor-pointer">
                    <Avatar rounded img={level?.img || ''} alt={level?.nome || ''} />
                    <div>
                      <span className="font-semibold text-txt">{level?.nome || 'Sconosciuto'}</span>
                      <span className="font-normal text-xs text-gray-400"> - {level?.tipo || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-txt mb-4">{item?.nome}</h1>
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-txt pb-1 mb-2">Descrizione</h2>
                <p className="text-txt leading-relaxed">{item?.descrizione}</p>
              </section>
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-txt pb-1 mb-2">Storia</h2>
                <p className="text-txt leading-relaxed">{item?.storia}</p>
              </section>
              <CommentArea itemId={item?.id} commenti={item?.commenti || []} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-8 pt-3 w-full">
            <Button onClick={handleOpen} className="bg-transparent glass shadow-xs">
              Annulla
            </Button>
            {ruolo !== 'USER' && (
              <Button onClick={() => { setOpenAdmin(true); closeModal() }} className="bg-myP shadow-xs">
                Modifica
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      <ModalMod open={openAdmin} handleOpen={() => setOpenAdmin(!openAdmin)} closeModal={() => setOpenAdmin(false)} itemPassed={item} />
    </>
  )
}
