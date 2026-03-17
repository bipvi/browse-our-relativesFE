'use client'
import { Drawer } from 'flowbite-react'
import FormNew from './FormNew'

export default function MyDrawer({ open, closeDrawer }: { open: boolean; closeDrawer: () => void }) {
  return (
    <Drawer open={open} onClose={closeDrawer} position="right"
      className="p-4 pb-24 nav:pb-8 z-50 bg-custom-gradient overflow-y-scroll shadow-xs w-[480px] max-w-full">
      <Drawer.Header title="Browse our relatives" />
      <FormNew closeDrawer={closeDrawer} />
    </Drawer>
  )
}
