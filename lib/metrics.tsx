import 'server-only'

import { api } from 'server/trpc/server-invoker'
import { unstable_cache } from 'next/cache'
import { google } from 'googleapis'

const googleAuth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
})

const youtube = google.youtube({
  version: 'v3',
  auth: googleAuth,
})

export const getBlogViews = unstable_cache(
  async (slug) => {
    if (!process.env.SQL) {
      return 0
    }

    const data = await api.viewsBySlug.query({ slug })
    return `${data && data[0].count} views`
  },
  ['blog-views-sum'],
  {
    revalidate: 5,
  }
)

/* export const getViewsCount = unstable_cache(
  async () => {
    return db.selectFrom("post").select(["slug", "count"]).execute();
  },
  ["all-views"],
  {
    revalidate: 5,
  },
);
 */
export const getLeeYouTubeSubs = unstable_cache(
  async () => {
    const response = await youtube.channels.list({
      id: ['UCd-pjthLQYLYVdN7GNwJgyA'],
      part: ['statistics'],
    })

    const channel = response.data.items![0]
    return Number(channel?.statistics?.subscriberCount)
  },
  ['youtube-subs'],
  {
    revalidate: 3600,
  }
)

export const getVercelYouTubeSubs = unstable_cache(
  async () => {
    const response = await youtube.channels.list({
      id: ['UCLq8gNoee7oXM7MvTdjyQvA'],
      part: ['statistics'],
    })

    const channel = response.data.items![0]
    return Number(channel?.statistics?.subscriberCount)
  },
  ['vercel-youtube-subs'],
  {
    revalidate: 3600,
  }
)
