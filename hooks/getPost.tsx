import { api } from 'server/trpc/server-http'
import { cache, memo, useMemo } from 'react'
import type { Comment } from 'types/index'

export interface PostProps {
  slug: string
}

export const getPost = async (slug: string) => {
  const post = await api.getBySlug.query({ slug })

  const commentsByParentId = cache(() => {
    const group: { [key: string]: Comment[] } = {}
    post?.comments?.forEach((c) => {
      group[c.parentId!] ||= []
      //@ts-ignore
      group[c.parentId!].push(c)
    })

    return group
  })

  const getReplies = (parentId: number): Comment[] => {
    return commentsByParentId?.[parentId] || []
  }

  const rootComments = commentsByParentId['null'] || []

  return {
    post,
    rootComments,
    getReplies,
  }
}
