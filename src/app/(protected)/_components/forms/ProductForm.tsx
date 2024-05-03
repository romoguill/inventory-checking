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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import UploadImages from './UploadImages';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  type: 'create' | 'update';
}

function ProductForm({ type }: ProductFormProps) {
  const [isUrlReady, setIsUrlReady] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      currentStock: 0,
      price: 0,
      imageUrl: '',
      batchTracking: true,
      severity: '' as any,
    },
  });

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    const response = await fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const { error, data: product } = await response.json();

    if (!error) {
      toast.success('Product created');
    } else {
      console.log(error);
      toast.error("Couldn't create product");
    }

    form.reset({
      name: '',
      currentStock: 0,
      price: 0,
      imageUrl: '',
      batchTracking: true,
      severity: '' as any,
    });

    setFiles([]);
    setIsUrlReady(false);
  };

  const handleImageUrlAfterUpload = (url: string) => {
    form.setValue('imageUrl', url);
    setIsUrlReady(true);
  };

  // Regex for allowwing prices with 2 decimals
  const restrictPriceExpression = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /\d+(\.\d{1,2})?/;
    return e.target.value.match(regex)?.[0];
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

          <FormField
            control={form.control}
            name='currentStock'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Product current stock'
                    variant='form'
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder=''
                    variant='form'
                    type='number'
                    {...field}
                    onChange={(e) => {
                      field.onChange(restrictPriceExpression(e));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isUrlReady && (
            <div className='space-y-2'>
              <FormLabel>Image</FormLabel>
              <UploadImages
                handleImageUrlAfterUpload={handleImageUrlAfterUpload}
                files={files}
                setFiles={setFiles}
              />
            </div>
          )}

          {isUrlReady && (
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
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
        <Button
          type='submit'
          variant='submit'
          className='mx-auto flex mt-8 w-28'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='animate-spin' />
          ) : (
            'Add product'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
