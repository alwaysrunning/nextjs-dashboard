import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import { fetchLatestInvoices } from '@/app/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices()
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className={`${lusitana.className} text-xl md:text-2xl`}>
          Latest Invoices
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {latestInvoices.map((invoice, i) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={invoice.image_url} alt={`${invoice.name}'s profile picture`} />
                <AvatarFallback>{invoice.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {invoice.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.email}
                </p>
              </div>
            </div>
            <p className={`${lusitana.className} text-sm font-medium`}>
              {invoice.amount}
            </p>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="flex items-center text-sm text-muted-foreground">
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        Updated just now
      </CardFooter>
    </Card>
  );
}
