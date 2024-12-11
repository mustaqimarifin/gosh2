'use client'

import { GoogleIcon } from 'components/lolicon'
import { signIn } from 'next-auth/react'

export default function SignIN() {
  return (
    <button
      className="mb-4 flex rounded-md border border-gray-800 bg-black px-4 py-3 text-sm font-semibold text-neutral-200 transition-all hover:text-white"
      onClick={() => signIn()}
    >
      <GoogleIcon />
      <div className="ml-3">Sign in with Google</div>
    </button>
  )
}
