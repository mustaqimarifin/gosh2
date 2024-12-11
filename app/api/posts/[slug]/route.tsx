import { type NextRequest, NextResponse } from 'next/server'
import { db } from 'server/db/prisma'

//mport { z } from 'zod'

export const dynamic = 'force-dynamic'
//type upView = z.infer<typeof PostSchema>

export async function POST(req: NextRequest) {
  let slug
  try {
    const { searchParams } = new URL(req.url)
    slug = searchParams.get('slug')
    if (!slug) {
      const url = new URL(req.url)
      slug = url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
    }

    const total = await db.post.upsert({
      create: {
        slug,
      },
      where: {
        slug,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    })
    return NextResponse.json({
      total: total.count?.toString(),
    })
  } catch (e) {
    console.log(`${e}`)
    return new Response(`Failed to increment page`, {
      status: 500,
    })
  }
}

export async function GET(req: Request) {
  let slug
  try {
    const { searchParams } = new URL(req.url)
    slug = searchParams.get('slug')
    if (!slug) {
      const url = new URL(req.url)
      slug = url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
    }

    const data = await db.post.findMany({
      where: {
        slug,
      },
      select: {
        count: true,
      },
    })

    //const total = data?.reduce((acc, row) => acc + row.count, 0)

    return NextResponse.json({
      total: Number(data[0].count),
    })
  } catch (e) {
    console.log(`${e}`)
    return new Response(`Failed to increment page`, {
      status: 500,
    })
  }
}
