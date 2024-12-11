//@ts-nocheck
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  const kyle = await prisma.user.create({ data: { name: 'Kyle' } })
  const sally = await prisma.user.create({ data: { name: 'Sally' } })

  const post2 = await prisma.post.create({
    data: {
      slug: 'backend',
    },
  })

  const comment1 = await prisma.comment.create({
    data: {
      text: 'I am a root comment',
      userId: kyle.id,
      slug: post2.slug,
    },
  })

  await prisma.comment.create({
    data: {
      parentId: comment1.id,
      text: 'I am a nested comment',
      userId: sally.id,
      slug: post2.slug,
    },
  })

  await prisma.comment.create({
    data: {
      text: 'I am another root comment',
      userId: sally.id,
      slug: post2.slug,
    },
  })

  await prisma.like.create({
    data: {
      commentId: comment1.id,
      userId: sally.id,
    },
  })
}

seed()

/*   const post2 = await prisma.post.create({
    data: {
      slug: 'beginners-gusluge-to-the-programming-portfolio',
    },
  });

  const post3 = await prisma.post.create({
    data: {
      slug: 'career',
    },
  });
  const post4 = await prisma.post.create({
    data: {
      slug: 'fonts',
    },
  });
  const post5 = await prisma.post.create({
    data: {
      slug: 'dx',
    },
  }); */

/*  const comment3 = await prisma.comment.create({
    data: {
      text: 'I am another root comment in a vagina',
      userslug: sally.slug,
      slug: post4.slug
    }
  });

  const like1 = await prisma.like.create({
    data: {
      commentslug: comment1.slug,
      userslug: sally.slug
    }
  }); */
