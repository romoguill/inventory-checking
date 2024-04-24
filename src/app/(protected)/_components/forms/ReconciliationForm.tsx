'use client';

import { ReconciliationSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Round } from '@prisma/client';
import { Form, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

interface ReconciliationFormProps {
  data: {
    id: string;
    isFinished: boolean;
    name: Round;
  }[];
  children: React.ReactNode;
}

function ReconciliationForm({ children, data }: ReconciliationFormProps) {
  const form = useForm<ReconciliationSchema>({
    resolver: zodResolver(ReconciliationSchema),
    defaultValues: {
      reconciliation: new Array(data.length).fill({
        stock: '-',
      }),
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'reconciliation',
  });

  const onSubmit: SubmitHandler<ReconciliationSchema> = async (data) => {
    console.log(data);
  };

  return <Form>{children}</Form>;
}

export default ReconciliationForm;
