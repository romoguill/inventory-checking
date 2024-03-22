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
import { MemberSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usePolicy } from '../policies/PolicyContext';
import { createPolicy, updatePolicy } from '@/actions/policy';
import { ChangeEvent, SetStateAction } from 'react';
import { Policy } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { addUserToOrganization } from '@/actions/organization';
import { getUserByEmail } from '@/actions/team';

interface MemberFormProps {
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

function MemberForm({ setIsModalOpen }: MemberFormProps) {
  const router = useRouter();
  const form = useForm<MemberSchema>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<MemberSchema> = async (data) => {
    const { data: user } = await getUserByEmail(data.email);

    if (!user) {
      form.setError('email', { message: "Couldn't find specified user" });
      return;
    }

    const { error } = await addUserToOrganization(user.id);

    if (!error) {
      toast.success('User added');
    } else {
      console.log(error);
      toast.error("Couldn't add user");
    }

    setIsModalOpen(false);

    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input variant='form' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
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
        </Button>
      </form>
    </Form>
  );
}

export default MemberForm;
