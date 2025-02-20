import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 在应用程序结束时关闭连接
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
// 定义请求体的验证模式
const InvoiceSchema = z.object({
  customerId: z.string().min(1, '客户ID是必需的'),
  amount: z.number().positive('金额必须大于0'),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '状态必须是 pending 或 paid',
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const validatedData = InvoiceSchema.parse(body);
    const { customerId, amount, status } = validatedData;
    
    // 转换金额为分
    const amountInCents = amount * 100;
    const date = new Date().toISOString();

    // 插入数据库
    // await sql`
    //   INSERT INTO invoices (customer_id, amount, status, date)
    //   VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    // `;

    await prisma.invoices.create({
      data: {
        customer_id: customerId,
        amount: amountInCents,
        status: status,
        date:  date
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: '发票创建成功' 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: error.errors 
      }, { status: 400 });
    }
    console.log(error)
    return NextResponse.json({ 
      success: false, 
      error: '创建发票失败' 
    }, { status: 500 });
  }
} 