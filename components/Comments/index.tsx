'use client'

//import "app/base.css"
//import './Comment.modules.css'

//import Form from "app/hotline/form"
import { api } from 'server/trpc/query-client'
import { usePost } from 'hooks/usePost'
import { memo, useState } from 'react'
import type { Comment } from 'types'

import { CommentForm } from './Form'
import { CommentList } from './List'
//import { CommentSolo } from "./Single"

const CommentComponent = ({ slug }: { slug: string }) => {
  const [error, setError] = useState('')
  const { rootComments } = usePost(slug)

  const utils = api.useUtils()
  const createComment = api.addComment.useMutation({
    async onSuccess(input) {
      await utils.getBySlug.invalidate({ slug: input.slug as string })
    },
  })

  const handleCommentCreate = async (text: string) => {
    if (text.trim().length === 0) {
      setError('You need to specify a text!')
      return
    }

    if (text.trim().length < 4) {
      setError('text is too short!')
      return
    }

    return await createComment.mutateAsync({ text, slug }).then(() => {
      setError('')
    })
  }

  return (
    <>
      {/* <div className="justify-start text-xs">{ccCount.data}</div> */}
      <h2 className="p-4 text-center text-xl font-bold text-gray-800 dark:text-gray-50">
        Comments
      </h2>
      <CommentForm onSubmit={handleCommentCreate} />
      <CommentList comments={rootComments} />
    </>
  )
}

export default CommentComponent
