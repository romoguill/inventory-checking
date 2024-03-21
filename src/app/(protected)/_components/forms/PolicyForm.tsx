'use client';

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
import { PolicySchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usePolicy } from '../policies/PolicyContext';
import { createPolicy, updatePolicy } from '@/actions/policy';
import { ChangeEvent } from 'react';
import { Policy } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';

// Regex for allowwing 2 integer + 2 decimals only
const restrictPercentIntput = (e: ChangeEvent<HTMLInputElement>) => {
  const regex = /\d{0,2}(\.\d{1,2})?/;
  return e.target.value.match(regex)?.[0];
};

interface PolicyFormProps {
  type: 'create' | 'update';
  policy: Policy;
  handleDialogOpenChange: (open: boolean) => void;
}

function PolicyForm({ type, policy, handleDialogOpenChange }: PolicyFormProps) {
  const router = useRouter();
  const form = useForm<PolicySchema>({
    resolver: zodResolver(PolicySchema),
    defaultValues: {
      frequency: policy?.frequency,
      threshold: policy?.threshold,
    },
  });

  const onSubmit: SubmitHandler<PolicySchema> = async (data) => {
    if (!policy) return;

    // Type refers to if the policy display was a placeholder or not. Fire update / create accordingly
    if (type === 'create') {
      const { error } = await createPolicy({
        ...data,
        threshold: data.threshold / 100, // Since locale formater multplies by 100.
        name: policy.name,
      });

      if (!error) {
        toast.success('Policy created');
      } else {
        console.log(error);
        toast.error("Couldn't create policy");
      }
    } else {
      const { error } = await updatePolicy(policy.id, {
        ...data,
        threshold: data.threshold / 100, // Since locale formater multplies by 100.
      });

      if (!error) {
        toast.success('Policy updated');
      } else {
        console.log(error);
        toast.error("Couldn't update policy");
      }
    }

    handleDialogOpenChange(false);

    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <FormField
            control={form.control}
            name='threshold'
            render={({ field }) => (
              <FormItem>
                <div className='flex gap-2 justify-between items-center'>
                  <FormLabel>Threshold (stock difference allowed)</FormLabel>
                  <FormControl>
                    <Input
                      variant='form'
                      type='number'
                      {...field}
                      onChange={(e) => {
                        console.log(e.target.value);
                        field.onChange(restrictPercentIntput(e));
                      }}
                      className='basis-20 ml-auto flex-grow-0'
                    />
                  </FormControl>
                  <span className='w-12'>%</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='frequency'
            render={({ field }) => (
              <FormItem>
                <div className='flex gap-2 justify-between items-center'>
                  <FormLabel>
                    Frequency (days between inventory checks)
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant='form'
                      type='number'
                      {...field}
                      className='basis-20 ml-auto flex-grow-0'
                    />
                  </FormControl>
                  <span className='w-12'>days</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          variant='submit'
          className='mx-auto flex mt-8 w-28'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='animate-spin' />
          ) : (
            'Modify policy'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default PolicyForm;
