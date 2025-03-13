import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { auth } from '@/auth'

import { db } from "@vercel/postgres";
import { customers } from './placeholder-data';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 在应用程序结束时关闭连接
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    const session = await auth();
    console.log('session===', session)
    // 验证用户是否登录
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    // return data.rows;
    const res = await prisma.revenue.findMany({})
    return res;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    // const data = await sql<LatestInvoiceRaw>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 6`;

    const data = await prisma.invoices.findMany({
      select: {
        amount: true,
        status: true,
        id: true,
        customer: {
          select: {
            id: true, // Ensure to select the id if needed
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 6,
    });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    const invoiceCountPromise = prisma.invoices.count();
    const customerCountPromise = prisma.customers.count();
    // const customerCountPromise = prisma.invoices.aggregate({
    //   _count: {
    //     status: true,
    //   },
    //   where: {
    //     status: {
    //       equals: 'pending',
    //     },
    //   },
    // });
    const invoicePaidStatusPromise = prisma.invoices.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: {
          equals: 'paid',
        },
      },
    });
    const invoicePendingStatusPromise = prisma.invoices.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: {
          equals: 'pending',
        },
      },
    });

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoicePaidStatusPromise,
      invoicePendingStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0]);
    const numberOfCustomers = Number(data[1]);
    const totalPaidInvoices = formatCurrency(data[2]['_sum']['amount'] ?? 0);
    const totalPendingInvoices = formatCurrency(data[3]['_sum']['amount'] ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // const invoices = await sql<InvoicesTable>`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;

    const data = await prisma.invoices.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      select: {
        amount: true,
        status: true,
        id: true,
        date: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: 'insensitive', // ILIKE equivalent
              }
            }
          },
          {
            customer: {
              email: {
                contains: query,
                mode: 'insensitive', // ILIKE equivalent
              },
            },
          },
          // {
          //   amount: {
          //     equals: parseFloat(query),
          //   }
          // },
          {
            status: {
              contains: query,
              mode: 'insensitive', // ILIKE equivalent
            },
          },
        ]
      },
      orderBy: {
        date: 'desc',
      }
    });


    const invoices = data.map(item=> {
      return {
        ...item,
        name: item.customer.name,
        image_url: item.customer.image_url,
        email: item.customer.email,
      }
    })

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
  //   const count = await sql`SELECT COUNT(*)
  //   FROM invoices
  //   JOIN customers ON invoices.customer_id = customers.id
  //   WHERE
  //     customers.name ILIKE ${`%${query}%`} OR
  //     customers.email ILIKE ${`%${query}%`} OR
  //     invoices.amount::text ILIKE ${`%${query}%`} OR
  //     invoices.date::text ILIKE ${`%${query}%`} OR
  //     invoices.status ILIKE ${`%${query}%`}
  // `;

  //   const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);

    const count = await prisma.invoices.count()
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    // const data = await sql<InvoiceForm>`
    //   SELECT
    //     invoices.id,
    //     invoices.customer_id,
    //     invoices.amount,
    //     invoices.status
    //   FROM invoices
    //   WHERE invoices.id = ${id};
    // `;

    // const invoice = data.rows.map((invoice) => ({
    //   ...invoice,
    //   // Convert amount from cents to dollars
    //   amount: invoice.amount / 100,
    // }));

    const data = await prisma.invoices.findUnique({
      where: {
        id : id
      }
    })
    const invoice = {
      ...data,
      amount: data.amount / 100,
    };

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // const data = await sql<CustomerField>`
    //   SELECT
    //     id,
    //     name,
    //     email,
    //     image_url
    //   FROM customers
    //   ORDER BY name ASC
    // `;
    // console.log(123, data.rows)
    // const customers = data.rows;

    const customers = await prisma.customers.findMany({})
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
