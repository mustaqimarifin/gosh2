'use client'
//import { getPost } from 'hooks/getPost'
import { ActionForm } from './ActionForm'
import { usePost } from 'hooks/usePost'
import { CommentList } from './List'

const CommentComponent2 = ({ slug }: { slug: string }) => {
  const { rootComments } = usePost(slug)

  return (
    <>
      <h2 className="p-4 text-center text-xl font-bold text-gray-800 dark:text-gray-50">
        Comments
      </h2>
      <ActionForm />
      <CommentList comments={rootComments} />
    </>
  )
}

export default CommentComponent2
