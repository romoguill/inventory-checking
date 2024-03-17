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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UploadButton } from '@/lib/uploadthing/uploadthing';
import { ProductSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ProductFormProps {
  type: 'create' | 'update';
}

function ProductForm({ type }: ProductFormProps) {
  const form = useForm<ProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      batchTracking: true,
      severity: '' as any,
    },
  });

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Product name' variant='form' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <UploadButton
            endpoint='imageUploader'
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log('Files: ', res);
              alert('Upload Completed');
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />

          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Product image url'
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
            name='batchTracking'
            render={({ field }) => (
              <FormItem>
                <div className='space-y-2'>
                  <FormLabel>Batch Tracking</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='flex'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='severity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='bg-inherit border-2 border-dashboard-border focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80'>
                      <SelectValue placeholder='Select product severity' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='bg-dashboard-dark text-dashboard-foreground'>
                    {ProductSchema.shape.severity.options.map((severity) => (
                      <SelectItem
                        key={severity}
                        value={severity}
                        className='focus:bg-dashboard-accent'
                      >
                        {severity.charAt(0).toUpperCase() +
                          severity.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' variant='submit' className='mx-auto flex mt-8'>
          Add product
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
