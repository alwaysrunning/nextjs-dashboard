'use client';

import { CustomerField } from '@/app/lib/definitions';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
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

export default function Form({ customers }: { customers: CustomerField[] }) {
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <Label htmlFor="customer">选择客户</Label>
            <Select name="customerId">
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="选择一个客户" />
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
            <Label htmlFor="amount">输入金额</Label>
            <div className="relative mt-2">
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="输入美元金额"
                className="pl-10"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Invoice Status */}
          <div className="mb-4">
            <Label>发票状态</Label>
            <RadioGroup name="status"  className="mt-2">
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending" className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    待处理 <ClockIcon className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid" className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                    已支付 <CheckIcon className="h-4 w-4" />
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push('/dashboard/invoices')}>
          取消
        </Button>
        <Button type="submit">创建发票</Button>
      </div>
    </form>
  );
}
