'use client'
import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import FormNew from './FormNew'

export default function MyDrawer({ open, closeDrawer }: { open: boolean; closeDrawer: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) closeDrawer() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-[480px] max-w-full z-50 flex flex-col bg-[#011f22] border-l border-white/8 shadow-[−32px_0_80px_rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <div>
              <Dialog.Title className="text-base font-bold text-txt">Nuovo elemento</Dialog.Title>
              <p className="text-xs text-txt/40 mt-0.5">Aggiungi un nuovo elemento alla tassonomia</p>
            </div>
            <Dialog.Close className="p-2 rounded-xl bg-white/5 text-txt/40 hover:text-txt hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto flex-1 pb-8 scroll-styled">
            <FormNew closeDrawer={closeDrawer} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
