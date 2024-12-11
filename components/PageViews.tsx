'use client'

import { Suspense, useEffect } from 'react'
import fetcher from 'lib/fetcher'
import useSWR from 'swr'

import { LoadingSpinner } from './spinner'

export type CounterProps = {
  slug?: string
  total?: number
  trackView: boolean
}

export const PageViews = ({ slug, trackView }: CounterProps) => {
  const { data, isLoading } = useSWR<CounterProps>(
    `/api/posts/${slug}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/posts/${slug}`, {
        method: 'POST',
      })
    if (trackView) {
      registerView()
    }
  }, [])

  if (!data) return null
  if (isLoading) return <LoadingSpinner />
  else return <p className="text-xs">{`${data?.total} views`}</p>
}

export const TotalViews = () => {
  const { data, isLoading } = useSWR<CounterProps>(`/api/posts`, fetcher)
  if (!data) return null
  if (isLoading) return <LoadingSpinner />
  else return <p className="text-xs">{`${data?.total} views`}</p>
}
