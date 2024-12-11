import { type NextRequest, NextResponse } from 'next/server'
////import { PostSchema } from 'prisma/ZOD'
import { db } from 'server/db/prisma'

//mport { z } from 'zod'

//type upView = z.infer<typeof PostSchema>

export async function GET(req: Request) {
  try {
    const data = await db.post.aggregate({
      _sum: {
        count: true,
      },
    })
    //const total = data?.reduce((acc, row) => acc + row.view_count, 0
    return NextResponse.json({
      total: data._sum.count?.toString(),
    })
  } catch (e) {
    console.log(`${e}`)
    return new Response(`Failed to increment page`, {
      status: 500,
    })
  }
}
