'use client';

import { Search as SearchIcon } from "lucide-react" 
import { Input } from "@/components/ui/input"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type pokemon = {
  name: string;
  url: string
}
export default function Item({ pokemons }: { pokemons: pokemon[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const editMode = searchParams.get('edit')
  console.log('pathname====', pathname);
  console.log('editMode====', editMode);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "50px",
      }}
    >
      {pokemons.map((item) => (
        <div
          key={item.name}
          onClick={() => {alert(item.name)}}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            padding: "10px",
            position: "relative",
          }}
        >
          <div>{item.name}</div>
        </div>
      ))}
    </div>
  );
}
