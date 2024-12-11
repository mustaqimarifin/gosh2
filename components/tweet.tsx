import './tweet.css'

import {
  EmbeddedTweet,
  TweetNotFound,
  type TweetProps,
  TweetSkeleton,
} from 'react-tweet'
import { getTweet, Tweet } from 'react-tweet/api'
import { Suspense } from 'react'

const TweetContent = async ({ id, components, onError }: TweetProps) => {
  let error
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          error = onError(err)
        } else {
          console.error(err)
          error = err
        }
      })
    : undefined

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound
    return <NotFound error={error} />
  }

  return <EmbeddedTweet tweet={tweet} components={components} />
}

const ReactTweet = (props: TweetProps) => (
  // I don't want a loading state though... I want to prerender
  // but I do want an ErrorBoundary
  // <Suspense fallback={<TweetSkeleton />}>
  <TweetContent {...props} />
  // </Suspense>
)

export async function StaticTweet({ id }: { id: string }) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
    </div>
  )
}
