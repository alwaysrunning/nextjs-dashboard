import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6">
      {/* 移动端视图 */}
      <div className="md:hidden space-y-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <Image
                  src={invoice.image_url}
                  className="mr-2 rounded-full"
                  width={28}
                  height={28}
                  alt={`${invoice.name}'s profile picture`}
                />
                <div>
                  <p className="font-medium">{invoice.name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.email}</p>
                </div>
              </div>
              <InvoiceStatus status={invoice.status} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-medium">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateToLocal(invoice.date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <UpdateInvoice id={invoice.id} />
                  <DeleteInvoice id={invoice.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 桌面端视图 */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={invoice.image_url}
                      className="rounded-full"
                      width={28}
                      height={28}
                      alt={`${invoice.name}'s profile picture`}
                    />
                    <span>{invoice.name}</span>
                  </div>
                </TableCell>
                <TableCell>{invoice.email}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatDateToLocal(invoice.date)}</TableCell>
                <TableCell>
                  <InvoiceStatus status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
