// components/login/LoginPage.tsx
"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import ButtonMyP from '@/components/buttons/ButtonMyP'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUserStore()
  const [me, setMe] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me.username || !me.password) return
    try {
      await login(me.username, me.password)
      router.push('/')
    } catch {
      setError('Credenziali non valide')
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-4 sm:px-10 lg:py-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center mt-16 justify-center flex-wrap">
        <Image src="/favicon.svg" alt="Logo" width={48} height={48} className="inline-block logo-shadow" />
        <h2 className="pl-5 text-center text-2xl/9 font-bold tracking-tight text-txt inline text-shadow">
          Login in to your account
        </h2>
      </div>

      <div className="mt-6 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form className="space-y-6 mx-6 sm:mx-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-md/6 font-medium text-txt">Username</label>
            <input
              onChange={(e) => setMe({ ...me, username: e.target.value })}
              value={me.username}
              id="email" type="email" required autoComplete="email"
              className="mt-2 block w-full shadow-xxs rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-myP sm:text-sm/6"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-txt">Password</label>
              <a href="#" className="text-sm font-semibold text-myP hover:text-ac">Forgot password?</a>
            </div>
            <input
              id="password" type="password" required autoComplete="current-password"
              onChange={(e) => setMe({ ...me, password: e.target.value })}
              value={me.password}
              className="mt-2 mb-10 block w-full rounded-md shadow-xxs border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-myP sm:text-sm/6"
            />
          </div>
          <ButtonMyP txt="Login" classe="flex w-full justify-center rounded-md" onClick={handleSubmit} />
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-300">
          Not a member?{' '}
          <span onClick={() => router.push('/register')} className="cursor-pointer font-semibold text-myP hover:text-ac">
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}