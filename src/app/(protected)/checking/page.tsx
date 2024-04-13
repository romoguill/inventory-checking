import { getServerAuthSession } from '@/auth/auth.config';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InnerDashboardContainer from '../_components/InnerDashboardContainer';
import Title from '../_components/forms/Title';
import { getOngoingInventories } from '@/actions/inventory';
import Link from 'next/link';
import { getCurrentInventoryRound } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';

async function CheckingPage() {
  const session = await getServerAuthSession();

  if (!session) return;

  const promise1 = getOngoingInventories(session.user.id, 'ongoing');
  const promise2 = getOngoingInventories(session.user.id, 'finished');
  const [ongoingInventories, finishedInventories] = await Promise.all([
    promise1,
    promise2,
  ]);

  console.log(ongoingInventories, finishedInventories);

  let displayMsg: string = '';

  let ongoingInventoriesContent;
  if (ongoingInventories.error) {
    ongoingInventoriesContent = <p>An error occured while retrieving data</p>;
  } else if (!ongoingInventories.data.length) {
    ongoingInventoriesContent = <p>There are no ongoing inventories</p>;
  } else {
    ongoingInventoriesContent = (
      <AccordionContent>
        <Table className='table-fixed'>
          <TableHeader>
            <TableRow className='hover:bg-inherit'>
              <TableHead>ID</TableHead>
              <TableHead className='w-[100px] md:w-[150px] text-center'>
                Round
              </TableHead>
              <TableHead className='w-[100px] md:w-[150px] text-center'>
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ongoingInventories.error &&
              ongoingInventories.data.length > 0 &&
              ongoingInventories.data.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell className='p-2 md:p-4 overflow-hidden truncate'>
                    <Link
                      href={`/checking/${inventory.id}`}
                      className='hover:underline'
                    >
                      {inventory.id}
                    </Link>
                  </TableCell>
                  <TableCell className='p-2 md:p-4 capitalize text-center'>
                    {getCurrentInventoryRound(
                      inventory.id,
                      ongoingInventories.data
                    ).toLowerCase()}
                  </TableCell>
                  <TableCell className='p-2 md:p-4  text-center'>
                    {inventory.createdAt.toLocaleDateString('en-CA')}
                  </TableCell>
                </TableRow>
              ))}
            {displayMsg}
          </TableBody>
        </Table>
      </AccordionContent>
    );
  }

  let finishedInventoriesContent;
  if (finishedInventories.error) {
    finishedInventoriesContent = <p>An error occured while retrieving data</p>;
  } else if (!finishedInventories.data.length) {
    finishedInventoriesContent = (
      <p>You haven&apos;t completed an inventory round</p>
    );
  } else {
    finishedInventoriesContent = (
      <AccordionContent>
        <Table className='table-fixed'>
          <TableHeader>
            <TableRow className='hover:bg-inherit'>
              <TableHead>ID</TableHead>
              <TableHead className='w-[100px] md:w-[150px] text-center'>
                Round
              </TableHead>
              <TableHead className='w-[100px] md:w-[150px] text-center'>
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!finishedInventories.error &&
              finishedInventories.data.length > 0 &&
              finishedInventories.data.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell className='p-2 md:p-4 overflow-hidden truncate'>
                    <Link
                      href={`/checking/${inventory.id}`}
                      className='hover:underline'
                    >
                      {inventory.id}
                    </Link>
                  </TableCell>
                  <TableCell className='p-2 md:p-4 capitalize text-center'>
                    {getCurrentInventoryRound(
                      inventory.id,
                      finishedInventories.data
                    ).toLowerCase()}
                  </TableCell>
                  <TableCell className='p-2 md:p-4  text-center'>
                    {inventory.createdAt.toLocaleDateString('en-CA')}
                  </TableCell>
                </TableRow>
              ))}
            {displayMsg}
          </TableBody>
        </Table>
      </AccordionContent>
    );
  }

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Dashboard
      </Title>
      <Accordion type='single' collapsible defaultValue='ongoingRounds'>
        <AccordionItem value='ongoingRounds'>
          <AccordionTrigger>
            <h4>Ongoing Rounds</h4>
          </AccordionTrigger>
          {ongoingInventoriesContent}
        </AccordionItem>
        <AccordionItem value='finishedRounds'>
          <AccordionTrigger>
            <h4>Finished Rounds</h4>
          </AccordionTrigger>
          {finishedInventoriesContent}
        </AccordionItem>
      </Accordion>
    </InnerDashboardContainer>
  );
}

export default CheckingPage;
