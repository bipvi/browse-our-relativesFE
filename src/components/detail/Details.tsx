'use client'
import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { X, Pencil, ChevronRight, MessageCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import CommentArea from './CommentArea'
import ModalMod from '@/components/admin/ModalMod'
import { cn } from '@/lib/utils'

const TIPO_COLOR: Record<string, string> = {
  regno:   'bg-purple-500/25 text-purple-200 border-purple-400/40',
  phylum:  'bg-blue-500/25 text-blue-200 border-blue-400/40',
  classe:  'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
  ordine:  'bg-teal-500/25 text-teal-200 border-teal-400/40',
  famiglia:'bg-myP/25 text-myP border-myP/40',
  genere:  'bg-yellow-500/25 text-yellow-200 border-yellow-400/40',
  specie:  'bg-orange-500/25 text-orange-200 border-orange-400/40',
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
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-[96vw] max-w-5xl h-[88vh] flex overflow-hidden',
              'rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.7)] border border-white/8',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            {/* ── LEFT: full-height image ── */}
            <div className="relative w-[42%] shrink-0 hidden md:block">
              <img
                src={item?.img || ''}
                alt={item?.nome || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

              {/* tipo + name + hierarchy overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {item?.tipo && (
                  <span className={cn(
                    'inline-block text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm mb-3',
                    TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20'
                  )}>
                    {item.tipo}
                  </span>
                )}
                <Dialog.Title className="text-3xl font-bold text-white leading-tight mb-4">
                  {item?.nome}
                </Dialog.Title>

                {hierarchy.length > 0 && (
                  <div className="space-y-1.5">
                    {hierarchy.map((level: any, i: number) => {
                      const lvlTipo = level?.tipo?.toLowerCase()
                      return (
                        <button
                          key={i}
                          onClick={() => { setNextItem(level); setOpenSubDialog(true) }}
                          className="w-full flex items-center gap-2.5 group text-left"
                        >
                          <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 ring-1 ring-white/20">
                            <img src={level?.img || ''} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate flex-1">
                            {level?.nome}
                          </span>
                          <span className={cn(
                            'text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0',
                            TIPO_COLOR[lvlTipo] ?? 'text-white/40 border-white/10'
                          )}>
                            {level?.tipo}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: content panel ── */}
            <div className="flex-1 flex flex-col bg-[#011f22] min-w-0">

              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/5">
                {/* Mobile only: tipo + name */}
                <div className="md:hidden min-w-0">
                  {item?.tipo && (
                    <span className={cn(
                      'inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border mb-1',
                      TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20'
                    )}>
                      {item.tipo}
                    </span>
                  )}
                  <Dialog.Title className="text-xl font-bold text-white truncate">{item?.nome}</Dialog.Title>
                </div>
                {/* Desktop: spacer */}
                <div className="hidden md:block" />

                <div className="flex items-center gap-2 ml-auto shrink-0">
                  {ruolo !== 'USER' && (
                    <button
                      onClick={() => { setOpenAdmin(true); closeModal() }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-myP text-myS text-xs font-bold hover:bg-myP/80 transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Modifica
                    </button>
                  )}
                  <Dialog.Close className="p-2 rounded-xl bg-white/5 text-txt/50 hover:text-txt hover:bg-white/10 transition-all">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                {/* Mobile: image */}
                <div className="md:hidden relative h-48 rounded-2xl overflow-hidden">
                  <img src={item?.img || ''} alt={item?.nome || ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Mobile: hierarchy pills */}
                {hierarchy.length > 0 && (
                  <div className="md:hidden flex flex-wrap gap-1.5">
                    {hierarchy.map((level: any, i: number) => {
                      const lvlTipo = level?.tipo?.toLowerCase()
                      return (
                        <button
                          key={i}
                          onClick={() => { setNextItem(level); setOpenSubDialog(true) }}
                          className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-full border transition-opacity hover:opacity-80',
                            TIPO_COLOR[lvlTipo] ?? 'text-txt/50 border-white/10'
                          )}
                        >
                          {level?.nome}
                        </button>
                      )
                    })}
                  </div>
                )}

                {item?.descrizione && (
                  <section>
                    <h3 className="text-[10px] font-bold text-txt/30 uppercase tracking-widest mb-2">Descrizione</h3>
                    <p className="text-sm text-txt/80 leading-relaxed">{item.descrizione}</p>
                  </section>
                )}

                {item?.storia && (
                  <>
                    <div className="h-px bg-white/5" />
                    <section>
                      <h3 className="text-[10px] font-bold text-txt/30 uppercase tracking-widest mb-2">Storia</h3>
                      <p className="text-sm text-txt/80 leading-relaxed">{item.storia}</p>
                    </section>
                  </>
                )}

                <div className="h-px bg-white/5" />

                <section>
                  <h3 className="text-[10px] font-bold text-txt/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <MessageCircle className="h-3 w-3" />
                    Commenti
                  </h3>
                  <CommentArea itemId={item?.id} commenti={item?.commenti || []} />
                </section>
              </div>
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
