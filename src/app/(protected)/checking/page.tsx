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
import { getOngoingInventories, getRounds } from '@/actions/inventory';
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

  // const promise1 = getOngoingInventories(session.user.id, 'ongoing');
  // const promise2 = getOngoingInventories(session.user.id, 'finished');
  // const [ongoingInventories, finishedInventories] = await Promise.all([
  //   promise1,
  //   promise2,
  // ]);

  // console.log(ongoingInventories, finishedInventories);

  const [ongoingRounds, finishedRounds] = await Promise.all([
    getRounds(session.user.id, 'ongoing'),
    getRounds(session.user.id, 'finished'),
  ]);

  console.log({ ongoingRounds, finishedRounds });

  let displayMsg: string = '';

  let ongoingRoundsContent;
  if (ongoingRounds.error) {
    ongoingRoundsContent = (
      <AccordionContent className='ml-3'>
        An error occured while retrieving data
      </AccordionContent>
    );
  } else if (!ongoingRounds.data.length) {
    ongoingRoundsContent = (
      <AccordionContent className='ml-3'>
        There are no ongoing rounds
      </AccordionContent>
    );
  } else {
    ongoingRoundsContent = (
      <AccordionContent>
        <Table className='table-fixed mb-6'>
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
            {!ongoingRounds.error &&
              ongoingRounds.data.length > 0 &&
              ongoingRounds.data.map((round) => (
                <TableRow key={round.id}>
                  <TableCell className='p-2 md:p-4 overflow-hidden truncate'>
                    <Link
                      href={`/checking/${round.id}`}
                      className='hover:underline'
                    >
                      {round.id}
                    </Link>
                  </TableCell>
                  <TableCell className='p-2 md:p-4 capitalize text-center'>
                    {round.name.toLowerCase()}
                  </TableCell>
                  <TableCell className='p-2 md:p-4  text-center'>
                    {round.createdAt.toLocaleDateString('en-CA')}
                  </TableCell>
                </TableRow>
              ))}
            {displayMsg}
          </TableBody>
        </Table>
      </AccordionContent>
    );
  }

  let finishedRoundsContent;
  if (finishedRounds.error) {
    finishedRoundsContent = (
      <AccordionContent className='ml-3'>
        An error occured while retrieving data
      </AccordionContent>
    );
  } else if (!finishedRounds.data.length) {
    finishedRoundsContent = (
      <AccordionContent className='ml-3'>
        You haven&apos;t completed an inventory round
      </AccordionContent>
    );
  } else {
    finishedRoundsContent = (
      <AccordionContent>
        <Table className='table-fixed mb-6'>
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
            {!finishedRounds.error &&
              finishedRounds.data.length > 0 &&
              finishedRounds.data.map((round) => (
                <TableRow key={round.id}>
                  <TableCell className='p-2 md:p-4 overflow-hidden truncate'>
                    <Link
                      href={`/checking/${round.id}`}
                      className='hover:underline'
                    >
                      {round.id}
                    </Link>
                  </TableCell>
                  <TableCell className='p-2 md:p-4 capitalize text-center'>
                    {round.name.toLowerCase()}
                  </TableCell>
                  <TableCell className='p-2 md:p-4  text-center'>
                    {round.createdAt.toLocaleDateString('en-CA')}
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
        <AccordionItem
          value='ongoingRounds'
          className='border-b-dashboard-border'
        >
          <AccordionTrigger className='p-2 bg-dashboard-dark -mx-2'>
            <h4>Ongoing Rounds</h4>
          </AccordionTrigger>
          {ongoingRoundsContent}
        </AccordionItem>
        <AccordionItem
          value='finishedRounds'
          className='border-b-dashboard-border'
        >
          <AccordionTrigger className='p-2 bg-dashboard-dark -mx-2'>
            <h4>Finished Rounds</h4>
          </AccordionTrigger>
          {finishedRoundsContent}
        </AccordionItem>
      </Accordion>
    </InnerDashboardContainer>
  );
}

export default CheckingPage;
