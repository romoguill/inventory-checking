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
import { ProductSchema } from '@/schemas/dashboard.schemas';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ProductFormProps {
  type: 'create' | 'update';
}

function ProductForm({ type }: ProductFormProps) {
  const form = useForm<ProductSchema>({
    defaultValues: {
      name: '',
      imageUrl: '',
      batchTracking: true,
      severity: 'MEDIUM',
    },
  });

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
              <div>
                <FormLabel>Batch Tracking</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='bg-[#948566]'
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
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Add product</Button>
      </form>
    </Form>
  );
}

export default ProductForm;
