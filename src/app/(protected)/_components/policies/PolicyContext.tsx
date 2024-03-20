'use client';

import { Policy } from '@prisma/client';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

const PolicyContext = createContext<Policy | null>(null);

export const PolicyProvider = ({
  children,
  policy,
}: PropsWithChildren<{ policy: Policy }>) => {
  return (
    <PolicyContext.Provider value={policy}>{children}</PolicyContext.Provider>
  );
};

export const usePolicy = () => useContext(PolicyContext);
