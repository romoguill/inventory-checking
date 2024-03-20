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

interface PolicyFormProps {
  type: 'create' | 'update';
}

function PolicyForm({ type }: PolicyFormProps) {
  const policy = usePolicy();

  const form = useForm<PolicySchema>({
    resolver: zodResolver(PolicySchema),
    defaultValues: {
      frequency: policy?.frequency || 0,
      threshold: policy?.threshold || 0,
    },
  });

  const onSubmit: SubmitHandler<PolicySchema> = async (data) => {
    if (!policy) return;

    const { error } = await createPolicy({
      ...data,
      name: policy.name,
    });

    if (!error) {
      toast.success('Policy created');
    } else {
      console.log(error);
      toast.error("Couldn't create policy");
    }

    form.reset({
      frequency: 0,
      threshold: 0,
    });
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
                <FormLabel>Threshold</FormLabel>
                <FormControl>
                  <Input
                    placeholder='% of delta allowed'
                    variant='form'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='frequency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Frequency between inventrory checks (in days)'
                    variant='form'
                    {...field}
                  />
                </FormControl>
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
