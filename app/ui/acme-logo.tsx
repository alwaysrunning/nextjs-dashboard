import { GlobeIcon } from "lucide-react";
import { lusitana } from '@/app/ui/fonts';
import { cn } from "@/lib/utils";

export default function AcmeLogo() {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        lusitana.className
      )}
    >
      <GlobeIcon 
        className="h-12 w-12 rotate-[15deg]" 
      />
      <p className="text-3xl font-bold ">
        Dashboard
      </p>
    </div>
  );
}
