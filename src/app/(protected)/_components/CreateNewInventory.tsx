import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductSchema } from '@/schemas/dashboard.schemas';
import Link from 'next/link';

export type Presets = 'low' | 'medium' | 'high' | 'custom';

function CreateNewInventory() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='place-self-center bg-dashboard-border p-2 rounded-md hover:bg-dashboard-border/80'>
        Start Inventory
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Presets</DropdownMenuLabel>
        {ProductSchema.shape.severity.options.map((severity) => (
          <DropdownMenuItem key={severity} className='capitalize' asChild>
            <Link href={`/dashboard/create-inventory?selection=${severity}`}>
              {severity.toLowerCase()}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuLabel>Custom</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/create-inventory?selection=custom`}>
            New custom inventory
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CreateNewInventory;
