'use client'

import { signOut } from 'next-auth/react'

export default function SignOut() {
  return (
    <button
      type="button"
      className="mb-6 mt-2 text-xs text-neutral-700 dark:text-neutral-300"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  )
}
