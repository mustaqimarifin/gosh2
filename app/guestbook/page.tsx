import { Balancer } from 'react-wrap-balancer'
import { auth } from 'server/db/auth'
import type { Metadata } from 'next'
import { cache } from 'react'

import { db } from 'server/db/prisma'
import LoginForm from './login-form'
import { HotBox } from './Box'

export const dynamic = 'force-dynamic'

const getHotline = cache(async () => {
  return await db.hotline.findMany({
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
})

async function HotlineForm() {
  const session = await auth()

  return <LoginForm session={session} />
}

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Leave a message!.',
}

export default async function HotlinePage() {
  const entries = await getHotline()
  //const user = await getUser()
  return (
    <>
      <section>
        <h1 className="mb-5 font-serif text-3xl font-bold">
          <Balancer>Guestbook</Balancer>
        </h1>
        <HotlineForm />
        <>
          {entries &&
            entries.map((post) => (
              <HotBox
                key={post.id}
                text={post.text}
                user={post.user}
                createdAt={post.createdAt}
              />
            ))}
        </>
      </section>
    </>
  )
}

/* //^PRISMA 

const getHotline = cache(async () => {
  return await prisma.guestbook.findMany({
    include: {
      user: true
    },
    orderBy: {
      updatedAt: "desc",
    },
  })
})

*/

/* //^KYSELY
db
    .selectFrom("Guestbook")
    .innerJoin("User", "User.id", "Guestbook.userId")
    .select([
      "Guestbook.id",
      "body",
      "User.name as username",
      "User.image as avatar",
      "updatedAt",
    ])
    .orderBy("updatedAt", "desc")
    .limit(100)
    .execute()
    
 */
