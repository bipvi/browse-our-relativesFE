'use client'
import { useState } from 'react'
import { Plus, X, PlusCircle, Pencil } from 'lucide-react'
import MyDrawer from '@/components/admin/MyDrawer'
import ModalMod from '@/components/admin/ModalMod'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

export default function MySpeedDial() {
  const [expanded, setExpanded] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { ruolo } = useUserStore()

  if (ruolo === 'USER') return null

  const actions = [
    {
      label: 'Nuovo elemento',
      icon: <PlusCircle className="h-4 w-4" />,
      onClick: () => { setDrawerOpen(true); setExpanded(false) },
    },
    {
      label: 'Modifica elemento',
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => { setModalOpen(true); setExpanded(false) },
    },
  ]

  return (
    <>
      <MyDrawer open={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />
      <ModalMod open={modalOpen} handleOpen={() => setModalOpen(!modalOpen)} closeModal={() => setModalOpen(false)} />

      <div className="fixed bottom-24 nav:bottom-6 right-5 z-40 flex flex-col items-end gap-2">
        {/* Action buttons */}
        {actions.map((action, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2 transition-all duration-200',
              expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}
            style={{ transitionDelay: expanded ? `${i * 50}ms` : '0ms' }}
          >
            <span className="text-xs font-semibold text-txt/70 bg-bg/90 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
              {action.label}
            </span>
            <button
              onClick={action.onClick}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-txt hover:bg-myP hover:text-myS hover:border-myP transition-all shadow-md flex items-center justify-center"
            >
              {action.icon}
            </button>
          </div>
        ))}

        {/* Main FAB */}
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            'w-13 h-13 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300',
            expanded
              ? 'bg-white/10 border border-white/20 text-txt rotate-45'
              : 'bg-myP border border-myP text-myS hover:bg-myP/80'
          )}
          style={{ width: '52px', height: '52px' }}
        >
          {expanded ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>
    </>
  )
}
