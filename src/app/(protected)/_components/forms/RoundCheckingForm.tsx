'use client';

import {
  getInventoryRoundDetails,
  updateUserCheckingRound,
} from '@/actions/inventory';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RoundCheck } from '@/schemas/checking.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RoundCheckingFormProps {
  roundDetails: Awaited<ReturnType<typeof getInventoryRoundDetails>>['data'];
}

function RoundCheckingForm({ roundDetails }: RoundCheckingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RoundCheck>({
    resolver: zodResolver(RoundCheck),
    defaultValues: {
      roundResults: new Array(roundDetails.round_product_user.length).fill({
        stock: '-',
      }),
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'roundResults',
  });

  const onSubmit: SubmitHandler<RoundCheck> = async (data) => {
    setIsLoading(true);
    // Massage data to match API for prisma transaction
    const parsedData = roundDetails.round_product_user.map((item, i) => ({
      productId: item.productId,
      stock: data.roundResults[i].stock,
    }));

    const { error } = await updateUserCheckingRound(
      roundDetails.id,
      parsedData
    );

    if (!error) {
      revalidatePath('/checking');
      router.push('/checking');
      toast.success('Round confirmed successfully');
    } else {
      toast.error('There was an error');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-[1fr,120px] grid-rows-[50px] gap-y-3 rounded-lg'>
          <p className='self-center bg-dashboard-dark p-2'>Product</p>
          <p className='self-center text-center bg-dashboard-dark p-2'>
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
        <Button
          variant='submit'
          type='submit'
          className='w-full mt-6'
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className='animate-spin' /> : 'Confirm'}
        </Button>
      </form>
    </Form>
  );
}

export default RoundCheckingForm;
