'use client';

import { ReconciliationSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Round } from '@prisma/client';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import InventoryCheckingTable from '../tables/InventoryCheckingTable';
import { DataRow } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Form } from '@/components/ui/form';

interface ReconciliationFormProps {
  data: DataRow[];
  productThresholds: {
    id: string;
    threshold: number;
  }[];
  rounds: {
    id: string;
    isFinished: boolean;
    name: Round;
  }[];
}

function ReconciliationForm({
  data,
  productThresholds,
  rounds,
}: ReconciliationFormProps) {
  const { inventoryId } = useParams();
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

  return (
    <Form {...form}>
      <InventoryCheckingTable
        data={data}
        inventoryId={inventoryId.toString()}
        productsThreshold={productThresholds}
        rounds={rounds}
        reconciliationPhase
      />
    </Form>
  );
}

export default ReconciliationForm;
