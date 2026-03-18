'use client'
import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { X, Pencil, ChevronRight } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import CommentArea from './CommentArea'
import ModalMod from '@/components/admin/ModalMod'
import { cn } from '@/lib/utils'

const TIPO_COLOR: Record<string, string> = {
  regno:   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  phylum:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  classe:  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  ordine:  'bg-teal-500/20 text-teal-300 border-teal-500/30',
  famiglia:'bg-myP/20 text-myP border-myP/30',
  genere:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  specie:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

interface DetailsProps {
  open: boolean
  handleOpen: () => void
  closeModal: () => void
  item: any
}

function getHierarchy(item: any): any[] {
  if (!item) return []
  switch (item.tipo?.toLowerCase()) {
    case 'specie':   return [item.genere?.famiglia?.ordine?.classe?.phylum?.regno, item.genere?.famiglia?.ordine?.classe?.phylum, item.genere?.famiglia?.ordine?.classe, item.genere?.famiglia?.ordine, item.genere?.famiglia, item.genere]
    case 'genere':   return [item.famiglia?.ordine?.classe?.phylum?.regno, item.famiglia?.ordine?.classe?.phylum, item.famiglia?.ordine?.classe, item.famiglia?.ordine, item.famiglia]
    case 'famiglia': return [item.ordine?.classe?.phylum?.regno, item.ordine?.classe?.phylum, item.ordine?.classe, item.ordine]
    case 'ordine':   return [item.classe?.phylum?.regno, item.classe?.phylum, item.classe]
    case 'classe':   return [item.phylum?.regno, item.phylum]
    case 'phylum':   return [item.regno]
    default:         return []
  }
}

export default function Details({ open, handleOpen, closeModal, item }: DetailsProps) {
  const { ruolo } = useUserStore()
  const [openSubDialog, setOpenSubDialog] = useState(false)
  const [nextItem, setNextItem] = useState<any>(null)
  const [openAdmin, setOpenAdmin] = useState(false)

  const tipo = item?.tipo?.toLowerCase()
  const hierarchy = getHierarchy(item).filter(Boolean)

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
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-[95vw] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden',
              'bg-[#002b2e] border border-white/8 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            {/* ── Hero image ── */}
            <div className="relative h-52 sm:h-64 shrink-0">
              <img
                src={item?.img || ''}
                alt={item?.nome || ''}
                className="w-full h-full object-cover"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#002b2e] via-[#002b2e]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#002b2e]/30 to-transparent" />

              {/* Close button */}
              <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all">
                <X className="h-5 w-5" />
              </Dialog.Close>

              {/* Tipo badge + name overlaid on image */}
              <div className="absolute bottom-4 left-6 right-6">
                {item?.tipo && (
                  <span className={cn(
                    'inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-sm mb-2',
                    TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20'
                  )}>
                    {item.tipo}
                  </span>
                )}
                <Dialog.Title className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                  {item?.nome}
                </Dialog.Title>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex flex-col md:flex-row gap-6">

                {/* Left: hierarchy */}
                {hierarchy.length > 0 && (
                  <div className="md:w-56 shrink-0">
                    <p className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-3">Classificazione</p>
                    <div className="space-y-1">
                      {hierarchy.map((level: any, i: number) => {
                        const lvlTipo = level?.tipo?.toLowerCase()
                        return (
                          <button
                            key={i}
                            onClick={() => { setNextItem(level); setOpenSubDialog(true) }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
                              <img
                                src={level?.img || ''}
                                alt={level?.nome || ''}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-semibold text-txt truncate group-hover:text-myP transition-colors">
                                {level?.nome}
                              </span>
                              <span className={cn(
                                'text-[10px] px-1.5 py-px rounded-full border',
                                TIPO_COLOR[lvlTipo] ?? 'text-txt/40 border-white/10'
                              )}>
                                {level?.tipo}
                              </span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-txt/20 group-hover:text-myP/50 shrink-0 transition-colors" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Right: content */}
                <div className="flex-1 min-w-0 space-y-6">
                  {item?.descrizione && (
                    <section>
                      <h2 className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-4 h-px bg-myP rounded-full" />
                        Descrizione
                      </h2>
                      <p className="text-sm text-txt/75 leading-relaxed">{item.descrizione}</p>
                    </section>
                  )}

                  {item?.storia && (
                    <section>
                      <h2 className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-4 h-px bg-myP rounded-full" />
                        Storia
                      </h2>
                      <p className="text-sm text-txt/75 leading-relaxed">{item.storia}</p>
                    </section>
                  )}

                  <section>
                    <h2 className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-myP rounded-full" />
                      Commenti
                    </h2>
                    <CommentArea itemId={item?.id} commenti={item?.commenti || []} />
                  </section>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            {ruolo !== 'USER' && (
              <div className="shrink-0 px-6 py-4 border-t border-white/5 flex justify-end">
                <Button
                  onClick={() => { setOpenAdmin(true); closeModal() }}
                  className="bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl gap-2 h-9 text-sm"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Modifica
                </Button>
              </div>
            )}
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
