'use client';

import { getInventoryRoundDetails } from '@/actions/inventory';
import { addUserToOrganization } from '@/actions/organization';
import { getUserByEmail } from '@/actions/team';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RoundCheck } from '@/schemas/checking.schemas';
import { MemberSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RoundCheckingFormProps {
  roundDetails: Awaited<ReturnType<typeof getInventoryRoundDetails>>['data'];
}

function RoundCheckingForm({ roundDetails }: RoundCheckingFormProps) {
  const router = useRouter();
  const form = useForm<RoundCheck>({
    resolver: zodResolver(RoundCheck),
    defaultValues: {
      stock: undefined,
    },
  });

  const onSubmit: SubmitHandler<RoundCheck> = async (data) => {
    console.log(data);
  };

  console.log(roundDetails);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <div className='flex justify-between items-center flex-nowrap'>
            <p>Iphone</p>
            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input variant='form' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* <Button
          type='submit'
          variant='submit'
          className='mx-auto flex mt-8 text-dashboard-foreground w-36'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='animate-spin' />
          ) : (
            'Add team member'
          )}
        </Button> */}
      </form>
    </Form>
  );
}

export default RoundCheckingForm;
