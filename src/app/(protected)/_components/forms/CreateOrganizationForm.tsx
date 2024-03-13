'use client';

import { createOrganization } from '@/actions/organization';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OrganizationSchema } from '@/schemas/dashboard.schemas';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateOrganizationFormProps {
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  getOrganizations: () => Promise<void>;
}

function CreateOrganizationForm({
  setIsMenuOpen,
  setIsModalOpen,
  getOrganizations,
}: CreateOrganizationFormProps) {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<OrganizationSchema>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<OrganizationSchema> = async ({ name }) => {
    if (!session || !session.user) return;

    setIsPending(true);

    const { error } = await createOrganization(session.user.email, name);

    if (error) {
      toast.error('There was an error when creating organization');
    }

    setIsPending(false);

    setIsModalOpen(false);
    setIsMenuOpen(false);

    await getOrganizations();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-3'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder='Your Company' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button size='lg' className='ml-auto mt-3' disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
}

export default CreateOrganizationForm;
