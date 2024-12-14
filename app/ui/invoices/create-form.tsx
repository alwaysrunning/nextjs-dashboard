'use client';

import { CustomerField } from '@/app/lib/definitions';
import { useRouter } from 'next/navigation';

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from 'react';


export default function Form({ customers }: { customers: CustomerField[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // 添加提交状态
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // 开始提交时设置状态
    
    const formData = new FormData(e.currentTarget);
    const data = {
      customerId: formData.get('customerId') as string,
      amount: Number(formData.get('amount')),
      status: formData.get('status') as string,
    }
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push('/dashboard/invoices');
        router.refresh();
      } else {
        console.error('创建失败:', result.error);
      }
    } catch (error) {
      console.error('提交出错:', error);
    } finally {
      setIsSubmitting(false); // 无论成功还是失败，重置状态
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <Label htmlFor="customer"> select customer </Label>
            <Select name="customerId">
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <Label htmlFor="amount"> input amount </Label>
            <div className="relative mt-2">
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="input amount"
                className="pl-10"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Invoice Status */}
          <div className="mb-4">
            <Label> invoice status </Label>
            <RadioGroup name="status" className="mt-2">
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
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end gap-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => router.push('/dashboard/invoices')}
          disabled={isSubmitting}
        >
          cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          create invoice
        </Button>
      </div>
    </form>
  );
}
