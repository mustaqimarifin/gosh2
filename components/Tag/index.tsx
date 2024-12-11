import { XCircleIcon } from 'lucide-react'
import { Level } from '@prisma/client'
import * as React from 'react'

export function Tags({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap space-x-2">
      {tags.map((tag) => (
        <Tag key={tag.name} name={tag.name} />
      ))}
    </div>
  )
}

export function Tag({ name }: { name: Level }) {
  const baseClasses =
    'flex-none justify-center flex items-center space-x-2 cursor-pointer self-start border uppercase rounded-md hover:bg-opacity-10 dark:hover:bg-opacity-30 px-3 py-0.5 text-xxs font-semibold tracking-wide border-opacity-50 dark:border-opacity-10'

  let specificClasses = ''
  if (name) {
    switch (name?.toLowerCase()) {
      case 'noob': {
        specificClasses =
          'border-purple-200 text-purple-600 dark:text-purple-300 bg-purple-500 bg-opacity-5 dark:bg-opacity-10'
        break
      }
      case 'mannequin': {
        specificClasses =
          'border-green-200 text-green-600 dark:text-green-200  bg-green-500 bg-opacity-5 dark:bg-opacity-10'
        break
      }
      case 'ai': {
        specificClasses =
          'border-blue-200 text-blue-600 dark:text-blue-200 bg-blue-500 bg-opacity-5 dark:bg-opacity-10'
        break
      }
      case 'lord': {
        specificClasses =
          'border-red-200 text-red-600 dark:text-red-200 bg-red-500 bg-opacity-5 dark:bg-opacity-10'
        break
      }

      case 'admin': {
        specificClasses =
          'border-gray-200 text-gray-600 dark:text-gray-300 bg-gray-200 bg-opacity-30 dark:bg-opacity-10 hover:bg-opacity-40'
        break
      }

      case 'none': {
        specificClasses =
          'border-gray-200 text-gray-600 dark:text-gray-300 bg-gray-200 bg-opacity-30 dark:bg-opacity-10 hover:bg-opacity-40'
        break
      }
    }
  }
  return (
    <span className={`${baseClasses} ${specificClasses}`}>
      {name === null ? (
        <>
          <XCircleIcon />
          <span>Clear tag</span>
        </>
      ) : (
        name
      )}
    </span>
  )
}
