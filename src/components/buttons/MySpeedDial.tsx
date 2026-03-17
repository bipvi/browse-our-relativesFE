'use client'
import { useState } from 'react'
import { FiUserPlus, FiUserX } from 'react-icons/fi'
import { BsDatabaseFillAdd } from 'react-icons/bs'
import MyDrawer from '@/components/admin/MyDrawer'
import ModalMod from '@/components/admin/ModalMod'
import Icon from './Icon'
import { useUserStore } from '@/store/userStore'

export default function MySpeedDial() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { ruolo } = useUserStore()

  return (
    <>
      <MyDrawer open={open} closeDrawer={() => setOpen(false)} />
      <ModalMod open={modalOpen} handleOpen={() => setModalOpen(!modalOpen)} closeModal={() => setModalOpen(false)} />

      <div className="fixed bottom-24 nav:bottom-5 z-40 logo-shadow right-6">
        <div className="relative group flex flex-col items-center gap-2">
          {/* Actions — visible on hover */}
          <div className="flex flex-col-reverse items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setOpen(true)}
              className="bg-bg border border-txt rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              title="Aggiungi elemento"
            >
              <BsDatabaseFillAdd className="h-5 w-5 nav:h-6 nav:w-6 text-txt" />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-bg border border-txt rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              title="Modifica elemento"
            >
              <Icon toggleModal={() => setModalOpen(true)} />
            </button>
          </div>

          {/* Main button */}
          {ruolo !== 'USER' && (
            <button className="nav:size-16 size-12 rounded-full bg-bg border border-txt flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <FiUserX className="h-5 w-5 nav:h-8 nav:w-8 hidden group-hover:block" />
              <FiUserPlus className="block h-5 w-5 nav:h-8 nav:w-8 group-hover:hidden" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
