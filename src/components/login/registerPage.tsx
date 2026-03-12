// components/login/RegisterPage.tsx
"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import ButtonMyP from '@/components/buttons/ButtonMyP'
import { Popover, TextInput } from 'flowbite-react'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useUserStore()
  const [me, setMe] = useState({ username: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me.username || !me.password) return
    try {
      await signUp(me.username, me.password)
      router.push('/login')
    } catch {
      alert('Errore durante la registrazione')
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-4 sm:px-10 lg:py-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center mt-16 justify-center flex-wrap">
        <Image src="/favicon.svg" alt="Logo" width={48} height={48} className="inline-block logo-shadow" />
        <h2 className="pl-5 text-center text-2xl/9 font-bold tracking-tight text-txt inline text-shadow">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-6 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6 mx-6 sm:mx-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-md/6 font-medium text-txt">Email address</label>
            <input
              type="email" required
              onChange={(e) => setMe({ ...me, username: e.target.value })}
              value={me.username}
              className="mt-2 block w-full shadow-xxs rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 sm:text-sm/6"
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-txt">Password</label>
            <div className="mt-2 mb-10">
              <Popover trigger="hover" content={
                <div className="space-y-2 p-3 bg-myP border border-myP rounded-md">
                  <h3 className="font-semibold">Must have at least 6 characters</h3>
                </div>
              }>
                <TextInput
                  onChange={(e) => setMe({ ...me, password: e.target.value })}
                  value={me.password}
                  type="password" required
                />
              </Popover>
            </div>
          </div>
          <ButtonMyP onClick={handleSubmit} txt="Register" classe="flex w-full justify-center rounded-md" />
        </form>
      </div>
    </div>
  )
}