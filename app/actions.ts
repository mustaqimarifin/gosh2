'use server'

import {
  createAction,
  protectedProcedure,
  publicProcedure,
} from 'server/context'
import { revalidatePath } from 'next/cache'
import { type Session } from 'next-auth'
import { db } from 'server/db/prisma'
import { auth } from 'server/db/auth'
import { z } from 'zod'

export const testAction = createAction(
  publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      console.log('testMutation called', opts)
      return {
        text: 'Hello world',
        date: new Date(),
      }
    })
)

/* export async function increment(slug: string) {
  const data = await db
    .selectFrom("post")
    .where("slug", "=", slug)
    .select(["count"])
    .execute();

  const views = !data.length ? 0 : (Number(data[0].count) as unknown as number);

  await db
    .insertInto("post")
    .values({ slug, count: 1 })
    .onDuplicateKeyUpdate({ count: views + 1 })
    .execute();
  return;
}
 */
async function getSession(): Promise<Session> {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }

  return session
}

export async function deleteGuestbookEntries(id) {
  const session = await getSession()
  const email = session.user?.email as string

  if (email !== 'vmprmyth@gmail.com') {
    throw new Error('Unauthorized')
  }

  //const selectedEntriesAsNumbers = selectedEntries.map(Number)
  const selEntries = Object.keys(id)

  await db.user.deleteMany({})

  revalidatePath('/admin')
  revalidatePath('/guestbook')
}

export const hotAction = createAction(
  publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const entry = await opts.ctx.db.hotline.create({
        data: {
          text: opts.input.text,
          userId: opts.ctx.session!.user.id,
          createdAt: new Date(),
        },
      })
      revalidatePath('/guestbook')

      return {
        entry,
      }
    })
)

export async function saveGuestbookEntry(formData: FormData) {
  const session = await getSession()
  //const email = session.user?.email as string;
  const userId = session.user?.id
  if (!session.user) {
    throw new Error('Unauthorized')
  }

  const entry = formData.get('entry')?.toString() || ''
  const text = entry.slice(0, 500)

  await db.hotline.create({
    data: {
      text,
      userId,
      createdAt: new Date(),
    },
  })
  revalidatePath('/guestbook')

  /*   const data = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "guestbook@leerob.io",
      to: "me@leerob.io",
      subject: "New Guestbook Entry",
      html: `<p>Email: ${email}</p><p>Message: ${body}</p>`,
    }),
  });

  const response = await data.json();
  console.log("Email sent", response); */
}

/* export async function deleteGuestbookEntries(selectedEntries: string[]) {
  const session = await getSession()
  const email = session.user?.email as string

  if (email !== 'me@leerob.io') {
    throw new Error('Unauthorized')
  }

  const selectedEntriesAsNumbers = selectedEntries.map(Number)

  await db
    .deleteFrom('guestbook')
    .where('id', 'in', selectedEntriesAsNumbers)
    .execute()

  revalidatePath('/admin')
  revalidatePath('/guestbook')
}
 */

/* export const hotAction = createAction(
  protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx }) => {
      const entry = await ctx.db.hotline.create({
        data: {
          text: input.text,
          userId: ctx.session!.user.id,
          createdAt: new Date(),
        },
      })
      revalidatePath('/hotline')

      return {
        entry,
      }
    })
) */

export async function saveComment(formData: FormData) {
  const schema = z.object({
    slug: z.string(),
    parentId: z.number().optional(),
    text: z.string(),
  })

  const data = schema.parse({
    text: formData.get('text')?.toString(),
    parentId: formData.get('parentId'),
    slug: formData.get('slug') as string,
  })

  const cAction = createAction(
    protectedProcedure.input(cSchema).mutation(async ({ ctx }) => {
      await ctx.db.post.findUnique({
        where: { slug: data.slug },
      })
      return await ctx.db.comment
        .create({
          data: {
            slug: data.slug,
            text: data.text,
            parentId: data.parentId,
            userId: ctx.session!.user.id,
            createdAt: new Date(),
          },
          select: {
            slug: true,
          },
        })
        .then((comment) => {
          return {
            ...comment,
            likeCount: 0,
            likedByMe: false,
          }
        })
    })
  )
  revalidatePath('/blog/[slug]')

  return cAction
}
export const cSchema = z.object({
  slug: z.string(),
  parentId: z.number().optional(),
  text: z.string(),
})

export const cAction = createAction(
  protectedProcedure.input(cSchema).mutation(async ({ input, ctx }) => {
    await ctx.db.post.findUnique({
      where: { slug: input.slug },
    })
    return await ctx.db.comment
      .create({
        data: {
          slug: input.slug,
          text: input.text,
          parentId: input.parentId,
          userId: ctx.session!.user.id,
          createdAt: new Date(),
        },
        select: {
          slug: true,
        },
      })
      .then((comment) => {
        return {
          ...comment,
          likeCount: 0,
          likedByMe: false,
        }
      })
  })
)

export const pageCount = createAction(
  publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async (opts) => {
      const total = await opts.ctx.db.post.upsert({
        where: opts.input,
        create: opts.input,
        update: {
          count: {
            increment: 1,
          },
        },
      })
      revalidatePath('/blog/[slug]')

      return { total }
    })
)

/* export const saveGuestbookEntry= async(formData: FormData) => {
  const session = await auth()
  const userId = session.user.id 
  const slug = formData.get("slug")?.toString() || ""
  const entry = formData.get("entry")?.toString() || ""
  const body = entry.slice(0, 500)

  await supabase
    .from("hotline")
    .insert({ body, slug, author_id: userId })
    .select()

  revalidatePath("/hotline")

  
} */
