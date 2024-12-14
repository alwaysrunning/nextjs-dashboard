'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState);

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <Label htmlFor="customer"> select customer </Label>
            <Select defaultValue={invoice.customer_id} name="customerId">
              <SelectTrigger>
                <SelectValue placeholder="select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.customerId && (
              <p className="text-sm text-destructive mt-2">{state.errors.customerId}</p>
            )}
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <Label htmlFor="amount"> amount </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              defaultValue={invoice.amount}
              placeholder="input amount"
            />
            {state.errors?.amount && (
              <p className="text-sm text-destructive mt-2">{state.errors.amount}</p>
            )}
          </div>

          {/* Invoice Status */}
          <div className="mb-4">
            <Label> invoice status </Label>
            <RadioGroup name="status" defaultValue={invoice.status} className="mt-2">
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending" className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    pending <ClockIcon className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid" className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                    paid <CheckIcon className="h-4 w-4" />
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {state.errors?.status && (
              <p className="text-sm text-destructive mt-2">{state.errors.status}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/invoices">cancel</Link>
        </Button>
        <Button type="submit">update invoice</Button>
      </div>
    </form>
  );
}
