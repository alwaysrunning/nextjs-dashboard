import { db } from "@vercel/postgres";

const client = await db.connect();

export default async function Page() {
  let data = await client.sql`
  SELECT *
  FROM invoices;
`;

  const posts = data.rows
  return ( 
    <div className="w-full">
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.amount}</li>
        ))}
      </ul>
    </div>
  )
}