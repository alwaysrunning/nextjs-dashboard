"use client"
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function SideNav() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/login'
    });
  };

  return (
    <nav className="flex h-full flex-col px-3 md:px-2">
      <Link
        className="mb-2 flex items-end justify-start rounded-md p-4"
        href="/"
      >
        <AcmeLogo />
      </Link>

      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <PowerIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px]">
          <NavLinks />
        </SheetContent>
      </Sheet>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex h-[48px] w-full items-center justify-start gap-2"
        >
          <PowerIcon className="h-4 w-4" />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
