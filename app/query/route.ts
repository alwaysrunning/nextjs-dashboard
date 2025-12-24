import { db } from "@vercel/postgres";
import { PrismaClient } from '@prisma/client'
import { customers, invoices, users } from "../lib/placeholder-data";
import { auth } from '@/auth'
import { revalidateTag, revalidatePath } from "next/cache";

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
  console.log('userId==', userId)
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
  console.log(111, usersWithCount)
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

  // const updatePosts = await prisma.posts.updateMany({
  //   where: {
  //     id: Number(data.id), // Ensure you are updating posts for the correct user
  //   },
  //   data: {
  //     authorId: {
  //       // increment: 1
  //       // decrement: 1
  //       set: 2
  //     },
  //   },
  // })

  // return updatePosts
  return []
}

async function deleteUser(data) {
  // const deleteUsers = await prisma.profile.deleteMany({
  //   where: {
  //     bio: {
  //       contains: 'like',
  //     },
  //   },
  // })

  // const deleteUsers = await prisma.user.deleteMany({
  //   where: {
  //     email: {
  //       contains: 'prisma.io',
  //     },
  //   },
  // })

  // return {
  //   code: '200',
  //   message: 'success',
  // };
}

export async function GET(request: Request) {
  
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const slug = params.get('slug'); // 可选：指定要重新验证的 slug
    const revalidateAll = params.get('all') === 'true'; // 是否重新验证所有页面
    
    // 如果提供了重新验证参数，执行重新验证逻辑
    if (slug || revalidateAll) {
      // 重新验证所有使用 'user' tag 的缓存数据
      // revalidateTag('user');
      
      if (slug) {
        // 重新验证特定的 CMS 详情页
        revalidatePath(`/cms/${slug}`);
        return Response.json({ 
          message: `Cache revalidated for /cms/${slug}`,
          timestamp: new Date().toISOString()
        }, { status: 200 });
      } else if (revalidateAll) {
        // 重新验证所有 CMS 页面（包括新增的）
        revalidatePath('/cms', 'layout');
        return Response.json({ 
          message: 'All CMS pages revalidated',
          timestamp: new Date().toISOString()
        }, { status: 200 });
      }
    }
    
    // 原有的业务逻辑
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.get('id');
    const userData = await fetchUser(userId);

    return Response.json(userData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    // 验证用户是否登录
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    return Response.json(await createUser(data));
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

