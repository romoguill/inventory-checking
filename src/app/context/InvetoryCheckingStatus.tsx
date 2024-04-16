'use client';

import { createContext, useContext } from 'react';

type StatusState = {
  inventory: {
    id: string;
    items: {
      productId: string;
      productName: string;
      userId: string;
      userName: string;
      initialStock: number;
      originalStock: number | null;
      reviewStock: number | null;
      policyThreshold: number;
    }[];
  };
};

const Context = createContext(null);

export const useInventoryCheckingStatus = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'useInventoryCheckingStatus must be used inside a InventoryCheckingStatusProvider'
    );
  }

  return context;
};

interface InventoryCheckingStatusProviderProps {
  children: React.ReactNode;
}

export const InvetoryCheckingStatusProvider = ({
  children,
}: InventoryCheckingStatusProviderProps) => {
  return <Context.Provider value={}>{children}</Context.Provider>;
};
