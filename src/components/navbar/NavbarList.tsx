'use client'
import { Badge, Navbar } from 'flowbite-react'
import { AiFillFire } from 'react-icons/ai'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarDropdown from './AvatarDropdown'
import SelectDropdown from './SelectDropdown'

export default function NavbarList({ classe }: { classe?: string }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <Navbar.Link className={`${classe} home-text-shadow text-myP border-none hover:text-ac hover:bg-none`} active>
        <p onClick={() => router.push('/')} className="cursor-pointer">Home</p>
      </Navbar.Link>
      <Navbar.Link className="home-text-shadow text-txt border-none hover:text-ac">
        <SelectDropdown />
      </Navbar.Link>
      <Navbar.Link
        className="home-text-shadow text-txt border-none hover:text-ac"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <p onClick={() => router.push('/curiosone')} className="static cursor-pointer">
          Curiosone
          <Badge
            className={`${isHovered ? 'text-ac shadow-gray-700' : 'text-txt'} hidden bg-myP md:inline absolute z-10 firebadge shadow-md`}
            size="xs" color="gray" icon={AiFillFire}
          />
        </p>
      </Navbar.Link>
      <Navbar.Link className="home-text-shadow text-txt border-none hover:text-ac">
        Contact
      </Navbar.Link>
      <Navbar.Link className="logo-shadow border-none">
        <AvatarDropdown />
      </Navbar.Link>
    </>
  )
}
