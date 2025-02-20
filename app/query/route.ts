import { db } from "@vercel/postgres";
import { PrismaClient } from '@prisma/client'
import { customers, invoices, users } from "../lib/placeholder-data";

const prisma = new PrismaClient()

async function connectToDatabase() {
  try {
    const client = await db.connect();
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to the database");
  }
}

await connectToDatabase();

async function fetchUser(userId) {

  // const user = await prisma.user.findUnique({
  //   where: {
  //     // email: 'alice@prisma.io',
  //     id: Number(userId),
  //   },
  // })

  // const allUsers = await prisma.user.findMany({
  //   include: {
  //     posts: true,
  //     profile: true,
  //   }
  // })

  // const findUser = await prisma.user.findFirst({
  //   where: {
  //     posts: {
  //       some: {
  //         likes: {
  //           gt: 100,
  //         },
  //       },
  //     },
  //   },
  //   orderBy: {
  //     id: 'desc',
  //   },
  // })

  // const users = await prisma.user.findMany({
  //   where: {
  //     email: {
  //       endsWith: 'prisma.io',
  //     },
  //   },
  // })

  // const users = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       {
  //         name: {
  //           startsWith: 'A'
  //         }
  //       },
  //       {
  //         AND: {
  //           id: {
  //             gt: 0,
  //           },
  //           email: {
  //             equals: 'bob@prisma.io',
  //           },
  //         }
  //       }
  //     ]
  //   }
  // })

  // const users = await prisma.user.findMany({
  //   where: {
  //     email: {
  //       endsWith: 'prisma.io'
  //     },
  //     posts: {
  //       some: {
  //         published: false
  //       }
  //     }
  //   },
  // })

  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: 'bob@prisma.io',
  //   },
  //   select: {
  //     email: true,
  //     name: true,
  //   },
  // })

  // const users = await prisma.user.findMany({
  //   include: {
  //     posts: true,
  //   },
  // })

  // const users = await prisma.user.findMany({
  //   skip: 2,
  //   take: 4,
  //   where: {
  //     email: {
  //       contains: 'prisma.io',
  //     },
  //   }
  // })

  const usersWithCount = await prisma.invoices.findMany({
    include: {
      customer: true
    }
  })
  return usersWithCount
}

async function createUser(data) {
  // await prisma.user.create({
  //   data: { 
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     },
  //   },
  // })

  // const result = await prisma.users.createMany({
  //   data: [
  //     { name: 'Bob', email: 'bob@prisma.io' },
  //     { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
  //     { name: 'Yewande', email: 'yewande@prisma.io' },
  //     { name: 'Angelique', email: 'angelique@prisma.io' },
  //   ],
  //   skipDuplicates: true, // Skip 'Bobo'
  // })
  let users = []
  try {
    users = await prisma.revenue.createManyAndReturn({
      data: [
        { month: 'Jan', revenue: 2000 },
        { month: 'Feb', revenue: 1800 },
        { month: 'Mar', revenue: 2200 },
        { month: 'Apr', revenue: 2500 },
        { month: 'May', revenue: 2300 },
        { month: 'Jun', revenue: 3200 },
        { month: 'Jul', revenue: 3500 },
        { month: 'Aug', revenue: 3700 },
        { month: 'Sep', revenue: 2500 },
        { month: 'Oct', revenue: 2800 },
        { month: 'Nov', revenue: 3000 },
        { month: 'Dec', revenue: 4800 },
      ],
      skipDuplicates: true,
    })
  } catch (error) {
    console.error("Error creating invoices:", error);
  }
  

  // const result = await prisma.user.create({
  //   data: {
  //     email: 'elsa@prisma.io',
  //     name: 'Elsa Prisma',
  //     posts: {
  //       create: [
  //         { title: 'How to make an omelette' },
  //         { title: 'How to eat an omelette' },
  //       ],
  //     },
  //   },
  //   include: {
  //     posts: true, // Include all posts in the returned object
  //   },
  // })

  return users
}

async function updateUser(data) {
  // await prisma.user.update({
  //   where: {
  //     id: Number(data.id)
  //   },
  //   data: { 
  //     name: data.name,
  //   },
  // })

  // await prisma.user.updateMany({
  //   where: {
  //     email: {
  //       contains: 'prisma.io',
  //     }
  //   },
  //   data: { 
  //     name: data.name,
  //   },
  // })

  // const users = await prisma.user.updateManyAndReturn({
  //   where: {
  //     email: {
  //       contains: 'prisma.io',
  //     }
  //   },
  //   data: {
  //     name: data.name,
  //   }
  // })

  // const upsertUser = await prisma.user.upsert({
  //   where: {
  //     email: 'viola@prisma.io',
  //   },
  //   update: {
  //     name: 'Viola the Magnificent',
  //   },
  //   create: {
  //     email: 'viola@prisma.io',
  //     name: 'Viola the Magnificent',
  //   },
  // })

  const updatePosts = await prisma.post.updateMany({
    where: {
      id: Number(data.id), // Ensure you are updating posts for the correct user
    },
    data: {
      authorId: {
        // increment: 1
        // decrement: 1
        set: 2
      },
    },
  })

  return updatePosts
}

async function deleteUser(data) {
  // const deleteUsers = await prisma.profile.deleteMany({
  //   where: {
  //     bio: {
  //       contains: 'like',
  //     },
  //   },
  // })

  const deleteUsers = await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'prisma.io',
      },
    },
  })

  return {
    code: '200',
    message: 'success',
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url); // 获取请求的 URL
    const params = new URLSearchParams(url.search); // 解析查询参数
    const userId = params.get('id'); // 获取特定参数，例如 'id'

    return Response.json(await fetchUser(userId)); // 将参数传递给 fetchUser 函数
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // 获取请求体中的 JSON 数据
    return Response.json(await createUser(data)); // 将数据传递给 createUser 函数
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}

