import { CompleteComment } from 'prisma/ZOD'
import { User } from '@prisma/client'

import type { JSX } from 'react'

//^SPOTIFY^//
export type Song = {
  songUrl: string
  artist: string
  title: string
}

export type PLAY = {
  isPlaying: boolean
  album: string
  albumImageUrl: string
  artist: string
  songUrl: string
  title: string
}

export type TopTracks = {
  tracks: Song[]
}

//^UI^//
export type CounterProps = {
  slug?: string
  total?: string
  trackView: boolean
}

export type Exercise = {
  blockId: string
  prompt: React.ReactNode
  exerciseCode: string
  solutionCode: React.ReactNode
}

export type Bling = {
  id: number
  avatar: string
  username: string
  fullname: string
  posted_at: string
  body: string
}

export type SiteConfig = {
  name: string
  siteName: string
  summary: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type ContentType = 'blog' | 'Project' | 'Scribble'

export type PostMeta = {
  wordCount: number
  slug: string
  title: string
  code: string
  summary: string
  banner: string
  date: string
  lastUpdated?: string
  tweetIds?: string[]
  tags?: string
  repost?: string
}

export type PickMeta<T extends ContentType> = T extends 'blog'
  ? PostMeta
  : T extends 'Scribble'
    ? ScribbleMeta
    : ProjectMeta

export type ScribbleMeta = {
  id: string
  pic: string
  tags: string
}

export type ScribbleType = {
  code: string
  Meta: ScribbleMeta
}

export type ProjectMeta = {
  slug: string
  title: string
  date: string
  lastUpdated?: string
  summary: string
  category?: string
  techs: string
  banner: string
  link?: string
  github?: string
  youtube?: string
}

export type ProjectType = {
  code: string
  Meta: ProjectMeta
}

export type MetaWithTags = PostMeta | ScribbleMeta
export type MetaWithDate = PostMeta | ProjectMeta
export type Meta = ProjectMeta | PostMeta | ScribbleMeta

export type HeroIcon = (props: React.ComponentProps<'svg'>) => JSX.Element

export type PostType = 'Post' | 'Page' | 'Project'

export type PostStatus = 'Idea' | 'Published' | 'Revise'

export type PostX = {
  id: string
  slug?: string
  count?: bigint
  comments?: Comment[]
  //repo_url: string;
  //thumbnail_url: string;
}
export interface Komment extends CompleteComment {
  likeCount: number
  likedByMe: boolean
  commentId?: string
  highlight?: boolean
  isDeleted?: boolean
}

type AuthorAssociation = 'NOOB' | 'LORD' | 'MANNEQUIN' | 'AI' | null

/* export interface PostT extends Post {
  comments?: Comment[]
}
 */
export type Comment = {
  id: number
  text: string
  slug: string
  createdAt: Date
  updatedAt: Date
  parentId: number | null
  user: {
    id: string
    name: string
    image: string
    level: AuthorAssociation
  }
  likeCount: number
  likedByMe: boolean
  commentId?: number
  highlight?: boolean
  isDeleted?: boolean
  replies?: Comment[]
  continueThread?: boolean
  replyCount: number
  reactionMetadata: CommentReactionMetadata[]
}

export type Reaction = {
  type: string
  createdAt: Date
  label: string
  url: string
  metadata: any
}

export type CommentReaction = {
  id: number
  userId: string
  commentId: string
  reactionType: string
  createdAt: Date
  user: User
}

export type CommentReactionMetadata = {
  commentId: number
  reactionType: string
  reactionCount: number
  active_for_user?: boolean
}
