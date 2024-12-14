'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Button
            key={link.name}
            variant="ghost"
            asChild
            className={cn(
              'w-full justify-start gap-2',
              pathname === link.href && 'bg-accent text-accent-foreground'
            )}
          >
            <Link href={link.href}>
              <LinkIcon className="h-4 w-4" />
              <span className="hidden md:inline-block">{link.name}</span>
            </Link>
          </Button>
        );
      })}
    </>
  );
}
