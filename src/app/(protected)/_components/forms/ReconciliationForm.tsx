'use client';

import { ReconciliationSchema } from '@/schemas/dashboard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Round } from '@prisma/client';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import InventoryCheckingTable from '../tables/InventoryCheckingTable';
import {
  DataRow,
  addStateToTableData,
  addThresholdToTableData,
} from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { inventoryReconciliation } from '@/actions/inventory';

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
  const dataWithThreshold = addThresholdToTableData(data, productThresholds);

  // To the product property add the State for each round. Used for populating more easily data in table
  const dataWithState = addStateToTableData(dataWithThreshold);

  // Filter data to get only rows that have been rejected twice

  const dataToDisplay = dataWithState.filter(
    (row) =>
      row.product.stateOriginal?.status === 'rejected' &&
      row.product?.stateReview?.status === 'rejected'
  );

  const form = useForm<ReconciliationSchema>({
    resolver: zodResolver(ReconciliationSchema),
    defaultValues: {
      reconciliation: new Array(dataToDisplay.length).fill({
        method: '',
      }),
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'reconciliation',
  });

  const onSubmit: SubmitHandler<ReconciliationSchema> = async (data) => {
    const payload = dataToDisplay.map((item, i) => ({
      productId: item.product.id,
      method: data.reconciliation[i].method,
    }));

    const response = await inventoryReconciliation(
      inventoryId.toString(),
      payload
    );

    console.log(response);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InventoryCheckingTable
          data={dataToDisplay}
          inventoryId={inventoryId.toString()}
          productsThreshold={productThresholds}
          rounds={rounds}
          reconciliationPhase
          formControl={form.control}
        />
        <button type='submit'>Send</button>
      </form>
    </Form>
  );
}

export default ReconciliationForm;
