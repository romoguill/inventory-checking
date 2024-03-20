import { Loader2 } from 'lucide-react';

function TableLoader() {
  return (
    <tr>
      <td className='absolute inset-0'>
        <Loader2 className='animate-spin mx-auto mt-10' size={30} />
      </td>
    </tr>
  );
}

export default TableLoader;
