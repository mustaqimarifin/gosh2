'use client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { Comment } from 'types'

//import { CommentSolo } from "./Single";
import { CommentSolo2 } from './Single3'

interface CommentListProps {
  comments: Comment[]
}

export const CommentList = ({ comments }: CommentListProps) => {
  const [parent] = useAutoAnimate<HTMLDivElement>()

  return (
    <div ref={parent}>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <CommentSolo2 comment={comment} />
        </div>
      ))}
    </div>
  )
}
