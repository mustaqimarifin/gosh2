'use client'
import { saveComment } from 'app/actions'
import { useFormStatus } from 'react-dom'
import { useRef } from 'react'

export function ActionForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      className="relative max-w-[500px]"
      ref={formRef}
      action={async (formData) => {
        await saveComment(formData)
        formRef.current?.reset()
      }}
    >
      <input
        aria-label="Your message"
        placeholder="Your message..."
        name="text"
        type="text"
        required
        className="pl-4 pr-32 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-neutral-300 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
      />
      <SubmitButton />
    </form>
  )
}

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="flex items-center justify-center absolute right-1 top-1 px-2 py-1 font-medium h-8 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded w-16"
      disabled={pending}
      type="submit"
    >
      Sign
    </button>
  )
}
