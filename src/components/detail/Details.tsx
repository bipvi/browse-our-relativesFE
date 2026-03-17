'use client'
import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { X, Pencil } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CommentArea from './CommentArea'
import ModalMod from '@/components/admin/ModalMod'
import { cn } from '@/lib/utils'

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
      case 'specie':   return [item.genere, item.genere?.famiglia, item.genere?.famiglia?.ordine, item.genere?.famiglia?.ordine?.classe, item.genere?.famiglia?.ordine?.classe?.phylum, item.genere?.famiglia?.ordine?.classe?.phylum?.regno]
      case 'genere':   return [item.famiglia, item.famiglia?.ordine, item.famiglia?.ordine?.classe, item.famiglia?.ordine?.classe?.phylum, item.famiglia?.ordine?.classe?.phylum?.regno]
      case 'famiglia': return [item.ordine, item.ordine?.classe, item.ordine?.classe?.phylum, item.ordine?.classe?.phylum?.regno]
      case 'ordine':   return [item.classe, item.classe?.phylum, item.classe?.phylum?.regno]
      case 'classe':   return [item.phylum, item.phylum?.regno]
      case 'phylum':   return [item.regno]
      default:         return []
    }
  }

  return (
    <>
      {nextItem && (
        <Details
          open={openSubDialog}
          handleOpen={() => setOpenSubDialog(!openSubDialog)}
          closeModal={() => setOpenSubDialog(false)}
          item={nextItem}
        />
      )}

      <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleOpen() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "max-h-[92vh] w-[95vw] max-w-5xl flex flex-col",
              "bg-bg border border-myP/20 rounded-2xl shadow-2xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
              "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-myP/10 flex-shrink-0">
              <Dialog.Title className="text-lg font-semibold text-txt">Browse our relatives</Dialog.Title>
              <Dialog.Close className="p-2 rounded-lg text-txt/50 hover:text-txt hover:bg-myP/10 transition-colors">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex flex-col-reverse md:flex-row gap-6">
                {/* Left: image + hierarchy */}
                <div className="flex-shrink-0 w-full md:w-72">
                  <img
                    src={item?.img}
                    alt={item?.nome || 'Elemento'}
                    className="w-full rounded-xl object-cover shadow-lg"
                  />
                  {getHierarchy().filter(Boolean).length > 0 && (
                    <div className="mt-4 space-y-1">
                      {getHierarchy().filter(Boolean).map((level: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => { setNextItem(level); setOpenSubDialog(true) }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-myP/10 transition-colors text-left group"
                        >
                          <img
                            src={level?.img || ''}
                            alt={level?.nome || ''}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-myP/30 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-txt truncate group-hover:text-myP transition-colors">
                              {level?.nome || 'Sconosciuto'}
                            </span>
                            <span className="text-xs text-txt/50">{level?.tipo || 'N/A'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-6">
                    <div>
                      <Badge variant="outline" className="mb-2">{item?.tipo}</Badge>
                      <h1 className="text-3xl font-bold text-txt">{item?.nome}</h1>
                    </div>
                  </div>

                  <section className="mb-6">
                    <h2 className="text-base font-semibold text-myP mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-myP rounded-full inline-block" />
                      Descrizione
                    </h2>
                    <p className="text-txt/80 leading-relaxed text-sm">{item?.descrizione}</p>
                  </section>

                  <section className="mb-6">
                    <h2 className="text-base font-semibold text-myP mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-myP rounded-full inline-block" />
                      Storia
                    </h2>
                    <p className="text-txt/80 leading-relaxed text-sm">{item?.storia}</p>
                  </section>

                  <CommentArea itemId={item?.id} commenti={item?.commenti || []} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-myP/10 flex-shrink-0">
              <Button
                onClick={handleOpen}
                variant="outline"
                className="border-myP/30 text-txt hover:bg-myP/10 rounded-xl"
              >
                Annulla
              </Button>
              {ruolo !== 'USER' && (
                <Button
                  onClick={() => { setOpenAdmin(true); closeModal() }}
                  className="bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Modifica
                </Button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ModalMod
        open={openAdmin}
        handleOpen={() => setOpenAdmin(!openAdmin)}
        closeModal={() => setOpenAdmin(false)}
        itemPassed={item}
      />
    </>
  )
}
