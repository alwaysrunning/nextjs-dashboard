// import Table from '@/app/ui/customers/table';
// import { TableRowSkeleton } from '@/app/ui/skeletons';
// import { Suspense } from 'react';
// import { fetchCustomers } from '@/app/lib/data';
// import { Metadata } from 'next';
 
// export const metadata: Metadata = {
//   title: 'Customers',
// };

// export default async function Page(props: {
//   searchParams?: Promise<{
//     query?: string;
//     page?: string;
//   }>;
// }) {
//   const searchParams = await props.searchParams;
//   const query = searchParams?.query || '';
//   const currentPage = Number(searchParams?.page) || 1;
//   const customers = await fetchCustomers();
//   return (
//     <div className="w-full">
//        <Suspense fallback={<TableRowSkeleton />}>
//         <Table customers={customers} />
//       </Suspense>

//     </div>
//   );
// }
import { lusitana } from '@/app/ui/fonts';
export default async function Page() {
  return ( 
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
    </div>
  )
}