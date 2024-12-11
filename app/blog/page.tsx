import { allPosts } from 'contentlayer/generated'
import { api } from 'server/trpc/server-invoker'
import { PageViews } from 'components/PageViews'
//import { getBlogViews } from 'lib/metrics'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'

/* export const dynamic = 'auto'

async function PostCounter({ slug }) {
  try {
    const data = await api.viewsBySlug.query({ slug });
    return `${data && data[0].count} views`;
  } catch (err) {
    console.log(err);
  }
}
 */
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, design, and more.',
}

export default async function BlogPage() {
  //const views = await getBlogViews()
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        read my blog
      </h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>

              <Suspense fallback={<p className="h-6" />}>
                <PageViews slug={post.slug} trackView={false} />
              </Suspense>
            </div>
          </Link>
        ))}
    </section>
  )
}

/* async function Views({ slug }: { slug: string }) {
  let views;
  try {
    views = await getViewsCount();
  } catch (error) {
    console.error(error);
  }

  return <ViewCounter allViews={views} slug={slug} trackView={false} />;
}
 */
