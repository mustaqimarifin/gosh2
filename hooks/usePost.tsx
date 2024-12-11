'use client'

import { api } from 'server/trpc/query-client'
import type { Comment } from 'types/index'
import { useMemo } from 'react'

export interface PostProps {
  slug: string
}

export const usePost = (slug: string) => {
  const { data: post } = api.getBySlug.useQuery({ slug })

  const commentsByParentId = useMemo(() => {
    const group: { [key: string]: Comment[] } = {}
    post?.comments?.forEach((c) => {
      group[c.parentId!] ||= []
      //@ts-expect-error sdfdsfadsfasdfasdf
      group[c.parentId!].push(c)
    })

    return group
  }, [post?.comments])

  const getReplies = (parentId: number): Comment[] => {
    return commentsByParentId?.[parentId] || []
  }

  return {
    post,
    rootComments: commentsByParentId['null'] || [],
    getReplies,
  }
}
