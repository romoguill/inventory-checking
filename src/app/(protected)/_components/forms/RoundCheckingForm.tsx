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
import React, { SetStateAction } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RoundCheckingFormProps {
  roundDetails: Awaited<ReturnType<typeof getInventoryRoundDetails>>['data'];
}

function RoundCheckingForm({ roundDetails }: RoundCheckingFormProps) {
  const router = useRouter();
  const form = useForm<RoundCheck>({
    resolver: zodResolver(RoundCheck),
    defaultValues: {
      roundResults: new Array(roundDetails.round_product_user.length).fill({
        stock: '' as unknown as number,
      }),
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'roundResults',
  });

  const onSubmit: SubmitHandler<RoundCheck> = async (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-[1fr,120px] grid-rows-[50px] gap-y-3 rounded-lg'>
          <p className='self-center bg-dashboard-accent p-2'>Product</p>
          <p className='self-center text-center bg-dashboard-accent p-2'>
            Quantity
          </p>

          {fieldArray.fields.map((field, i) => (
            <React.Fragment key={field.id}>
              <p className='self-center p-2'>
                {roundDetails.round_product_user[i].product.name}
              </p>
              <FormField
                control={form.control}
                name={`roundResults.${i}.stock`}
                render={({ field }) => (
                  <FormItem className='p-2'>
                    <FormControl>
                      <Input
                        variant='form'
                        type='number'
                        {...field}
                        className='text-center'
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </React.Fragment>
          ))}
        </div>
        <Button variant='submit' type='submit' className='w-full mt-6'>
          Confirm
        </Button>
      </form>
    </Form>
  );
}

export default RoundCheckingForm;
