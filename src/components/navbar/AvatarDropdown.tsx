'use client'
import { Dropdown, Avatar } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import ChangeImg from '@/components/admin/ChangeImg'

export default function AvatarDropdown() {
  const router = useRouter()
  const { username, avatar, logout } = useUserStore()
  const [openImg, setOpenImg] = useState(false)

  const exit = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      <ChangeImg open={openImg} close={() => setOpenImg(false)} handler={() => setOpenImg(!openImg)} />
      <Dropdown
        className="bg-bg rounded-lg border border-txt"
        arrowIcon={false}
        inline
        label={
          avatar ? (
            <img className="object-contain w-10 h-10 ring-2 ring-txt rounded-full" alt="profile" src={avatar} />
          ) : (
            <img src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png" alt="profile" className="object-contain w-10 h-10 ring-2 ring-txt rounded-full" />
          )
        }
      >
        <Dropdown.Header className="text-txt hover:bg-myP hover:text-bg rounded-none">
          <span className="block text-sm">{username}</span>
        </Dropdown.Header>
        <Dropdown.Item className="text-txt text-nowrap hover:bg-myP hover:text-ac rounded-none">
          Cambia password
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setOpenImg(true)} className="text-txt hover:bg-myP hover:text-ac rounded-none">
          Cambia avatar
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={exit} className="text-txt hover:bg-myP hover:text-ac rounded-none">
          Sign out
        </Dropdown.Item>
      </Dropdown>
    </>
  )
}
